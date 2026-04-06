# AGENTS.md — POP Perote

> Project context for AI coding agents: OpenCode, Claude Code, Gemini, Codex.
> Last updated: April 2026

---

## Project Overview

**POP Perote** is a full-stack web application for a sushi restaurant in Perote, Veracruz, Mexico. The site serves as a sales tool, customer loyalty platform, staff motivation system, and CFDI invoicing module.

**Restaurant:** POP Perote | Justo Sierra No. 11, Col. Amado Nervo, Perote, Veracruz
**Phone:** 282-825-32-43 | **Google Rating:** 4.4 ★
**Hours:** Mon/Wed-Thu 14:00-21:30, Fri-Sat 14:00-22:00, Sun 14:00-21:00, **Tuesday: CLOSED**
**Specialties:** Sushi (40+ rolls), Wings (10 sauces), Boneless, Crepes, Snacks
**Ordering System:** FoodBooking (existing integration)
**Social:** Facebook @pop.perote (5.2K), Instagram @pop_perote, TikTok

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15+ (App Router), React 19, TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion + GSAP |
| Backend | PHP + Laravel (REST API) |
| Database | MySQL / MariaDB |
| Auth | Laravel Breeze + Laravel Sanctum |
| Hosting | Hostinger Shared Hosting (no Docker, no CI/CD) |
| Domain | pop-perote.com |

---

## Golden Rules

```
1. SQL        → ALWAYS use prepared statements (PDO/Laravel Query Builder), NEVER concatenate
2. CORS       → ONLY in Laravel middleware, NEVER in .htaccess
3. API URL    → ONLY in frontend config (env variable NEXT_PUBLIC_API_URL)
4. API Routes → ONLY in routes/api.php in Laravel
5. Responses  → ALWAYS use Laravel API Resources / Response::json()
6. Auth       → Laravel Sanctum tokens, NEVER from request body
7. Deploy     → Hostinger Shared Hosting — no Docker, no automatic CI/CD
8. Colors     → ONLY use POP palette: #F2C777, #F2C894, #D96725, #732817, #0D0D0D
9. Secrets    → NEVER commit .env, ALWAYS use environment variables
10. Images    → ALWAYS use next/image with defined width/height
11. Stitch UI → When transferring HTML from Google Stitch Text-to-UI, DO NOT save as .html in /public. Instead, directly convert it into JSX/TSX React components within frontend/app or frontend/components (convert class→className, fix self-closing tags, migrate Tailwind config colors and inline styles).
12. No Docs   → NEVER generate .md documentation files after completing operations. Only document when explicitly requested by the user.
```

---

## System Roles

`cliente` | `mesero` | `admin`

---

## Project Modules

1. **Landing Page** — Hero with video, promos, menu, loyalty teaser, testimonials, location
2. **Menu** — Catalog with filters, product cards, FoodBooking integration
3. **Promotions** — Active promos, weekly calendar, FOMO
4. **POP Points** — Loyalty system with tiers (Fan → Lover → VIP → Elite)
5. **CFDI Invoicing** — Ticket upload, tax data, PAC integration, tracking
6. **POP Bar Stars** — Internal waiter ranking by beverage sales
7. **Admin Panel** — Dashboard, CRUD for menu/promos/users/waiters/invoices
8. **Location & Contact** — Map, hours, WhatsApp, reservations

---

## Architecture

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

---

## Proposed File Structure

```
pop_web/
├── frontend/                          ← Next.js 15 (App Router)
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
│   │   ├── ui/                        ← Base components
│   │   ├── menu/                      ← Product cards
│   │   ├── fidelidad/                 ← POP Points
│   │   ├── facturacion/               ← Ticket upload, forms
│   │   └── ranking/                   ← POP Bar Stars
│   ├── lib/
│   │   ├── api.ts                     ← fetch wrapper to Laravel API
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
│   │   │   ├── PacService.php         ← PAC invoicing integration
│   │   │   └── WhatsAppService.php    ← Notifications
│   │   └── Jobs/
│   │       └── TimbrarFactura.php     ← Invoice queue
│   ├── routes/
│   │   ├── api.php                    ← REST API routes
│   │   └── web.php                    ← Only if Laravel admin views needed
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── .env
│
├── docs/
│   ├── POP_WEB.md                     ← General and technical proposal
│   └── planteamiento-web-pop-perote.md
│
└── .opencode/
    └── skills/                        ← Specialized skills
```

---

## Environment Variables

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
DB_PASSWORD=<real_password>

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
MAIL_PASSWORD=<mail_password>
MAIL_FROM_ADDRESS=noreply@pop-perote.com
MAIL_FROM_NAME="POP Perote"
```

---

## POP Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Gold | `#F2C777` | Primary accents, CTAs |
| Light Gold | `#F2C894` | Secondary accents |
| Orange | `#D96725` | Highlights, badges |
| Dark Brown | `#732817` | Text, dark elements |
| Black | `#0D0D0D` | Backgrounds, primary text |

---

## Key Integrations

- **FoodBooking:** Existing ordering system (iframe or redirect with tracking)
- **WhatsApp Business API:** Primary notification channel in Mexico
- **PAC (CFDI):** Facturama (recommended), SW Sapien, Finkok, or Diverza
- **Google Maps:** Location embed
- **Analytics:** Google Analytics 4 + Hotjar

---

## Loyalty System — POP Points

### Tiers
| Tier | Points | Benefits |
|------|--------|----------|
| POP Fan | 0-499 | Basic promos, points per purchase |
| POP Lover | 500-1,499 | +10% pts, monthly exclusive promo, free birthday drink |
| POP VIP | 1,500-2,999 | +25% pts, free roll every 5 visits, early promo access |
| POP Elite | 3,000+ | +50% pts, priority table reservation, events invite, 1 free buffet/month |

### Point Earning
| Action | Points |
|--------|--------|
| First registration | 50 pts (welcome bonus) |
| Per order | 1 pt per $10 MXN spent |
| Check-in at restaurant | 25 pts per visit |
| Google review | 100 pts (with proof) |
| Refer a friend | 200 pts (when friend makes first order) |
| Low-traffic day order | 2x points |
| Birthday | 150 pts automatic |
| Social media share | 30 pts |

---

## Waiter Ranking — POP Bar Stars

| Action | Points |
|--------|--------|
| Sell 1 cocktail/margarita | 10 pts |
| Sell 1 premium drink | 15 pts |
| Sell 1 pitcher/shared | 25 pts |
| Full bottle sale | 50 pts |
| Food + drink combo | 20 pts |
| Upselling (drink upgrade) | 15 pts |
| Best customer rating (waiter mention) | 30 pts |
| "Drink of the month" special | 2x points |

---

## CFDI Invoicing Notes

- **CFDI 4.0** — only valid version since April 1, 2023
- **Required fields:** RFC, exact Name/Razón Social (must match SAT records), Tax Regime, CFDI Usage, Postal Code
- **SLA:** 1-5 min stamping (automatic via PAC), 24 hr max internal SLA
- **States:** pendiente → procesando → timbrado → enviado → error → cancelado
- **Important:** System must NOT auto-reject late requests — human decision required (admin + accountant)

---

## Documentation

- `docs/POP_WEB.md` — Full technical and business proposal
- `docs/planteamiento-web-pop-perote.md` — Detailed project plan
- `docs/prompt-google-stitch-interfaces.md` — UI design prompts
- `.opencode/skills/` — Specialized agent skills
