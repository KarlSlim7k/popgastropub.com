# Prompt Maestro — Google Stitch: Interfaces Web POP PEROTE

> Copia y pega este prompt completo en Google Stitch para generar todas las interfaces de la plataforma.

---

## PROMPT PRINCIPAL

```
Actúa como un arquitecto frontend de élite y diseñador UX/UI especializado en experiencias gastronómicas premium. Tu tarea es diseñar y generar TODAS las interfaces web para la plataforma digital del restaurante POP PEROTE, ubicado en Perote, Veracruz, México.

══════════════════════════════════════════════════════════
IDENTIDAD VISUAL OBLIGATORIA
══════════════════════════════════════════════════════════

PALETA DE COLORES — USO EXACTO:
• Dorado Principal:    #F2C777  (acentos, badges, iconos premium, CTAs secundarios)
• Dorado Claro:        #F2C894  (fondos sutiles, hover states, gradientes)
• Naranja Cálido:      #D96725  (CTAs principales, botones de acción, promos activas)
• Rojo Oscuro/Vino:    #732817  (títulos, secciones de énfasis, overlays, footer)
• Negro Profundo:      #0D0D0D  (fondo principal, texto, contraste)

REGLAS DE APLICACIÓN:
- Fondo general del sitio: #0D0D0D (negro profundo)
- Textos principales: blanco (#FFFFFF) sobre fondos oscuros
- Títulos y encabezados: #F2C777 (dorado)
- Botones de acción principal (CTA): #D96725 (naranja) con hover a #F2C777
- Secciones destacadas: gradientes de #732817 a #0D0D0D
- Acentos decorativos: #F2C894 (dorado claro)
- Cards y contenedores: #0D0D0D con bordes sutiles en #F2C777 a 20% opacidad

TIPOGRAFÍA:
- Títulos (H1-H3): Fuente bold, condensed o display (estilo editorial gastronómico)
- Subtítulos (H4-H6): Fuente semibold, legible
- Cuerpo de texto: Fuente sans-serif limpia, alta legibilidad
- Precios y números: Fuente monospace o tabular para alineación
- Jerarquía visual clara: H1 > H2 > H3 > H4 > body > caption

══════════════════════════════════════════════════════════
PRINCIPIOS DE DISEÑO
══════════════════════════════════════════════════════════

1. ESTÉTICA EDITORIAL INMERSIVA
   - Composición tipo revista gastronómica de alto nivel
   - Espacios generosos (white space negativo sobre fondo negro)
   - Tipografía grande y audaz para headlines
   - Fotografía de producto como elemento heroico

2. INTERACCIÓN AVANZADA
   - Partículas reactivas al cursor (puntos dorados sutiles que siguen el ratón)
   - Efecto parallax en secciones con imágenes de fondo
   - Hover effects en cards: zoom sutil (scale 1.05) + overlay con información
   - Scroll-triggered animations: fade-up, slide-in, reveal progresivo
   - Transiciones de página fluidas (morph entre secciones)
   - Micro-interacciones: botones con glow pulse, contadores animados
   - Cursor personalizado: círculo dorado semitransparente que reacciona a elementos clickeables

3. MULTIMEDIA INTEGRADO
   - Hero sections con video de fondo (preparación de sushi, flambé de cócteles, ambiente del restaurante)
   - Logos dinámicos: el logo POP con animación sutil de entrada
   - Fondos con textura sutil (patrón geométrico japonés a 5% opacidad)
   - Fotos de platillos con iluminación dramática (estilo food photography premium)
   - Iconografía custom en línea con la paleta de colores

4. COCREACIÓN GENERATIVA E ITERACIÓN DIALÉCTICA
   - Cada sección debe ser modular y autocontenida
   - Permitir ajuste en tiempo real de: proporciones de grid, tamaños tipográficos, velocidad de animaciones, intensidad de efectos
   - Componentes parametrizables: número de cards, columnas del grid, dirección del scroll
   - Sistema de variantes por sección (compacta, estándar, expandida)

══════════════════════════════════════════════════════════
RESPONSIVIDAD OBLIGATORIA
══════════════════════════════════════════════════════════

DISEÑAR CADA INTERFAZ EN 4 BREAKPOINTS:

📱 MOBILE (320px - 480px):
   - Layout: 1 columna, scroll vertical
   - Navegación: hamburger menu con overlay a pantalla completa
   - Tipografía: H1 28px, H2 24px, H3 20px, body 16px
   - Cards: full width, stacked
   - CTAs: full width, mínimo 48px de alto (touch-friendly)
   - Partículas: desactivadas o reducidas al mínimo (rendimiento)
   - Videos: reemplazados por imágenes estáticas con overlay
   - Gestos: swipe para carruseles, pull-to-refresh

📱 TABLET PORTRAIT (481px - 768px):
   - Layout: 2 columnas máximo
   - Navegación: hamburger o barra compacta superior
   - Tipografía: H1 36px, H2 30px, H3 24px, body 16px
   - Cards: grid 2 columnas
   - CTAs: ancho contenido, mínimo 44px

💻 TABLET LANDSCAPE / LAPTOP (769px - 1024px):
   - Layout: 3 columnas
   - Navegación: barra horizontal completa
   - Tipografía: H1 44px, H2 36px, H3 28px, body 16px
   - Cards: grid 3 columnas
   - Todas las animaciones activas

🖥️ DESKTOP (1025px - 1920px+):
   - Layout: 4 columnas, max-width 1440px centrado
   - Navegación: barra horizontal con mega-menu
   - Tipografía: H1 56px+, H2 44px, H3 32px, body 18px
   - Cards: grid 4 columnas (menú), 3 columnas (promos)
   - Todas las animaciones y efectos al máximo
   - Cursor personalizado activo
   - Partículas reactivas al ratón activas

══════════════════════════════════════════════════════════
INTERFACES A GENERAR
══════════════════════════════════════════════════════════

──────────────────────────────────────────────────────────
INTERFAZ 1: LANDING PAGE (HOME)
──────────────────────────────────────────────────────────

SECCIÓN 1.1 — HERO PRINCIPAL:
- Video de fondo a pantalla completa (loop: preparación de sushi, cócteles siendo servidos, ambiente del restaurante)
- Overlay degradado: de #732817 (40% opacidad) en la parte inferior a transparente arriba
- Logo POP animado: aparece con fade + scale desde el centro (duración 1.2s)
- Tagline: "Pop Perote está riquísimo" — tipografía grande, dorada (#F2C777), animación de escritura tipo máquina o reveal letra por letra
- Sub-tagline: "Sushi · Alitas · Boneless · Crepas · Snacks" — texto blanco, tracking amplio
- Dos CTAs horizontales:
  • Primario: "🔥 HAZ TU PEDIDO AHORA" — fondo #D96725, texto blanco, hover: escala 1.05 + glow naranja
  • Secundario: "📍 VER MENÚ" — borde #F2C777, fondo transparente, texto dorado, hover: fondo #F2C777, texto negro
- Indicador de scroll animado en la parte inferior (flecha que rebota)
- Partículas doradas flotantes reactivas al cursor (desktop)

SECCIÓN 1.2 — PROMO DESTACADA DEL DÍA:
- Banner horizontal con fondo gradiente #732817 → #0D0D0D
- Badge animado "🔥 PROMO ACTIVA" — parpadeo sutil
- Título de la promo grande en dorado
- Descripción breve en blanco
- Countdown timer si la promo tiene fecha límite
- Botón "VER ESTA PROMO →" en naranja
- Carrusel si hay múltiples promos activas (swipe en mobile)

SECCIÓN 1.3 — MENÚ RÁPIDO (CATEGORÍAS VISUALES):
- Título de sección: "NUESTRO MENÚ" en dorado, centrado
- Grid de cards con imagen de fondo por categoría:
  • 🍣 SUSHI — foto de rollos premium
  • 🍗 ALITAS — foto de alitas con salsa
  • 🔥 BONELESS — foto de boneless crujientes
  • 🥞 CREPAS — foto de crepa decorada
  • 🍹 BEBIDAS — foto de cóctel/margarita
  • 🍿 SNACKS — foto de entrada/snack
- Cada card: imagen de fondo con overlay oscuro, nombre de categoría en grande, badge de cantidad ("+40 rollos"), hover: imagen hace zoom, overlay muestra descripción breve
- En mobile: scroll horizontal con snap

SECCIÓN 1.4 — POP POINTS (FIDELIDAD TEASER):
- Sección con fondo #0D0D0D y patrón geométrico sutil
- Título: "ACUMULA PUNTOS. CANJEA PREMIOS." en dorado
- Subtítulo: "Cada visita te acerca a algo increíble"
- Visual: 4 cards de niveles en horizontal (Fan → Lover → VIP → Elite) con iconos de medalla 🥉🥈🥇💎
- Cada nivel muestra: nombre, puntos requeridos, beneficio estrella
- CTA: "REGÍSTRATE GRATIS Y OBTÉN 50 PTS →" en naranja
- Animación: las cards aparecen con stagger al hacer scroll

SECCIÓN 1.5 — TESTIMONIOS:
- Título: "LO QUE DICEN NUESTROS CLIENTES"
- Carrusel de testimonios con:
  • Foto del cliente (avatar circular)
  • Nombre y estrellas (4-5 estrellas en dorado)
  • Texto del testimonio
  • Fuente (Google Reviews badge)
- Auto-scroll cada 5 segundos, pausa al hover
- En mobile: swipe manual

SECCIÓN 1.6 — UBICACIÓN Y HORARIOS:
- Split layout:
  • Izquierda: Google Maps embed con custom styling (colores de la marca)
  • Derecha: Dirección, teléfono, horarios en tabla con badges de "ABIERTO AHORA" / "CERRADO" según hora actual
- Botones: "📍 CÓMO LLEGAR" (abre Google Maps), "💬 WHATSAPP" (abre chat)
- En mobile: mapa arriba, info abajo

SECCIÓN 1.7 — FOOTER:
- Fondo #732817
- Logo POP en dorado
- Links: Inicio, Menú, Promociones, Fidelidad, Contacto
- Redes sociales: Facebook, Instagram, TikTok (iconos en dorado, hover: blanco)
- Horarios resumidos
- Copyright: "© 2026 POP PEROTE — Todos los derechos reservados"

──────────────────────────────────────────────────────────
INTERFAZ 2: PÁGINA DE MENÚ COMPLETO
──────────────────────────────────────────────────────────

HEADER DE PÁGINA:
- Título: "NUESTRO MENÚ" en dorado grande
- Subtítulo: "Más de 40 rollos, 10 salsas de alitas y mucho más"
- Barra de búsqueda: "Buscar platillo..." con icono de lupa
- Filtros rápidos (chips): Todo | Más Vendidos | Nuevos | Vegano | Picante | Promociones

NAVEGACIÓN POR CATEGORÍAS:
- Tabs horizontales sticky al hacer scroll: Sushi | Alitas | Boneless | Crepas | Bebidas | Snacks
- Tab activo: fondo #D96725, texto blanco
- Tab inactivo: fondo transparente, texto dorado, borde dorado
- En mobile: scroll horizontal con snap

GRID DE PRODUCTOS:
- Cards de producto con:
  • Foto del platillo (aspect ratio 4:3, object-fit cover)
  • Badge "⭐ MÁS VENDIDO" o "🆕 NUEVO" en esquina superior (fondo #D96725)
  • Nombre del platillo en blanco, bold
  • Descripción breve en gris claro
  • Precio en dorado grande (#F2C777)
  • Rating con estrellas doradas
  • Botón "AGREGAR" — fondo #D96725, hover: #F2C777 con texto negro
- Hover en desktop: card se eleva (shadow), imagen zoom 1.1, overlay con descripción completa
- Grid: 4 columnas desktop, 3 tablet, 2 tablet portrait, 1 mobile
- Lazy loading de imágenes

DETALLE DE PRODUCTO (MODAL / DRAWER):
- Al hacer click en un producto:
  • Drawer lateral (desktop) o modal fullscreen (mobile)
  • Foto grande del platillo
  • Nombre, descripción completa, precio
  • Selector de cantidad (+ / -)
  • Opciones adicionales (extras, salsas para alitas)
  • Botón "AGREGAR AL PEDIDO" grande en naranja
  • Productos relacionados debajo

BOTÓN FLOTANTE DE PEDIDO:
- Sticky en esquina inferior derecha
- Muestra número de items y total
- Fondo #D96725, texto blanco
- Al hacer click: redirige a FoodBooking con items preseleccionados
- Animación: pulse sutil cada 3 segundos

──────────────────────────────────────────────────────────
INTERFAZ 3: PÁGINA DE PROMOCIONES
──────────────────────────────────────────────────────────

HEADER:
- Título: "PROMOCIONES 🔥" en dorado
- Subtítulo: "Porque en POP siempre hay algo especial para ti"

PROMO PRINCIPAL (HERO):
- Card grande a pantalla casi completa
- Foto de la promo (ej: Sushiércoles — mesa llena de rollos)
- Título grande: "SUSHIÉRCOLES"
- Descripción: "2x1 en rollos seleccionados todos los miércoles"
- Badge de tiempo: "Disponible en X días" o "Termina en 3h 24m"
- CTA: "APROVECHAR AHORA →"

GRID DE PROMOS ACTIVAS:
- Cards de promociones con:
  • Foto de la promo
  • Nombre y descripción
  • Vigencia (fecha inicio - fecha fin)
  • Badge de estado: ACTIVA (verde), PRÓXIMA (amarillo), EXPIRADA (gris)
  • Botón "VER DETALLES"
- Grid: 3 columnas desktop, 2 tablet, 1 mobile

CALENDARIO SEMANAL:
- Visual tipo calendario horizontal con los 7 días
- Cada día muestra si tiene promo activa
- Día actual resaltado con borde dorado
- Click en un día: muestra las promos de ese día

SECCIÓN FOMO (PROMOS PASADAS):
- Título: "TE LO PERDISTE... PERO VUELVE PRONTO"
- Carrusel de promos pasadas en escala de grises
- Genera urgencia y expectativa

──────────────────────────────────────────────────────────
INTERFAZ 4: PROGRAMA DE FIDELIDAD — POP POINTS
──────────────────────────────────────────────────────────

SECCIÓN 4.1 — LANDING DE FIDELIDAD (PÚBLICA):
- Hero con fondo gradiente #732817 → #0D0D0D
- Título: "POP POINTS ⭐" en dorado grande
- Subtítulo: "Tu lealtad tiene premio"
- Explicación visual en 3 pasos:
  1. "REGÍSTRATE" — icono de usuario + "Crea tu cuenta en 30 segundos"
  2. "ACUMULA" — icono de estrella + "Gana puntos con cada visita y pedido"
  3. "CANJEA" — icono de regalo + "Cambia tus puntos por premios increíbles"
- CTA: "UNIRME AHORA — ES GRATIS →"

SECCIÓN 4.2 — DASHBOARD DE USUARIO (LOGUEADO):
- Header con saludo: "¡Hola, [Nombre]! 👋"
- Card principal de puntos:
  • Puntos actuales en grande (ej: "1,250 pts") con animación de contador
  • Barra de progreso hacia siguiente nivel
  • Nivel actual con badge (🥉 Fan / 🥈 Lover / 🥇 VIP / 💎 Elite)
  • Puntos necesarios para siguiente nivel
- Acciones rápidas:
  • "📱 CHECK-IN" — botón para registrar visita al local (QR o geolocalización)
  • "🎁 CANJEAR PUNTOS" — abre catálogo de beneficios
  • "📊 MI HISTORIAL" — abre historial de puntos
- Stats rápidos:
  • Visitas este mes
  • Total gastado
  • Puntos ganados este mes
  • Próximo beneficio desbloqueable

SECCIÓN 4.3 — CATÁLOGO DE BENEFICIOS:
- Grid de beneficios canjeables:
  • Icono/foto del beneficio
  • Nombre (ej: "Bebida Gratis")
  • Costo en puntos (ej: "100 pts")
  • Badge si el usuario tiene puntos suficientes (verde) o no (gris)
  • Botón "CANJEAR" (activo) o "NECESITAS XX PTS MÁS" (inactivo)
- Filtros: Todos | Bebidas | Comida | Experiencias | Descuentos

SECCIÓN 4.4 — HISTORIAL DE PUNTOS:
- Timeline vertical con entradas:
  • Fecha
  • Acción (ej: "Pedido #1234", "Check-in en local", "Referido: Juan P.")
  • Puntos (+50, +120, -200 por canje)
  • Balance acumulado
- Filtros por mes

SECCIÓN 4.5 — NIVELES DE MEMBRESÍA:
- Visual comparativo de los 4 niveles en cards horizontales
- Cada nivel muestra:
  • Icono de medalla
  • Nombre del nivel
  • Rango de puntos
  • Lista de beneficios
  • Badge "TU NIVEL ACTUAL" si aplica
- Animación: el nivel actual tiene glow dorado

──────────────────────────────────────────────────────────
INTERFAZ 5: REGISTRO / LOGIN
──────────────────────────────────────────────────────────

DISEÑO:
- Fondo #0D0D0D con partículas doradas sutiles
- Card central con fondo #0D0D0D, borde dorado sutil
- Logo POP arriba
- Tabs: "Iniciar Sesión" | "Registrarse"

FORMULARIO REGISTRO:
- Campos:
  • Nombre completo
  • Teléfono (con validación)
  • Email
  • Fecha de nacimiento (para bonus de cumpleaños)
  • Contraseña
  • "¿Cómo nos conociste?" (dropdown: Redes, Amigo, Google, Pasaba por ahí)
- Checkbox: "Acepto términos y condiciones"
- Botón: "CREAR MI CUENTA Y OBTENER 50 PTS →" en naranja
- Opción de registro rápido con Google/Facebook
- Mensaje de bienvenida post-registro con animación de confeti dorado

FORMULARIO LOGIN:
- Campos: Email/Teléfono + Contraseña
- Botón: "INICIAR SESIÓN →"
- Link: "¿Olvidaste tu contraseña?"
- Opción de login con Google/Facebook
- Link: "¿No tienes cuenta? Regístrate y gana 50 pts"

──────────────────────────────────────────────────────────
INTERFAZ 6: RANKING DE MESEROS — POP BAR STARS (INTERNO)
──────────────────────────────────────────────────────────

SECCIÓN 6.1 — LOGIN DE STAFF:
- Diseño similar al login de usuarios pero con branding "POP BAR STARS"
- Campos: Número de empleado + PIN
- Logo con estrella dorada

SECCIÓN 6.2 — DASHBOARD DEL MESERO:
- Header: "¡Hola, [Nombre]! 🌟" con foto del mesero
- Card de puntos:
  • Puntos del mes en grande con animación
  • Posición en el ranking (ej: "#2 de 8")
  • Flecha de tendencia (↑ subió, ↓ bajó, = igual)
- Meta del mes:
  • Barra de progreso: "12/15 bebidas meta"
  • Porcentaje completado
- Insignias logradas:
  • Grid de badges con iconos:
    • 👑 Reina Margarita (100 margaritas/mes)
    • 🔥 Racha de 5 días
    • ⭐ 5 estrellas del cliente
    • 🍹 Mixólogo POP (50 cócteles/semana)
    • 💎 Barra de Oro (mejor calificación)
  • Badges bloqueados en gris con candado
- Acciones rápidas:
  • "📊 VER MI HISTORIAL"
  • "🏆 VER RANKING COMPLETO"
  • "🎯 MIS METAS"

SECCIÓN 6.3 — RANKING COMPLETO:
- Tabla/Podio de los meseros:
  • Top 3 en formato podio visual:
    • 🥇 1er lugar: centro, más alto, fondo dorado
    • 🥈 2do lugar: izquierda, plata
    • 🥉 3er lugar: derecha, bronce
  • Foto del mesero, nombre, puntos, insignias
  • Resto de la lista en formato tabla debajo
- Filtros: Esta Semana | Este Mes | Todo el Tiempo
- Animación: el podio aparece con bounce al cargar

SECCIÓN 6.4 — HISTORIAL DEL MESERO:
- Gráfica de líneas: puntos por semana
- Timeline de logros:
  • Fecha + logro desbloqueado + puntos ganados
- Stats:
  • Total bebidas vendidas este mes
  • Promedio diario
  • Mejor día
  • Bebida más vendida

SECCIÓN 6.5 — PANEL DE METAS:
- Metas actuales con barras de progreso
- Metas alcanzadas (check verde)
- Metas pendientes (círculo vacío)
- Siguiente meta destacada con countdown

──────────────────────────────────────────────────────────
INTERFAZ 7: PANEL DE ADMINISTRACIÓN
──────────────────────────────────────────────────────────

SECCIÓN 7.1 — LOGIN ADMIN:
- Diseño minimalista, fondo #0D0D0D
- Logo POP + "ADMIN"
- Campos: Email + Contraseña
- 2FA opcional

SECCIÓN 7.2 — DASHBOARD ADMIN:
- Sidebar izquierdo con navegación:
  • 📊 Dashboard
  • 🍱 Menú
  • 🔥 Promociones
  • ⭐ Fidelidad
  • 👥 Usuarios
  • 🏆 Meseros
  • 🍹 Ventas Bebidas
  • 📢 Notificaciones
  • ⚙️ Configuración
- Área principal con KPIs en cards:
  • Usuarios totales (con % de cambio)
  • Pedidos del mes (con % de cambio)
  • Puntos emitidos vs canjeados
  • Ventas de bebidas del mes
- Gráficas:
  • Pedidos por día de la semana
  • Usuarios nuevos por semana
  • Top 5 platillos más vendidos
  • Top 5 meseros del mes
- Actividad reciente (timeline)

SECCIÓN 7.3 — GESTIÓN DE MENÚ:
- Tabla de platillos con:
  • Foto thumbnail
  • Nombre
  • Categoría
  • Precio
  • Estado (Activo/Inactivo)
  • Acciones: Editar, Desactivar
- Botón "AGREGAR PLATILLO"
- Filtros por categoría
- Drag & drop para reordenar

SECCIÓN 7.4 — GESTIÓN DE PROMOCIONES:
- Lista de promociones con:
  • Nombre
  • Tipo de descuento
  • Vigencia
  • Estado
  • Pedidos generados
- Botón "CREAR PROMOCIÓN"
- Formulario de creación:
  • Nombre, descripción, foto
  • Tipo de descuento (% o $)
  • Fecha inicio/fin
  • Platillos aplicables
  • Segmento de usuarios (todos, VIP, nuevos)

SECCIÓN 7.5 — GESTIÓN DE FIDELIDAD:
- Configuración de reglas de puntos
- Gestión de niveles (editar requisitos y beneficios)
- Catálogo de beneficios (CRUD)
- Métricas de fidelidad:
  • Tasa de canje
  • Usuarios por nivel
  • Puntos emitidos vs canjeados

SECCIÓN 7.6 — GESTIÓN DE USUARIOS:
- Tabla de usuarios con:
  • Nombre, email, teléfono
  • Nivel de membresía
  • Puntos actuales
  • Última visita
  • Total gastado
- Acciones: Ver detalle, Enviar notificación, Editar puntos
- Filtros: Nivel, Puntos, Última actividad

SECCIÓN 7.7 — GESTIÓN DE MESEROS:
- Lista de meseros con:
  • Foto, nombre, número de empleado
  • Puntos del mes
  • Posición en ranking
  • Estado (Activo/Inactivo)
- Botón "AGREGAR MESERO"
- Configuración de metas mensuales
- Asignación de incentivos

SECCIÓN 7.8 — NOTIFICACIONES:
- Composer de mensajes:
  • Tipo: WhatsApp / Email / Push
  • Segmento: Todos, Nivel específico, Inactivos, Cumpleañeros
  • Mensaje (con templates predefinidos)
  • Programación: Enviar ahora / Programar
- Historial de envíos con métricas (entregados, abiertos, clicks)

SECCIÓN 7.9 — GESTIÓN DE FACTURACIÓN:
- Dashboard de facturación:
  • KPIs: Facturas del mes, Pendientes, Timbradas, Errores
  • Gráfica de facturas por semana
  • Costo total en timbrado del mes
- Tabla de solicitudes de facturación:
  • Folio, cliente (nombre/email), RFC, monto, fecha solicitud
  • Estado con badge de color:
    • Pendiente (amarillo)
    • Procesando (azul)
    • Timbrado (verde)
    • Enviado (verde oscuro)
    • Error (rojo)
    • Cancelado (gris)
  • Acciones: Ver detalle, Timbrar manual, Cancelar, Reenviar email
- Detalle de solicitud (modal):
  • Foto del ticket del cliente
  • Datos fiscales completos
  • Montos (subtotal, IVA, total)
  • UUID del CFDI (si ya timbrado)
  • Botones: Descargar PDF, Descargar XML, Reenviar
- Configuración de PAC:
  • Selector de PAC (Facturama, SW Sapien, Finkok, Diverza)
  • Campos de API Key / credenciales
  • Estado de conexión (conectado/desconectado)
  • Test de conexión

──────────────────────────────────────────────────────────
INTERFAZ 8: FACTURACIÓN CFDI (PÚBLICA — CLIENTE)
──────────────────────────────────────────────────────────

SECCIÓN 8.1 — LANDING DE FACTURACIÓN:
- Hero con fondo gradiente #732817 → #0D0D0D
- Título: "FACTURA TU COMPRA 🧾" en dorado
- Subtítulo: "Sube tu ticket, llena tus datos y recibe tu factura en minutos"
- 3 pasos visuales horizontales:
  1. "📷 SUBE TU TICKET" — "Toma una foto o sube la imagen de tu ticket"
  2. "📝 LLENA TUS DATOS" — "RFC, razón social y datos fiscales"
  3. "📧 RECIBE TU CFDI" — "PDF + XML en tu email en 1-5 minutos"
- CTA: "FACTURAR AHORA →"
- FAQ acordeón debajo:
  • "¿Cuánto tiempo tengo para facturar?" — Hasta el mes siguiente según el SAT
  • "¿Qué datos necesito?" — RFC, régimen fiscal, uso de CFDI, código postal
  • "¿Cuánto tarda?" — Generalmente 1-5 minutos, máximo 24 horas
  • "¿Puedo cancelar una factura?" — Sí, contáctanos y la reemitimos

SECCIÓN 8.2 — FORMULARIO DE FACTURACIÓN (PASO A PASO):

PASO 1 — SUBIR TICKET:
- Título: "Paso 1 de 3: Sube tu ticket"
- Zona de upload grande con drag & drop:
  • Borde punteado dorado (#F2C777)
  • Icono de cámara grande en el centro
  • Texto: "Arrastra tu imagen aquí o haz click para seleccionar"
  • Formatos aceptados: JPG, PNG, HEIC, PDF
  • Tamaño máximo: 10MB
- Opción de tomar foto directamente (cámara en mobile)
- Preview de la imagen subida con opción de eliminar y subir otra
- OCR automático: si se detecta texto en la imagen, extraer monto y fecha
- Botón: "CONTINUAR →" (se activa cuando hay imagen)

PASO 2 — DATOS FISCALES:
- Título: "Paso 2 de 3: Datos fiscales"
- Campo RFC con validación en tiempo real:
  • Input con formato: [XXXX000000XXX]
  • Al escribir: validación automática contra formato SAT
  • Si es válido: check verde + "RFC válido ✅"
  • Si es inválido: texto rojo + "RFC inválido, verifica los datos ❌"
  • Botón "¿No tienes RFC?" → muestra formulario para público general (XAXX010101000)
- Campo "Buscar RFC por nombre":
  • Input con autocompletado desde API del SAT
  • Al seleccionar: rellena RFC y razón social automáticamente
- Razón Social / Nombre:
  • Input de texto
  • Placeholder: "Nombre o razón social"
- Régimen Fiscal:
  • Dropdown con opciones del SAT (lista completa)
  • Placeholder: "Selecciona tu régimen fiscal"
  • Tooltip de ayuda: "¿No sabes tu régimen?" → link a guía
- Uso de CFDI:
  • Dropdown con opciones del SAT
  • Placeholder: "Selecciona el uso de CFDI"
  • Tooltip de ayuda
- Código Postal:
  • Input numérico, 5 dígitos
  • Validación de CP válido
- Email para recibir factura:
  • Input tipo email
  • Placeholder: "tu@email.com"
  • Se pre-llena si el usuario ya está logueado
- Sección de datos del ticket:
  • Monto total detectado (editable)
  • Fecha del ticket (editable)
  • Si el OCR no detectó: campos manuales para subtotal, IVA, total
- Indicador de progreso: Paso 2 de 3 — barra al 66%
- Botones: "← ATRÁS" y "CONTINUAR →"

PASO 3 — CONFIRMACIÓN Y ENVÍO:
- Título: "Paso 3 de 3: Confirma y solicita tu factura"
- Resumen visual tipo recibo:
  ┌─────────────────────────────────┐
  │  RESUMEN DE TU FACTURA          │
  ├─────────────────────────────────┤
  │  RFC: XAXX010101000             │
  │  Razón: Juan Pérez García       │
  │  Régimen: Sueldos y Salarios    │
  │  Uso: Gastos en general         │
  │  CP: 94440                      │
  │  Email: juan@email.com          │
  ├─────────────────────────────────┤
  │  Subtotal:  $350.00             │
  │  IVA (16%): $ 56.00             │
  │  TOTAL:     $406.00             │
  ├─────────────────────────────────┤
  │  [📷 Ver ticket]                │
  └─────────────────────────────────┘
- Checkbox: "☑ Confirmo que los datos son correctos. La factura no se puede modificar una vez timbrada."
- Nota: "⚠️ Verifica bien tus datos. Una vez timbrada, la factura solo puede cancelarse y reemitirse."
- Botón grande: "🧾 SOLICITAR MI FACTURA →" en naranja
- Al enviar:
  • Spinner de carga con texto "Generando tu factura..."
  • Animación de éxito: check verde grande + confeti dorado
  • Mensaje: "✅ ¡Tu factura fue solicitada exitosamente!"
  • "Recibirás el PDF y XML en tu email en 1-5 minutos"
  • "Folio de solicitud: FAC-2026-001234"
  • Botones: "FACTURAR OTRA" y "VER MIS FACTURAS"

SECCIÓN 8.3 — MIS FACTURAS (USUARIO LOGUEADO):
- Título: "MIS FACTURAS 🧾"
- Tabla/lista de facturas del usuario:
  • Fecha, folio, monto, estado (badge de color)
  • Acciones: Descargar PDF, Descargar XML, Cancelar
- Filtros: Este mes | Últimos 3 meses | Todo
- Stats rápidos:
  • Total facturado este año
  • Número de facturas
  • Última factura
- Estado vacío: "Aún no has solicitado facturas" + CTA "FACTURAR AHORA"

SECCIÓN 8.4 — ESTADO DE FACTURA (TRACKING):
- Al entrar con folio de solicitud:
  • Timeline vertical del estado:
    1. ✅ Solicitud recibida — [fecha/hora]
    2. 🔄 Procesando — [fecha/hora o "En cola"]
    3. ⏳ Timbrando — [fecha/hora o "Pendiente"]
    4. ✅ Enviada a tu email — [fecha/hora]
  • Si hay error:
    • 🔴 Error al timbrar
    • Mensaje explicando el error
    • Botón "CORREGIR Y REENVIAR"
  • Botones: Descargar PDF, Descargar XML (si está timbrada)

──────────────────────────────────────────────────────────
INTERFAZ 9: PÁGINA DE UBICACIÓN Y CONTACTO
──────────────────────────────────────────────────────────

- Hero con foto del exterior del restaurante
- Título: "ENCUÉNTRANOS 📍"
- Google Maps embed grande con custom styling
- Info del restaurante en card lateral:
  • Dirección: Justo Sierra No. 11, Col. Amado Nervo, Perote, Ver.
  • Teléfono: 282-825-32-43
  • Horarios en tabla con indicador "ABIERTO AHORA"
- Botones grandes:
  • "🗺️ CÓMO LLEGAR" (abre Google Maps app)
  • "💬 WHATSAPP" (abre chat directo)
  • "📞 LLAMAR" (inicia llamada)
- Sección de reservaciones:
  • Formulario: Nombre, Teléfono, Fecha, Hora, Número de personas, Notas
  • Botón "SOLICITAR RESERVACIÓN"
- Fotos del interior del restaurante en galería

──────────────────────────────────────────────────────────
INTERFAZ 10: PÁGINA "SOBRE NOSOTROS"
──────────────────────────────────────────────────────────

- Hero con foto del equipo o del restaurante
- Título: "SOBRE POP 🍣"
- Historia del restaurante: "Desde el 2014 satisfaciendo tu antojo..."
- Timeline visual de hitos
- Sección del equipo (fotos del staff con nombre y rol)
- Valores del restaurante (iconos + texto)
- Galería de fotos del local
- CTA: "¿Listo para probar? → VER MENÚ"

══════════════════════════════════════════════════════════
EFECTOS Y ANIMACIONES ESPECÍFICAS
══════════════════════════════════════════════════════════

PARTÍCULAS REACTIVAS:
- Puntos dorados (#F2C777) de 2-4px que flotan sutilmente
- Reaccionan al cursor: se alejan suavemente al acercarse el ratón
- Densidad: 30-50 partículas en desktop, 0 en mobile
- Opacidad: 20-40%

CURSOR PERSONALIZADO (DESKTOP):
- Círculo de 20px con borde #F2C777, fondo transparente
- Al hover sobre elementos clickeables: se expande a 40px, fondo #F2C777 a 20%
- Al hacer click: efecto de onda (ripple)

SCROLL ANIMATIONS:
- Fade-up: elementos aparecen desde abajo con opacidad 0→1
- Slide-in: elementos entran desde los laterales
- Stagger: elementos en grid aparecen secuencialmente (delay 100ms entre cada uno)
- Parallax: imágenes de fondo se mueven a diferente velocidad que el contenido
- Trigger: animación inicia cuando el elemento entra al 80% del viewport

HOVER EFFECTS:
- Cards: scale(1.05) + shadow dorada sutil
- Botones: cambio de color + scale(1.02)
- Imágenes: zoom sutil (scale 1.1) + overlay oscuro
- Links: underline animado de izquierda a derecha en color dorado

TRANSICIONES DE PÁGINA:
- Fade out de la página actual (200ms)
- Fade in de la nueva página (300ms)
- Scroll position se mantiene al navegar entre secciones

CONTADORES ANIMADOS:
- Números que cuentan desde 0 hasta el valor final
- Duración: 2 segundos
- Easing: ease-out
- Aplicar en: puntos del usuario, número de platillos, clientes satisfechos

══════════════════════════════════════════════════════════
COMPONENTES REUTILIZABLES
══════════════════════════════════════════════════════════

Crear como componentes parametrizables:

1. CARD DE PRODUCTO:
   - Props: imagen, nombre, descripción, precio, badge, rating, onAdd
   - Variantes: compacta, estándar, destacada

2. CARD DE PROMO:
   - Props: imagen, título, descripción, vigencia, estado, onCta
   - Variantes: hero, grid, mini

3. BOTÓN CTA:
   - Props: texto, icono, variante (primario, secundario, ghost), tamaño, onClick
   - Variantes: primario (naranja), secundario (borde dorado), ghost (solo texto)

4. BADGE:
   - Props: texto, color, icono
   - Variantes: promo, nuevo, más vendido, activo, inactivo

5. INPUT:
   - Props: label, placeholder, tipo, valor, onChange, error
   - Variantes: texto, email, teléfono, contraseña, fecha, select

6. MODAL/DRAWER:
   - Props: título, contenido, onClose, tamaño
   - Variantes: modal centrado, drawer lateral, fullscreen (mobile)

7. TABLA DE DATOS:
   - Props: columnas, filas, acciones, paginación
   - Features: ordenamiento, filtrado, búsqueda

9. BADGE DE ESTADO DE FACTURA:
   - Props: estado (pendiente, procesando, timbrado, enviado, error, cancelado)
   - Colores: amarillo, azul, verde, verde oscuro, rojo, gris
   - Icono por estado

10. UPLOAD ZONE:
    - Props: onUpload, formatos, maxSize, preview
    - Features: drag & drop, click para seleccionar, preview de imagen, eliminar
    - Variantes: con OCR, sin OCR

11. TIMELINE DE ESTADO:
    - Props: pasos (array con estado, fecha, descripción), paso actual
    - Variantes: vertical, horizontal
    - Estados: completado (check verde), activo (spinner azul), pendiente (círculo gris), error (X roja)

12. FORMULARIO PASO A PASO (WIZARD):
    - Props: pasos (array), paso actual, onNext, onBack, onComplete
    - Features: barra de progreso, validación por paso, guardar borrador
    - Indicador visual de pasos completados/pendientes

══════════════════════════════════════════════════════════
INSTRUCCIONES DE GENERACIÓN
══════════════════════════════════════════════════════════

1. GENERA CADA INTERFAZ DE FORMA INDEPENDIENTE pero manteniendo consistencia visual
2. CADA INTERFAZ debe incluir sus 4 breakpoints (mobile, tablet portrait, tablet landscape, desktop)
3. USA EXACTAMENTE la paleta de colores proporcionada — no introducir colores adicionales salvo blanco (#FFFFFF) y grises neutros para texto secundario
4. LAS ANIMACIONES deben ser configurables: velocidad, intensidad, activación/desactivación
5. LOS COMPONENTES deben ser modulares y reutilizables
6. EL CÓDIGO generado debe ser limpio, semántico y accesible (ARIA labels, alt texts, contraste WCAG AA)
7. LAS IMÁGENES deben usar placeholders con la paleta de colores hasta que se reemplacen con fotos reales
8. EL LAYOUT debe usar CSS Grid y Flexbox — no frameworks de layout propietarios
9. LAS TRANSICIONES deben usar transform y opacity para rendimiento óptimo (GPU accelerated)
10. INCLUIR comentarios en el código indicando dónde ajustar parámetros (colores, tamaños, velocidades)

══════════════════════════════════════════════════════════
NOTAS ADICIONALES
══════════════════════════════════════════════════════════

- El restaurante tiene un ambiente familiar y casual con juegos de mesa
- La especialidad es sushi (+40 rollos), alitas (10 salsas), boneless, crepas y snacks
- El horario: Lun/Mié-Jue 14:00-21:30, Vie-Sáb 14:00-22:00, Dom 14:00-21:00, Martes CERRADO
- Google Rating: 4.4 estrellas
- Redes: Facebook (@pop.perote, 5.2K seguidores), Instagram (@pop_perote), TikTok
- Sistema de pedidos actual: FoodBooking (integrar mediante redirección con tracking)
- La web actual está en mantenimiento ("¡Pronta Reapertura!")
- Promociones conocidas: Sushiércoles (2x1 rollos miércoles), Sushihuatiza (rollos + margaritas viernes en Cuaresma)

Genera todas las interfaces descritas con la máxima calidad visual, atención al detalle y coherencia con la identidad de marca POP PEROTE.
```

