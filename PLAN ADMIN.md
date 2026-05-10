# Análisis Profundo — Rol ADMIN · POP Perote

## Resumen Ejecutivo

El panel administrativo tiene **9 módulos** con sus vistas frontend implementadas y un diseño visual premium (Obsidian Sommelier). Sin embargo, la integración backend-frontend está **parcialmente funcional** — la mayoría de módulos hacen llamadas API reales pero los datos devueltos están vacíos o no mapean correctamente a las interfaces.

> [!IMPORTANT]
> **Porcentaje de avance global del rol ADMIN: ~35%**
> - UI/Frontend: ~75% (todas las vistas existen, diseño premium)
> - Backend API: ~50% (controladores existen, pero falta validación robusta y lógica de negocio)
> - Base de Datos: ~30% (faltan 5 tablas, campos no alineados con frontend)
> - Integración E2E funcional: ~15% (muy pocos flujos end-to-end operativos)

---

## Estado de la Base de Datos

### Tablas Existentes (7)
| Tabla | Registros | Estado |
|-------|-----------|--------|
| `users` | 4 | ✅ Funcional |
| `productos` | 0 | ✅ Creada, vacía |
| `promociones` | 0 | ✅ Creada, vacía |
| `facturas` | 0 | ✅ Creada, vacía |
| `meseros` | 1 | ✅ Creada, 1 registro |
| `migrations` | - | ✅ Control de migraciones |
| `personal_access_tokens` | - | ✅ Sanctum tokens |

### Tablas Faltantes (5) — Migraciones escritas pero NO ejecutadas en producción
| Tabla | Migración Existe | Impacto |
|-------|-----------------|---------|
| `reservas` | ✅ `2026_04_25_000002` | ❌ Crash si se accede desde API |
| `pedidos` | ✅ `2026_04_25_000003` | ❌ Crash en Dashboard (cuenta pedidos) |
| `recompensas` | ✅ `2026_04_25_000004` | ❌ Módulo Puntos POP no funcional |
| `reward_redemptions` | ✅ `2026_04_25_000005` | ❌ Canjes de puntos no funcional |
| `loyalty_transactions` | ✅ `2026_04_25_000001` | ❌ Historial de puntos no funcional |

> [!CAUTION]
> El `DashboardController` hace queries a `Reserva`, `Pedido` y `RewardRedemption` que **no existen en producción**. Esto probablemente causa errores 500 silenciosos que el frontend ignora con `catch(() => {})`.

---

## Análisis por Módulo

### 1. Dashboard (`/admin/dashboard`)

