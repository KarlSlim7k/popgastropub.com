# Plan de Desarrollo — Auditoría Junio 2026

> Generado a partir de la auditoría completa de seguridad, calidad y escalabilidad del 2026-06-10.
> Documento de trabajo para agentes AI (Claude Code, OpenCode, etc.) y desarrolladores.
> **Regla:** cada fase = 1 branch + 1 PR. No mezclar fases. Verificar con tests antes de mergear.

---

## Contexto para el agente implementador

Lee esto antes de tocar código:

- **Stack:** Next.js 15 App Router (`frontend/`), Laravel 12 (`backend/`, estilo `bootstrap/app.php`, NO usa `app/Http/Kernel.php` ni `app/Console/Kernel.php`), MariaDB, Docker Compose + Dokploy + Traefik + Nginx interno.
- **Reglas obligatorias:** `AGENTS.md` (Golden Rules). Respetar paleta, `routes/api.php` único, secretos vía env.
- **Deploy:** push a `main` dispara auto-deploy vía Dokploy (90-120s). NO deployar manualmente.
- **Auth real:** Sanctum tokens Bearer guardados en `localStorage` (`frontend/lib/auth-session.ts`, key `pop_auth_session`). Roles: `cliente` / `mesero` / `admin` vía middleware `role:` (`backend/app/Http/Middleware/EnsureRole.php`).
- **Facturación real:** NO hay PAC ni TimbrarFactura (AGENTS.md está desactualizado en eso). El flujo real: cliente sube ticket → `FacturaController::store` → `FacturaAccountantMailer` manda email al contador con el ticket adjunto. Retry vía scheduler (`routes/console.php`).
- **Puntos QR (flujo crítico de dinero):** mesero genera QR firmado HMAC (`Staff/TicketGeneratorController::generate`, secreto `config('app.qr_secret')`) → cliente escanea → `TicketRedeemController::redeem` → `PuntosService::asignarPuntosPorCanje` (transacción + `lockForUpdate`, idempotente). NO romper esta cadena; tiene firma `hash_hmac('sha256', $total.$ref.$ts, secret)` — cambiar el formato de payload invalida QRs ya impresos.
- **Storage:** disco `public` se sirve por DOS vías: Nginx `location /storage/` (directo, sin Laravel) y `GET /api/storage/{path}` (`PublicImageController`, con whitelist regex). El volumen `pop_backend_storage` se monta read-only en el contenedor nginx.
- **Tests:** `cd backend && php artisan test`. Suites existentes en `backend/tests/Feature/`. Usan SQLite/array según `phpunit.xml` — revisar antes de asumir MariaDB en tests.
- **Frontend build:** `cd frontend && npm run build` para verificar tipos. `NEXT_PUBLIC_API_URL` se hornea en build (arg de Docker).

---

## FASE 1 — Hotfixes de producción (prioridad máxima, ~1 día)

### 1.1 Nginx: `client_max_body_size` (SEC-09) — BUG ACTIVO PROBABLE

**Problema:** Laravel acepta tickets hasta 5MB (`FacturaController.php:30`, `TicketGeneratorController.php:56`) pero Nginx default = 1MB → `413` antes de llegar a PHP. Fotos de celular >1MB fallan hoy.

**Archivo:** `nginx/nginx.conf`, server block `api.popgastropub.com`.

```nginx
server {
    listen 80;
    server_name api.popgastropub.com;
    client_max_body_size 8m;   # ← agregar
    ...
}
```

**Verificar:** después de deploy, subir imagen de ~3MB en `/facturacion` y en staff QR generator.

### 1.2 Tickets fiscales a disco privado (SEC-01) — CRÍTICO

**Problema:** tickets CFDI y fotos de tickets staff se guardan en disco `public` y Nginx sirve `/storage/` completo sin auth. Datos fiscales expuestos.

**Cambios:**

1. `backend/app/Http/Controllers/FacturaController.php:37`:
```php
// antes
$path = $request->file('ticket')->store('tickets', 'public');
// después
$path = $request->file('ticket')->store('tickets', 'local');
```

