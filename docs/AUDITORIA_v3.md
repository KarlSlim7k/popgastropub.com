# Auditoría v3 — Seguridad / Calidad / Escalabilidad (10 junio 2026)

> Tercera pasada de auditoría sobre POP Perote, posterior a las Fases 1-4
> (`PLAN-AUDITORIA-2026-06.md`) y a la re-auditoría NEW/REM
> (`PLAN-MITIGACION-REAUDITORIA-2026-06.md`, PRs #5-#10, todos mergeados y
> desplegados). Esta sesión fue **solo lectura y análisis**: no se tocó código.
> El único entregable es este documento.
>
> **Regla de implementación:** cada fase/hallazgo = 1 branch + 1 PR. No mezclar.
> Suite verde antes de cada push.

---

## Estado de las verificaciones ejecutadas (10-jun-2026)

| Verificación | Resultado |
|--------------|-----------|
| `php artisan test` | **Verde** — 72 tests, 292 assertions, 0 fallos (todos marcados `DEPR` por `PDO::MYSQL_ATTR_SSL_CA` deprecado en PHP 8.4, no es fallo). |
| `composer audit` | **10 advisories / 8 paquetes** → V3-01. |
| `npm audit` | **3 vulnerabilidades** (1 alta `next`, 2 moderadas `postcss`, `brace-expansion`) → V3-01. |
| `npm audit --omit=dev` | **2** (next alta, postcss moderada) — ambas en prod. |
| `npm run build` | **OK**, sin errores de tipos. |

La suite sigue verde: no hay hallazgo P0 por tests rotos.

---

## Contexto para el agente implementador

Lee esto antes de tocar código (idéntico a los planes previos, resumido):

- **Stack:** Next.js 15 App Router (`frontend/`), Laravel 12 (`backend/`, config en
  `bootstrap/app.php`, NO existe `app/Http/Kernel.php`), MariaDB 10.11, Docker Compose
  + Dokploy + Traefik + Cloudflare, Nginx interno.
