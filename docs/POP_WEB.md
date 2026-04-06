# 🍣 Propuesta de Desarrollo Web — POP PEROTE

> **Documento de Planteamiento General y Técnico**
> Fecha: Abril 2026
> Estado: Propuesta Inicial

---

## 1. Contexto del Restaurante

| Dato | Detalle |
|---|---|
| **Nombre** | POP Perote |
| **Ubicación** | Justo Sierra No. 11, Col. Amado Nervo, Perote, Veracruz |
| **Teléfono** | 282-825-32-43 |
| **Horarios** | Lun, Mié-Jue: 14:00–21:30/22:00 · Vie-Sáb: 14:00–22:00/23:00 · Dom: 14:00–21:00/22:00 · **Martes: Cerrado** |
| **Especialidad** | Sushi (+40 rollos), Alitas (10 salsas), Boneless, Crepas, Snacks |
| **Ambiente** | Familiar, casual, con juegos de mesa |
| **Google Rating** | 4.4 ★ |
| **Posicionamiento** | #1 en "Otras cocinas" en Perote · #40 de 146 restaurantes |
| **Redes Sociales** | Facebook: [@pop.perote](https://www.facebook.com/pop.perote/) (5.2K seguidores) · Instagram: [@pop_perote](https://www.instagram.com/pop_perote/) · TikTok |
| **Web Actual** | [pop-perote.com](https://pop-perote.com/) (básica, en mantenimiento — "¡Pronta Reapertura!") |
| **Sistema de Pedidos** | [FoodBooking](https://www.foodbooking.com/ordering/restaurant/menu?company_uid=04f4d10b-2c07-4411-895d-4437eb890919&restaurant_uid=499ca112-e4ea-46f4-8990-47d5b58748ae&facebook=true) |
| **Métodos de Pago** | Visa, Mastercard, American Express, Débito |

### Promociones Identificadas
- **Sushiércoles**: Promoción especial de sushi los miércoles
---

## 2. Objetivos del Proyecto

### 2.1 Objetivo General

Crear una página web que no solo muestre información del restaurante, sino que funcione como una **herramienta activa de venta, fidelización de clientes y motivación del equipo**.

### 2.2 Objetivos Específicos

| # | Objetivo | Descripción |
|---|---|---|
| 1 | **Vender más** | Integrar el sistema de pedidos FoodBooking con una experiencia visual que impulse la conversión |
| 2 | **Fidelizar clientes** | Sistema de puntos acumulables por visitas y consumo, canjeables por beneficios |
| 3 | **Motivar al equipo** | Ranking interno de meseros basado en venta de bebidas/cócteles con incentivos |
| 4 | **Atraer visualmente** | Diseño dinámico, animaciones, videos — que desde que entras den ganas de ir |
| 5 | **Generar clientes recurrentes** | Promociones inteligentes, notificaciones, recordatorios basados en comportamiento |

---

## 3. Arquitectura del Sistema

### 3.1 Diagrama General

```
┌─────────────────────────────────────────────────────────────────┐
│                        POP PEROTE WEB                           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   FRONTEND   │  │   BACKEND    │  │   SERVICIOS EXTERNOS │  │
│  │              │  │              │  │                      │  │
│  │ • Landing    │◄─┤ • API REST   │◄─┤ • FoodBooking API    │  │
│  │   Animada    │  │              │  │                      │  │
│  │ • Menú       │  │ • Auth       │  │ • WhatsApp API       │  │
│  │ • Promos     │  │ • Fidelidad  │  │ • Email (SendGrid)   │  │
│  │ • Fidelidad  │  │ • Ranking    │  │ • Google Maps        │  │
│  │ • Pedidos    │  │ • Pedidos    │  │ • Analytics          │  │
│  │ • Ranking    │  │ • Notif.     │  │                      │  │
│  │   (meseros)  │  │ • Admin      │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│         │                  │                                    │
│         │                  ▼                                    │
│         │         ┌──────────────┐                              │
│         └────────►│   BASE DE    │                              │
│                   │    DATOS     │                              │
│                   │              │                              │
│                   │ • Usuarios   │                              │
│                   │ • Puntos     │                              │
│                   │ • Pedidos    │                              │
│                   │ • Meseros    │                              │
│                   │ • Promos     │                              │
│                   └──────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```


### 3.2 Stack Tecnológico Recomendado

> **🖥️ Infraestructura de Hosting:** Todo el sistema se desplegará en **Hostinger Hosting Compartido**. Esta decisión garantiza compatibilidad nativa con PHP y MySQL sin configuraciones adicionales, reduce costos operativos y permite escalar a un VPS de Hostinger en el futuro sin reescribir código.

| Capa | Tecnología | Justificación |
|---|---|---|
| **Frontend** | Next.js 14 + React | SSR para SEO, rendimiento, ecosistema maduro |
| **Estilos** | Tailwind CSS + Framer Motion | Diseño responsivo + animaciones fluidas |
| **Animaciones** | Framer Motion + GSAP | Animaciones de scroll, transiciones, efectos visuales |
| **Backend** | PHP + Laravel | Compatible nativamente con Hostinger Hosting Compartido; API REST que consume el frontend. Escalable a VPS sin cambios de código |
| **Base de Datos** | MySQL (MariaDB) | Relacional, ideal para puntos, transacciones, rankings. Incluido en el plan de Hostinger |
| **Autenticación** | Laravel Breeze + Laravel Sanctum | Autenticación nativa de Laravel; login con email, teléfono y redes sociales |
| **Pedidos** | Integración FoodBooking (iframe o API) | Sistema ya existente, se conecta sin reinventar |
| **Notificaciones** | WhatsApp Business API + Email | Canal principal en México: WhatsApp |
| **Analytics** | Google Analytics 4 + Hotjar | Seguimiento de conversiones y comportamiento |

> **⚙️ Comunicación Frontend–Backend:** Next.js y Laravel se comunican mediante una **API REST**. Next.js consume los endpoints que Laravel expone, lo cual es el estándar de la industria y no representa ninguna limitación técnica en hosting compartido.

---

## 4. Estructura del Sitio Web

### 4.1 Mapa del Sitio

```
POP PEROTE WEB
│
├── 🏠 INICIO (Landing Page)
│   ├── Hero con video de fondo (sushi, alitas, ambiente)
│   ├── CTA principal: "Haz tu pedido ahora"
│   ├── Promociones destacadas del día/semana
│   ├── Menú rápido (categorías visuales)
│   ├── Testimonios de clientes
│   ├── Horarios y ubicación
│   └── Sección "¿Por qué POP?"
│
├── 🍱 MENÚ
│   ├── Categorías visuales: Sushi, Alitas, Boneless, Crepas, Bebidas, Snacks
│   ├── Fotos profesionales de cada platillo
│   ├── Filtros: Popular, Nuevo, Vegano, Picante
│   ├── Badge "Más vendido"
│   └── Botón "Pedir" → redirige a FoodBooking
│
├── 🔥 PROMOCIONES
│   ├── Promociones activas (Sushiércoles, Sushihuatiza, etc.)
│   ├── Calendario de promos semanales
│   ├── Promos exclusivas para miembros fidelizados
│   └── Historial de promos pasadas (genera FOMO)
│
├── ⭐ PROGRAMA DE FIDELIDAD (POP Points)
│   ├── Registro/Login
│   ├── Dashboard de puntos acumulados
│   ├── Historial de visitas y consumo
│   ├── Catálogo de beneficios canjeables
│   ├── Niveles de membresía
│   └── Progreso hacia siguiente nivel
│
├── 📍 UBICACIÓN Y CONTACTO
│   ├── Mapa interactivo (Google Maps embed)
│   ├── Horarios actualizados
│   ├── Botón WhatsApp directo
│   ├── Botón "Cómo llegar"
│   └── Formulario de contacto/reservaciones
│
├── 🏆 RANKING MESEROS (Interno)
│   ├── Login exclusivo para staff
│   ├── Ranking en tiempo real
│   ├── Puntos acumulados por venta de bebidas
│   ├── Historial semanal/mensual
│   └── Incentivos y metas
│
└── 🔐 PANEL DE ADMINISTRACIÓN
    ├── Gestión de menú y precios
    ├── Gestión de promociones
    ├── Gestión de fidelidad (puntos, beneficios)
    ├── Gestión de meseros y ranking
    ├── Dashboard de métricas
    └── Gestión de usuarios
```

---

## 5. Módulo de Fidelización — "POP Points"

### 5.1 Cómo Funciona (Para el Cliente)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  REGÍSTRATE │────►│   ACUMULA   │────►│   CANJEA    │────►│   REGRESA   │
│             │     │   PUNTOS    │     │  BENEFICIOS │     │             │
│ Crea tu     │     │ Por cada    │     │ Usa tus     │     │ Más puntos, │
│ cuenta en   │     │ visita y    │     │ puntos en   │     │ más niveles,│
│ 30 segundos │     │ consumo     │     │ el local o  │     │ más premios │
│             │     │             │     │ en tu pedido│     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### 5.2 Sistema de Puntos

| Acción | Puntos Ganados |
|---|---|
| Registrarse por primera vez | 50 pts (bonus de bienvenida) |
| Hacer un pedido | 1 pt por cada $10 MXN gastados |
| Visitar el local (check-in) | 25 pts por visita |
| Dejar una reseña en Google | 100 pts (con comprobante) |
| Referir a un amigo | 200 pts (cuando el amigo haga su primer pedido) |
| Pedir en día de baja afluencia  | 2x puntos |
| Cumpleaños | 150 pts automáticos |
| Compartir en redes sociales | 30 pts |

### 5.3 Niveles de Membresía

| Nivel | Puntos Requeridos | Beneficios |
|---|---|---|
| 🥉 **POP Fan** | 0 – 499 pts | Acceso a promociones básicas, puntos por consumo |
| 🥈 **POP Lover** | 500 – 1,499 pts | +10% pts extra, promoción exclusiva mensual, bebida gratis en cumpleaños |
| 🥇 **POP VIP** | 1,500 – 2,999 pts | +25% pts extra, rollo gratis cada 5 visitas, acceso anticipado a promos |
| 💎 **POP Elite** | 3,000+ pts | +50% pts extra, mesa reservada prioritaria, invitación a eventos especiales, 1 buffet gratis al mes |

### 5.4 Catálogo de Canje de Puntos

| Beneficio | Costo en Puntos |
|---|---|
| Bebida gratis | 100 pts |
| Rollo especial gratis | 200 pts |
| Orden de alitas gratis | 250 pts |
| 10% de descuento en tu pedido | 150 pts |
| 2x1 en rollos seleccionados | 300 pts |
| Postre/crepa gratis | 120 pts |
| Buffet de alitas gratis | 400 pts |
| Experiencia VIP (mesa decorada + botella) | 800 pts |

### 5.5 Lógica de Retención

```
┌──────────────────────────────────────────────────────────────┐
│                  MOTOR DE RETENCIÓN                          │
│                                                              │
│  ┌─────────────────┐    ┌─────────────────┐                  │
│  │ Si no viene en  │    │ Si viene seguido│                  │
│  │   15 días       │    │   (3+ veces/mes)│                  │
│  │                 │    │                 │                  │
│  │ WhatsApp:       │    │ WhatsApp:       │                  │
│  │ "Te extrañamos  │    │ "¡Eres POP VIP! │                  │
│  │ 🥺. Aquí tienes │    │ Este fin de     │                  │
│  │ 50 pts para que │    │ semana tienes   │                  │
│  │ vuelvas"        │    │ 2x1 en rollos"  │                  │
│  └─────────────────┘    └─────────────────┘                  │
│                                                              │
│  ┌─────────────────┐    ┌─────────────────┐                  │
│  │ Cerca de subir  │    │ Después de      │                  │
│  │ de nivel        │    │   canjear       │                  │
│  │                 │    │                 │                  │
│  │ WhatsApp:       │    │ WhatsApp:       │                  │
│  │ "¡Estás a 50    │    │ "¡Disfruta tu  │                  │
│  │ pts de ser POP  │    │ premio! 🎉      │                  │
│  │ Lover!"         │    │ Vuelve pronto   │                  │
│  │                 │    │ por más"        │                  │
│  └─────────────────┘    └─────────────────┘                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Módulo de Ranking de Meseros — "POP Bar Stars"

### 6.1 Concepto

Sistema interno de gamificación para motivar a los meseros a vender más bebidas (especialmente cócteles y margaritas). Se convierte en una competencia sana con reconocimiento e incentivos reales.

### 6.2 Cómo Funciona

```
┌──────────────────────────────────────────────────────────────┐
│                  POP BAR STARS                               │
│                                                              │
│  Cada mesero tiene un perfil con:                            │
│                                                              │
│  📊 Puntos acumulados (por venta de bebidas)                 │
│  🏆 Posición en el ranking                                   │
│  📈 Historial semanal y mensual                              │
│  🎯 Metas personales                                         │
│  🎖️ Insignias logradas                                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              RANKING DEL MES                        │    │
│  │                                                     │    │
│  │ 🥇 1. María G.  —  1,250 pts  —  "Reina Margarita" │    │
│  │ 🥈 2. Carlos R. —    980 pts  —  "Mixólogo POP"    │    │
│  │ 🥉 3. Ana L.    —    870 pts  —  "Barra de Oro"    │    │
│  │ 4. Pedro M.     —    650 pts                        │    │
│  │ 5. Luis H.      —    520 pts                        │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### 6.3 Sistema de Puntos para Meseros

| Acción | Puntos |
|---|---|
| Vender 1 cóctel/margarita | 10 pts |
| Vender 1 bebida premium | 15 pts |
| Vender 1 jarra/compartida | 25 pts |
| Venta de botella completa | 50 pts |
| Combo comida + bebida | 20 pts |
| Upselling (upgrade de bebida) | 15 pts |
| Mejor calificación del cliente (mención del mesero) | 30 pts |
| Vender la "bebida del mes" (promoción especial) | 2x puntos |

### 6.4 Incentivos y Reconocimientos

| Logro | Incentivo |
|---|---|
| 🏆 #1 del mes | Bono económico + "Mesero Estrella" en redes |
| 🥈 #2 del mes | Bono menor + reconocimiento interno |
| 🥉 #3 del mes | Reconocimiento + insignia |
| 🔥 Racha de 5 días vendiendo +10 bebidas/día | Bono extra |
| 💎 Insignia "Rey/Reina Margarita" (100 margaritas/mes) | Premio especial |
| 🌟 Insignia "Barra de Oro" (mejor calificación del mes) | Reconocimiento público |

### 6.5 Vista del Mesero (App Web)

```
┌──────────────────────────────────────┐
│  POP Bar Stars  👋 Hola, María       │
├──────────────────────────────────────┤
│                                      │
│  Tus Puntos: 1,250 🏆                │
│  Posición: #1 de 8                   │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  Esta Semana                   │ │
│  │  ████████████░░░░  12 bebidas  │ │
│  │  Meta: 15 bebidas              │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  Insignias                     │ │
│  │  👑 Reina Margarita            │ │
│  │  🔥 Racha de 5 días            │ │
│  │  ⭐ 5 estrellas del cliente    │ │
│  └────────────────────────────────┘ │
│                                      │
│  📊 Mi Historial  │  🏆 Ranking     │
│                                      │
└──────────────────────────────────────┘
```

---

## 7. Experiencia Visual y Diseño

### 7.1 Identidad Visual

| Elemento | Descripción |
|---|---|
| **Estilo** | Dinámico, moderno, vibrante — alineado al branding POP |
| **Colores** | Basados en la identidad actual de POP (negro, rojo, dorado — estilo sushi bar premium) |
| **Tipografía** | Sans-serif moderna, bold para títulos, legible para cuerpo |
| **Fotografía** | Fotos profesionales de alta calidad de platillos, ambiente y equipo |
| **Video** | Videos de fondo en el hero: preparación de sushi, alitas siendo servidas, ambiente del restaurante |

### 7.2 Animaciones y Efectos

| Elemento | Efecto |
|---|---|
| **Hero** | Video de fondo con overlay, texto animado que aparece con fade + slide |
| **Scroll** | Animaciones de entrada por sección (fade-up, slide-in) |
| **Menú** | Cards con hover effect (zoom sutil + info overlay) |
| **Promociones** | Carousel animado con transiciones suaves |
| **CTAs** | Botones con efecto glow/pulse para llamar la atención |
| **Contador** | Números animados (clientes satisfechos, rollos vendidos, etc.) |
| **Transiciones** | Page transitions suaves entre secciones |

### 7.3 Wireframe Conceptual — Landing Page

```
┌─────────────────────────────────────────────────────────┐
│  [NAV]  POP Logo  │  Menú  │  Promos  │  Fidelidad  │  │
│                                         📍  🛒  👤     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ╔═══════════════════════════════════════════════════╗  │
│  ║                                                   ║  │
│  ║         [VIDEO DE FONDO: Sushi + Ambiente]        ║  │
│  ║                                                   ║  │
│  ║          "Pop Perote está riquísimo"              ║  │
│  ║                                                   ║  │
│  ║    Sushi · Alitas · Boneless · Crepas · Snacks    ║  │
│  ║                                                   ║  │
│  ║      [🔥 HAZ TU PEDIDO AHORA]  [📍 VER MENÚ]      ║  │
│  ║                                                   ║  │
│  ╚═══════════════════════════════════════════════════╝  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🔥 PROMO DEL DÍA                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🍣 SUSHIÉRCOLES                                │   │
│  │  2x1 en rollos seleccionados                    │   │
│  │  [VER MÁS →]                                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🍱 NUESTRO MENÚ                                        │
│                                                         │
│  [🍣 Sushi]  [🍗 Alitas]  [🔥 Boneless]  [🥞 Crepas]   │
│     [🍹 Bebidas]  [🍿 Snacks]                           │
│                                                         │
│  [VER MENÚ COMPLETO →]                                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ⭐ ÚNETE A POP POINTS                                  │
│  Acumula puntos con cada visita y canjéalos             │
│  por premios increíbles                                 │
│                                                         │
│  [REGISTRARME GRATIS →]                                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  💬 LO QUE DICEN NUESTROS CLIENTES                      │
│  [Testimonios con fotos y estrellas]                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📍 ENCUÉNTRANOS                                        │
│  [Google Maps Embed]                                    │
│  Justo Sierra No. 11, Col. Amado Nervo, Perote, Ver.   │
│  📞 282-825-32-43  │  [WhatsApp]  │  [Cómo Llegar]     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [FOOTER]  Redes Sociales  │  Horarios  │  Legal       │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Integración con FoodBooking

### 8.1 Estrategia de Integración

| Método | Descripción | Pros | Contras |
|---|---|---|---|
| **iframe embebido** | Incrustar el menú de FoodBooking directamente en la web | Rápido, sin mantenimiento | Menos personalización |
| **Redirección con tracking** | Botón "Pedir" → redirige a FoodBooking con parámetros UTM | Simple, tracking de conversiones | El usuario sale del sitio |
| **API (si disponible)** | Consumir API de FoodBooking para mostrar menú nativo | Experiencia 100% integrada | Depende de disponibilidad de API |

### 8.2 Recomendación

**Enfoque híbrido**: Mostrar el menú con fotos y descripciones propias en la web de POP, y al momento de "Agregar al carrito" o "Pedir", redirigir a FoodBooking con los parámetros de sesión ya configurados. Esto permite:

- ✅ Experiencia visual premium en la web de POP
- ✅ FoodBooking maneja el checkout, pagos y logística
- ✅ Tracking completo de conversiones
- ✅ Sin duplicar lógica de pedidos

### 8.3 Flujo de Pedido

```
Usuario en web POP
       │
       ▼
Explora menú con fotos y animaciones
       │
       ▼
Selecciona platillos → "Agregar"
       │
       ▼
Se abre FoodBooking (iframe o nueva ventana)
con los items preseleccionados
       │
       ▼
Checkout en FoodBooking (pago, datos, entrega)
       │
       ▼
Confirmación → Vuelve a web POP
       │
       ▼
Si está registrado → Puntos POP Points acreditados automáticamente
```

---

## 9. Base de Datos — Estructura Principal

### 9.1 Tablas Principales

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    usuarios      │     │     puntos       │     │    pedidos       │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │     │ id (PK)          │
│ nombre           │     │ usuario_id (FK)  │     │ usuario_id (FK)  │
│ email            │     │ tipo             │     │ foodbooking_id   │
│ telefono         │     │ puntos           │     │ total            │
│ fecha_registro   │     │ descripcion      │     │ fecha            │
│ nivel            │     │ fecha            │     │ estado           │
│ puntos_actuales  │     │ pedido_id (FK)   │     │                  │
│ referidos_por    │     │                  │     │                  │
│ cumpleaños       │     └──────────────────┘     └──────────────────┘
│ activo           │
└──────────────────┘

┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    meseros       │     │  ranking_meseros │     │    beneficios    │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │     │ id (PK)          │
│ nombre           │     │ mesero_id (FK)   │     │ nombre           │
│ numero_empleado  │     │ periodo          │     │ descripcion      │
│ activo           │     │ puntos           │     │ costo_puntos     │
│ foto             │     │ posicion         │     │ tipo             │
└──────────────────┘     │ insignias        │     │ stock            │
                         │ bono             │     │ activo           │
                         └──────────────────┘     └──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│   ventas_bebidas │     │   notificaciones │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │
│ mesero_id (FK)   │     │ usuario_id (FK)  │
│ bebida           │     │ tipo             │
│ cantidad         │     │ mensaje          │
│ puntos_ganados   │     │ canal            │
│ fecha            │     │ estado           │
│ ticket_id        │     │ fecha_envio      │
└──────────────────┘     └──────────────────┘
```

---

## 10. Módulo de Facturación CFDI

### 10.1 Contexto Fiscal (México)

> ⚠️ **Nota importante:** Esta sección refleja la normativa fiscal vigente al momento de elaborar este documento (Abril 2026). Las reglas del SAT pueden cambiar. Se recomienda validar cualquier implementación con un contador público certificado antes de poner en producción el módulo de facturación.

| Requisito | Detalle |
|---|---|
| **Plazo legal para emitir CFDI** | El Art. 39 del Reglamento del CFF establece que el CFDI debe enviarse al SAT o PAC **dentro de las 24 horas** siguientes a la operación. Si el cliente no solicita factura en ese momento, la operación debe incluirse en una **factura global mensual**. El SAT considera práctica indebida negar la factura por no haberla solicitado al momento. El plazo máximo reconocido es **dentro del mismo ejercicio fiscal** en que ocurrió la operación. |
| **Factura global del restaurante** | POP Perote debe emitir un CFDI global (diario, semanal o mensual) por todas las operaciones con el público en general que no se facturen individualmente. Si después un cliente solicita su factura individual, se debe **cancelar o ajustar la factura global** mediante nota de crédito y emitir el CFDI individual. Esto tiene implicaciones contables que deben gestionarse con el contador. |
| **Datos obligatorios CFDI 4.0** | RFC, **Nombre o Razón Social exacto** (debe coincidir al carácter con la Constancia de Situación Fiscal del SAT), Régimen Fiscal, Uso de CFDI, Código Postal fiscal. Cualquier discrepancia en el nombre causa rechazo automático. |
| **Tipo de comprobante** | CFDI 4.0 — única versión válida desde el 1 de abril de 2023. |
| **Cancelación de CFDI** | Según el Art. 29-A del CFF (reforma vigente desde enero 2026), la cancelación debe realizarse **a más tardar en el mes en que se presenta la declaración anual del ISR** del ejercicio en que se emitió el comprobante. En la práctica: personas morales hasta el **31 de marzo** y personas físicas hasta el **30 de abril** del año siguiente. Requiere seleccionar un motivo de cancelación (01: error con sustitución, 02: error sin sustitución, 03: operación no realizada, 04: global nominativa). El receptor tiene 3 días hábiles para aceptar; si no responde se considera aceptación automática en la mayoría de los casos. Facturas menores a **$1,000 MXN** no requieren aceptación del receptor. Cancelar fuera de plazo implica multa del **5% al 10%** del monto del CFDI. |
| **PAC recomendado** | Facturama, SW Sapien, Finkok o Diverza. Para volúmenes bajos (menos de 50 facturas/mes), considerar **pago por folio** en lugar de suscripción mensual — resulta más económico. Para menos de 50 facturas/mes también existe la opción gratuita **"Factura Fácil"** del SAT, aunque sin API ni automatización. |

### 10.2 Flujo del Cliente

```
┌──────────────────────────────────────────────────────────────┐
│                  FACTURACIÓN POP                             │
│                                                              │
│  1. SUBE TU TICKET                                          │
│     ┌─────────────────────────────┐                         │
│     │                             │                         │
│     │   [📷 Foto del ticket]      │                         │
│     │   o                         │                         │
│     │   [📎 Subir imagen]         │                         │
│     │                             │                         │
│     │   Arrastra o selecciona     │                         │
│     │   la foto de tu ticket      │                         │
│     │                             │                         │
│     └─────────────────────────────┘                         │
│                                                              │
│  2. LLENA TUS DATOS FISCALES                                │
│     ┌─────────────────────────────┐                         │
│     │ RFC: [XAXX010101000       ] │ ← Validación automática│
│     │                             │    contra el SAT        │
│     │ Razón Social / Nombre:      │                         │
│     │ [                          ] │                         │
│     │                             │                         │
│     │ Régimen Fiscal:             │                         │
│     │ [Seleccionar ▼             ] │                         │
│     │                             │                         │
│     │ Uso de CFDI:                │                         │
│     │ [Seleccionar ▼             ] │                         │
│     │                             │                         │
│     │ Código Postal:              │                         │
│     │ [94440                     ] │                         │
│     │                             │                         │
│     │ Email para recibir factura: │                         │
│     │ [cliente@email.com         ] │                         │
│     └─────────────────────────────┘                         │
│                                                              │
│  3. CONFIRMA Y RECIBE                                       │
│     ┌─────────────────────────────┐                         │
│     │  Montos del ticket:         │                         │
│     │  Subtotal:    $350.00       │                         │
│     │  IVA (16%):   $ 56.00       │                         │
│     │  Total:       $406.00       │                         │
│     │                             │                         │
│     │  ☑ Acepto que los datos son │                         │
│     │    correctos                │                         │
│     │                             │                         │
│     │  [SOLICITAR MI FACTURA →]   │                         │
│     └─────────────────────────────┘                         │
│                                                              │
│  4. RECIBE TU CFDI                                          │
│     ✅ Factura generada exitosamente                        │
│     📧 PDF + XML enviados a cliente@email.com               │
│     ⏱️ Tiempo estimado: 1-5 minutos (máx. 24 hrs SLA)      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 10.3 Arquitectura Técnica

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   FRONTEND   │────►│   BACKEND    │────►│   PAC API    │
│              │     │              │     │              │
│ • Upload foto│     │ • Validar RFC│     │ • Facturama  │
│ • Form datos │     │ • Validar CP │     │ • SW Sapien  │
│ • Preview    │     │ • Cola de    │     │ • Finkok     │
│ • Status     │     │   proceso    │     │ • Diverza    │
│              │     │ • Timbrar    │     │              │
│              │◄────│ • Enviar     │◄────│ • Timbrar    │
│              │     │   email      │     │ • PDF + XML  │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   EMAIL API  │
                     │              │
                     │ • SendGrid   │
                     │ • Resend     │
                     │ • AWS SES    │
                     └──────────────┘
```

### 10.4 Base de Datos — Tablas de Facturación

```
┌──────────────────┐     ┌──────────────────┐
│    facturas      │     │  tickets_foto    │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │
│ usuario_id (FK)  │     │ factura_id (FK)  │
│ rfc              │     │ url_imagen       │
│ razon_social     │     │ fecha_upload     │
│ regimen_fiscal   │     │ ocr_data (JSON)  │
│ uso_cfdi         │     └──────────────────┘
│ codigo_postal    │
│ email_destino    │
│ subtotal         │
│ iva              │
│ total            │
│ uuid_cfdi        │
│ fecha_timbrado   │
│ estado           │
│  (pendiente,     │
│   procesando,    │
│   timbrado,      │
│   enviado,       │
│   error,         │
│   cancelado)     │
│ fecha_solicitud  │
│ fecha_limite     │
│ notas            │
└──────────────────┘
```

### 10.5 Integración con PAC — Comparativa

> **Nota sobre precios:** Los rangos mensuales son orientativos. El costo real por CFDI en volúmenes bajos (menos de 50 facturas/mes) suele ser más alto que el indicado. Se recomienda comparar los planes de **pago por folio** vs. suscripción mensual según el volumen real del restaurante antes de contratar.

| PAC | Costo/mes (referencia) | Costo/CFDI | API | Docs | Recomendación |
|---|---|---|---|---|---|
| **Facturama** | $300-600 MXN | ~$3-5 MXN (alto volumen) | REST | Excelentes | ⭐ Mejor opción |
| **SW Sapien** | $200-500 MXN | ~$2-4 MXN (alto volumen) | REST | Buenas | ✅ Buena opción |
| **Finkok** | $150-400 MXN | ~$2-3 MXN (alto volumen) | SOAP/REST | Regulares | 💰 Más económico |
| **Diverza** | $200-500 MXN | ~$3-5 MXN (alto volumen) | REST | Buenas | ✅ Alternativa |

### 10.6 Estados de la Factura

| Estado | Descripción | Acción del Sistema |
|---|---|---|
| **Pendiente** | Solicitud recibida, en cola | Notificar al usuario "Recibimos tu solicitud" |
| **Procesando** | Validando datos con SAT, enviando al PAC | Email: "Estamos generando tu factura" |
| **Timbrado** | CFDI generado y sellado exitosamente por el PAC | Adjuntar PDF + XML, enviar por email |
| **Enviado** | Email con PDF y XML entregado al cliente | Registro interno del envío |
| **Error** | Falló el timbrado (datos inválidos, RFC incorrecto, nombre no coincide con SAT) | Notificar al usuario con el error específico para corregir datos |
| **Cancelado** | CFDI cancelado ante el SAT con motivo registrado (01/02/03/04). Requiere aceptación del receptor salvo facturas menores a $1,000 MXN | Notificar al cliente; reemitir si aplica |

### 10.7 SLA y Tiempos

| Métrica | Objetivo |
|---|---|
| Tiempo de timbrado | 1-5 minutos (automático vía PAC) |
| Tiempo de envío email | Inmediato después del timbrado |
| SLA máximo interno | 24 horas (revisión manual si falla el automático) |
| Disponibilidad | 99.5% (depende del PAC contratado) |
| Vencimiento de solicitud (`fecha_limite`) | Si la solicitud supera las 24 horas sin procesar, el sistema debe alertar al administrador para revisión manual. **No se rechaza automáticamente** — el rechazo lo determina el administrador junto con el contador, considerando si la operación ya fue incluida en una factura global. |

> ⚠️ **Importante para el desarrollo:** El sistema NO debe rechazar solicitudes de forma automática basándose únicamente en tiempo. La decisión de si una factura puede o no emitirse fuera del plazo debe involucrar criterio humano (administrador + contador), ya que tiene implicaciones fiscales para el restaurante.

## 11. Panel de Administración

### 11.1 Funcionalidades

| Módulo | Funcionalidades |
|---|---|
| **Dashboard** | Métricas generales: ventas, usuarios activos, puntos emitidos, ranking del mes |
| **Menú** | Agregar/editar/eliminar platillos, categorías, precios, fotos |
| **Promociones** | Crear promos, programar fechas, asignar a segmentos de usuarios |
| **Fidelidad** | Configurar reglas de puntos, niveles, beneficios, catálogo de canje |
| **Usuarios** | Ver lista de clientes, puntos, historial, enviar notificaciones |
| **Meseros** | Agregar/editar meseros, ver ranking, asignar incentivos, configurar metas |
| **Ventas Bebidas** | Registrar ventas de bebidas por mesero, ver estadísticas |
| **Notificaciones** | Programar y enviar WhatsApps/emails masivos o segmentados |
| **Facturación** | Ver solicitudes, validar tickets, timbrar, cancelar, reemitir |
| **Configuración** | Datos del restaurante, horarios, redes sociales, integración FoodBooking, datos fiscales del restaurante (RFC, CSD) |

### 11.2 Dashboard — Vista Rápida

```
┌──────────────────────────────────────────────────────────────┐
│  POP Admin  │  Dashboard                                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Usuarios │  │ Pedidos  │  │ Puntos   │  │ Ventas   │    │
│  │  1,247   │  │  342     │  │ 45,230   │  │ Bebidas  │    │
│  │  ↑ 12%   │  │  ↑ 8%    │  │ emitidos │  │ $89,450  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
│  ┌────────────────────────┐  ┌────────────────────────────┐ │
│  │  Top Meseros del Mes   │  │  Promociones Activas       │ │
│  │                        │  │                            │ │
│  │  1. María G.  1,250   │  │  🍣 Sushiércoles  (Activa) │ │
│  │  2. Carlos R.   980   │  │  🍹 Sushihuatiza  (Activa) │ │
│  │  3. Ana L.      870   │  │  🎂 Cumpleaños POP  (Prog) │ │
│  │                        │  │                            │ │
│  │  [Ver Ranking Completo]│  │  [Gestionar Promos]        │ │
│  └────────────────────────┘  └────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Actividad Reciente                                    │ │
│  │  • Juan P. canjeó 200 pts → Rollo gratis              │ │
│  │  • María G. vendió 15 margaritas hoy                  │ │
│  │  • 23 nuevos registros esta semana                    │ │
│  │  • Promoción Sushiércoles: 45 pedidos                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 12. Estrategia de Notificaciones y Retención

### 12.1 Canal Principal: WhatsApp Business API

| Trigger | Mensaje | Momento |
|---|---|---|
| Bienvenida | "¡Bienvenido a POP! 🍣 Tienes 50 pts de regalo" | Al registrarse |
| Después de pedido | "¡Gracias por tu pedido! +XX pts acumulados" | Inmediatamente |
| Inactividad 15 días | "Te extrañamos 🥺. Aquí tienes 50 pts para volver" | Día 15 sin visita |
| Inactividad 30 días | "¡Tu nivel POP Lover está en riesgo! Ven esta semana" | Día 30 sin visita |
| Cerca de nivel | "¡Estás a 50 pts de ser POP VIP! 🏆" | Al alcanzar 80% del nivel |
| Cumpleaños | "¡Feliz cumple! 🎂 150 pts + rollo gratis te esperan" | Día del cumpleaños |
| Promo personalizada | "Este Sushiércoles es especial para ti 🍣" | Día de promo |
| Ranking mesero | "¡Subiste al #2! Sigue así 🔥" | Semanal |

### 12.2 Email (Complementario)

- Newsletter mensual con novedades y promos
- Resumen de puntos y nivel
- Invitaciones a eventos especiales

---

## 13. Recomendaciones Finales

### 13.1 Contenido Necesario

Antes de comenzar el desarrollo, se necesitará:

- [ ] Fotos profesionales de platillos (mínimo 3 por categoría)
- [ ] Video(s) del restaurante y ambiente para el hero
- [ ] Logo en alta resolución (SVG o PNG grande)
- [ ] Lista completa y actualizada del menú con precios
- [ ] Lista de promociones vigentes y calendario
- [ ] Lista de meseros activos
- [ ] Definición de beneficios y costos de canje de puntos
- [ ] Definición de niveles y metas de fidelidad
- [ ] Acceso a la cuenta de FoodBooking (para integración)
- [ ] Cuenta de WhatsApp Business API
- [ ] Datos fiscales del restaurante para facturación (RFC, Régimen Fiscal, CSD)
- [ ] Cuenta con PAC seleccionado (Facturama, SW Sapien, Finkok o Diverza)
- [ ] Paleta de colores oficial y guía de marca (si existe)

### 13.2 Siguientes Pasos

1. **Validar esta propuesta** — Confirmar alcance, prioridades y presupuesto
2. **Reunir el contenido** — Fotos, videos, menú, datos de meseros
3. **Diseño UX/UI** — Crear wireframes y mockups para aprobación
4. **Desarrollo** — Ejecutar por fases según cronograma
5. **Lanzamiento** — Testing, optimización y puesta en producción

---

> **Documento elaborado como planteamiento inicial para POP PEROTE.**
> Todos los costos y tiempos son estimaciones sujetas a ajuste según requerimientos finales.
> Abril 2026