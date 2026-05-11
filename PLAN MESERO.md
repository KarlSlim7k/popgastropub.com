# PLAN DE DESARROLLO — ROL MESERO (Staff Portal)

> **Fecha de auditoría:** 2026-05-10
> **URL producción:** https://popgastropub.com/staff/
> **API base:** https://api.popgastropub.com/api
> **Estado general:** ~20% funcional
> **Credenciales test:** mesero@popgastropub.com / PopPerote2026!

---

## Resumen Ejecutivo

El portal del mesero tiene **7 páginas frontend** renderizando visualmente con un diseño premium (Obsidian Sommelier), pero **5 de 7 páginas usan datos 100% hardcoded** sin conexión al backend. Solo el **Dashboard** y **Ranking** consumen el endpoint `/api/ranking` real. El backend tiene únicamente **2 endpoints** dedicados al mesero (`GET /api/ranking`, `POST /api/ranking/points`). La base de datos tiene la tabla `meseros` con esquema completo (19 columnas) pero con un solo registro de prueba con 0 puntos.

> [!CAUTION]
> **Bug crítico compartido con otros roles:** El frontend desplegado usa `NEXT_PUBLIC_API_URL=https://api.popgastropub.com/api` pero `fetchWithAuth()` antepone `/api/` al endpoint, generando llamadas a `/api/api/ranking` → **404**. En producción, el ranking muestra "Sin datos" / "No hay ranking disponible" por este doble-prefijo.

---

## Inventario de Archivos del Rol Mesero

### Frontend (Next.js 15 — App Router)

| Archivo | Tamaño | Conecta API | Estado |
|---------|--------|-------------|--------|
| `frontend/app/(staff)/layout.tsx` | 3.1KB | — | ✅ Funcional |
| `frontend/app/(staff)/staff/dashboard/page.tsx` | 8KB | `/api/ranking` | ⚠️ Parcial (stats hardcoded) |
| `frontend/app/(staff)/staff/ranking/page.tsx` | 13.2KB | `/api/ranking` | ⚠️ Parcial (badges hardcoded) |
| `frontend/app/(staff)/staff/analiticas/page.tsx` | 7KB | ❌ Ninguno | 🔴 100% hardcoded |
| `frontend/app/(staff)/staff/configuracion/page.tsx` | 18.7KB | ❌ Ninguno | 🔴 100% hardcoded |
| `frontend/app/(staff)/staff/menu/page.tsx` | 4.5KB | ❌ Ninguno | 🔴 100% hardcoded |
| `frontend/app/(staff)/staff/perfil/page.tsx` | 12.9KB | ❌ Ninguno | 🔴 Parcial (lee session) |
| `frontend/app/(staff)/staff/reservaciones/page.tsx` | 7KB | ❌ Ninguno | 🔴 100% hardcoded |
| `frontend/components/ui/StaffSidebar.tsx` | 7.6KB | — | ✅ Funcional |
| `frontend/components/ui/StaffBottomNav.tsx` | 1.6KB | — | ✅ Funcional |

### Backend (Laravel — API)

| Archivo | Endpoints | Estado |
|---------|-----------|--------|
| `backend/routes/api.php` | `GET /api/ranking`, `POST /api/ranking/points` | ✅ Registrados |
| `backend/app/Http/Controllers/RankingController.php` | `index()`, `addPoints()` | ✅ Funcional |
| `backend/app/Http/Controllers/ReservaController.php` | `index()`, `store()`, `cancel()` | ⚠️ Compartido (no específico mesero) |
| `backend/app/Http/Middleware/EnsureRole.php` | Middleware `role:mesero` | ✅ Funcional |
| `backend/app/Models/Mesero.php` | Relación `belongsTo(User)` | ✅ Funcional |
| `backend/app/Models/User.php` | Relación `hasOne(Mesero)` | ✅ Funcional |

### Base de Datos (MariaDB)

**Tabla `meseros`** — 19 columnas, 1 registro (Mesero Demo, 0 puntos):

Campos: `id`, `user_id` (FK→users), `nombre`, `iniciales`, `puntos`, `cocktail_points`, `premium_points`, `pitcher_points`, `bottle_points`, `combo_points`, `upsell_points`, `rating_points`, `total_sales` (decimal 12,2), `orders_served`, `avg_rating` (decimal 3,1), `activo`, `status`, `created_at`, `updated_at`

---

## Diagnóstico por Módulo

### 1. Dashboard (`/staff/dashboard`) — 25% funcional

**Funciona:** Renderiza, lee `session.user.name`, intenta cargar ranking desde API, muestra sección Ranking Personal.

