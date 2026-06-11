# Plan de Mitigación — Re-auditoría Post-Fases 1-4 (10 junio 2026)

> Documento de implementación para los hallazgos de la re-auditoría realizada tras desplegar
> las Fases 1-4 de `PLAN-AUDITORIA-2026-06.md`. Todos los hallazgos originales (SEC/QUA/ESC)
> fueron verificados como corregidos en repo Y en producción. Este plan cubre únicamente lo
> nuevo (NEW-01..06) y lo residual (REM-01..03).

---

## Contexto para el agente implementador

- **Stack:** Next.js 15 (frontend), Laravel 12 (backend, config en `bootstrap/app.php`, NO existe `app/Http/Kernel.php`), MariaDB, Docker + Dokploy + Traefik + Cloudflare, Nginx interno.
- **Deploy:** push a `main` dispara auto-deploy vía Dokploy (90-120s). NUNCA desplegar manualmente al VPS salvo instrucción explícita (Golden Rule #7). Verificación post-deploy: SSH `karol@srv1562002` solo lectura.
- **Workflow establecido:** correr tests → push → esperar ~120s → verificar por SSH/curl.
- **Tests:** `cd backend && php artisan test`. La suite DEBE quedar verde antes de cualquier push (hoy hay 2 fallos preexistentes — ver NEW-03, arreglar PRIMERO).
- **Reglas de oro relevantes:** rutas API solo en `routes/api.php`; respuestas con API Resources; secretos solo por env; no generar docs no pedidos.
- **CRÍTICO — firma HMAC de QR:** `hash_hmac('sha256', $total.$ref.$ts, secret)` en `QrSignatureService`. NO cambiar el formato de la firma ni el orden de concatenación. Hay QRs vivos con ventana de canje de 72h.
- **CRÍTICO — QR_SECRET:** ya está seteado en producción (16 chars). Rotarlo invalida todos los QR emitidos y no canjeados. Ver procedimiento en NEW-05 antes de tocar.

---

## Orden de implementación

| # | ID | Severidad | Esfuerzo | Rama sugerida |
|---|----|-----------|----------|---------------|
| 1 | NEW-03 | Media | 15 min | `fix/reaudit-tests-drinktypes` |
| 2 | NEW-01 | Alta | 5 min | `fix/reaudit-healthcheck-frontend` |
| 3 | NEW-02 | Media | 1 h | `fix/reaudit-unique-folio` |
| 4 | NEW-04 | Media | 1-2 h | `fix/reaudit-addpoints-dynamic-column` |
| 5 | NEW-06 | Baja | 10 min | (puede ir junto con #2 o #4) |
| 6 | REM-02 | Media | 1-2 h + observación | `fix/reaudit-csp-enforce` |
| 7 | NEW-05 | Media | coordinación con negocio | NO automatizar — procedimiento manual |
| 8 | REM-01/03 | — | decisión de negocio | sin código por ahora |

NEW-03 va primero: con la suite roja, ningún otro fix puede validarse con confianza.

---

## NEW-03 — Suite de tests en rojo (2 fallos en StaffEndpointsTest)

**Problema:** `RankingController::addPoints` ahora valida `category` contra la tabla
`drink_types` (`DrinkType::active()`). `tests/Feature/StaffEndpointsTest.php` no siembra esa
tabla → `POST /ranking/points` con `category: cocktail` devuelve 422 en vez de 200
(fallos en líneas 96 y 109). Producción funciona porque la tabla está seedeada.

**Fix:** sembrar el drink type en el `setUp()` del test (o en cada test que pegue a
`/ranking/points`):

```php
use App\Models\DrinkType;

protected function setUp(): void
{
    parent::setUp();
    // ... setup existente (mesero, user, etc.) ...

    DrinkType::create([
        'slug' => 'cocktail',
        'nombre' => 'Cóctel',     // ajustar al nombre real del campo (ver modelo/migración)
        'points' => 10,
        'activo' => true,          // ajustar al campo real que usa el scope active()
    ]);
}
```

**Antes de escribir:** leer `app/Models/DrinkType.php` (scope `active()`, `$fillable`) y la
migración `2026_06_04_210000_create_drink_types_table.php` para usar los nombres de columna
exactos. El test `test_add_points_applies_multiplier` espera `puntos = 120` (100 base +
10 pts × qty 1 × multiplier 2) — el seed con `points => 10` mantiene esa aritmética.

**Verificación:** `php artisan test --filter=StaffEndpointsTest` → todo verde. Luego suite completa.

---

## NEW-01 — Healthcheck del frontend permanentemente unhealthy

**Problema:** `docker-compose.yml:40` usa `wget -qO- http://localhost:3000/`. Dentro del
contenedor, `localhost` resuelve primero a `::1` (IPv6); Next standalone escucha solo en
`0.0.0.0` (IPv4). Resultado verificado en VPS: `wget 127.0.0.1` OK, `wget localhost` falla
con `Connection refused`. El contenedor reporta `unhealthy` aunque el sitio sirve 200.

**Fix (1 línea):**

```yaml
# docker-compose.yml — servicio frontend
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
```

**Verificación post-deploy:**

```bash
ssh karol@srv1562002 'docker ps --format "table {{.Names}}\t{{.Status}}" | grep frontend'
# Esperado: Up X minutes (healthy)
```

---

## NEW-02 — UNIQUE de `folio_ticket` eliminado (carrera de duplicados)

**Problema:** la migración `2026_06_10_151121_add_performance_indexes_to_tables.php` hizo
`dropUnique(['folio_ticket'])` y dejó index simple, confiando en el check de aplicación
(`TicketValidator.php:52`, `exists()`). Check-then-insert sin constraint = TOCTOU: dos
requests concurrentes con el mismo folio pasan ambas la validación y ambas insertan →
doble acreditación de puntos por un mismo ticket físico.

**Fix:** restaurar la constraint Y mantener el mensaje amigable capturando la violación.
Constraint y UX no son excluyentes.

1. Nueva migración:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ticket_redeems', function (Blueprint $table) {
            $table->dropIndex(['folio_ticket']);
            // Red de seguridad contra registro concurrente del mismo folio;
            // TicketValidator da el mensaje amigable en el caso secuencial y
            // el catch de QueryException cubre la carrera.
            $table->unique('folio_ticket');
        });
    }

    public function down(): void
    {
        Schema::table('ticket_redeems', function (Blueprint $table) {
            $table->dropUnique(['folio_ticket']);
            $table->index('folio_ticket');
        });
    }
};
```

**OJO antes de migrar:** verificar que no existan duplicados ya insertados (la ventana
estuvo abierta desde el deploy de Fase 3). Solo lectura:

```sql
SELECT folio_ticket, COUNT(*) c FROM ticket_redeems
WHERE folio_ticket IS NOT NULL
GROUP BY folio_ticket HAVING c > 1;
```

Si hay duplicados, resolverlos con el admin (decidir cuál registro vale y ajustar puntos)
ANTES de aplicar la migración, o `migrate` fallará.

2. Capturar la violación en los puntos de inserción (`TicketGeneratorController::generate`,
línea ~89, y cualquier otro `TicketRedeem::create` con folio):

```php
use Illuminate\Database\QueryException;

