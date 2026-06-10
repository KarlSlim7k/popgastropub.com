# Análisis Profundo — Rol CLIENTE · POP Perote

## Resumen Ejecutivo

El portal del cliente tiene **7 módulos** dentro del dashboard `(dashboard)/` + páginas públicas relevantes (facturación, menú, login, registro). El diseño visual "Obsidian Sommelier" es premium y consistente. Sin embargo, hay un **bug crítico sistémico** que rompe 3 módulos completos, y la mayoría de los datos están vacíos.

> [!IMPORTANT]
> **Porcentaje de avance global del rol CLIENTE: ~40%**
> - UI/Frontend: ~80% (todas las vistas existen, diseño premium)
> - Backend API: ~65% (controladores existen y funcionan cuando se llaman correctamente)
> - Base de Datos: ~70% (todas las tablas existen, schemas correctos, pero 0 datos)
> - Integración E2E funcional: ~15% (bug de doble-prefijo `/api/api/` rompe 3 módulos)

---

## Bug Crítico #1: Doble Prefijo API `/api/api/`

**Impacto: 3 módulos completamente rotos en producción**

El `NEXT_PUBLIC_API_URL` en producción es `https://api.popgastropub.com/api`. Las funciones `fetchAPI()` y `fetchWithAuth()` en `lib/api.ts` construyen URLs así: `${API_URL}${endpoint}`.

**Páginas que usan `/api/...` como endpoint (ROTO — genera `/api/api/...`):**

| Archivo | Línea | Llamada Incorrecta | URL Generada |
|---------|-------|---------------------|--------------|
| `pedidos/page.tsx` | 31 | `fetchWithAuth("/api/pedidos", token)` | `api.popgastropub.com/api/api/pedidos` ❌ |
| `reservas/page.tsx` | 45 | `fetchWithAuth("/api/reservas", token)` | `api.popgastropub.com/api/api/reservas` ❌ |
| `reservas/page.tsx` | 89 | `fetchWithAuth("/api/reservas", token, {POST})` | `api.popgastropub.com/api/api/reservas` ❌ |
| `recompensas/page.tsx` | 33 | `fetchAPI("/api/recompensas")` | `api.popgastropub.com/api/api/recompensas` ❌ |
| `recompensas/page.tsx` | 46 | `fetchWithAuth("/api/loyalty/points", token)` | `api.popgastropub.com/api/api/loyalty/points` ❌ |
| `recompensas/page.tsx` | 76 | `fetchWithAuth("/api/recompensas/${id}/canjear")` | `api.popgastropub.com/api/api/recompensas/...` ❌ |

**Páginas que usan endpoint SIN `/api/` (CORRECTO):**

| Archivo | Llamada Correcta |
|---------|-----------------|
| `puntos/page.tsx` | `fetchWithAuth("/loyalty/points", token)` ✅ |
| `puntos/page.tsx` | `fetchWithAuth("/loyalty/tier", token)` ✅ |
| `puntos/page.tsx` | `fetchWithAuth("/loyalty/history", token)` ✅ |
| `mis-facturas/page.tsx` | `fetchWithAuth("/facturas", token)` ✅ |
| `perfil/page.tsx` | `fetchWithAuth("/auth/me", token)` ✅ |

**Fix:** Cambiar todos los endpoints de `/api/xxx` a `/xxx` en pedidos, reservas y recompensas.

---

## Bug Crítico #2: Facturación Pública — Doble `/api`

En `(public)/facturacion/PageClient.tsx` línea 91:
```js
const res = await fetch(`${API_URL}/api/facturas`, { ... });
```
Genera: `https://api.popgastropub.com/api/api/facturas` ❌

**Fix:** Cambiar a `${API_URL}/facturas`.

---

## Estado de la Base de Datos (Producción)

### Tablas (13 total) — TODAS las migraciones ejecutadas ✅