**Falta:**
- Stats cards (Mesas: 14, Bebidas: 42, Puntos: 2,840) → **hardcoded líneas 54-58**
- Órdenes Activas → **hardcoded líneas 60-64** — no hay endpoint de órdenes mesero
- Notificaciones → **hardcoded líneas 172-183** — no hay sistema de notificaciones
- Botón "Ver Ranking Completo" sin `onClick` ni `Link` (línea 162)
- Ranking muestra "Sin datos" en producción por bug doble-prefijo

### 2. Ranking POP Bar Stars (`/staff/ranking`) — 35% funcional

**Funciona:** Consume `/api/ranking`, podium visual top 3, tabla general, loading/error/empty states.

**Falta:**
- Bug doble-prefijo → no carga en producción
- Progreso personal **hardcoded** (65%, Tier Pro) — líneas 246-255
- Insignias del Mes **hardcoded** — líneas 264-276
- No muestra posición personal del mesero logueado
- No hay endpoint para posición personal ni badges
- No hay historial de puntos

### 3. Analíticas (`/staff/analiticas`) — 5% funcional

**100% hardcoded.** Gráfico barras valores fijos, eficiencia fija (18min, 4.8★), categorías fijas, puntos "12,450" fijo, recompensa fija. Filtro período no funciona. Botón descarga sin acción. No existen endpoints backend.

### 4. Menú / Carta (`/staff/menu`) — 10% funcional

Solo 5 items hardcoded. No consume `/api/menu`. Sin búsqueda por nombre. Stock hardcoded. Endpoint `/api/menu` existe pero BD tiene 0 productos.

### 5. Reservaciones (`/staff/reservaciones`) — 5% funcional

4 reservaciones hardcoded. Estado salón hardcoded (75%, 8 mesas). Lista espera hardcoded. Todos los botones sin funcionalidad. Endpoint `/api/reservas` existe pero es del cliente (filtra por user_id). No hay endpoint staff-specific para ver TODAS las reservas. Fecha hardcoded.

### 6. Perfil (`/staff/perfil`) — 20% funcional

Lee nombre/email/puntos/tier de session. Toggle editar funcional (client-side). Logout funcional. Guardar cambios no envía al API. Cambiar contraseña no envía. Teléfono no carga. "Último acceso" y "Sesiones" hardcoded. Endpoints `PUT /auth/profile` y `PUT /auth/password` existen pero no se consumen.

### 7. Configuración (`/staff/configuracion`) — 5% funcional

Tabs funcionales. Datos staff hardcoded. Ningún "Guardar" envía datos. Notificaciones no persisten. Tema no persiste. 2FA no implementado. No existen endpoints backend para config staff.

---

## FASE 1 — CRÍTICA: Corregir Conectividad API (BLOQUEANTE)

### Tarea 1.1: Corregir bug doble-prefijo API

**Contexto:** `NEXT_PUBLIC_API_URL` = `https://api.popgastropub.com/api`. La función `fetchWithAuth(endpoint, token)` construye la URL como `${API_URL}${endpoint}`. Si el endpoint empieza con `/api/`, la URL final será `https://api.popgastropub.com/api/api/...` → 404.

**Regla:** Los endpoints pasados a `fetchWithAuth()` y `fetchAPI()` NUNCA deben empezar con `/api/`. Solo usar la ruta relativa al prefijo `/api` de Laravel.

**Archivos a corregir:**

| Archivo | Línea aprox. | Cambiar | Por |
|---------|------|---------|-----|
| `frontend/app/(staff)/staff/dashboard/page.tsx` | ~74 | `'/api/ranking'` | `'/ranking'` |
| `frontend/app/(staff)/staff/ranking/page.tsx` | ~61 | `'/api/ranking'` | `'/ranking'` |

**Esfuerzo:** 5 minutos. **Impacto:** Desbloquea Dashboard y Ranking en producción.

### Tarea 1.2: Verificar middleware role

El middleware `role:mesero` ya está registrado y funcional. Las rutas existentes son:
- `GET /ranking` — lista ranking de meseros activos
- `POST /ranking/points` — agregar puntos a un mesero

Estas rutas están protegidas con `auth:sanctum` + `role:mesero` en `backend/routes/api.php`.

---

## FASE 2 — BACKEND: Crear Endpoints Faltantes

### Tarea 2.1: Dashboard del mesero
**Crear:** `backend/app/Http/Controllers/Staff/StaffDashboardController.php`
- `GET /staff/dashboard` → stats personales (mesas atendidas, bebidas vendidas, puntos), órdenes activas, notificaciones

### Tarea 2.2: Analíticas del mesero
**Crear:** `backend/app/Http/Controllers/Staff/StaffAnalyticsController.php`
- `GET /staff/analytics?period=week|month` → ventas por día, eficiencia, categorías vendidas

