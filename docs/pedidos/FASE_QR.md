# FASE QR — Sistema de Puntos por Ticket (Opción B: Mesero genera QR)

> **Documento para agentes IA**
> Proyecto: POP Perote · popgastropub.com
> Stack: Next.js 15 (App Router) + Laravel 11 + MariaDB
> Fecha: Mayo 2026
> POS del restaurante: Soft Restaurant (sin API — no se integra directamente)

---

## Contexto

El restaurante usa **Soft Restaurant** como POS. No tiene API REST ni forma de generar QRs externos desde el sistema de caja. La integración directa no es viable en Fase 1.

**Solución adoptada (Opción B):** El mesero, al cerrar la cuenta del cliente en Soft Restaurant, abre el portal staff de POP Perote en su celular/tablet, ingresa el monto total de la cuenta y genera un QR desde ahí. El cliente escanea el QR y sus puntos se acreditan automáticamente.

**Nuestro sistema NO gestiona pedidos.** Solo genera QRs firmados y acredita puntos.

---

## Flujo completo

```
Mesero cierra cuenta en Soft Restaurant
  └─ Abre portal staff: /staff/ventas (sección "Generar QR")
       └─ Ingresa monto total (ej. $350)
            └─ Frontend genera QR con URL firmada (HMAC en cliente con QR_SECRET público*)
                 └─ Mesero muestra QR en pantalla al cliente (o lo imprime)
                      └─ Cliente escanea QR → popgastropub.com/puntos/canjear?...
                           ├─ Autenticado → POST /api/tickets/redeem → puntos acreditados
                           └─ No autenticado → /login?redirect=... → al loguearse, canjea
```

> *La firma HMAC se genera en el **backend** al solicitar el QR, no en el cliente. El frontend llama a `POST /api/staff/tickets/generate` con el monto, el backend devuelve la URL firmada, y el frontend renderiza el QR con esa URL.

---

## Formato de la URL codificada en el QR