2. Mismo controller, `ticketResponse()` (línea ~80) y `FacturaAccountantMailer.php:37`: cambiar `Storage::disk('public')` → `Storage::disk('local')`.
   - OJO: también `backend/app/Http/Controllers/Admin/FacturaController.php` tiene su propio `ticket()` — actualizar igual.
   - Compatibilidad con registros viejos: helper que pruebe `local` primero y caiga a `public`:
```php
private function ticketDisk(string $path): \Illuminate\Contracts\Filesystem\Filesystem
{
    return Storage::disk(Storage::disk('local')->exists($path) ? 'local' : 'public');
}
```

3. `backend/app/Http/Controllers/Staff/TicketGeneratorController.php:79-82`: foto de ticket → disco `local`. Quitar `Storage::url($fotoPath)` de la respuesta (línea 113) o reemplazar por endpoint autenticado.

4. `nginx/nginx.conf`: restringir `/storage/` a carpetas realmente públicas:
```nginx
location ~ ^/storage/(menu|promociones|recompensas)/ {
    root /var/www/html/storage/app/public;
    rewrite ^/storage/(.*)$ /$1 break;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
location /storage/ { return 404; }
```
   (Alternativa más simple: eliminar `location /storage/` por completo y dejar que `PublicImageController` sirva todo — ya tiene whitelist y cache headers. Medir si el tráfico de imágenes justifica nginx directo.)

5. **Migración de datos:** comando artisan one-shot o paso en deploy que mueva `storage/app/public/tickets/**` → `storage/app/private/tickets/**` y actualice nada (los paths en BD son relativos al disco, se mantienen iguales).

**Verificar:** `curl -I https://api.popgastropub.com/storage/tickets/loquesea.jpg` → 404. Flujo de facturación end-to-end sigue funcionando (subir + admin descarga ticket + email a contador con adjunto).

### 1.3 Secretos: fail-closed y rotación (SEC-02, SEC-03, SEC-14) — CRÍTICO

1. **`docker-compose.yml:74-75`** — eliminar defaults de VAPID:
```yaml
- VAPID_PUBLIC_KEY=${VAPID_PUBLIC_KEY:?VAPID_PUBLIC_KEY requerido}
- VAPID_PRIVATE_KEY=${VAPID_PRIVATE_KEY:?VAPID_PRIVATE_KEY requerido}
```
   **Rotar las claves** (las actuales están quemadas en el historial git): generar par nuevo (`npx web-push generate-vapid-keys`), setear en Dokploy env. Consecuencia: suscripciones push existentes mueren — aceptable, el frontend re-suscribe (`lib/usePushNotifications.ts` debe manejar 410/expiración; verificar).

2. **`docker-compose.yml:64`** — `QR_SECRET=${QR_SECRET:?QR_SECRET requerido}`.

3. **`docker-compose.yml:49,53`** — quitar la autogeneración de APP_KEY del command. Reemplazar por `APP_KEY=${APP_KEY:?APP_KEY requerido}`. Generar una vez (`php artisan key:generate --show`) y fijarla en Dokploy.

4. **Fail-closed en código** — `backend/app/Http/Controllers/TicketRedeemController.php` y `Staff/TicketGeneratorController.php`: antes de firmar/verificar HMAC:
```php
$secret = (string) config('app.qr_secret');
if ($secret === '') {
    report(new \RuntimeException('QR_SECRET no configurado'));
    abort(503, 'Servicio de tickets no disponible');
}
```
   Mejor: extraer a un `QrSignatureService` con el secreto inyectado y validado en constructor, y usarlo en ambos controllers (hoy la lógica HMAC está duplicada).

5. Verificar que QR_SECRET real ya esté seteado en Dokploy ANTES de mergear (si no, el deploy tumba el módulo de tickets).

### 1.4 Headers de seguridad en Nginx (SEC-08)