### Tarea 2.3: Reservaciones para staff
**Crear:** `backend/app/Http/Controllers/Staff/StaffReservaController.php`
- `GET /staff/reservas?fecha=YYYY-MM-DD` → TODAS las reservas del día (no filtradas por user_id) + estado salón
- `PATCH /staff/reservas/{id}/status` → cambiar estado de reserva (confirmar, sentar, completar)

### Tarea 2.4: Menú con disponibilidad
**Crear:** `backend/app/Http/Controllers/Staff/StaffMenuController.php`
- `GET /staff/menu` → todos los productos con campo `disponible` y `stock`
- `PATCH /staff/menu/{id}/disponibilidad` → toggle disponibilidad rápido

### Tarea 2.5: Ranking personal y badges
**Crear:** `backend/app/Http/Controllers/Staff/StaffRankingController.php`
- `GET /staff/mi-ranking` → posición personal, progreso al siguiente tier, badges ganados, desglose de puntos por categoría

### Tarea 2.6: Configuración staff
**Crear:** `backend/app/Http/Controllers/Staff/StaffConfigController.php`
- `GET /staff/configuracion` + `PUT /staff/configuracion`
- Usa tabla `settings` existente con group `staff_{user_id}` o campo `preferences` JSON en `meseros`

### Tarea 2.7: Registrar rutas en api.php

**Archivo:** `backend/routes/api.php`

> [!IMPORTANT]
> Las rutas se registran SIN prefijo `/api/` en Laravel (Laravel ya agrega `/api` automáticamente vía `RouteServiceProvider`). El frontend las llama como `/staff/dashboard`, `/staff/analytics`, etc. (sin `/api/` al inicio).

```php
Route::middleware(['auth:sanctum', 'role:mesero'])->prefix('staff')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Staff\StaffDashboardController::class, 'index']);
    Route::get('/analytics', [App\Http\Controllers\Staff\StaffAnalyticsController::class, 'index']);
    Route::get('/reservas', [App\Http\Controllers\Staff\StaffReservaController::class, 'index']);
    Route::patch('/reservas/{id}/status', [App\Http\Controllers\Staff\StaffReservaController::class, 'updateStatus']);
    Route::get('/menu', [App\Http\Controllers\Staff\StaffMenuController::class, 'index']);
    Route::patch('/menu/{id}/disponibilidad', [App\Http\Controllers\Staff\StaffMenuController::class, 'toggleDisponibilidad']);
    Route::get('/mi-ranking', [App\Http\Controllers\Staff\StaffRankingController::class, 'miRanking']);
    Route::get('/configuracion', [App\Http\Controllers\Staff\StaffConfigController::class, 'index']);
    Route::put('/configuracion', [App\Http\Controllers\Staff\StaffConfigController::class, 'update']);
});
```

**Nota:** Las rutas existentes de ranking (`GET /ranking`, `POST /ranking/points`) se mantienen tal cual — ya funcionan con middleware `role:mesero`.

### Tarea 2.8: Seeders con datos de prueba
**Crear:** `backend/database/seeders/MeseroSeeder.php` con 5-8 meseros ficticios con puntos variados para que el ranking tenga datos visibles.

---

## FASE 3 — FRONTEND: Conectar Páginas al Backend

> [!IMPORTANT]
> **Convención de endpoints en frontend:** Todos los endpoints se pasan a `fetchWithAuth()` SIN el prefijo `/api/`. Ejemplos correctos: `'/staff/dashboard'`, `'/ranking'`, `'/staff/menu'`. NUNCA usar `'/api/staff/...'`.

### Tarea 3.1: Dashboard — reemplazar hardcoded
**Archivo:** `frontend/app/(staff)/staff/dashboard/page.tsx`
- Stats cards → consumir `fetchWithAuth('/staff/dashboard', token)`
- Ranking snapshot → ya usa `'/ranking'` (corregido en Fase 1)
- Botón "Ver Ranking Completo" → agregar `<Link href="/staff/ranking">`

### Tarea 3.2: Ranking — posición personal y badges
**Archivo:** `frontend/app/(staff)/staff/ranking/page.tsx`
- Cargar `fetchWithAuth('/staff/mi-ranking', token)` para datos personales
- Reemplazar progreso hardcoded (65%, Tier Pro) con datos reales
- Reemplazar badges hardcoded con badges del API
- Highlight del mesero logueado en la tabla general

### Tarea 3.3: Analíticas — implementar desde cero
**Archivo:** `frontend/app/(staff)/staff/analiticas/page.tsx`
- Consumir `fetchWithAuth('/staff/analytics?period=week', token)`
- Filtro período funcional (cambia query param)
- Gráfico dinámico con datos reales