try {
    $redeem = TicketRedeem::create([...]);
} catch (QueryException $e) {
    if (($e->errorInfo[0] ?? null) === '23000') { // integridad: duplicado
        return response()->json([
            'valido' => false,
            'errores' => ['Este folio ya fue registrado anteriormente'],
        ], 422);
    }
    throw $e;
}
```

Mantener el check previo de `TicketValidator` (camino feliz con mensaje claro); el catch
solo cubre la carrera.

3. Test de regresión (Feature): crear `TicketRedeem` con folio X, intentar `create` directo
con el mismo folio, esperar `QueryException`/respuesta 422 según el endpoint.

**Verificación:** suite verde + en VPS post-deploy:
`docker exec pop_perote_backend php artisan migrate:status | tail -5` (solo lectura — la
migración la corre el `command` del contenedor en el deploy).

---

## NEW-04 — Columna dinámica `{slug}_points` en addPoints (bomba operativa)

**Problema:** `RankingController.php:46`:

```php
$mesero->increment($category . '_points', $points);
```

`$category` es un slug de `drink_types`, tabla que el admin puede extender con cualquier
slug (`alpha_dash`). La tabla `meseros` tiene columnas fijas (`cocktail_points`, etc.).
Admin crea tipo nuevo ("mezcal") → todo `POST /ranking/points` con esa categoría revienta
con 500 (columna `mezcal_points` no existe). No es inyección (Laravel escapa el identificador),
es rotura garantizada al primer uso legítimo de una feature de admin.

**Fix recomendado (opción A — eliminar el desglose por columna):** el desglose por categoría
ya vive en `MeseroPointsLog` (mesero_id, category, points, multiplier, created_at). Las
columnas `*_points` de `meseros` son redundantes.

```php
// RankingController::addPoints — reemplazar las 3 líneas de increment por:
$mesero->increment('puntos', $points);
$mesero->increment('orders_served', $validated['quantity']);
```

Luego auditar consumidores de las columnas `*_points`:

```bash
grep -rn "_points" backend/app frontend/ --include="*.php" --include="*.ts" --include="*.tsx" | grep -v "MeseroPointsLog\|ranking_points"
```

Si dashboard/analytics las leen, reemplazar por agregación sobre `MeseroPointsLog`:

```php
MeseroPointsLog::where('mesero_id', $id)
    ->selectRaw('category, SUM(points) as total')
    ->groupBy('category')
    ->get();