**Archivo:** `nginx/nginx.conf` — en AMBOS server blocks (frontend y api):

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
# Solo en server api (el frontend Next.js necesita frames propios? no — aplicar en ambos):
add_header X-Frame-Options "DENY" always;
```
CSP se pospone a Fase 2 (requiere inventariar scripts inline de Next/GSAP — no bloquear hotfixes con eso).

**Nota:** `add_header` en nginx no se hereda si el location define sus propios `add_header` — el `location /storage/` con `Cache-Control` debe repetir los headers o usar `include`.

---

## FASE 2 — Seguridad de cuentas (~2-3 días)

### 2.1 QR de 2FA generado localmente (SEC-05) — fix de 3 líneas

**Archivo:** `frontend/components/ui/TwoFactorSection.tsx:114`.
`qrcode.react` YA está en `package.json`.

```tsx
import { QRCodeSVG } from 'qrcode.react';
// reemplazar el <img src="https://api.qrserver.com/..."> por:
<QRCodeSVG value={qrUrl} size={180} />
```
Eliminar el comentario `eslint-disable-next-line @next/next/no-img-element`.

### 2.2 Validator de login realmente evaluado (SEC-06)

**Archivo:** `backend/app/Http/Controllers/AuthController.php:127-141`. Después de crear `$validator`, agregar (mismo patrón que `register()`):
```php
if ($validator->fails()) {
    return response()->json([
        'message' => 'Los datos de inicio de sesión no son válidos.',
        'errors' => $validator->errors(),
    ], 422);
}
```

### 2.3 2FA aplicado en login (SEC-04)

**Diseño (mantenerlo simple, tokens con abilities de Sanctum):**

1. `AuthController::login`: si `$user->two_factor_enabled`:
```php
$tempToken = $user->createToken('2fa_pending', ['2fa:pending'])->plainTextToken;
return response()->json(['requires_2fa' => true, 'temp_token' => $tempToken]);
```
   (no emitir token completo todavía; no devolver el objeto user completo).

2. `TwoFactorController::verify` (`backend/app/Http/Controllers/TwoFactorController.php:89`): aceptar el token temporal, validar TOTP, y si es válido: borrar token temporal, emitir token completo:
```php
$user = $request->user();
abort_unless($request->user()->currentAccessToken()->can('2fa:pending')
    || $request->user()->currentAccessToken()->can('*'), 403);
