---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use when building web components, pages, or improving the UI/UX of the POP Perote platform. Generates creative, polished code avoiding generic AI aesthetics. Uses Next.js, Tailwind CSS, and Framer Motion.
license: Apache-2.0 — https://github.com/anthropics/skills
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

## Project-Specific Context

This platform is for **POP PEROTE** — a sushi, wings, and snacks restaurant in Perote, Veracruz, Mexico. The design language should convey:
- **Energy & vibrancy** — this is a fun, casual dining experience
- **Premium food photography** — sushi rolls, cocktails, wings as hero elements
- **Warmth & accessibility** — family-friendly atmosphere with games
- **Excitement** — animations and interactions that make you WANT to go

Key technical constraints:
- Next.js 14+ App Router
- Tailwind CSS for styling
- Framer Motion for animations
- GSAP for advanced scroll effects
- Mobile-first (customers browse from phones)
- Color palette: `#F2C777` (gold), `#F2C894` (light gold), `#D96725` (orange), `#732817` (wine red), `#0D0D0D` (black)

## Design Thinking

Before coding, commit to a clear aesthetic direction:
- **Purpose**: Which page/section is this for? (landing, menu, promos, loyalty, ranking)
- **Tone**: Energetic but premium — avoid cold corporate OR childish playful extremes
- **Differentiation**: What makes this page instantly recognizable as POP Perote?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Intentionality over intensity.

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Use bold, condensed display fonts for headlines (Bebas Neue, Oswald, or similar). Clean sans-serif for body (DM Sans, Inter). Distinctive pairings.
- **Color & Theme**: Dark mode primary (`#0D0D0D`). Gold accents (`#F2C777`) for premium feel. Orange (`#D96725`) for CTAs. Wine red (`#732817`) for overlays and emphasis.
- **Motion**: Framer Motion for micro-interactions. GSAP for scroll-triggered reveals. Page transitions with fade. Keep animations under 400ms for UI feedback.
- **Spatial Composition**: Generous whitespace (blackspace) on public pages. Controlled density on dashboards. Cards with clear shadow hierarchy.
- **Visual Details**: Subtle gradients, soft golden shadows, consistent border-radius. Food photography as hero elements. Particle effects on desktop.

## Common Patterns in this Project

```css
/* Card component — dark theme */
.card {
  background: #0D0D0D;
  border: 1px solid rgba(242, 199, 119, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}
.card:hover {
  border-color: rgba(242, 199, 119, 0.4);
  box-shadow: 0 8px 32px rgba(242, 199, 119, 0.1);
  transform: translateY(-4px);
}

/* CTA button */
.cta-primary {
  background: #D96725;
  color: white;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-weight: 700;
  transition: all 0.2s ease;
}
.cta-primary:hover {
  background: #F2C777;
  color: #0D0D0D;
  transform: scale(1.02);
}

/* Badge */
.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge-promo { background: #D96725; color: white; }
.badge-new { background: #F2C777; color: #0D0D0D; }
.badge-bestseller { background: #732817; color: #F2C777; }
```

NEVER use generic AI-generated aesthetics: purple gradients on white, Inter font everywhere, predictable grid layouts with no hierarchy, cookie-cutter patterns.

Interpret creatively and make unexpected choices that feel genuinely designed for a premium Mexican restaurant experience.

## Key Pages to Design

1. **Landing Page** — Hero with video, promos, menu teaser, loyalty teaser, testimonials, location
2. **Menu** — Category tabs, product cards with photos, filters, detail drawer
3. **Promotions** — Active promos, weekly calendar, FOMO section
4. **Loyalty (POP Points)** — Dashboard, points, levels, benefits catalog
5. **Waiter Ranking (POP Bar Stars)** — Internal ranking, badges, goals
6. **Admin Panel** — Dashboard, CRUD for menu/promos/users/waiters
7. **Billing (Facturación CFDI)** — Upload ticket, fiscal data form, status tracking