**Estado: 🟡 Parcialmente Funcional (~40%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| KPI Cards (6) | 🟡 | Hacen fetch a `/api/admin/dashboard`, pero el backend crashea por tablas faltantes |
| Gráfica Facturación | 🔴 | **100% hardcoded** — datos estáticos `barData` en frontend |
| Mix de Ventas (donut) | 🔴 | **100% hardcoded** — `donutData` con productos ficticios |
| Top Meseros tabla | 🔴 | **100% hardcoded** — `topWaiters` array estático |
| Menú en Vivo tabla | 🔴 | **100% hardcoded** — `menuItems` array estático con URLs Unsplash |
| Toggle 7D/30D | 🔴 | Solo cambia estado visual, no filtra datos |

**Problemas críticos:**
- El backend retorna `totalUsers`, `totalMeseros`, etc. pero las tablas de `reservas`, `pedidos`, `reward_redemptions` no existen → error 500
- Frontend muestra KPIs como "-" si el fetch falla
- No hay endpoint para datos de gráficas ni mix de ventas

---

### 2. Gestión Menú (`/admin/gestion-menu`)

**Estado: 🟢 Mayormente Funcional (~65%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Listado de productos | ✅ | Fetch real a `/api/admin/menu` |
| Crear producto | ✅ | POST funcional (pero campo mismatch) |
| Editar producto | ✅ | PUT funcional |
| Eliminar producto | ✅ | DELETE funcional |
| Toggle activo/inactivo | 🟡 | Envía PUT pero el campo `active` del frontend no existe en backend (usa `disponible`) |
| Búsqueda y filtros | ✅ | Funciona client-side |

**Problemas de mapeo Frontend ↔ Backend:**
```
Frontend (MenuItem)          Backend (Producto)
─────────────────           ──────────────────
name                    →   nombre
category                →   categoria
price                   →   precio
cost                    →   ❌ NO EXISTE
stock                   →   ❌ NO EXISTE
status                  →   ❌ NO EXISTE
active                  →   disponible
image                   →   imagen
orders                  →   ❌ NO EXISTE
rating                  →   ❌ NO EXISTE
hasPromo                →   ❌ NO EXISTE
promoPrice              →   ❌ NO EXISTE
allergens               →   ❌ NO EXISTE
```

> [!WARNING]
> El frontend envía campos que el backend no valida ni almacena (cost, stock, allergens, etc.). El backend almacena `nombre`, `precio`, `categoria`, `imagen`, `disponible`, `destacado`, `descripcion` — campos que el frontend NO usa correctamente.

---

### 3. Promociones (`/admin/promociones`)

**Estado: 🟡 Parcialmente Funcional (~45%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Listado | ✅ | Fetch real a `/api/admin/promociones` |
| Crear/Editar/Eliminar | ✅ | CRUD funcional |
| Calendario semanal | 🔴 | **100% hardcoded** en frontend |
| Filtros por estado | ✅ | Funciona client-side |
| KPI estadísticas | 🟡 | Calculadas sobre datos cargados pero sin datos reales |

**Problemas de mapeo:**
```
Frontend (Promo)            Backend (Promocion)
────────────────            ───────────────────
name                    →   titulo
description             →   descripcion
type                    →   ❌ NO EXISTE
discount                →   precio_original + precio_promo
startDate               →   dia_inicio
endDate                 →   dia_fin
daysActive              →   ❌ NO EXISTE
status                  →   activa (boolean, no enum)
redemptions             →   ❌ NO EXISTE
target                  →   ❌ NO EXISTE
revenue                 →   ❌ NO EXISTE
image                   →   imagen
```

---

### 4. Facturación (`/admin/facturacion`)

**Estado: 🟢 Funcional (~60%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Listado solicitudes | ✅ | Fetch real a `/api/admin/facturas` |
| Cambio de estado | ✅ | PATCH funcional con 5 estados |
| KPIs (total, pendientes, etc.) | ✅ | Calculadas sobre datos reales |
| Filtros por estado | ✅ | Funciona client-side |
| Ver ticket (imagen) | ✅ | Link al archivo subido |
| Ver detalle | 🔴 | Botón existe pero no hace nada |
| Envío por email | 🔴 | No implementado |
| Integración PAC (CFDI) | 🔴 | No implementado (requiere servicio externo) |

**Nota:** El modelo `Factura` tiene campos: `user_id`, `rfc`, `razon_social`, `regimen_fiscal`, `uso_cfdi`, `email`, `ticket_path`, `estado`. La interfaz admin mapea correctamente para la gestión básica de solicitudes.

---

### 5. Usuarios (`/admin/usuarios`)

**Estado: 🟡 Parcialmente Funcional (~40%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Listado | ✅ | Fetch real a `/api/admin/usuarios`, muestra 0 usuarios (pero hay 4 en BD) |
| Filtros rol/estado | ✅ | Funciona client-side |
| Búsqueda | ✅ | Funciona client-side |
| KPI stats (cards) | ✅ | Calculadas sobre datos cargados |
| Botón Exportar | 🔴 | Sin funcionalidad |
| Editar usuario | 🔴 | Botón existe pero no abre modal (no hay modal implementado) |
| Eliminar usuario | 🔴 | Botón existe pero no conectado a API |
| Ver perfil | 🔴 | Botón existe pero no hace nada |
| Crear usuario | 🔴 | **No hay botón** para crear usuarios |

**Problema principal:** La tabla muestra "0 usuarios" a pesar de tener 4 en BD. El backend devuelve los campos del modelo User (`name`, `email`, `role`, `phone`, `points`, `created_at`) pero el frontend espera campos adicionales: `status`, `tier`, `tierColor`, `joinDate`, `lastVisit`, `orders`, `totalSpent`, `avatar`, `rfc`, `id (string)`.

> [!WARNING]
> El backend retorna `id` como integer, el frontend espera string. Además faltan campos como `status`, `tier`, `orders`, `totalSpent` que no existen en la tabla `users`. Esto causa que la tabla se muestre vacía porque `user.name.toLowerCase()` falla si algún campo esperado es undefined.

---

### 6. Bar Stars / Meseros (`/admin/meseros`)

**Estado: 🟡 Parcialmente Funcional (~45%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Listado + Ranking | ✅ | Fetch real a `/api/admin/meseros` |
| Podio Top 3 | ✅ | Se genera dinámicamente |
| Crear mesero | 🟡 | Modal funcional pero campo mismatch |
| Editar mesero | 🟡 | Modal funcional pero campo mismatch |
| Eliminar mesero | ✅ | DELETE funcional |
| Filtro por periodo | 🔴 | Cambia estado visual pero no filtra datos |

**Problemas de mapeo:**
```
Frontend (Waiter)           Backend (Mesero)
─────────────────           ────────────────
name                    →   nombre
initials                →   ❌ NO EXISTE
status                  →   activo (boolean, no enum)
cocktailPoints          →   ❌ NO EXISTE
premiumPoints           →   ❌ NO EXISTE
pitcherPoints           →   ❌ NO EXISTE
bottlePoints            →   ❌ NO EXISTE
comboPoints             →   ❌ NO EXISTE
upsellPoints            →   ❌ NO EXISTE
ratingPoints            →   ❌ NO EXISTE
totalPoints             →   puntos
totalSales              →   ❌ NO EXISTE
ordersServed            →   ❌ NO EXISTE
avgRating               →   ❌ NO EXISTE
```

El backend solo tiene: `user_id`, `nombre`, `puntos`, `activo`, `turno`. El frontend espera un desglose detallado de puntos por categoría que no existe en la BD.

---

### 7. Puntos POP (`/admin/puntos`)

**Estado: 🔴 No Funcional (~15%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| KPI Stats (4 cards) | 🔴 | **100% hardcoded** (1,268 miembros, 125,000 puntos, etc.) |
| Tier Cards (4 niveles) | 🔴 | **100% hardcoded** (842 Fan, 328 Lover, etc.) |
| Cómo Ganar Puntos grid | 🔴 | **100% hardcoded** (UI informativa estática) |
| Top 5 Miembros tabla | 🔴 | **100% hardcoded** (Roberto Sánchez 4,250 pts, etc.) |
| Actividad Reciente timeline | 🔴 | **100% hardcoded** (Juan Pérez hace 2 min, etc.) |
| Registrar Canje modal | 🔴 | Modal se abre pero **sin funcionalidad** backend |
| Botón Exportar | 🔴 | Sin funcionalidad |

> [!CAUTION]
> Este módulo NO hace **ninguna llamada API**. Todo es data estática en el componente. Las tablas `loyalty_transactions`, `recompensas`, y `reward_redemptions` no existen en producción. Hay un **bug visual**: en el tier POP Elite dice "Reservación优先" (texto en chino corrupto).

---

### 8. Configuración (`/admin/configuracion`)

**Estado: 🔴 Solo UI (~10%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Tab General | 🔴 | Campos pre-poblados con valores estáticos, sin save API |
| Tab Notificaciones | 🔴 | Toggles visuales, sin persistencia |
| Tab Apariencia | 🔴 | Radio buttons y toggles visuales, sin persistencia |
| Tab Seguridad | 🔴 | 2FA, sesiones, todo visual sin backend |
| Horario de operación | 🔴 | Datos estáticos correctos pero sin save |
| Botones "Guardar" | 🔴 | Sin funcionalidad — no llaman a ningún endpoint |

**No existe:**
- Ningún endpoint API para configuración
- Ningún modelo/tabla de configuración
- Ninguna lógica de persistencia

---

### 9. Perfil (`/admin/perfil`)

**Estado: 🟡 Parcialmente Funcional (~35%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Mostrar info del usuario | ✅ | Lee de la sesión auth (nombre, email) |
| Avatar con iniciales | ✅ | Genera dinámicamente |
| Toggle modo edición | ✅ | Habilita/deshabilita inputs |
| Guardar cambios perfil | 🔴 | Botón sin funcionalidad API |
| Cambiar contraseña | 🔴 | Formulario sin funcionalidad API |
| Stats de actividad | 🔴 | **100% hardcoded** ("Hoy, 14:30", "1 dispositivo") |

---

## Resumen de Avance por Módulo

| # | Módulo | Frontend | Backend | BD | E2E | % Total |
|---|--------|----------|---------|-----|-----|---------|
| 1 | Dashboard | 85% | 40% | 30% | 15% | **40%** |
| 2 | Gestión Menú | 90% | 70% | 50% | 40% | **65%** |
| 3 | Promociones | 85% | 60% | 40% | 25% | **45%** |
| 4 | Facturación | 85% | 70% | 80% | 55% | **60%** |
| 5 | Usuarios | 75% | 60% | 40% | 10% | **40%** |
| 6 | Bar Stars | 85% | 50% | 25% | 20% | **45%** |
| 7 | Puntos POP | 80% | 0% | 0% | 0% | **15%** |
| 8 | Configuración | 90% | 0% | 0% | 0% | **10%** |
| 9 | Perfil | 70% | 10% | 50% | 10% | **35%** |
| | **PROMEDIO** | | | | | **~39%** |

---

## Plan de Desarrollo por Módulo

> [!IMPORTANT]
> **Prioridad sugerida:** La ruta crítica es ejecutar las migraciones pendientes en producción PRIMERO, luego alinear los modelos/controladores con las interfaces, y finalmente conectar la lógica de negocio.

### Fase 0: Infraestructura Crítica (BLOQUEANTE)

| Tarea | Esfuerzo | Prioridad |
|-------|----------|-----------|
| Ejecutar 5 migraciones pendientes en producción (`artisan migrate`) | 15 min | 🔴 URGENTE |
| Instalar `laravel/tinker` para debugging | 5 min | Media |
| Corregir `.env` del backend local vs producción | 10 min | Alta |

---

### Módulo 1: Dashboard

| Tarea | Esfuerzo |
|-------|----------|
| Corregir `DashboardController` para manejar tablas faltantes con try/catch o verificación | 30 min |
| Crear endpoint `/api/admin/dashboard/chart-data` para gráfica de facturación por día/semana/mes | 2 hrs |
| Crear endpoint `/api/admin/dashboard/sales-mix` para mix de ventas real | 2 hrs |
| Crear endpoint `/api/admin/dashboard/top-waiters` para top meseros dinámico | 1 hr |
| Crear endpoint `/api/admin/dashboard/live-menu` para menú con stock real | 1 hr |
| Conectar frontend con todos los nuevos endpoints eliminando datos hardcoded | 2 hrs |
| **Subtotal** | **~8.5 hrs** |

---

### Módulo 2: Gestión Menú

| Tarea | Esfuerzo |
|-------|----------|
| Agregar campos faltantes a migración `productos`: `costo`, `stock`, `status`, `pedidos_count`, `rating`, `alergenos` (JSON), `tiene_promo`, `precio_promo` | 1 hr |
| Actualizar modelo `Producto` con nuevos fillables y casts | 30 min |
| Actualizar `Admin\MenuController` — validaciones y mapeo de campos | 1 hr |
| Alinear frontend para usar nombres de campo del backend o crear adapter | 1.5 hrs |
| Agregar upload de imagen real (en lugar de URL) con storage Laravel | 2 hrs |
| Seed con los 40+ platillos reales de POP Perote | 1.5 hrs |
| **Subtotal** | **~7.5 hrs** |

---

### Módulo 3: Promociones

| Tarea | Esfuerzo |
|-------|----------|
| Agregar campos faltantes a migración `promociones`: `tipo` (enum), `descuento`, `dias_activos`, `estado` (enum), `redenciones`, `meta`, `ingresos` | 1 hr |
| Actualizar modelo `Promocion` y controller con nuevos campos y validaciones | 1 hr |
| Alinear mapeo frontend ↔ backend | 1 hr |
| Crear endpoint para calendario semanal dinámico basado en promociones activas | 1.5 hrs |
| Implementar lógica de expiración automática de promociones (scheduled command) | 1 hr |
| **Subtotal** | **~5.5 hrs** |

---

### Módulo 4: Facturación

| Tarea | Esfuerzo |
|-------|----------|
| Implementar botón "Ver Detalle" — modal con toda la info de la factura | 1.5 hrs |
| Agregar funcionalidad de descarga de ticket (PDF/imagen) | 1 hr |
| Implementar notificación por email al cliente cuando se cambia estado | 2 hrs |
| Agregar filtro por fecha (rango) | 1 hr |
| Crear vista de estadísticas mensuales (gráfica de facturas por estado) | 2 hrs |
| **Futuro:** Integración PAC (Facturama) para timbrado CFDI 4.0 | 8-16 hrs |
| **Subtotal (sin PAC)** | **~7.5 hrs** |

---

### Módulo 5: Usuarios

| Tarea | Esfuerzo |
|-------|----------|
| Agregar campos faltantes a `users`: `status` (enum), `phone`, `rfc`, `tier`, `last_visit`, `total_spent` | 1 hr |
| Crear API Resource para formatear correctamente la respuesta (con tier calculado, avatar generado) | 1.5 hrs |
| Implementar modal de crear usuario en frontend | 1.5 hrs |
| Implementar modal de editar usuario en frontend | 1.5 hrs |
| Conectar botones eliminar y ver perfil | 1 hr |
| Implementar funcionalidad de exportar CSV/Excel | 2 hrs |
| Calcular tier POP dinámicamente basado en puntos del usuario | 1 hr |
| **Subtotal** | **~9.5 hrs** |

---

### Módulo 6: Bar Stars / Meseros

| Tarea | Esfuerzo |
|-------|----------|
| Expandir migración `meseros` con campos de puntos desglosados (cocktail, premium, pitcher, bottle, combo, upsell, rating), orders_served, avg_rating, total_sales | 1 hr |
| Actualizar modelo `Mesero` y controller | 1 hr |
| Alinear frontend con nombres de campo del backend | 1.5 hrs |
| Implementar filtro por periodo real (semana/mes/histórico) en backend | 1.5 hrs |
| Agregar endpoint para registrar ventas/puntos individualmente (no solo CRUD completo) | 2 hrs |
| **Subtotal** | **~7 hrs** |

---

### Módulo 7: Puntos POP

| Tarea | Esfuerzo |
|-------|----------|
| Verificar/ejecutar migraciones de `loyalty_transactions`, `recompensas`, `reward_redemptions` | 15 min |
| Crear `Admin\PuntosController` con endpoints: stats, tiers-distribution, top-members, recent-activity | 3 hrs |
| Crear rutas API admin para puntos | 30 min |
| Conectar KPI cards con datos reales del backend | 1 hr |
| Conectar tier cards con conteo real de usuarios por rango de puntos | 1 hr |
| Conectar Top 5 miembros con query real | 1 hr |
| Conectar actividad reciente con `loyalty_transactions` reales | 1.5 hrs |
| Implementar funcionalidad "Registrar Canje" completa (buscar usuario, validar puntos, crear transacción) | 3 hrs |
| Implementar funcionalidad "Exportar" | 1.5 hrs |
| Corregir bug "Reservación优先" → "Reservación prioritaria" | 5 min |
| **Subtotal** | **~13 hrs** |

---

### Módulo 8: Configuración

| Tarea | Esfuerzo |
|-------|----------|
| Crear tabla `settings` (key-value) con migración | 30 min |
| Crear modelo `Setting` y `Admin\ConfiguracionController` | 1.5 hrs |
| Implementar endpoints CRUD para settings agrupados por categoría | 2 hrs |
| Conectar tab General con API (save/load) | 1.5 hrs |
| Conectar tab Notificaciones (save preferencias de notificación) | 1 hr |
| Conectar tab Apariencia (tema, densidad) | 1 hr |
| Conectar tab Seguridad (2FA toggle, session timeout, sesiones activas reales) | 3 hrs |
| **Subtotal** | **~10.5 hrs** |

---

### Módulo 9: Perfil

| Tarea | Esfuerzo |
|-------|----------|
| Crear endpoint `PUT /api/auth/profile` para actualizar nombre, email, phone | 1 hr |
| Crear endpoint `PUT /api/auth/password` para cambiar contraseña (validación actual) | 1 hr |
| Conectar frontend "Guardar Cambios" con API | 1 hr |
| Conectar "Actualizar Contraseña" con API | 1 hr |
| Reemplazar stats hardcoded con datos reales (último acceso de Sanctum token, sesiones activas) | 1.5 hrs |
| **Subtotal** | **~5.5 hrs** |

---

## Resumen de Esfuerzo Total

| Fase/Módulo | Horas Estimadas |
|-------------|-----------------|
| Fase 0: Infraestructura | 0.5 hrs |
| Módulo 1: Dashboard | 8.5 hrs |
| Módulo 2: Gestión Menú | 7.5 hrs |
| Módulo 3: Promociones | 5.5 hrs |
| Módulo 4: Facturación | 7.5 hrs |
| Módulo 5: Usuarios | 9.5 hrs |
| Módulo 6: Bar Stars | 7 hrs |
| Módulo 7: Puntos POP | 13 hrs |
| Módulo 8: Configuración | 10.5 hrs |
| Módulo 9: Perfil | 5.5 hrs |
| **TOTAL** | **~75 hrs** |

## Orden de Prioridad Sugerido

1. 🔴 **Fase 0** — Ejecutar migraciones pendientes (bloqueante para todo)
2. 🟠 **Módulo 2: Gestión Menú** — Más cerca de funcional, impacto operativo alto
3. 🟠 **Módulo 4: Facturación** — Ya funcional básicamente, necesita pulir
4. 🟡 **Módulo 5: Usuarios** — Crítico para administración
5. 🟡 **Módulo 9: Perfil** — Rápido de completar
6. 🟡 **Módulo 6: Bar Stars** — Necesario para motivación del staff
7. 🟡 **Módulo 3: Promociones** — Impacto en marketing
8. 🔵 **Módulo 1: Dashboard** — Resumen ejecutivo, depende de los demás
9. 🔵 **Módulo 7: Puntos POP** — Complejo, depende de datos de usuarios
10. 🔵 **Módulo 8: Configuración** — Nice-to-have, prioridad más baja

## Open Questions

> [!IMPORTANT]
> 1. **¿Debo proceder a ejecutar las migraciones pendientes en producción?** Esto creará las 5 tablas faltantes sin afectar datos existentes.
> 2. **¿Prefieres que alinee el frontend a los nombres del backend (español: `nombre`, `precio`, `categoria`) o el backend al frontend (inglés: `name`, `price`, `category`)?**
> 3. **¿Quieres que empecemos con un módulo específico o seguir el orden de prioridad sugerido?**
> 4. **Para el seed de datos del menú, ¿tienes el catálogo real de platillos con precios actualizado?**
