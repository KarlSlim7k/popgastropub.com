---
name: webapp-testing
description: Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs. Use for testing the POP Perote Next.js application.
license: Apache-2.0 — https://github.com/anthropics/skills
---

# Web Application Testing — POP Perote

To test the POP Perote web application, write native Python Playwright scripts.

**Always run scripts with `--help` first** to see usage. DO NOT read the source until you try running the script first and find that a customized solution is absolutely necessary.

## Decision Tree: Choosing Your Approach

```
User task → Is it static HTML?
    ├─ Yes → Read HTML file directly to identify selectors
    │         ├─ Success → Write Playwright script using selectors
    │         └─ Fails/Incomplete → Treat as dynamic (below)
    │
    └─ No (dynamic webapp) → Is the server already running?
        ├─ No → Start the Next.js dev server first
        │        Then navigate and test
        │
        └─ Yes → Reconnaissance-then-action:
            1. Navigate and wait for networkidle
            2. Take screenshot or inspect DOM
            3. Identify selectors from rendered state
            4. Execute actions with discovered selectors
```

## Project-Specific Context

This is a **Next.js 14+** project with:
- **Frontend**: Next.js App Router, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, PostgreSQL (Supabase/Neon)
- **Dev server**: `npm run dev` (default port 3000)
- **Build**: `npm run build && npm start` for production
- **Key pages**: Landing, Menu, Promotions, Loyalty (POP Points), Waiter Ranking (POP Bar Stars), Admin Panel, Billing (Facturación CFDI)

## Starting the Server

```bash
# Development mode
cd /home/karoldelgado/web-dev/pop_web
npm run dev
# Server runs on http://localhost:3000

# Production mode
npm run build
npm start
# Server runs on http://localhost:3000
```

## Example Playwright Script

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Navigate to landing page
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')  # CRITICAL: Wait for JS to execute
    
    # Screenshot for inspection
    page.screenshot(path='/tmp/landing.png', full_page=True)
    
    # Check hero section
    hero = page.locator('h1')
    print(f"Hero text: {hero.inner_text()}")
    
    # Click CTA button
    page.click('text=HAZ TU PEDIDO AHORA')
    page.wait_for_load_state('networkidle')
    
    browser.close()
```

## Reconnaissance-Then-Action Pattern

1. **Inspect rendered DOM**:
   ```python
   page.screenshot(path='/tmp/inspect.png', full_page=True)
   content = page.content()
   page.locator('button').all()
   ```
2. **Identify selectors** from inspection results
3. **Execute actions** using discovered selectors

## Common Pitfall

❌ **Don't** inspect the DOM before waiting for `networkidle` on dynamic apps
✅ **Do** wait for `page.wait_for_load_state('networkidle')` before inspection

## Best Practices

- Use `sync_playwright()` for synchronous scripts
- Always close the browser when done
- Use descriptive selectors: `text=`, `role=`, CSS selectors, or data-testid attributes
- Store tests in `tests/playwright/` organized by feature
- Always test auth flows first (login, registro, password recovery)
- Test responsive breakpoints: mobile (375px), tablet (768px), desktop (1440px)

## Testing POP Perote Key Flows

```python
from playwright.sync_api import sync_playwright

def test_pop_perote_flows():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 375, 'height': 812})  # Mobile
        page = context.new_page()
        
        # 1. Landing page loads
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        assert page.locator('text=Pop Perote').is_visible()
        
        # 2. Menu page loads with categories
        page.goto('http://localhost:3000/menu')
        page.wait_for_load_state('networkidle')
        assert page.locator('text=SUSHI').is_visible()
        assert page.locator('text=ALITAS').is_visible()
        
        # 3. Billing page - upload ticket flow
        page.goto('http://localhost:3000/facturacion')
        page.wait_for_load_state('networkidle')
        assert page.locator('text=FACTURA TU COMPRA').is_visible()
        
        # 4. Test responsive (desktop)
        context.set_viewport_size({'width': 1440, 'height': 900})
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        page.screenshot(path='/tmp/desktop-landing.png', full_page=True)
        
        browser.close()
```

## Testing Auth Flows

```python
def test_auth_flows():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Registration
        page.goto('http://localhost:3000/registro')
        page.wait_for_load_state('networkidle')
        page.fill('input[name="nombre"]', 'Test User')
        page.fill('input[name="email"]', 'test@popperote.com')
        page.fill('input[name="telefono"]', '2821234567')
        page.fill('input[name="password"]', 'TestPass123!')
        page.click('button[type="submit"]')
        page.wait_for_load_state('networkidle')
        
        # Verify redirect to dashboard
        assert 'dashboard' in page.url or 'puntos' in page.url
        
        browser.close()
```