```

(Las columnas viejas pueden quedarse en BD sin uso; eliminarlas con migración es opcional
y de menor prioridad.)

**Opción B (parche mínimo si A toca demasiados consumidores):** incrementar solo si la
columna existe.

```php
use Illuminate\Support\Facades\Schema;

if (Schema::hasColumn('meseros', $category . '_points')) {
    $mesero->increment($category . '_points', $points);
}
$mesero->increment('puntos', $points);
```

(`Schema::hasColumn` consulta el schema; aceptable a este tráfico, o cachear la lista de
columnas. A es la solución correcta; B solo desactiva la bomba.)

**Test de regresión:** crear `DrinkType` con slug `mezcal` (sin columna en meseros) +
`POST /ranking/points` con `category: mezcal` → esperar 200 y `puntos` incrementado.

---

## NEW-06 — `X-Powered-By: PHP/8.4.22` expuesto

**Problema:** la API anuncia versión exacta de PHP en cada respuesta. Regalo para
fingerprinting de exploits.

**Fix (elegir UNO, nginx es el más simple — no requiere rebuild de imagen PHP):**

```nginx
# nginx/nginx.conf — dentro del bloque location ~ \.php$ del server api:
location ~ \.php$ {
    set $backend_upstream "backend:9000";
    fastcgi_pass $backend_upstream;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
    fastcgi_hide_header X-Powered-By;
}
```

Alternativa en imagen backend (`backend/Dockerfile`):

```dockerfile
RUN echo "expose_php = Off" > /usr/local/etc/php/conf.d/hardening.ini
```

**Verificación:** `curl -sI https://api.popgastropub.com/up | grep -i x-powered-by` → vacío.

---

## REM-02 — CSP pasar de Report-Only a enforce

**Problema:** ambos dominios siguen con `Content-Security-Policy-Report-Only`
(`nginx/nginx.conf:22` frontend, `:56` API). El comentario dice "pasar a enforce en Fase 3/4"
— quedó pendiente. Report-Only no bloquea nada; es la mitigación principal contra el riesgo
residual REM-01 (token en localStorage).

**Procedimiento (NO pasar a enforce a ciegas):**

1. **Observación previa.** Report-Only no tiene `report-uri` configurado, así que no hay
   telemetría server-side. Validación manual: abrir el sitio (landing, menú, promos, login,
   admin, staff) con DevTools → consola, y anotar violaciones CSP. Atención especial a:
   Elfsight (widget reseñas), Google Fonts, mapas embebidos, avatares OAuth, imágenes Unsplash.
2. **Ajustar la política** con lo observado (el inventario actual en el comentario de
   `nginx.conf:19-21` es el punto de partida).
3. **Cambiar header** en ambos server blocks (y en el location de `/storage/` whitelisted,
   que duplica los headers):

```nginx
# Reemplazar Content-Security-Policy-Report-Only por:
add_header Content-Security-Policy "<política ajustada>" always;
```

   Mantener un periodo con AMBOS headers (enforce con política holgada + Report-Only con
   política más estricta) es opción válida para iterar sin romper.

4. **Realismo sobre `unsafe-inline`:** Next.js 15 con App Router inyecta scripts inline;
   quitar `'unsafe-inline'` de `script-src` requiere nonces (integración no trivial en
   Next). Aceptable como primer enforce: mantener `'unsafe-inline'` en `style-src` y
   `script-src` — la política sigue bloqueando orígenes externos no listados, que es el
   vector principal de exfiltración del token (REM-01).

**Verificación post-deploy:** navegar todo el sitio logueado como cliente/mesero/admin; cero
funcionalidad rota; `curl -sI https://popgastropub.com | grep -i content-security` muestra
el header enforce.

---

## NEW-05 — QR_SECRET de producción corto (16 chars) — PROCEDIMIENTO MANUAL

