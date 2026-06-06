# AGENTS.md — POP Perote

> Project context for AI coding agents: OpenCode, Claude Code, Gemini, Codex.
> Last updated: June 2026

---

## Project Overview

**POP Perote** is a full-stack web application for a sushi restaurant in Perote, Veracruz, Mexico. The site serves as a sales tool, customer loyalty platform, staff motivation system, and CFDI invoicing module.

**Restaurant:** POP Perote | Justo Sierra No. 11, Col. Amado Nervo, Perote, Veracruz
**Phone:** 282-825-32-43 | **Google Rating:** 4.4 ★
**Hours:** Mon/Wed-Thu 14:00-21:30, Fri-Sat 14:00-22:00, Sun 14:00-21:00, **Tuesday: CLOSED**
**Specialties:** Sushi (40+ rolls), Wings (10 sauces), Boneless, Crepes, Snacks
**Ordering System:** FoodBooking (existing integration)
**Social:** Facebook @pop.perote (5.2K), Instagram @pop_perote, TikTok

### Scope Clarification (Updated June 2026)

**FoodBooking** is the restaurant's primary platform for managing ALL food and beverage orders (sushi, wings, boneless, crepes, snacks, beverages, etc.). The restaurant actively uses FoodBooking for daily operations.

**POP Perote (this platform)** does NOT manage food orders. Its scope is limited to:
- **Beverage menu management** — Only beverages, large alcoholic bottles (wines, spirits), and mixology items are managed in the POP admin menu. These are the ONLY products tracked for the waiter ranking system.
- **POP Bar Stars ranking** — Waiters earn points exclusively from beverage sales (cocktails, premium drinks, pitchers, bottles, combos). Food items do NOT contribute to the ranking.
- **Customer loyalty (POP Points)** — Points are earned from all purchases (tracked via QR tickets in-restaurant), but the admin menu CRUD only manages beverages for ranking purposes.
- **CFDI invoicing, promotions, reservations** — These modules operate independently of FoodBooking.

The internal `/orden` page and `OrderPanel` component are **legacy/deprecated** — they should not be used for new features. All ordering goes through FoodBooking.

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
| Hosting | Hostinger VPS with Docker + Dokploy + Cloudflare |
| Domain | popgastropub.com |

---

## Golden Rules

```
1. SQL        → ALWAYS use prepared statements (PDO/Laravel Query Builder), NEVER concatenate
2. CORS       → ONLY in Laravel middleware, NEVER in .htaccess
3. API URL    → ONLY in frontend config (env variable NEXT_PUBLIC_API_URL)
4. API Routes → ONLY in routes/api.php in Laravel
5. Responses  → ALWAYS use Laravel API Resources / Response::json()
6. Auth       → Laravel Sanctum tokens, NEVER from request body
7. Deploy     → Hostinger VPS with Docker + Dokploy; push to repo triggers auto-deploy via Dokploy (90-120s); NEVER deploy manually to VPS unless explicitly instructed
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
2. **Menu** — Beverage catalog (drinks, bottles, mixology) for ranking, product cards, FoodBooking link for full menu
3. **Promotions** — Active promos, weekly calendar, FOMO
4. **POP Points** — Loyalty system with tiers (Fan → Lover → VIP → Elite)
5. **CFDI Invoicing** — Ticket upload, tax data, PAC integration, tracking
6. **POP Bar Stars** — Internal waiter ranking by beverage sales
7. **Admin Panel** — Dashboard, CRUD for menu (beverages only)/promos/users/waiters/invoices
8. **Location & Contact** — Map, hours, WhatsApp, reservations

---

## Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Cloudflare    │  HTTPS  │   Dokploy       │  HTTP   │   Next.js       │
│   (CDN/WAF)     │ ──────► │   (Traefik)     │ ──────► │   (Frontend)    │
│                 │ ◄────── │                 │ ◄────── │   Docker        │
└─────────────────┘         └────────┬────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   Nginx         │
                            │   (Reverse      │
                            │    Proxy)       │
                            └────────┬────────┘
                                     │
               ┌─────────────────────┼─────────────────────┐
               │                     │                     │
               ▼                     ▼                     ▼
        ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
        │   Laravel    │    │   MariaDB    │    │   Scheduler  │
        │   (Backend)  │    │   (Database) │    │   (Cron)     │
        │   PHP-FPM    │    │              │    │              │
        └──────────────┘    └──────────────┘    └──────────────┘
```

### Infrastructure
- **VPS:** Hostinger VPS (IP: 76.13.123.24)
- **OS:** Linux (Docker + Dokploy)
- **Reverse Proxy:** Nginx inside Docker → Traefik (Dokploy) → Cloudflare
- **Containers:** frontend (Next.js), backend (Laravel PHP-FPM), nginx, mariadb, scheduler
- **Domains:** `popgastropub.com` (frontend), `api.popgastropub.com` (backend)
- **SSL:** Let's Encrypt via Traefik (managed by Dokploy)

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
NEXT_PUBLIC_API_URL="https://api.popgastropub.com/api"
NEXT_PUBLIC_FOODBOOKING_COMPANY_UID="04f4d10b-2c07-4411-895d-4437eb890919"
NEXT_PUBLIC_FOODBOOKING_RESTAURANT_UID="499ca112-e4ea-46f4-8990-47d5b58748ae"
```

### Backend (.env)
```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.popgastropub.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pop_perote
DB_USERNAME=pop_user
DB_PASSWORD=<real_password>

SANCTUM_STATEFUL_DOMAINS=popgastropub.com
SESSION_DOMAIN=.popgastropub.com

MAIL_MAILER=smtp
MAIL_SCHEME=tls
MAIL_HOST=mail.popgastropub.com
MAIL_PORT=587
MAIL_AUTO_TLS=true
MAIL_VERIFY_PEER=false
MAIL_USERNAME=noreply@popgastropub.com
MAIL_PASSWORD=<mailcow_password>
MAIL_FROM_ADDRESS=noreply@popgastropub.com
MAIL_FROM_NAME="POP Perote"
FACTURACION_EMAIL=facturacion@popgastropub.com

PAC_API_KEY=""
PAC_API_URL=""
PAC_PROVIDER=facturama

WHATSAPP_API_KEY=""
WHATSAPP_API_URL=""
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

- **FoodBooking:** Restaurant's primary platform for ALL food & beverage orders. POP links to it for ordering; POP does NOT manage orders internally
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

> Points are earned exclusively from **beverage sales** (cocktails, premium drinks, pitchers, bottles, combos). Food items do NOT contribute to the ranking.

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