| Tabla | Registros | Estado |
|-------|-----------|--------|
| `users` | 4 (2 clientes, 1 admin, 1 mesero) | ✅ |
| `productos` | 0 | ⚠️ Vacía |
| `promociones` | 0 | ⚠️ Vacía |
| `facturas` | 0 | ⚠️ Vacía |
| `meseros` | 0 | ⚠️ Vacía |
| `reservas` | 0 | ⚠️ Vacía |
| `pedidos` | 0 | ⚠️ Vacía |
| `recompensas` | 0 | ⚠️ Vacía (catálogo de premios vacío) |
| `loyalty_transactions` | 0 | ⚠️ Vacía |
| `reward_redemptions` | 0 | ⚠️ Vacía |
| `settings` | ? | Creada en batch 5 |
| `personal_access_tokens` | - | ✅ Sanctum |
| `migrations` | - | ✅ Control |

### Usuario Cliente Demo

```
id: 3, name: "Cliente Demo", email: "cliente@popgastropub.com"
role: "cliente", phone: "2281234569", points: 100, tier: "fan" (computed)
status: "activo", orders_count: 0, total_spent: 0.00
```

---

## Análisis por Módulo del Cliente

### 1. Login y Registro (`/login`, `/registro`)

**Estado: 🟢 Funcional (~75%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Login con email/contraseña | ✅ | Funciona, redirige a `/puntos` |
| Registro de cliente nuevo | ✅ | POST a `/auth/register` con bienvenida 50 pts |
| Logout | ✅ | Limpia token Sanctum + sessionStorage |
| Social Login (Google/Facebook/X) | 🔴 | Botones existen, controlador existe pero NO configurado (requiere OAuth keys) |
| Validación frontend | ✅ | Validación robusta con regex, password rules |
| Redirección por rol | ✅ | `getRoleDashboard()` correcto |
| Persistencia sesión | 🟡 | Usa `sessionStorage` — se pierde al cerrar pestaña |

**Falta:**
- Migrar de `sessionStorage` a `localStorage` o cookie para persistencia
- Configurar OAuth providers (Google/Facebook) con API keys reales
- Recuperación de contraseña (no existe)
- Página `/registro` solo tiene placeholder (123 bytes)

---

### 2. POP Points / Dashboard Cliente (`/puntos`)

**Estado: 🟡 Parcialmente Funcional (~55%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Fetch puntos del usuario | ✅ | `/loyalty/points` → devuelve 100 pts |
| Fetch tier actual | ✅ | `/loyalty/tier` → "POP Fan" correcto |
| Barra de progreso al siguiente tier | ✅ | Calcula % dinámicamente |
| Tarjeta Digital Membership | ✅ | Muestra nombre, tier, ID socio |
| QR Code para Check-in | 🔴 | Solo placeholder icon, no genera QR real |
| Tab Beneficios | 🔴 | **100% hardcoded** (3 beneficios estáticos) |
| Tab Historial | ✅ | Fetch real a `/loyalty/history`, muestra empty state correcto |
| Check-in endpoint | ✅ | Backend funcional (POST `/loyalty/checkin` +25 pts) |
| Botón Check-in en UI | 🔴 | **No existe** — el endpoint existe pero no hay botón en el frontend |
| Atajos de navegación | ✅ | Links a pedidos, reservas, referidos, facturas |
| Promo Banner lateral | 🔴 | **100% hardcoded** — imagen Unsplash, promo ficticia |
| "Miembro desde" fecha | 🔴 | **Hardcoded** "Abril 2024" en vez de `created_at` |
| Expira tarjeta | 🔴 | **Hardcoded** "12 / 2026" |
| Contactar Soporte VIP | 🔴 | Botón sin funcionalidad |

**Response format mismatch:**
- Frontend espera `{ data: { points: number } }` pero backend devuelve `{ user: {...}, recent_transactions: [...] }`
- Frontend espera `{ data: { current: Tier, next: Tier } }` pero backend devuelve `{ current_tier: {...}, next_tier: {...}, points, progress }`
- Actualmente funciona por coincidencia: `pointsRes.data?.points` es undefined → fallback a 0, pero el usuario tiene 100 pts que NO se muestran

> [!CAUTION]
> El usuario `Cliente Demo` tiene 100 puntos en BD pero la UI muestra 0 porque el response format no coincide.

---

### 3. Mis Facturas (`/mis-facturas`)

**Estado: 🟢 Funcional (~70%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Listado de facturas propias | ✅ | Fetch correcto a `/facturas`, empty state funciona |
| Status badges (5 estados) | ✅ | Mapeo correcto con colores |
| Ver ticket adjunto | ✅ | Link condicional al archivo |
| Botón "Solicitar Nueva Factura" | ✅ | Redirige a `/facturacion` |
| Formato fecha | ✅ | Localizado es-MX |
| Detalle de factura individual | 🔴 | No hay vista de detalle |
| Descargar PDF/XML | 🔴 | No implementado (campos `pdf_path`/`xml_path` existen en BD) |
| Notificación cambio de estado | 🔴 | No hay push/email |

---

### 4. Solicitud de Factura Pública (`/facturacion`)

**Estado: 🟡 Parcialmente Funcional (~50%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Verificación de login | ✅ | Muestra "Inicia sesión" si no autenticado |
| Upload de ticket (drag & drop) | ✅ | Funcional con preview y animación |
| Formulario datos fiscales | ✅ | RFC, Razón Social, Régimen, Uso CFDI, CP, Email |
| Validación HTML5 | ✅ | Pattern RFC, maxLength, required |
| Submit al backend | 🔴 | **ROTO** — doble `/api/api/facturas` |
| FAQs interactivas | ✅ | Accordion funcional |
| Datos del establecimiento | ✅ | Info correcta sidebar |
| Requisitos CFDI | ✅ | Listado informativo |
| Contacto WhatsApp/Email | ✅ | Links funcionales |
| Animación de progreso | ✅ | CSS animation premium |

---

### 5. Mis Pedidos (`/pedidos`)

**Estado: 🔴 No Funcional (~20%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| UI completa | ✅ | Diseño premium con cards, badges, estados |
| Fetch de pedidos | 🔴 | **ROTO** — `/api/pedidos` → `/api/api/pedidos` (404) |
| Status badges | ✅ | Mapeo visual de 4+ estados |
| Formato items | ✅ | Parsea string o array de items |
| Formato moneda MXN | ✅ | `Intl.NumberFormat` |
| Puntos ganados | ✅ | Muestra pts por pedido |
| CTA "Ver Menú Digital" | ✅ | Link a `/menu` |
| Crear pedido | 🔴 | No hay botón — los pedidos se crean desde FoodBooking (externo) |
| Integración FoodBooking | 🔴 | No implementada |

---

### 6. Recompensas (`/recompensas`)

**Estado: 🔴 No Funcional (~25%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| UI catálogo de premios | ✅ | Grid responsivo con cards, filtros por categoría |
| Fetch recompensas | 🔴 | **ROTO** — `/api/recompensas` → doble prefijo (404) |
| Fetch puntos del usuario | 🔴 | **ROTO** — `/api/loyalty/points` → doble prefijo |
| Canjear recompensa | 🔴 | **ROTO** — `/api/recompensas/${id}/canjear` → doble prefijo |
| Lock visual (puntos insuficientes) | ✅ | Overlay con candado + "Faltan X pts" |
| Toast de feedback | ✅ | Notificación temporal 3 seg |
| Info "Cómo gano puntos" | ✅ | Sección informativa estática |
| Catálogo de recompensas en BD | 🔴 | **Tabla vacía** — 0 recompensas cargadas |

---

### 7. Mis Reservas (`/reservas`)

**Estado: 🔴 No Funcional (~30%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| UI lista de reservas | ✅ | Diseño premium con imagen, estados, historial |
| Fetch reservas | 🔴 | **ROTO** — `/api/reservas` → doble prefijo (404) |
| Modal crear reservación | ✅ | Form completo: nombre, teléfono, fecha, hora, personas, notas |
| Submit reservación | 🔴 | **ROTO** — POST `/api/reservas` → doble prefijo |
| Pre-fill nombre/teléfono | ✅ | Del objeto session.user |
| Separación activas/pasadas | ✅ | Filtrado client-side por estado |
| Cancelar reserva | 🟡 | Solo muestra toast "Contacta al restaurante" |
| Modificar reserva | 🔴 | Botón deshabilitado, sin funcionalidad |
| Validación horario/día | 🔴 | No valida martes cerrado ni horario operativo |

---

### 8. Referidos (`/referidos`)

**Estado: 🔴 Solo UI (~10%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Diseño visual | ✅ | Hero premium, código referido, reglas |
| Código de referido | 🔴 | **100% hardcoded** "POP-SOFIA-2026" |
| Copiar enlace | ✅ | `navigator.clipboard` funcional |
| Botones WhatsApp/Instagram | 🔴 | Sin funcionalidad real (no abren deep links) |
| Lista de referidos | 🔴 | **Sin datos** — siempre muestra "No tienes referidos" |
| Backend de referidos | 🔴 | **No existe** — no hay controlador, modelo, ni tabla |
| Tracking de conversión | 🔴 | No implementado |

---

### 9. Perfil (`/perfil`)

**Estado: 🟡 Parcialmente Funcional (~45%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Mostrar info usuario | ✅ | Fetch real a `/auth/me`, avatar con iniciales |
| Toggle modo edición | ✅ | Habilita/deshabilita inputs |
| Nombre, email, teléfono | ✅ | Muestra datos reales del backend |
| Fecha de nacimiento | 🟡 | Campo existe pero no se guarda (no está en User model) |
| Guardar cambios | 🔴 | Botón sin funcionalidad — no hay endpoint PUT |
| Cambiar contraseña | 🔴 | Botón sin funcionalidad — no hay endpoint |
| Métodos de pago | 🔴 | Botón sin funcionalidad |
| Beneficios de nivel | 🔴 | **100% hardcoded** (4 beneficios estáticos) |
| Upload avatar | 🔴 | Botón cámara sin funcionalidad |
| ID Socio | ✅ | Genera #POP-0003 dinámicamente |
| Cerrar sesión | ✅ | Funcional, redirige a `/login` |

---

### 10. Navegación del Cliente

**Estado: 🟢 Funcional (~80%)**

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| TopNav desktop | ✅ | Links: Puntos, Recompensas, Facturas, Menú |
| BottomNav móvil | ✅ | 4 items: Dashboard, Menú, Premios, Perfil |
| User dropdown menu | ✅ | Perfil, Recompensas, Facturación, Cerrar Sesión |
| Role guard `RequireRole` | ✅ | Solo permite `role: "cliente"` |
| Redirect si no autenticado | ✅ | Redirige a `/login` |
| Notificaciones (campana) | 🔴 | Icono sin funcionalidad |
| Reservas y Pedidos en nav | 🔴 | No accesibles desde nav principal (solo desde atajos en /puntos) |

---

## Resumen de Avance por Módulo

| # | Módulo | Frontend | Backend | BD | E2E | % Total |
|---|--------|----------|---------|-----|-----|---------|
| 1 | Login/Registro | 85% | 80% | 100% | 70% | **75%** |
| 2 | POP Points `/puntos` | 85% | 75% | 100% | 30% | **55%** |
| 3 | Mis Facturas `/mis-facturas` | 90% | 80% | 100% | 65% | **70%** |
| 4 | Solicitud Factura `/facturacion` | 90% | 80% | 100% | 0% | **50%** |
| 5 | Pedidos `/pedidos` | 85% | 70% | 100% | 0% | **20%** |
| 6 | Recompensas `/recompensas` | 90% | 75% | 0% | 0% | **25%** |
| 7 | Reservas `/reservas` | 90% | 70% | 100% | 0% | **30%** |
| 8 | Referidos `/referidos` | 80% | 0% | 0% | 0% | **10%** |
| 9 | Perfil `/perfil` | 80% | 30% | 80% | 20% | **45%** |
| 10 | Navegación | 90% | N/A | N/A | 80% | **80%** |
| | **PROMEDIO** | | | | | **~46%** |

---

## Plan de Desarrollo por Módulo

> [!IMPORTANT]
> **Prioridad:** La Fase 0 es BLOQUEANTE — el bug de doble-prefijo rompe 3+ módulos completamente.

### Fase 0: Fix Crítico — Doble Prefijo `/api/api/` (BLOQUEANTE)

**Archivos a modificar:**

| Archivo | Cambio |
|---------|--------|
| `frontend/app/(dashboard)/pedidos/page.tsx` L31 | `"/api/pedidos"` → `"/pedidos"` |
| `frontend/app/(dashboard)/reservas/page.tsx` L45 | `"/api/reservas"` → `"/reservas"` |
| `frontend/app/(dashboard)/reservas/page.tsx` L89 | `"/api/reservas"` → `"/reservas"` |
| `frontend/app/(dashboard)/recompensas/page.tsx` L33 | `"/api/recompensas"` → `"/recompensas"` |
| `frontend/app/(dashboard)/recompensas/page.tsx` L46 | `"/api/loyalty/points"` → `"/loyalty/points"` |
| `frontend/app/(dashboard)/recompensas/page.tsx` L76 | `` `/api/recompensas/${id}/canjear` `` → `` `/recompensas/${id}/canjear` `` |
| `frontend/app/(public)/facturacion/PageClient.tsx` L91 | `${API_URL}/api/facturas` → `${API_URL}/facturas` |

**Esfuerzo:** 15 minutos. **Impacto:** Desbloquea Pedidos, Reservas, Recompensas y Facturación pública.

---

### Fase 1: Response Format Alignment — POP Points

**Problema:** El backend retorna formatos diferentes a los que el frontend espera.

**Archivos:**

| Archivo | Cambio |
|---------|--------|
| `frontend/app/(dashboard)/puntos/page.tsx` | Adaptar parsing: `pointsRes.user?.points` en vez de `pointsRes.data?.points`; `tierRes.current_tier` en vez de `tierRes.data?.current`; `tierRes.next_tier` en vez de `tierRes.data?.next` |
| Alternativa: `backend/app/Http/Controllers/LoyaltyController.php` | Wrappear respuestas en `{ data: ... }` para que coincidan con el frontend |

**Backend response actual vs Frontend esperado:**

```
/loyalty/points:
  Backend: { user: {...}, recent_transactions: [...] }
  Frontend espera: { data: { points: number } }
  Fix: leer `res.user?.points ?? res.points ?? 0`

/loyalty/tier:
  Backend: { current_tier: {min,max,name}, next_tier: {min,max,name}, points, progress }
  Frontend espera: { data: { current: Tier, next: Tier|null } }
  Fix: leer `res.current_tier` y `res.next_tier` directamente
```

**Esfuerzo:** 1 hora.

---

### Fase 2: Seed de Datos — Recompensas y Contenido

**Problema:** La tabla `recompensas` está vacía. El módulo de Recompensas no tiene contenido.

**Tareas:**

| Tarea | Detalle | Esfuerzo |
|-------|---------|----------|
| Crear seeder `RecompensaSeeder` | 8-12 recompensas temáticas POP (roll gratis, bebida cumpleaños, descuento, etc.) | 30 min |
| Ejecutar seeder en producción | `php artisan db:seed --class=RecompensaSeeder` | 5 min |
| Agregar campo `categoria` y `tier` a tabla `recompensas` | Migración para filtros frontend | 20 min |

---

### Fase 3: Perfil — Endpoints CRUD

**Tareas:**

| Tarea | Archivo | Esfuerzo |
|-------|---------|----------|
| Crear endpoint `PUT /auth/profile` | `AuthController.php` o nuevo `ProfileController.php` | 1 hr |
| Crear endpoint `PUT /auth/password` | Validar contraseña actual, actualizar | 1 hr |
| Agregar `birth_date` al User model fillable | `User.php` | 5 min |
| Agregar migración para `birth_date` en `users` | Nueva migración | 15 min |
| Conectar frontend form submit con API | `perfil/page.tsx` — form controlado con state, fetch PUT | 1.5 hr |
| Conectar "Cambiar Contraseña" modal | Crear modal, validar, POST | 1.5 hr |

---

### Fase 4: Referidos — Sistema Completo (Nuevo)

**Este módulo NO tiene backend.**

| Tarea | Esfuerzo |
|-------|----------|
| Crear migración `referrals`: id, referrer_id, referred_id, code, status, converted_at | 30 min |
| Crear modelo `Referral` | 15 min |
| Crear `ReferralController` con endpoints: GET /referidos, POST /referidos/generate-code | 2 hrs |
| Agregar `referral_code` a tabla `users` (migración) | 15 min |
| Generar código único al registrarse (`POP-{NAME}-{YEAR}`) | 30 min |
| Modificar `AuthController@register` para procesar `?ref=` parameter | 1 hr |
| Conectar frontend con datos reales (lista de referidos, código dinámico) | 1.5 hrs |
| Implementar share via WhatsApp/Instagram deep links | 30 min |

---

### Fase 5: Mejoras UX y Funcionalidad Adicional

| Tarea | Módulo | Esfuerzo |
|-------|--------|----------|
| Generar QR real con `qrcode.react` | POP Points | 1 hr |
| Agregar botón "Check-in" en UI que llame POST `/loyalty/checkin` | POP Points | 30 min |
| Reemplazar "Miembro desde Abril 2024" con `user.created_at` real | POP Points | 15 min |
| Beneficios dinámicos por tier (no hardcoded) | POP Points, Perfil | 2 hrs |
| Validar martes cerrado + horario operativo en reservas | Reservas | 1 hr |
| Cancelar reserva vía API (no solo toast) | Reservas | 1 hr |
| Agregar Reservas y Pedidos al TopNav/BottomNav | Navegación | 30 min |
| Implementar notificaciones (campana) | Navegación | 3 hrs |
| Migrar `sessionStorage` → `localStorage` para persistencia | Auth | 30 min |
| Implementar "Olvidé mi contraseña" | Auth | 3 hrs |
| Implementar página `/registro` real (actualmente placeholder) | Auth | 2 hrs |
| Descarga PDF/XML de factura completada | Mis Facturas | 2 hrs |

---

## Resumen de Esfuerzo Total

| Fase | Horas |
|------|-------|
| Fase 0: Fix doble prefijo | 0.25 hrs |
| Fase 1: Response format alignment | 1 hr |
| Fase 2: Seed recompensas | 1 hr |
| Fase 3: Perfil CRUD | 5.5 hrs |
| Fase 4: Referidos sistema completo | 6.5 hrs |
| Fase 5: Mejoras UX | ~17 hrs |
| **TOTAL** | **~31 hrs** |

## Orden de Prioridad

1. 🔴 **Fase 0** — Fix doble `/api/api/` (15 min, desbloquea 3+ módulos)
2. 🔴 **Fase 1** — Response format POP Points (1 hr, los puntos muestran 0 en vez de 100)
3. 🟠 **Fase 2** — Seed recompensas (1 hr, el catálogo de premios está vacío)
4. 🟡 **Fase 3** — Perfil endpoints (5.5 hrs, guardar datos del cliente)
5. 🔵 **Fase 4** — Referidos backend (6.5 hrs, módulo completamente nuevo)
6. 🔵 **Fase 5** — Mejoras UX (17 hrs, features nice-to-have)

## Infraestructura

| Aspecto | Estado |
|---------|--------|
| Docker (Dokploy) | ✅ 4 containers: frontend, backend, mariadb, nginx |
| Migraciones en producción | ✅ Todas ejecutadas (16 migraciones, 5 batches) |
| CORS | ✅ Nginx maneja OPTIONS para `popgastropub.com` |
| SSL/TLS | ✅ Traefik con Let's Encrypt |
| API subdomain | ✅ `api.popgastropub.com` → Laravel |
| Frontend domain | ✅ `popgastropub.com` → Next.js |
| Sanctum Auth | ✅ Tokens funcionando correctamente |
