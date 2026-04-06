---
name: web-performance
description: Web performance optimization for the Next.js + Laravel + Hostinger stack of POP Perote. Use when improving page load speed, image optimization, browser caching, CDN configuration, API response time, or frontend asset delivery.
---

# Web Performance — POP Perote (Next.js + Laravel + Hostinger)

Plataforma en Hostinger con Next.js (frontend) y Laravel (backend API). Rendimiento optimizado en tres capas: **Next.js**, **Laravel**, y **MySQL**.

## Stack de Referencia

- Next.js 14+ App Router con SSR/SSG
- Laravel API REST (PHP 8.x)
- MySQL/MariaDB (Hostinger)
- Tailwind CSS (purged en build)
- Framer Motion + GSAP para animaciones
- Imágenes optimizadas con `next/image`
- Hosting: Hostinger Hosting Compartido

---

## 1. Next.js — Optimización de Imágenes

```tsx
// ✅ Usar next/image con optimización automática
import Image from 'next/image'

<Image
  src="/images/sushi-roll.jpg"
  alt="Rollo de sushi premium"
  width={800}
  height={600}
  priority  // Solo para hero/above-the-fold
  quality={85}
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

// ✅ Imágenes remotas (desde CDN de fotos)
<Image
  src={platillo.imagenUrl}
  alt={platillo.nombre}
  width={400}
  height={300}
  loading="lazy"
/>
```

### Configurar dominios permitidos en `next.config.ts`

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}
```

---

## 2. Next.js — Optimización de Rendering

### Server Components por defecto

```tsx
// ✅ Server Component (default) — sin 'use client'
// Se renderiza en servidor, cero JS al cliente
export default async function MenuPage() {
  const platillos = await fetchPlatillos() // Llamada a Laravel API
  return <MenuGrid platillos={platillos} />
}

// ✅ Client Component — solo cuando se necesita interactividad
'use client'
import { useState } from 'react'

export function MenuGrid({ platillos }: { platillos: Platillo[] }) {
  const [filtro, setFiltro] = useState('todos')
  // ... interactividad
}
```

### Static Generation para páginas que no cambian

```tsx
// ✅ SSG para landing page (revalidar cada hora)
export const revalidate = 3600 // 1 hora

export default function LandingPage() {
  // Contenido cacheado
}

// ✅ ISR para menú (revalidar cada 5 min)
export const revalidate = 300

export default function MenuPage() {
  // Se regenera cuando hay cambios
}
```

---

## 3. Laravel — Optimización de API

### Cache de respuestas

```php
// En el controller de Laravel
public function index(Request $request)
{
    $platillos = Cache::remember('platillos.activos', 300, function () {
        return Platillo::where('activo', true)
            ->with('categoria')
            ->orderBy('categoria_id')
            ->get();
    });

    return response()->json([
        'success' => true,
        'data' => PlatilloResource::collection($platillos),
    ]);
}
```

### Evitar N+1 con Eager Loading

```php
// ❌ N+1: loop de consultas
$pedidos = Pedido::where('estado', 'completado')->get();
foreach ($pedidos as $pedido) {
    $items = $pedido->items; // Query por cada pedido
}

// ✅ Un solo query con eager loading
$pedidos = Pedido::with(['items.platillo'])
    ->where('estado', 'completado')
    ->get();
```

### Colas para tareas pesadas

```php
// Facturación en cola (no bloquear la respuesta)
dispatch(new TimbrarFactura($factura))->onQueue('facturacion');

return response()->json([
    'success' => true,
    'message' => 'Factura en proceso, recibirás un email cuando esté lista',
    'folio' => $factura->folio,
]);
```

---

## 4. Hostinger — Optimización de Hosting Compartido

### PHP OPcache — Verificación

```php
// Verificar que OPcache esté activo en Hostinger
// cPanel → MultiPHP Manager → PHP Options → opcache.enable = On

// Configuración recomendada en .user.ini o php.ini
[opcache]
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=4000
opcache.revalidate_freq=60
opcache.validate_timestamps=1
```

### MySQL Query Cache

```php
// En Laravel, usar cache de aplicación en lugar de query cache de MySQL
// (MySQL 8.0 eliminó query cache)

// Cache de respuestas frecuentes
$promociones = Cache::remember('promociones.activas', 60, function () {
    return Promocion::where('activo', true)
        ->where('fecha_fin', '>=', now())
        ->get();
});
```

### .htaccess para caché de navegador

```apache
# En public/.htaccess del frontend Next.js (si se sirve estático)
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/jpeg "access plus 6 months"
    ExpiresByType image/png "access plus 6 months"
    ExpiresByType image/webp "access plus 6 months"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>
```

---

## 5. Frontend — Optimización de Assets

### Code Splitting dinámico

```tsx
// Cargar componentes pesosos solo cuando se necesitan
import dynamic from 'next/dynamic'

const MapaInteractivo = dynamic(() => import('@/components/MapaInteractivo'), {
  loading: () => <div className="animate-pulse bg-gray-900 h-64" />,
  ssr: false,
})

const ParticulasFondo = dynamic(() => import('@/components/ParticulasFondo'), {
  ssr: false,
  loading: () => null,
})
```

### Lazy loading de animaciones

```tsx
'use client'
import { motion, useInView } from 'framer-motion'

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

---

## 6. Métricas de Rendimiento — Objetivos

| Métrica | Objetivo | Herramienta |
|---------|----------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse / PageSpeed |
| INP (Interaction to Next Paint) | < 200ms | Chrome DevTools |
| CLS (Layout Shift) | < 0.1 | Lighthouse |
| TTFB (Time To First Byte) | < 600ms | WebPageTest |
| Tamaño de página inicial | < 300KB JS | Network tab |
| Consultas por request API | < 5 | Laravel Debugbar |

### Medir TTFB en Laravel

```php
// En middleware de Laravel
public function handle(Request $request, Closure $next)
{
    $start = microtime(true);
    $response = $next($request);
    $elapsed = microtime(true) - $start;
    
    if ($elapsed > 1.0) {
        Log::warning("Slow request: {$request->path()} took {$elapsed}s");
    }
    
    return $response;
}
```

---

## 7. Optimización de Animaciones

### Reglas para animaciones en POP Perote

| Efecto | Desktop | Mobile |
|--------|---------|--------|
| Partículas reactivas | ✅ Activas (30-50) | ❌ Desactivadas |
| Cursor personalizado | ✅ Activo | ❌ Desactivado |
| Parallax | ✅ Activo | ⚠️ Reducido |
| Video de fondo | ✅ Activo | ⚠️ Imagen estática |
| Scroll animations | ✅ Activas | ✅ Activas (reducidas) |
| Page transitions | ✅ Activas | ✅ Activas |

### Detectar dispositivo y ajustar

```tsx
'use client'
import { useEffect, useState } from 'react'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  
  return isMobile
}

// Uso
const isMobile = useIsMobile()
{!isMobile && <ParticulasFondo />}
```