// ... verifyKey igual que hoy ...
$request->user()->currentAccessToken()->delete();
$token = $user->createToken('auth_token', ['*'])->plainTextToken;
return response()->json(['verified' => true, 'token' => $token, 'user' => $user]);
```

3. **Bloquear el token temporal en el resto del API.** Opción mínima invasiva: middleware `EnsureTokenIsFull` aplicado al grupo `auth:sanctum` general (excepto `/auth/2fa/verify` y `/auth/logout`):
```php
if ($request->user()?->currentAccessToken()?->cant('*')) {
    return response()->json(['message' => 'Verificación 2FA pendiente.'], 423);
}
```

4. **Frontend** `app/(auth)/login`: si respuesta trae `requires_2fa`, mostrar input de 6 dígitos, llamar `POST /auth/2fa/verify` con el temp token, y solo entonces `saveAuthSession`.

5. Rate limit: agregar `throttle:auth-login` a `/auth/2fa/verify` (hoy sin throttle específico → fuerza bruta de 6 dígitos). 6 intentos/min ya definido en `AppServiceProvider`.

6. **Tests:** login sin 2FA → token completo; login con 2FA → temp token no accede a `/auth/me`; verify correcto → token completo; verify incorrecto ×N → 429.

### 2.4 CSV injection (SEC-11)

**Archivos:** `backend/app/Http/Controllers/Admin/UsuarioController.php:140-151`, `Admin/PromocionController.php` (método `leadsCsv`).

Helper compartido (trait o método en `Controller` base):
```php
private function csvSafe(?string $value): string
{
    $value = (string) $value;
    return preg_match('/^[=+\-@\t\r]/', $value) ? "'" . $value : $value;
}
```
Aplicar a `name`, `email`, `phone`, `rfc` y campos de leads.

### 2.5 Hardcoded CC del contador (SEC-15)

`backend/app/Services/FacturaAccountantMailer.php:42`: mover `emzare2@gmail.com` a `config/mail.php` → `'facturacion' => ['cc' => env('FACTURACION_CC')]` + env en compose. Si `FACTURACION_CC` vacío, no agregar CC.

### 2.6 UploadController folder default (SEC-10)

`backend/app/Http/Controllers/Admin/UploadController.php:19`: `$folder = $request->input('folder', 'menu');` — o `folder` → `required`. Revisar qué manda el frontend (`components/ui/ImageUpload.tsx`) y alinear.

### 2.7 (Evaluar, no obligatorio) Sanctum SPA mode con cookies httpOnly (SEC-07)

Cambio grande: tocar `auth-provider.tsx`, `auth-session.ts`, todos los `fetchWithAuth`. `config/cors.php` ya tiene `supports_credentials: true` y `sanctum/csrf-cookie` en paths — la base existe. Decisión de producto: si no se hace, documentar el riesgo y compensar con CSP (2.8).

**Decisión (2026-06):** NO se implementa en Fase 2. Es un cambio transversal (frontend `auth-provider.tsx`, `auth-session.ts`, todos los `fetchWithAuth`, backend `EnsureFrontendRequestsAreStateful`, CORS/CSRF) que excede el alcance "~2-3 días" de esta fase y tiene alto riesgo de romper sesiones en producción si algo queda mal alineado entre dominios/subdominios.

**Riesgo aceptado:** tokens Bearer en `localStorage` son legibles por cualquier JS que corra en la página (XSS → robo de sesión completo, sin protección de `httpOnly`).

**Mitigación aplicada:** 2.8 (CSP `Report-Only` → enforce) reduce drásticamente la superficie de XSS al bloquear scripts/estilos/conexiones no permitidas, que es el vector primario para explotar este riesgo. Revisar Sanctum SPA + cookies `httpOnly` como candidato de Fase 3/4 si CSP en modo enforce queda estable.

### 2.8 CSP (cierre de Fase 2)

Inventariar: GSAP/Framer no inyectan scripts externos; Next requiere `'unsafe-inline'` para estilos o nonces. Empezar con `Content-Security-Policy-Report-Only` en nginx, observar, luego enforce. No bloquear la fase por esto.

---

## FASE 3 — Robustez y escalabilidad (~1 semana)

### 3.1 Queue worker + trabajo asíncrono (ESC-01)

1. **`docker-compose.yml`** — nuevo servicio (copiar bloque `scheduler`, cambiar command):
```yaml
  queue:
    build: { context: ., dockerfile: backend/Dockerfile }
    container_name: pop_perote_queue
    restart: unless-stopped
    command: php artisan queue:work --tries=3 --backoff=10 --max-time=3600
    environment: # mismo set que scheduler (DB + MAIL + APP_KEY)
    volumes:
      - pop_backend_storage:/var/www/html/storage
    depends_on:
      mariadb: { condition: service_healthy }
    networks: [pop_network]
