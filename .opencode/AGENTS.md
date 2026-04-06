# OpenCode — POP Perote

> Contexto para agentes IA trabajando en el proyecto POP Perote.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14+ App Router, React, TypeScript |
| Estilos | Tailwind CSS |
| Animaciones | Framer Motion + GSAP |
| Backend | PHP + Laravel (API REST) |
| Base de datos | MySQL/MariaDB |
| Autenticación | Laravel Breeze + Laravel Sanctum |
| Hosting | Hostinger Hosting Compartido |
| Dominio | pop-perote.com (por definir) |

## Reglas de Oro

```
1. SQL        → SIEMPRE prepared statements (PDO/Laravel Query Builder), NUNCA concatenación
2. CORS       → SOLO en Laravel middleware, NUNCA en .htaccess
3. API URL    → SOLO en frontend config (env variable NEXT_PUBLIC_API_URL)
4. Rutas API  → SOLO en routes/api.php de Laravel
5. Respuestas → SIEMPRE usar Laravel API Resources / Response::json()
6. Auth       → Laravel Sanctum tokens, NUNCA del request body
7. Deploy     → Hostinger Hosting Compartido — sin Docker, sin CI/CD automático
8. Colores    → SOLO usar paleta POP: #F2C777, #F2C894, #D96725, #732817, #0D0D0D
9. Secretos   → NUNCA commitear .env, SIEMPRE usar variables de entorno
10. Imágenes  → SIEMPRE usar next/image con width/height definidos
```

## Roles del Sistema

`cliente` | `mesero` | `admin`

## Módulos del Proyecto

1. **Landing Page** — Hero con video, promos, menú, fidelidad teaser, testimonios, ubicación
2. **Menú** — Catálogo con filtros, cards de producto, integración FoodBooking
3. **Promociones** — Promos activas, calendario semanal, FOMO
4. **POP Points** — Sistema de fidelidad con niveles (Fan → Lover → VIP → Elite)
5. **Facturación CFDI** — Upload ticket, datos fiscales, integración PAC, tracking
6. **POP Bar Stars** — Ranking interno de meseros por venta de bebidas
7. **Admin Panel** — Dashboard, CRUD de menú/promos/usuarios/meseros/facturas
8. **Ubicación y Contacto** — Mapa, horarios, WhatsApp, reservaciones

## Arquitectura de Comunicación

```
┌─────────────────┐         ┌─────────────────┐
│   Next.js       │  HTTP   │   Laravel       │
│   (Frontend)    │ ──────► │   (Backend API) │
│   Hostinger     │ ◄────── │   Hostinger     │
│                 │  JSON   │                 │
└─────────────────┘         └────────┬────────┘
                                     │
                              ┌──────▼──────┐
                              │   MySQL     │
                              │  (MariaDB)  │
                              └─────────────┘
```

## Estructura de Archivos (propuesta)

```
pop_web/
├── frontend/                          ← Next.js 14 (App Router)
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx               ← Landing
│   │   │   ├── menu/
│   │   │   ├── promociones/
│   │   │   ├── facturacion/
│   │   │   └── ubicacion/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── registro/
│   │   ├── (dashboard)/
│   │   │   ├── puntos/                ← POP Points
│   │   │   └── mis-facturas/
│   │   ├── (staff)/
│   │   │   └── ranking/               ← POP Bar Stars
│   │   ├── (admin)/
│   │   │   ├── dashboard/
│   │   │   ├── menu/
│   │   │   ├── promociones/
│   │   │   ├── facturacion/
│   │   │   ├── usuarios/
│   │   │   └── meseros/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                        ← Componentes base
│   │   ├── menu/                      ← Cards de producto
│   │   ├── fidelidad/                 ← POP Points
│   │   ├── facturacion/               ← Upload ticket, forms
│   │   └── ranking/                   ← POP Bar Stars
│   ├── lib/
│   │   ├── api.ts                     ← fetch wrapper hacia Laravel API
│   │   └── utils/
│   └── public/
│       ├── images/
│       └── videos/
│
├── backend/                           ← Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Middleware/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   ├── Services/
│   │   │   ├── PacService.php         ← Integración PAC facturación
│   │   │   └── WhatsAppService.php    ← Notificaciones
│   │   └── Jobs/
│   │       └── TimbrarFactura.php     ← Cola de facturación
│   ├── routes/
│   │   ├── api.php                    ← Rutas de la API REST
│   │   └── web.php                    ← Solo si hay vistas admin Laravel
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── .env
│
├── docs/
│   ├── POP_WEB.md                     ← Planteamiento general y técnico
│   └── prompt-google-stitch-interfaces.md
│
└── .opencode/
    ├── AGENTS.md                      ← Este archivo
    └── skills/                        ← Skills adaptados
```

## Variables de Entorno

### Frontend (.env.local)
```dotenv
NEXT_PUBLIC_API_URL="https://pop-perote.com/api"
NEXT_PUBLIC_FOODBOOKING_COMPANY_UID="04f4d10b-2c07-4411-895d-4437eb890919"
NEXT_PUBLIC_FOODBOOKING_RESTAURANT_UID="499ca112-e4ea-46f4-8990-47d5b58748ae"
```

### Backend (.env)
```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://pop-perote.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pop_perote
DB_USERNAME=pop_user
DB_PASSWORD=<contraseña_real>

SANCTUM_STATEFUL_DOMAINS=pop-perote.com
SESSION_DOMAIN=.pop-perote.com

PAC_API_KEY=""
PAC_API_URL=""
PAC_PROVIDER=facturama

WHATSAPP_API_KEY=""
WHATSAPP_API_URL=""

MAIL_MAILER=smtp
MAIL_HOST=mail.pop-perote.com
MAIL_PORT=587
MAIL_USERNAME=noreply@pop-perote.com
MAIL_PASSWORD=<contraseña_correo>
MAIL_FROM_ADDRESS=noreply@pop-perote.com
MAIL_FROM_NAME="POP Perote"
```

## Datos del Restaurante

- **Nombre:** POP Perote
- **Dirección:** Justo Sierra No. 11, Col. Amado Nervo, Perote, Veracruz
- **Teléfono:** 282-825-32-43
- **Horarios:** Lun/Mié-Jue 14:00-21:30, Vie-Sáb 14:00-22:00, Dom 14:00-21:00, Martes CERRADO
- **Especialidad:** Sushi (+40 rollos), Alitas (10 salsas), Boneless, Crepas, Snacks
- **Google Rating:** 4.4 ★
- **Redes:** Facebook @pop.perote (5.2K), Instagram @pop_perote, TikTok
- **Sistema de pedidos:** FoodBooking (integrar con tracking)