### Tarea 3.4: Menú — conectar API
**Archivo:** `frontend/app/(staff)/staff/menu/page.tsx`
- Consumir `fetchWithAuth('/staff/menu', token)`
- Toggle disponibilidad → `fetchWithAuth('/staff/menu/{id}/disponibilidad', token, { method: 'PATCH' })`
- Agregar buscador client-side

### Tarea 3.5: Reservaciones — conectar API staff
**Archivo:** `frontend/app/(staff)/staff/reservaciones/page.tsx`
- Consumir `fetchWithAuth('/staff/reservas?fecha=2026-05-10', token)`
- Fecha dinámica (hoy por defecto, selector de fecha)
- Botones de estado → `fetchWithAuth('/staff/reservas/{id}/status', token, { method: 'PATCH', body: ... })`

### Tarea 3.6: Perfil — conectar guardado
**Archivo:** `frontend/app/(staff)/staff/perfil/page.tsx`
- Guardar cambios → `fetchWithAuth('/auth/profile', token, { method: 'PUT', body: ... })`
- Cambiar contraseña → `fetchWithAuth('/auth/password', token, { method: 'PUT', body: ... })`
- Feedback visual (toast/mensaje) al guardar

### Tarea 3.7: Configuración — persistencia
**Archivo:** `frontend/app/(staff)/staff/configuracion/page.tsx`
- Cargar → `fetchWithAuth('/staff/configuracion', token)`
- Guardar → `fetchWithAuth('/staff/configuracion', token, { method: 'PUT', body: ... })`

---

## FASE 4 — MEJORAS AVANZADAS

- **4.1:** Sistema de notificaciones en tiempo real (WebSocket/polling)
- **4.2:** Interfaz para registrar ventas de bebidas (core POP Bar Stars)
- **4.3:** Mapa visual de mesas del restaurante
- **4.4:** Historial de puntos y transacciones (tabla `mesero_point_transactions`)
- **4.5:** Exportación de reportes (CSV/PDF)

---

## Progreso Estimado por Fase

| Módulo | Actual | F1 | F2 | F3 | F4 |
|--------|:---:|:---:|:---:|:---:|:---:|
| Layout/Nav | 95% | 95% | 95% | 95% | 100% |
| Dashboard | 25% | 30% | 50% | 85% | 100% |
| Ranking | 35% | 45% | 65% | 90% | 100% |
| Analíticas | 5% | 5% | 40% | 80% | 100% |
| Menú | 10% | 10% | 40% | 80% | 100% |
| Reservaciones | 5% | 5% | 40% | 75% | 100% |
| Perfil | 20% | 20% | 40% | 85% | 100% |
| Configuración | 5% | 5% | 30% | 70% | 100% |
| **GLOBAL** | **~20%** | **~25%** | **~45%** | **~80%** | **100%** |

---

## Rutas Clave para Agentes IA

```
# Frontend — Páginas Staff
frontend/app/(staff)/layout.tsx
frontend/app/(staff)/staff/dashboard/page.tsx
frontend/app/(staff)/staff/ranking/page.tsx
frontend/app/(staff)/staff/analiticas/page.tsx
frontend/app/(staff)/staff/menu/page.tsx
frontend/app/(staff)/staff/perfil/page.tsx
frontend/app/(staff)/staff/reservaciones/page.tsx
frontend/app/(staff)/staff/configuracion/page.tsx
frontend/components/ui/StaffSidebar.tsx
frontend/components/ui/StaffBottomNav.tsx
frontend/lib/api.ts                    ← BUG doble-prefijo
frontend/lib/auth-session.ts
frontend/lib/auth-provider.tsx

# Backend — Existentes
backend/app/Http/Controllers/RankingController.php
backend/app/Http/Controllers/ReservaController.php
backend/app/Http/Middleware/EnsureRole.php
backend/app/Models/Mesero.php
backend/app/Models/User.php
backend/routes/api.php

# Backend — A CREAR
backend/app/Http/Controllers/Staff/StaffDashboardController.php
backend/app/Http/Controllers/Staff/StaffAnalyticsController.php
backend/app/Http/Controllers/Staff/StaffReservaController.php
backend/app/Http/Controllers/Staff/StaffMenuController.php
backend/app/Http/Controllers/Staff/StaffRankingController.php
backend/app/Http/Controllers/Staff/StaffConfigController.php

# Despliegue VPS
SSH: root@76.13.123.24
Código: /etc/dokploy/compose/popperoteweb-sistemapopperote-4hogw4/code/
Contenedores: pop_perote_frontend, pop_perote_backend, pop_perote_mariadb
BD: pop_user / P0p_P3r0t3_DB_2026! / pop_perote
API: https://api.popgastropub.com/api
```