---

## Guía de Uso del Prompt

### Cómo usarlo en Google Stitch:

1. **Copia el bloque completo** del prompt (desde `Actúa como un arquitecto...` hasta el final)
2. **Pégalo en Google Stitch** como prompt principal
3. **Itera por interfaz**: Si la herramienta lo permite, genera una interfaz a la vez usando las secciones numeradas (INTERFAZ 1, INTERFAZ 2, etc.)
4. **Ajusta en tiempo real**: Modifica proporciones, tipografías y comportamientos según el resultado

### Si necesitas generar por partes:

| Iteración | Sección del Prompt | Qué genera |
|---|---|---|
| 1 | `INTERFAZ 1: LANDING PAGE` | Home completa con hero, promos, menú rápido, fidelidad teaser, testimonios, ubicación, footer |
| 2 | `INTERFAZ 2: PÁGINA DE MENÚ` | Catálogo completo con filtros, cards de producto, modal de detalle |
| 3 | `INTERFAZ 3: PROMOCIONES` | Página de promos activas, calendario semanal, sección FOMO |
| 4 | `INTERFAZ 4: FIDELIDAD` | Landing POP Points, dashboard usuario, catálogo beneficios, historial, niveles |
| 5 | `INTERFAZ 5: REGISTRO/LOGIN` | Formularios de autenticación |
| 6 | `INTERFAZ 6: RANKING MESEROS` | Dashboard mesero, ranking completo, historial, metas |
| 7 | `INTERFAZ 7: ADMIN PANEL` | Dashboard admin, gestión de menú, promos, fidelidad, usuarios, meseros, notificaciones |
| 8 | `INTERFAZ 8-9: UBICACIÓN + ABOUT` | Página de contacto/ubicación y sobre nosotros |

### Para ajustar responsividad:

El prompt ya incluye los 4 breakpoints definidos. Si necesitas enfatizar uno específico, añade al inicio de tu prompt iterativo:

```
Enfócate principalmente en el breakpoint [MOBILE / TABLET PORTRAIT / TABLET LANDSCAPE / DESKTOP] para esta iteración.
```