```
   Driver ya es `database`; verificar que la tabla `jobs` existe (migración `2026_06_01_000005_create_runtime_tables.php` — confirmar contenido; si no, `php artisan queue:table`).

2. **Job `SendFacturaToAccountant`**: `backend/app/Jobs/`, implementa `ShouldQueue`, llama `FacturaAccountantMailer::deliver($factura)`. En `FacturaController::store:56`, reemplazar la llamada síncrona por `dispatch`. La respuesta HTTP pasa a ser siempre 201 con mensaje "en proceso de envío" (el mailer ya es idempotente y el scheduler ya reintenta — el job es solo el primer intento rápido).

3. **Job `SendPushNotification`**: mover `PushNotificationController::dispatch()` (método privado estático, líneas 73+) a un Job. `sendToUser`/`sendToAll` despachan el job. Cuidado: `StaffNotification::send` y `RankingController::checkTierUp` llaman estos helpers — la firma pública no cambia.

4. **`MailTestController::send`** puede quedar síncrono (es diagnóstico admin, el admin QUIERE el error inmediato).

5. **Tests:** `Queue::fake()` en `FacturaDeliveryTest` — ajustar asserts existentes.

### 3.2 Índices de BD (ESC-02)

Nueva migración `2026_06_XX_add_performance_indexes.php`:
```php
Schema::table('ticket_redeems', fn (Blueprint $t) => $t->index('folio_ticket'));
Schema::table('loyalty_transactions', fn (Blueprint $t) => $t->index(['user_id', 'created_at']));
Schema::table('users', fn (Blueprint $t) => $t->index('points'));
Schema::table('meseros', fn (Blueprint $t) => $t->index('puntos'));
```
(Verificar nombres exactos de columnas en migraciones existentes antes de escribir. `folio_ticket` NO debe ser unique en BD — la unicidad la valida `TicketValidator` con mensaje amigable; un unique constraint rompería el flujo de error.)

### 3.3 Paginación y memoria (ESC-03)

- `backend/app/Http/Controllers/FacturaController.php:16`: `->paginate(20)` con shape `{data, meta}` (mismo formato que `UsuarioController::index`). **Frontend:** `app/(dashboard)/mis-facturas` debe leer `.data` — actualizar en el mismo PR.
- `Admin/FacturaController::index`: revisar y paginar igual si no lo está.
- `UsuarioController::export:133`: `User::orderBy('name')->cursor()` dentro del `streamDownload`.

### 3.4 Healthchecks y límites Docker (ESC-04)

```yaml
  backend:
    healthcheck:
      test: ["CMD-SHELL", "php-fpm-healthcheck || pgrep php-fpm"]
      interval: 30s
    deploy: { resources: { limits: { memory: 512M } } }
  frontend:
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/"]
      interval: 30s
    deploy: { resources: { limits: { memory: 768M } } }