> **Advertencia (leer completo antes de actuar):** rotar `QR_SECRET` invalida la firma HMAC
> de TODOS los QR emitidos y aún no canjeados. La ventana de canje es de 72 horas
> (`TicketRedeemController::EXPIRY_SECONDS`). Un QR entregado a un cliente ayer dejará de
> funcionar en el momento de la rotación. Esto NO se automatiza ni se incluye en un deploy
> normal — requiere coordinación con el restaurante.

**Objetivo:** secret de 64+ caracteres aleatorios.

**Procedimiento recomendado (ventana de invalidación aceptada):**

1. Acordar con el restaurante fecha/hora de corte (ej. martes — día cerrado — por la mañana).
   Idealmente anunciar 72h antes: "canjea tus tickets pendientes antes del martes".
2. Generar secret nuevo (localmente, NO commitearlo):
   ```bash
   openssl rand -hex 32   # 64 chars hex
   ```
3. Actualizar la variable `QR_SECRET` en el panel de Dokploy (Environment del proyecto).
4. Redeploy desde Dokploy.
5. Verificar (solo lectura):
   ```bash
   ssh karol@srv1562002 'docker exec pop_perote_backend php -r "echo strlen(getenv(\"QR_SECRET\")).PHP_EOL;"'
   # Esperado: 64
   ```
6. Generar un ticket QR de prueba desde el panel staff y canjearlo → ciclo completo OK.

**Alternativa sin ventana de invalidación (solo si negocio no acepta el corte):** verificación
dual-secret temporal en `QrSignatureService::verify()` — aceptar firma del secret nuevo O del
viejo (`QR_SECRET_OLD` env) durante 72h, firmar siempre con el nuevo; retirar el secret viejo
después. Más código, solo justificable si hay volumen alto de QRs vivos.

---

## REM-01 / REM-03 — Riesgos residuales (decisión de negocio, sin código por ahora)

- **REM-01 — Token en localStorage (`frontend/lib/auth-session.ts:27`).** XSS = robo de
  sesión. Mitigaciones ya activas: CSP (enforce tras REM-02), tokens revocables por sesión,
  `token.full`. Migrar a cookie httpOnly implica reescribir el flujo de auth de SPA a
  cookie-based de Sanctum (cambio grande en frontend y backend). Registrar como deuda
  aceptada; reevaluar si se añade contenido generado por usuarios (hoy no hay vector XSS
  almacenado conocido).
- **REM-03 — Auto-reporte de meseros (`/ranking/points`) y check-in sin verificación de
  presencia.** Riesgo de fraude interno, no técnico. Mitigación operativa: revisión
  periódica de `MeseroPointsLog` por el admin (dashboard ya expone actividad). Si el fraude
  se materializa, opciones futuras: aprobación admin de cargas, tope diario por mesero,
  check-in con código QR físico en el local.

---

## Checklist de cierre

- [x] NEW-03: `php artisan test` completamente verde en local — PR #5, mergeado y desplegado
- [x] NEW-01: `docker ps` en VPS muestra frontend `(healthy)` — PR #6, mergeado y desplegado, verificado
- [x] NEW-02: query de duplicados limpia + migración unique aplicada + catch 23000 + test regresión — PR #7, mergeado, `migrate:status` confirma `2026_06_10_160000_restore_unique_folio_ticket` aplicada
- [x] NEW-04: drink type nuevo no rompe `/ranking/points` (test con slug sin columna) — PR #8, mergeado y desplegado (Opción B: `Schema::hasColumn` guard)
- [x] NEW-06: `curl -sI https://api.popgastropub.com/up` sin `x-powered-by` — PR #7, verificado en vivo
- [x] REM-02: CSP enforce en vivo (dual-header, política ampliada para Elfsight/Google Fonts) — PR #9, mergeado y desplegado, `curl -sI` confirma ambos headers (`Content-Security-Policy` enforce + `Content-Security-Policy-Report-Only` estricta como telemetría). Pendiente: navegación logueada completa (cliente/mesero/admin) por el usuario para detectar roturas y violaciones de consola.
- [ ] NEW-05: QR_SECRET 64 chars en Dokploy (tras coordinación con negocio) + canje de prueba OK — PROCEDIMIENTO MANUAL, no iniciado, requiere coordinación de negocio (ventana 72h)
- [x] REM-01/03: registrados como riesgo aceptado (este documento es el registro)

**Regla transversal:** cada fix en rama propia → suite verde → PR a `main` → auto-deploy
Dokploy → esperar ~120s → verificar por SSH/curl según el checklist del hallazgo.