```
https://popgastropub.com/puntos/canjear?total=350&ref=TKT-20260530-0042&ts=1748650000&sig=abc123def456
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `total` | integer | Monto total en MXN (sin decimales, redondeado) |
| `ref` | string | ID único generado por nuestro backend al crear el ticket |
| `ts` | integer | Unix timestamp de generación |
| `sig` | string | HMAC-SHA256 de `total+ref+ts` con `QR_SECRET` |

---

## Sistema de puntos

### Regla base
**1 punto por cada $10 MXN gastados** (redondeado hacia abajo).

```
puntos = floor(total / 10)
```

Ejemplos: $150 → 15 pts · $280 → 28 pts · $450 → 45 pts

### Multiplicadores por categoría — Fase 2 únicamente
No implementar en Fase 1. En Fase 2 se puede agregar un selector de categoría en el formulario del mesero.

---

## Base de datos — Migraciones a crear

### Tabla `ticket_redeems`

```sql
CREATE TABLE ticket_redeems (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ref           VARCHAR(100) NOT NULL UNIQUE,
  total         INT NOT NULL,
  puntos        INT NOT NULL,
  mesero_id     BIGINT UNSIGNED NULL,           -- quién generó el QR
  user_id       BIGINT UNSIGNED NULL,           -- quién lo canjeó (NULL hasta canje)
  ts_emision    INT NOT NULL,
  canjeado_at   TIMESTAMP NULL,
  ip_canje      VARCHAR(45) NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mesero_id) REFERENCES meseros(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

> Incluir `mesero_id` permite en Fase 2 dar puntos POP Bar Stars al mesero por cada cliente que canjea.

---

## Backend — Archivos a crear

### 1. Migración
```
backend/database/migrations/XXXX_create_ticket_redeems_table.php
```

### 2. Modelo
```
backend/app/Models/TicketRedeem.php
```
Fillable: `ref`, `total`, `puntos`, `mesero_id`, `user_id`, `ts_emision`, `canjeado_at`, `ip_canje`

### 3. Controlador — generación (staff)
```
backend/app/Http/Controllers/Staff/TicketGeneratorController.php
```

Método `generate(Request $request)` — POST, `auth:sanctum` + `role:mesero`:
- Valida `total` (integer, min 1, max 99999)
- Genera `ref` único: `'TKT-' . date('Ymd') . '-' . strtoupper(Str::random(6))`
- Genera `ts` = `now()->timestamp`
- Genera `sig` = `hash_hmac('sha256', $total . $ref . $ts, env('QR_SECRET'))`
- Inserta en `ticket_redeems` con `mesero_id` del usuario autenticado
- Devuelve la URL completa para el QR

```php
return response()->json([
    'url' => "https://popgastropub.com/puntos/canjear?total={$total}&ref={$ref}&ts={$ts}&sig={$sig}",
    'puntos' => floor($total / 10),
    'ref' => $ref,
]);
```

### 4. Controlador — validación y canje (público + cliente)
```
backend/app/Http/Controllers/TicketRedeemController.php
```

Métodos:
- `validate(Request $request)` — GET, público — verifica firma, expiración y si ya fue canjeado
- `redeem(Request $request)` — POST, `auth:sanctum` — acredita puntos al usuario autenticado

Lógica de `validate`:
```php
// 1. Verificar firma
$expected = hash_hmac('sha256', $total . $ref . $ts, env('QR_SECRET'));
if (!hash_equals($expected, $sig)) return response()->json(['error' => 'QR inválido'], 422);

// 2. Verificar expiración (72 horas)
if (now()->timestamp - $ts > 72 * 3600) return response()->json(['error' => 'QR expirado'], 422);

// 3. Verificar si ya fue canjeado
$ticket = TicketRedeem::where('ref', $ref)->first();
if ($ticket?->canjeado_at) return response()->json(['error' => 'Ya canjeado'], 409);

return response()->json(['valid' => true, 'total' => $total, 'puntos' => floor($total / 10), 'ref' => $ref]);
```

Lógica de `redeem`:
```php
// 1. Validar QR (misma lógica que validate)
// 2. Actualizar ticket_redeems: user_id, canjeado_at, ip_canje
// 3. Incrementar users.points
// 4. Insertar en loyalty_transactions con type='qr_ticket'
// Todo en DB::transaction()
```

### 5. Rutas en `routes/api.php`
```php
// Staff — generar QR
Route::middleware(['auth:sanctum', 'role:mesero'])->group(function () {
    Route::post('/staff/tickets/generate', [Staff\TicketGeneratorController::class, 'generate']);
});

// Público — validar QR
Route::get('/tickets/validate', [TicketRedeemController::class, 'validate']);

// Cliente — canjear
Route::middleware('auth:sanctum')->post('/tickets/redeem', [TicketRedeemController::class, 'redeem']);
```

### 6. Variable de entorno
Agregar en `.env` del backend (y en Dokploy como variable de entorno del contenedor):
```
QR_SECRET=<string_aleatorio_minimo_32_chars>
```

---

## Frontend — Archivos a crear/modificar

### 1. Sección "Generar QR" en portal mesero
**Archivo:** `frontend/app/(staff)/staff/ventas/page.tsx` — agregar nueva sección al final, o crear página separada `frontend/app/(staff)/staff/qr/page.tsx`

Comportamiento:
- Formulario: campo numérico "Monto total de la cuenta ($MXN)"
- Botón "Generar QR" → `POST /staff/tickets/generate` con `{ total }`
- Al recibir respuesta: renderizar QR con la librería `qrcode` (ya disponible en npm como `qrcode.react`)
- Mostrar debajo: "El cliente ganará X puntos"
- Botón "Nuevo QR" para limpiar y generar otro
- El QR debe ser grande (mínimo 256x256px) para facilitar el escaneo

Instalar dependencia:
```bash
cd frontend && npm install qrcode.react
```

Usar el componente:
```tsx
import { QRCodeSVG } from 'qrcode.react';
<QRCodeSVG value={qrUrl} size={256} bgColor="#0D0D0D" fgColor="#F2C777" />
```

Agregar al sidebar y bottom nav del staff si se crea página separada.

### 2. Página pública de canje
**Archivo:** `frontend/app/(public)/puntos/canjear/page.tsx`

Debe ser `'use client'`. Comportamiento:
1. Lee query params: `total`, `ref`, `ts`, `sig`
2. Si faltan params: mostrar "QR inválido"
3. Llama a `GET /tickets/validate?total=...&ref=...&ts=...&sig=...`
4. Estados a manejar:
   - `loading` — skeleton
   - `invalid` — "Este QR no es válido"
   - `expired` — "Este QR ha expirado (72 horas)"
   - `already_redeemed` — "Este ticket ya fue canjeado"
   - `valid + autenticado` — muestra monto, puntos a ganar, botón "Canjear X puntos" → `POST /tickets/redeem`
   - `valid + no autenticado` — muestra monto, puntos a ganar, botón "Inicia sesión para canjear" → `/login?redirect=/puntos/canjear?[params]`
   - `success` — "¡Canjeaste X puntos! Tu saldo: Y pts"

Diseño: dark theme, paleta POP, consistente con `/puntos`. Usar `useAuth` para detectar sesión.

### 3. Redirect post-login
**Archivo:** `frontend/app/(auth)/login/page.tsx`

Después de login exitoso, verificar si `searchParams.get('redirect')` existe y redirigir ahí en lugar de a `/puntos`. Ya debería estar implementado — verificar antes de modificar.

---

## Checklist Fase 1

### Backend
- [ ] Migración `ticket_redeems` con `mesero_id`
- [ ] Modelo `TicketRedeem`
- [ ] `Staff/TicketGeneratorController@generate`
- [ ] `TicketRedeemController@validate`
- [ ] `TicketRedeemController@redeem` (con `DB::transaction`)
- [ ] Rutas en `api.php`
- [ ] `QR_SECRET` en `.env` y en Dokploy
- [ ] Ejecutar migración en producción: `php artisan migrate --force`

### Frontend
- [ ] `npm install qrcode.react` en `/frontend`
- [ ] Sección/página QR en portal mesero
- [ ] Página `/puntos/canjear`
- [ ] Verificar redirect post-login

---

## Fase 2 (no implementar ahora)
- Selector de categoría en formulario del mesero → multiplicador de puntos
- Puntos POP Bar Stars al mesero por cada cliente que canjea su QR
- Panel admin `/admin/tickets` con historial de tickets generados y canjeados
- Puntos pendientes en localStorage para usuarios no registrados

---

## Condiciones y restricciones

1. **Un ticket = un canje.** `ref` tiene `UNIQUE` en BD.
2. **Expiración 72 horas** desde `ts_emision`.
3. **`QR_SECRET` solo en backend.** Nunca exponer al frontend.
4. **La firma se genera en el backend** (`Staff/TicketGeneratorController`), no en el cliente.
5. **`DB::transaction()`** en `redeem` — si falla el update de puntos, no se marca como canjeado.
6. **Registrar en `loyalty_transactions`** con `type = 'qr_ticket'` para auditoría.
7. **Multiplicadores son Fase 2** — no implementar en Fase 1.
8. **Paleta POP:** `#F2C777`, `#F2C894`, `#D96725`, `#732817`, `#0D0D0D`.
9. **Endpoints sin doble prefijo:** usar `/staff/tickets/generate`, no `/api/staff/tickets/generate`.

---

## Archivos de referencia — leer antes de implementar

```
backend/routes/api.php                              ← dónde agregar rutas
backend/app/Models/User.php                         ← campo points
backend/app/Models/Mesero.php                       ← relación con user
backend/app/Http/Middleware/EnsureRole.php          ← middleware role:mesero
backend/database/migrations/*loyalty_transactions*  ← estructura de la tabla
frontend/lib/api.ts                                 ← fetchAPI y fetchWithAuth
frontend/lib/auth-provider.tsx                      ← useAuth, session
frontend/app/(staff)/staff/ventas/page.tsx          ← página de ventas del mesero
frontend/app/(dashboard)/puntos/page.tsx            ← referencia de diseño cliente
frontend/components/ui/StaffSidebar.tsx             ← para agregar enlace si se crea /staff/qr
```