```
(Dokploy/compose standalone: usar `mem_limit` si `deploy.resources` no aplica fuera de swarm — probar en staging de Dokploy primero.)
Laravel ya expone `/up` (health route en `bootstrap/app.php:13`) — usable para healthcheck vía nginx.

### 3.5 Tests de módulos críticos (QUA-08)

Prioridad de cobertura (en `backend/tests/Feature/`):
1. `AuthFlowTest`: register (bono bienvenida + referral), login (válido/inválido/inactivo/throttle), reset password (código expirado, tokens revocados).
2. `TicketRedeemTest`: generate → redeem feliz; doble canje → 409; firma inválida → 422; QR expirado → 422; secreto vacío → 503; puntos a mesero asignado.
3. `LoyaltyTest`: checkin único por día; tier calculation con settings dinámicos.
4. `TwoFactorTest`: flujo completo de 2.3.

### 3.6 Cache de endpoints públicos calientes (ESC-04, opcional)

`MenuController::index`, `PromocionController::index` (públicos, mayor tráfico):
```php
return Cache::remember('public_menu_v1', 300, fn () => /* query actual */);
```
Invalidar (`Cache::forget`) en los CRUD de `Admin/MenuController` y `Admin/PromocionController`. Solo si se observa carga; con tráfico actual es opcional.

---

## FASE 4 — Limpieza y calidad (continuo, PRs pequeños)

### 4.1 Eliminar legacy `/orden` (QUA-02)

- Borrar `frontend/app/(public)/orden/page.tsx`, `frontend/components/order/OrderPanel.tsx`, carpeta `components/order/`.
- Redirect en `next.config.mjs`: `{ source: '/orden', destination: '/menu', permanent: true }`.
- Backend: evaluar borrar `PedidoController` (público y Admin) + rutas `/pedidos` (`routes/api.php:100-101,255-257`) + modelo si nada más lo usa. **Antes de borrar:** `grep -rn "Pedido" backend/app frontend/app frontend/components` y confirmar con el equipo que no hay datos productivos en la tabla `pedidos` que el admin consulte.

### 4.2 Código muerto de infraestructura (QUA-06)

- Borrar `backend/app/Console/Kernel.php` (Laravel 12 no lo registra; schedules viven en `routes/console.php`). Verificar: `php artisan schedule:list` antes y después — debe mostrar lo mismo.
- `backend/Dockerfile`: quitar `nginx`, `supervisor` de apt, quitar `COPY docker/nginx.conf` y `COPY docker/supervisord.conf`, CMD → `["php-fpm"]`. Borrar `docker/` completo. OJO: `docker-compose.yml` ya overridea el command — el cambio es solo limpieza de imagen, pero probar build local: `docker compose build backend`.
- `frontend/package.json`: `grep -rn "axios" frontend/app frontend/components frontend/lib` → si cero usos, `npm uninstall axios`.

### 4.3 API Resources (QUA-03, Golden Rule #5)

Incremental, empezar por superficies sensibles:
1. `UserResource` (reemplaza `response()->json($user)` en `AuthController::login/register/me` y `toFrontend()` de `UsuarioController` — consolidar el mapeo de tier/color ahí).
2. `FacturaResource`.
3. Resto según se toquen los controllers.

### 4.4 Closures fuera de rutas (QUA-07)

`routes/api.php:193-208` (loyalty-config) → `Admin\LoyaltyConfigController` con `index/update`. `routes/api.php:240-242` (points-log) → método en `Admin\MeseroController`. Después verificar `php artisan route:cache` no falla.

### 4.5 `<img>` → `next/image` (QUA-04, Golden Rule #10)

Migrar (URLs remotas, `remotePatterns` ya configurados): `app/(public)/PageClient.tsx:341`, `components/menu/MenuExperience.tsx:282`, `app/(admin)/admin/promociones/page.tsx:438`, `app/(admin)/admin/gestion-menu/page.tsx:306`.
NO tocar (blob/data URLs locales, justificados): `ImageUpload.tsx:61`, `staff/qr/page.tsx:376,449`.

### 4.6 Tipado TS (QUA-05)

62 usos de `any`. Estrategia: crear `frontend/lib/types.ts` con interfaces de las respuestas API (User, Factura, Mesero, Promocion, TicketRedeem) y reemplazar por módulo, empezando por páginas admin (las que mutan datos). No hacer big-bang.

### 4.7 Actualizar AGENTS.md (QUA-01)

- Eliminar referencias a `PacService.php`, `WhatsAppService.php`, `Jobs/TimbrarFactura.php` de "Proposed File Structure".
- Documentar flujo real CFDI: ticket → email contador (`FacturaAccountantMailer`) → estados manuales por admin.
- Agregar módulos reales no documentados: 2FA, push notifications, tickets QR, referidos, social auth.

### 4.8 Anti-fraude de puntos (SEC-12, SEC-13) — decisión de producto, no solo código

- `RankingController::addPoints`: mesero se auto-asigna puntos sin evidencia. Opciones: (a) deprecar y dejar solo flujo QR, (b) cola de aprobación admin, (c) dashboard de anomalías sobre `MeseroPointsLog`. **Requiere decisión del negocio antes de implementar.**
- `LoyaltyController::checkin`: sin verificación de presencia. Opción barata: QR de mesa firmado con `QrSignatureService` (reutilizar infra de 3.3/1.3) con TTL de 5 min.

---

## Checklist de verificación por fase

| Fase | Verificación |
|------|--------------|
| 1 | `curl -I .../storage/tickets/x.jpg` → 404 · upload 3MB OK · `php artisan test` verde · headers presentes en `curl -I` |
| 2 | login con 2FA exige código · temp token rechazado en `/auth/me` · QR 2FA sin requests externos (Network tab) · CSV abre limpio en Excel |
| 3 | `php artisan queue:work` procesa job de factura · `EXPLAIN` usa índices nuevos · facturas paginadas en UI |
| 4 | `/orden` → 301 · `npm run build` sin errores · `php artisan route:cache` OK · `docker compose build` OK |

## Variables de entorno a configurar en Dokploy ANTES de Fase 1

```
APP_KEY=base64:...            # generar: php artisan key:generate --show
QR_SECRET=...                 # 64+ chars aleatorios — si ya existe, NO cambiar (invalida QRs vivos)
VAPID_PUBLIC_KEY=...          # ROTAR — las del repo están quemadas
VAPID_PRIVATE_KEY=...         # ROTAR
FACTURACION_CC=...            # email contador (reemplaza hardcode)
```