- **Deploy:** push a `main` dispara auto-deploy vía Dokploy (90-120s). NUNCA desplegar
  manualmente al VPS salvo instrucción explícita (Golden Rule #7). Verificación
  post-deploy: SSH `karol@srv1562002` solo lectura → `docker ps`, `curl -sI`.
- **Workflow:** correr tests → push → esperar ~120s → verificar por SSH/curl.
- **Auth:** Sanctum Bearer en `localStorage` (`frontend/lib/auth-session.ts`).
  Roles `cliente`/`mesero`/`admin` vía `role:` (`EnsureRole`). Token completo vs
  temporal 2FA vía `token.full` (`EnsureTokenIsFull`).
- **CRÍTICO — firma HMAC de QR:** `hash_hmac('sha256', $total.$ref.$ts, secret)` en
  `QrSignatureService`. NO cambiar formato ni orden de concatenación. QRs vivos con
  ventana de canje de 72h. `QR_SECRET` en prod aún es de 16 chars (ver NEW-05, abajo).
- **CSP:** enforce activa con dual-header (`nginx/nginx.conf`). `'unsafe-inline'` se
  mantiene en script/style-src por Next App Router.
- **Secretos:** `docker-compose.yml` ya es fail-closed (`:?`) en APP_KEY, QR_SECRET,
  VAPID. No hay `.env` commiteado (verificado con `git ls-files`).

---

## Resumen de hallazgos

| ID | Área | Severidad | Esfuerzo | Estado |
|----|------|-----------|----------|--------|
| V3-01 | 1. Dependencias | **ALTA** | 2-4 h | **Cerrado — PR #11** |
| V3-02 | 3/10. Lógica puntos | **MEDIA** | 1-2 h | Nuevo (residual de NEW-04) |
| V3-03 | 7. Backups BD | **MEDIA** | 2-4 h | Nuevo |
| V3-04 | 6. Logging/monitoreo | **MEDIA** | 2-3 h | Nuevo |
| V3-05 | 3. Autorización (OAuth) | **MEDIA** | 1-2 h | Nuevo |
| V3-06 | 2. Rate limiting | **BAJA** | 30 min | Nuevo |
| V3-07 | 9. CSP | **BAJA** | media jornada + obs. | Residual REM-02 |
| V3-08 | 10. Performance N+1 | **BAJA** | 1 h | Nuevo |
| NEW-05 | 5. Secrets | **MEDIA** | coord. negocio | Carry-over (sin iniciar) |

Áreas **revisadas sin hallazgos**: 3 (IDOR de recursos de usuario), 4 (uploads),
8 (XSS contenido de usuario). Detalle al final.

---

## ALTA

### V3-01 — Dependencias con CVEs (composer + npm)

**Área:** 1. Dependencias · **Severidad:** ALTA · **Esfuerzo:** 2-4 h

**Problema:** ambos `lock` arrastran CVEs publicados en mayo 2026 (posteriores al
último update). Versiones instaladas vs. seguras:

**Backend (`backend/composer.lock`):**

| Paquete | Instalada | CVE / advisory | Sev | Versión segura |
|---------|-----------|----------------|-----|----------------|
| `laravel/framework` | 12.56.0 | CVE-2026-48019 (CRLF injection en regla de email) | — | ≥ 12.60.0 |
| `symfony/mime` | 7.4.8 | CVE-2026-45067 (CRLF / SMTP command injection en `Address`) | **high** | ≥ 7.4.12 |
| `symfony/mime` | 7.4.8 | CVE-2026-45070 (header injection vía param names) | med | ≥ 7.4.12 |
| `symfony/mailer` | 7.4.8 | CVE-2026-45068 (argument injection en SendmailTransport) | med | ≥ 7.4.12 |
| `symfony/http-foundation` | 7.4.8 | CVE-2026-48736 (SSRF bypass IpUtils IPv6) | — | ≥ 7.4.13 |
| `symfony/http-kernel` | 7.4.8 | CVE-2026-45075 (HEAD bypass de `methods:['GET']`) | med | ≥ 7.4.12 |
| `symfony/routing` | 7.4.8 | CVE-2026-48784 (dot-segment), CVE-2026-45065 (`//host` injection) | med | ≥ 7.4.13 |
| `phpseclib/phpseclib` | 3.0.51 | CVE-2026-44167 (OID amplification DoS) | **high** | ≥ 3.0.52 |
| `symfony/polyfill-intl-idn` | 1.33.0 | CVE-2026-46644 (punycode equivalence) | low | ≥ 1.38.1 |

`symfony/mailer` + `symfony/mime` son los más relevantes para este proyecto: el flujo
de facturación (`FacturaAccountantMailer`) construye correos con `razon_social` y
`email` del cliente como `replyTo`/cabeceras → vector directo para las inyecciones de
cabecera CRLF. Subir Symfony es prioridad.

**Frontend (`frontend/package.json` → next 15.5.14 instalado):**

| Paquete | Instalada | Advisory | Sev | Acción |
|---------|-----------|----------|-----|--------|
| `next` | 15.5.14 | 15 advisories (SSRF en WebSocket upgrades, cache poisoning RSC, DoS Image Optimization, middleware/proxy bypass, XSS en CSP nonces/beforeInteractive) | **high** | actualizar al último parche 15.x |
| `postcss` | <8.5.10 | GHSA-qx2v-qp2m-jg93 (XSS en stringify `</style>`) | med | `npm audit fix` |
| `brace-expansion` | 5.0.2-5.0.5 | GHSA-jxxr-4gwj-5jf2 (ReDoS, solo dev) | med | `npm audit fix` |

**Fix propuesto:**

```bash
# Backend
cd backend
composer update laravel/framework symfony/mime symfony/mailer \
  symfony/http-foundation symfony/http-kernel symfony/routing \
  phpseclib/phpseclib symfony/polyfill-intl-idn --with-all-dependencies
composer audit   # debe quedar limpio
php artisan test # debe seguir verde

# Frontend
cd ../frontend
npm install next@latest   # dentro de ^15 (no saltar a 16, breaking)
npm audit fix
npm run build             # verificar tipos/build
```

**OJO:** `next@latest` puede traer cambios de comportamiento en App Router/middleware.
Verificar tras build que: login en los 3 roles, `/ubicacion` (mapa), widget Elfsight y
`/menu` siguen OK (las mismas rutas del walkthrough REM-02).

**Verificación post-fix:** `composer audit` sin advisories ≥ medium; `npm audit
--omit=dev` con 0 high; suite verde; build OK; walkthrough rápido de las 14 rutas
públicas sin regresión.

**Branch:** `fix/auditv3-deps-cve`

---

## MEDIA

### V3-02 — `adjustPoints` de admin revienta con drink types nuevos (residual de NEW-04)

**Área:** 3/10. Lógica de puntos · **Severidad:** MEDIA · **Esfuerzo:** 1-2 h

**Problema:** NEW-04 (PR #8) parchó la columna dinámica `{slug}_points` en
`RankingController::addPoints` con un guard `Schema::hasColumn`, pero **el mismo patrón
sin guardar sigue vivo en `Admin/MeseroController::adjustPoints`**.

`backend/app/Http/Controllers/Admin/MeseroController.php:109-138`:

```php
$drinkTypeSlugs = \App\Models\DrinkType::pluck('slug')->toArray();
$validCategories = implode(',', array_merge($drinkTypeSlugs, ['rating']));
$request->validate(['category' => 'required|in:' . $validCategories, ...]);
...
$categoryField = $category . '_points';      // ← 'mezcal_points'
if ($points > 0) {
    $mesero->increment($categoryField, $points);   // ← 500 si la columna no existe
    ...
} else {
    $currentCategoryPoints = (int) $mesero->{$categoryField};  // null → 0
    ...
    $mesero->decrement($categoryField, $absPoints);            // ← 500
}
```

La validación **acepta** cualquier slug de `drink_types` (tabla extensible por el admin),
pero `meseros` solo tiene las 7 columnas fijas (`cocktail_points`, …, `rating_points`).
Admin crea un tipo nuevo (`mezcal`) → ajustar puntos manualmente de esa categoría a
cualquier mesero → 500. Misma bomba que NEW-04, distinto controller.

**Problema secundario (consistencia de datos):** NEW-04 Opción B dejó que
`addPoints` solo incremente `puntos` (no la columna) para tipos nuevos. Pero el total que
ve el negocio se calcula sumando **solo las 7 columnas fijas** en:
- `Admin/MeseroController::toFrontend` (`:162`) y `totalPoints` (`:240`)
- `Admin/DashboardController::topWaiters` (`:95,104`)
- `Staff/StaffDashboardController::index` (`:23`)
- `StaffAnalyticsController` (categorías hardcodeadas, `:39-47`)

Resultado: un mesero que gana puntos vía un drink type nuevo ve subir su `puntos`
(ranking) pero **NO** su total en dashboard/analytics → discrepancia visible entre el
ranking y el desglose.

**Fix propuesto (alinear con la decisión correcta de NEW-04 Opción A — fuente única
`MeseroPointsLog`):**

1. En `adjustPoints`, mismo guard que `RankingController`:
```php
if (Schema::hasColumn('meseros', $categoryField)) {
    $points > 0 ? $mesero->increment($categoryField, $points)
                : $mesero->decrement($categoryField, $absPoints);
}
$points > 0 ? $mesero->increment('puntos', $points)
            : $mesero->decrement('puntos', $absPoints);
```
   (la verificación de "puntos insuficientes" debe pasar a evaluarse contra `puntos`
   global o contra `MeseroPointsLog`, no contra la columna que puede no existir).

2. **Mejor (resuelve también la consistencia):** calcular totales y desgloses por
   categoría desde `MeseroPointsLog` agregado, no desde las columnas `*_points`:
```php
MeseroPointsLog::where('mesero_id', $id)
    ->selectRaw('category, SUM(points) as total')
    ->groupBy('category')->pluck('total', 'category');
```
   y que `toFrontend`/`topWaiters`/dashboards sumen ese agregado + `puntos`. Las
   columnas `*_points` quedan como histórico (o se eliminan en migración aparte, baja
   prioridad). Esto cierra NEW-04 de verdad y unifica la fuente de verdad.

**Verificación post-fix:** test — crear `DrinkType('mezcal')` sin columna →
`POST admin/meseros/{id}/adjust-points` con `category: mezcal` → 200 (no 500); el total
del mesero en `GET admin/meseros` refleja los puntos del tipo nuevo. Suite verde.

**Branch:** `fix/auditv3-adjustpoints-dynamic-column`

---

### V3-03 — Sin backups de la base de datos

**Área:** 7. Backups BD · **Severidad:** MEDIA · **Esfuerzo:** 2-4 h

**Problema:** no existe ningún mecanismo de backup de MariaDB en el repo. Grep de
`backup|mysqldump|mariadb-dump` sobre `backend/routes`, `backend/app` y
`docker-compose.yml` → 0 resultados. El volumen `pop_db_data` es `driver: local` sin
política de snapshot. Para una plataforma con dinero/puntos de lealtad y datos fiscales
(CFDI), la ausencia de backups probados es un riesgo alto de pérdida total ante corrupción,
borrado accidental o fallo de disco del VPS.

**Fix propuesto (elegir según infraestructura disponible):**

Opción A — comando artisan + scheduler (consistente con el patrón actual de
`routes/console.php`):

```php
// routes/console.php
Schedule::command('db:backup')->dailyAt('04:00')->withoutOverlapping()->onOneServer();
```
```php
// app/Console/Commands/DbBackup.php (o closure en console.php)
$file = storage_path('app/backups/pop_'.now()->format('Ymd_His').'.sql.gz');
$cmd = sprintf(
    'mariadb-dump -h%s -u%s -p%s %s | gzip > %s',
    config('database.connections.mysql.host'),
    config('database.connections.mysql.username'),
    escapeshellarg(config('database.connections.mysql.password')),
    config('database.connections.mysql.database'),
    escapeshellarg($file)
);
// rotar: borrar backups > 14 días; idealmente subir a almacenamiento offsite (S3/R2)
```
   El contenedor `scheduler` ya corre `schedule:work`; necesita el cliente
   `mariadb-client` en la imagen (`backend/Dockerfile`) para `mariadb-dump`.

Opción B — backup nativo de Dokploy: configurar el backup programado de Dokploy
para el servicio MariaDB con destino S3/R2/local + retención. Más simple, sin tocar
código; documentar la config en este repo.

**Imprescindible:** **probar un restore** al menos una vez en staging
(`gunzip < backup.sql.gz | mariadb ...`) y documentar el procedimiento. Un backup sin
restore probado no es un backup.

**Verificación post-fix:** existe artefacto de backup tras el primer ciclo
(`ssh ... 'ls -la .../backups'` o panel Dokploy); restore de prueba reproduce los datos.

**Branch:** `fix/auditv3-db-backups`

---

### V3-04 — Sin monitoreo de errores ni alertas de cola/scheduler

**Área:** 6. Logging/monitoreo/alertas · **Severidad:** MEDIA · **Esfuerzo:** 2-3 h

**Problema:**
1. No hay Sentry/Bugsnag ni equivalente (grep en `composer.json`/`package.json` → 0).
   Los errores solo van a `storage/logs/laravel.log` dentro del contenedor; nadie los
   revisa proactivamente. Un fallo en el flujo de canje de QR o de envío a contadores
   pasa desapercibido hasta que un cliente reclama.
2. Los servicios `scheduler` y `queue` en `docker-compose.yml` **no tienen
   `healthcheck`** (solo lo tienen `mariadb`, `frontend`, `backend`). Si el worker de
   cola o el scheduler mueren, Docker no los marca `unhealthy` y nadie se entera: las
   facturas dejan de enviarse al contador (job `SendFacturaToAccountant` + retry
   `facturas:retry-accountant-emails` cada minuto) y la expiración de puntos
   (`loyalty:expire-inactive-points`) deja de correr, en silencio.

**Fix propuesto:**

1. **Sentry Laravel** (mínimo viable):
```bash
cd backend && composer require sentry/sentry-laravel
php artisan sentry:publish --dsn=${SENTRY_LARAVEL_DSN}
```
   Añadir `SENTRY_LARAVEL_DSN` a `docker-compose.yml` (env de backend/queue/scheduler,
   fail-open con `:-`) y a Dokploy. `traces_sample_rate` bajo (0.1) o 0 si solo se
   quieren errores. Frontend opcional (`@sentry/nextjs`).

2. **Healthcheck de queue/scheduler** en `docker-compose.yml` (verifica que el proceso
   vive):
```yaml
  queue:
    healthcheck:
      test: ["CMD-SHELL", "pgrep -f 'queue:work' || exit 1"]
      interval: 60s
      timeout: 10s
      retries: 3
      start_period: 30s
  scheduler:
    healthcheck:
      test: ["CMD-SHELL", "pgrep -f 'schedule:work' || exit 1"]
      interval: 60s
      timeout: 10s
      retries: 3
      start_period: 30s
```
   Complementar con un check de uptime externo (Dokploy notifications / UptimeRobot
   sobre `/up`) para enterarse si todo el stack cae.

3. (Opcional) Heartbeat: que el scheduler "pinguee" un endpoint de cron-monitoring
   (Healthchecks.io/Better Stack) en cada corrida; si deja de pingar, alerta.

**Verificación post-fix:** forzar una excepción de prueba → aparece en Sentry; matar el
proceso de queue dentro del contenedor → `docker ps` lo marca `unhealthy`.

**Branch:** `fix/auditv3-monitoring-healthchecks`

---

### V3-05 — OAuth en modo `stateless()` sin parámetro `state` propio (login CSRF)

**Área:** 3. Autorización · **Severidad:** MEDIA · **Esfuerzo:** 1-2 h

**Problema:** `SocialAuthController::resolveProvider` fuerza `->stateless()` en todos los
providers OAuth2 (`backend/app/Http/Controllers/SocialAuthController.php:175-184`):

```php
if ($provider instanceof SocialiteOAuth2Provider) {
    return $provider->stateless();
}
```

`stateless()` **desactiva la validación del parámetro `state`** de OAuth2 (que Socialite
normalmente guarda en sesión para anti-CSRF). El flujo es stateless por diseño (SPA con
token Bearer, no hay sesión a través del redirect), pero al no implementar un `state`
propio firmado, el callback `handleProviderCallback` acepta cualquier `code` sin verificar
que la petición se originó en este sitio → **login CSRF**: un atacante puede forzar a la
víctima a completar un login con la cuenta OAuth del atacante (o, combinado con
account-linking por email, manipular la vinculación).

Riesgo secundario menor: el token completo se devuelve en el **fragmento de URL**
(`/login#token=...`, línea 191). El fragmento no viaja al servidor, pero queda en el
historial del navegador y puede filtrarse vía `Referer` de recursos cargados en `/login`.

**Fix propuesto:**

1. Implementar un `state` propio firmado/efímero ya que la sesión no persiste:
   - En `redirectToProvider`: generar un nonce aleatorio, firmarlo (HMAC con `APP_KEY` o
     `QR_SignatureService`-like) o guardarlo en cache con TTL corto, e incluirlo como
     `state` (`->with(['state' => $signed])` / `Socialite` lo añade).
   - En `handleProviderCallback`: leer `request('state')`, verificar firma/TTL antes de
     procesar el `code`. Rechazar si no valida.
   - Mantener `stateless()` (no hay sesión), pero la validación del `state` la hace
     tu código.

2. (Defensa en profundidad para el token en fragmento) Evaluar entregar un código de
   un solo uso de corta vida en el fragmento y canjearlo por el token vía
   `POST /auth/social/exchange`, en vez del token directo. Opcional; el fragmento ya
   limita la exposición.

**Verificación post-fix:** callback con `state` ausente/manipulado → rechazado (4xx);
flujo normal Google/Facebook/X sigue logueando. Test feature si es viable mockear
Socialite, o verificación manual en staging.

**Branch:** `fix/auditv3-oauth-state`

---

## BAJA

### V3-06 — Endpoints de ticket sin rate limit

**Área:** 2. Rate limiting · **Severidad:** BAJA · **Esfuerzo:** 30 min

**Problema:** el throttling de auth está bien cubierto (`auth-login`, `auth-register`,
`auth-password-reset`, `auth-social`, y `2fa/verify` con `auth-login`). Los grupos staff
y admin usan `throttle:admin-api` (120/min). Pero:

- `Route::get('/tickets/validate', ...)` (`routes/api.php:32`) — **público, sin
  throttle**. Hace verificación HMAC y consulta `TicketRedeem` por `ref`. La firma es
  inforzable por fuerza bruta (HMAC-SHA256, `hash_equals` constant-time), pero el
  endpoint público sin límite permite hammering/DoS y enumeración de estado de refs
  (respuesta 409 "ya canjeado" distingue refs válidos).
- El **grupo de rutas autenticadas de cliente** (`routes/api.php:81-121`: loyalty,
  facturas, reservas, recompensas redeem, `tickets/redeem`, ratings, push) **no tiene
  ningún `throttle`**. `ranking/points` sí está cubierto (`admin-api`). Para el flujo de
  dinero (`POST /tickets/redeem`) conviene un límite explícito.

**Fix propuesto:** añadir un limiter `tickets` en `AppServiceProvider` y aplicarlo:

```php
// AppServiceProvider::boot
RateLimiter::for('tickets', fn (Request $r) => [
    Limit::perMinute(20)->by($r->user()?->id ?? $r->ip()),
]);
```
```php
// routes/api.php
Route::get('/tickets/validate', [TicketRedeemController::class, 'validate'])
    ->middleware('throttle:tickets');
// y dentro del grupo autenticado:
Route::post('/tickets/redeem', [TicketRedeemController::class, 'redeem'])
    ->middleware('throttle:tickets');
```
   Opcional: aplicar un `throttle:60,1` general al grupo cliente autenticado como red de
   seguridad.

**Verificación post-fix:** > N requests/min a `/tickets/validate` → 429; canje normal no
afectado. Suite verde.

**Branch:** `fix/auditv3-throttle-tickets`

---

### V3-07 — CSP aún con `'unsafe-inline'` (camino a nonces) — residual REM-02

**Área:** 9. CSP · **Severidad:** BAJA · **Esfuerzo:** media jornada + observación

**Problema:** la CSP enforce (REM-02, `nginx/nginx.conf:32`) mantiene `'unsafe-inline'`
en `script-src` y `style-src` porque Next.js 15 App Router inyecta scripts/estilos inline.
Es la decisión correcta para no romper prod, pero deja abierto el vector inline-XSS, que
es justo la mitigación de REM-01 (token en `localStorage`). El header Report-Only
(telemetría más estricta) **no tiene `report-uri`**, así que no hay recolección
server-side de violaciones: la observación sigue siendo manual por consola.

**Estado:** no hay violaciones enforce nuevas (walkthrough Playwright de REM-02, 0
violaciones en 14 públicas + 31 autenticadas). No hay urgencia, pero el endurecimiento a
nonces sigue pendiente.

**Fix propuesto (cuando se priorice):**
1. Configurar un `report-uri`/`report-to` (endpoint propio ligero o servicio tipo
   report-uri.com) en el header Report-Only para acumular telemetría real en vez de
   inspección manual.
2. Evaluar nonces de Next 15: middleware que genera nonce por request + `headers()` →
   CSP con `'nonce-...'` en `script-src`, quitando `'unsafe-inline'`. **OJO:** una de las
   advisories de V3-01 (`GHSA-ffhc-5mcf-pf4q`) es precisamente XSS en App Router *usando*
   CSP nonces en versiones viejas de Next — actualizar Next (V3-01) **antes** de
   implementar nonces.
3. `style-src 'unsafe-inline'` es el más difícil de quitar en Next/Tailwind; aceptable
   mantenerlo más tiempo que el de scripts.

**Verificación post-fix:** `curl -sI https://popgastropub.com | grep -i content-security`
muestra `script-src` con nonce y sin `'unsafe-inline'`; walkthrough sin regresión.

**Branch:** `fix/auditv3-csp-nonces` (no bloquear; depende de V3-01)

---

### V3-08 — N+1 acotados en endpoints admin de puntos

**Área:** 10. Performance / N+1 · **Severidad:** BAJA · **Esfuerzo:** 1 h

**Problema:** revisados los controllers de listados. La mayoría usan eager loading
correcto (`MeseroController::index` y `RankingController::index` con `->with('user')`;
`PuntosController::activity` con `->with('user')`). Dos N+1 menores, **acotados por
`limit`** (no críticos al tráfico actual):

- `Admin/PuntosController::topMembers` (`:238-264`) — por cada uno de 5 usuarios hace
  una query a `LoyaltyTier` + un `count()` de `RewardRedemption`. 5 usuarios → ~10
  queries extra.
- `Admin/PuntosController::tiers` (`:31-64`) — un `count()` de `User` por cada tier.
  Tiers ≈ 4-6 → acotado.

Notas de escalabilidad (no N+1, pero registrar):
- `MeseroController::index` y `RankingController::index` devuelven `->get()` **sin
  paginar** y ordenan con `orderByRaw('(cocktail_points + ... ) DESC')` — suma de columnas
  no indexable. La tabla `meseros` es pequeña (plantilla del restaurante), aceptable hoy;
  si crece, paginar y/o materializar el total en una columna `puntos` (que ya existe) e
  indexarla.
- `MeseroPointsLog.category` almacena valores de alta cardinalidad para canjes QR
  (`'ticket_qr:FOLIO'`, `PuntosService:57`). Agregaciones `groupBy('category')` sobre esa
  tabla generarán muchos grupos basura. Si se migra a la fuente única de V3-02, normalizar
  la categoría de canjes QR a un valor fijo (`'ticket_qr'`) y guardar el folio en columna
  aparte.

**Fix propuesto:**
- `topMembers`: precargar tiers una vez (`LoyaltyTier::all()` en memoria) y resolver el
  tier en PHP; agregar los `count` de redenciones con un `withCount` o un solo `groupBy`.
- `tiers`: un único query `User ... groupBy(rango)` o `selectRaw` con CASE en vez de N
  counts.

**Verificación post-fix:** `DB::enableQueryLog()` en test de `topMembers`/`tiers` → nº de
queries constante (no proporcional a usuarios/tiers). Suite verde.

**Branch:** `fix/auditv3-nplus1-puntos`

---

## Carry-over (de la re-auditoría, aún sin cerrar)

### NEW-05 — `QR_SECRET` de producción corto (16 chars) — PROCEDIMIENTO MANUAL

**Área:** 5. Secrets · **Severidad:** MEDIA · **Estado:** sin iniciar (requiere
coordinación con negocio).

Sigue pendiente del checklist de `PLAN-MITIGACION-REAUDITORIA-2026-06.md`. El secret de
prod es de 16 chars; el objetivo es 64+. Rotar invalida la firma HMAC de todos los QR
emitidos y no canjeados (ventana 72h), así que **no se automatiza**: requiere acordar una
ventana de corte con el restaurante (idealmente un martes, día cerrado) y avisar 72h antes.
Procedimiento completo (generar con `openssl rand -hex 32`, actualizar env en Dokploy,
redeploy, verificar `strlen` = 64, canje de prueba) está documentado en NEW-05 de ese plan;
no se reproduce aquí para no duplicar. La alternativa dual-secret (`QR_SECRET_OLD` durante
72h) evita la ventana de invalidación si el negocio no acepta el corte.

**Memoria:** existe nota de sesión (`new05_qr_secret_rotation`) con notice de 72h desde
2026-06-11 y cutover 2026-06-14 — confirmar con el usuario si ese calendario sigue vigente
antes de ejecutar.

---

## Áreas revisadas — sin hallazgos

### 3. IDOR / autorización por recurso — OK
Cada endpoint con `:id` filtra por el dueño autenticado, no solo por rol:
- `FacturaController::show/ticket` → `$request->user()->facturas()->findOrFail($id)`
  (scoped). `store` guarda en disco `local` privado.
- `ReservaController::cancel` → `where('id',$id)->where('user_id', $user->id)`.
- `RecompensaController::redeem` y `LoyaltyController` → operan sobre
  `$request->user()` con `lockForUpdate`.
- `Admin/*` con `:id` (factura, mesero, usuario, reserva, pedido) son globales **por
  diseño** (gestión admin) y van detrás de `role:admin`. Correcto.
- `TicketRedeemController::redeem` exige `role === 'cliente'` y resuelve el ticket por
  `ref` firmado, no por id del usuario. Idempotente con `lockForUpdate` en
  `PuntosService`. Correcto.

No se encontró ningún caso donde el usuario A pueda leer/editar el recurso de B cambiando
el id.

### 4. Uploads — OK
- `FacturaController::store` → disco `local` (privado), `mimes:jpg,jpeg,png,pdf`,
  `max:5120`. Se sirve solo vía endpoint autenticado scoped (`ticket()`), nunca por nginx.
- `Staff/TicketGeneratorController::generate` foto → disco `local`,
  `mimes:jpeg,jpg,png,webp`, `max:5120`.
- `Admin/UploadController` → disco `public`, `mimes:jpg,jpeg,png,webp,gif`, `max:4096`,
  `folder` en whitelist `in:menu,promociones,recompensas`, nombre `Str::uuid()` (sin path
  traversal). El default `'menu'` cuando falta `folder` es aceptable (whitelist activa).
- `PublicImageController` sirve solo `^(menu|promociones|recompensas)/[a-f0-9-]+\.(ext)$`
  con regex estricta; nginx replica la whitelist en `location ~ ^/storage/(menu|...)`.
Disco correcto en cada caso (privado para fiscal, público para catálogo). Sin hallazgos.

### 8. XSS en contenido generado por usuario — OK
- `MeseroRating.comentario` (`max:255`) se **almacena pero nunca se renderiza**: ningún
  endpoint backend lo expone en una respuesta (grep confirma: solo aparece en validación,
  create y `$fillable`). Campo write-only hoy. Si en el futuro se muestra en un panel,
  React escapa por defecto; cuidar solo emails (`Mail::raw`, texto plano, OK).
- `reserva.notas` se renderiza en `admin/reservas/page.tsx:110` como `{reserva.notas}` —
  JSX escapa automáticamente. OK.
- Único `dangerouslySetInnerHTML` del proyecto: `app/(public)/page.tsx:14` — JSON-LD
  estático (schema.org), sin datos de usuario. OK.
- Emails (`FacturaAccountantMailer`, `Admin/FacturaController::sendStatusNotification`)
  usan `Mail::raw` (texto plano) — sin interpolación HTML. El vector de inyección de
  cabecera vía `razon_social`/`email` lo cubre V3-01 (subir symfony/mime).

---

## Orden de implementación sugerido

| # | ID | Severidad | Esfuerzo | Branch | Notas |
|---|----|-----------|----------|--------|-------|
| 1 | V3-01 | ALTA | 2-4 h | `fix/auditv3-deps-cve` | Primero: symfony/mime+mailer protegen el flujo de facturación. Bloquea V3-07 (nonces). |
| 2 | V3-02 | MEDIA | 1-2 h | `fix/auditv3-adjustpoints-dynamic-column` | Cierra de verdad NEW-04 + consistencia de datos. |
| 3 | V3-03 | MEDIA | 2-4 h | `fix/auditv3-db-backups` | Probar restore, no solo el dump. |
| 4 | V3-04 | MEDIA | 2-3 h | `fix/auditv3-monitoring-healthchecks` | Sentry + healthcheck queue/scheduler. |
| 5 | V3-05 | MEDIA | 1-2 h | `fix/auditv3-oauth-state` | `state` firmado en callback OAuth. |
| 6 | V3-06 | BAJA | 30 min | `fix/auditv3-throttle-tickets` | Puede ir junto con otro PR pequeño. |
| 7 | V3-08 | BAJA | 1 h | `fix/auditv3-nplus1-puntos` | Cosmético al tráfico actual. |
| 8 | V3-07 | BAJA | media jornada | `fix/auditv3-csp-nonces` | Después de V3-01; no bloquear. |
| — | NEW-05 | MEDIA | coord. negocio | (manual) | No automatizar; ventana 72h. |

---

## Checklist de cierre

- [x] V3-01: **CERRADO — PR #11 (mergeado y desplegado 2026-06-11)**. `composer audit` 0 advisories · `npm audit` 0 vulnerabilidades (next 15.5.19 + override `next>postcss ^8.5.10`) · suite verde (72 tests) · build OK · prod verificada por SSH (Laravel 12.62.0, next 15.5.19, contenedores healthy, rutas clave 200)
- [x] V3-02: **CERRADO — PR #12 (mergeado 2026-06-11)**. Guard `Schema::hasColumn` en `Admin/MeseroController.php:136` · `puntos` se incrementa siempre aunque falte columna de categoría · suite verde
- [x] V3-03: **CERRADO — PR #14 (mergeado 2026-06-11)**. Comando `db:backup` creado (`app/Console/Commands/DbBackup.php`) y agendado en `routes/console.php:25` · **restore probado 2026-06-11**: `pop_20260611_040000.sql.gz` (backup `dailyAt('04:00')`, 7.7KB) restaurado en BD temporal `pop_restore_test` vía `gunzip -c ... | mariadb -uroot pop_restore_test`; 34/34 tablas, 5/5 `users`, 1/1 `meseros` coinciden con prod. BD temporal eliminada tras verificar.
- [x] V3-04: **CERRADO — PR #15 (mergeado 2026-06-11)**. Healthchecks en `docker-compose.yml`: scheduler (`pgrep schedule:work`) y queue (`pgrep queue:work`)
- [x] V3-05: **CERRADO — PR #13 (mergeado 2026-06-11)**. `state` firmado con `Crypt` + nonce + TTL 10 min (`SocialAuthController::generateSignedState/verifySignedState`), verificado antes de canjear el `code`
- [x] V3-06: **CERRADO**. `/tickets/validate` con `throttle:tickets` (20/min, `routes/api.php:32-33`) · limiter `tickets` en `AppServiceProvider`
- [x] V3-08: **CERRADO**. `tiers()` con una sola query `selectRaw` (`PuntosController.php:73-84`) · `topMembers` con conteos pre-agrupados
- [x] V3-07: **CERRADO — PR #18 (mergeado 2026-06-11)**. `report-uri`/`report-to` configurados + limiter `csp-report` · residual aceptado: `'unsafe-inline'` permanece en script/style-src (Next.js App Router inyecta inline; documentado en `nginx.conf:30-31`)
- [ ] NEW-05: confirmar calendario con negocio · `QR_SECRET` 64 chars en Dokploy · canje de prueba OK — **cutover programado 2026-06-14**

**Re-verificación 2026-06-11 (post PRs #12-#18):** `composer audit` 0 advisories · `npm audit --omit=dev` 0 vulnerabilidades · suite verde (510 assertions, 0 fallos; marcas "deprecated" = `PDO::MYSQL_ATTR_SSL_CA` PHP 8.4, no fallos).

**Regla transversal:** cada fix en rama propia → suite verde → PR a `main` → auto-deploy
Dokploy → esperar ~120s → verificar por SSH/curl según el checklist del hallazgo.
