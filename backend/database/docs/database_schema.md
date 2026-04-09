# Base de Datos — POP PEROTE

> **Motor:** MariaDB 10.6+ / InnoDB  
> **Charset:** `utf8mb4` / `utf8mb4_unicode_ci`  
> **Zona horaria:** `UTC-6` (Centro México)  
> **Versión del schema:** `1.0.0` *(revisado 2026-04-09)*  
> **Archivo SQL:** `backend/database/mariadb/001_schema_pop_perote.sql`

---

## Resumen de Módulos

| # | Módulo | Tablas | Descripción |
|---|--------|--------|-------------|
| 1 | **Usuarios & Auth** | `users`, `personal_access_tokens`, `password_reset_tokens` | Registro, roles y autenticación Sanctum |
| 2 | **Menú & Catálogo** | `categorias_menu`, `productos` | Productos del menú (Sushi, Alitas, Boneless, Crepas, Bebidas, Snacks) |
| 3 | **Promociones** | `promociones`, `promo_productos` | Ofertas activas, históricas y programadas |
| 4 | **POP Points** | `niveles_fidelidad`, `pop_points`, `pop_points_transacciones` | Sistema de lealtad con 4 niveles |
| 5 | **Pedidos** | `pedidos`, `pedido_items` | Pedidos (mesa / online / FoodBooking) |
| 6 | **POP Bar Stars** | `meseros`, `bar_stars_transacciones`, `bar_stars_ranking` | Ranking mensual de meseros por ventas de bebidas |
| 7 | **Facturación CFDI 4.0** | `datos_fiscales_clientes`, `solicitudes_cfdi`, `cfdi_log` | Ciclo de vida completo de facturas electrónicas |
| 8 | **Engagement** | `testimonios` | Reseñas y testimonios de clientes |
| 9 | **Config & Auditoría** | `configuracion`, `activity_log` | Parámetros del sistema y trazabilidad |
| 10 | **Horarios** | `horarios_atencion`, `horarios_especiales` | Horarios regulares semanales y días festivos/cierres |
| 11 | **Contenido Web** | `contenido_web`, `galeria` | CMS ligero: textos, imágenes y galería del sitio público |
| 12 | **Reservaciones** | `reservaciones` | Solicitudes de mesa (beneficio POP VIP / Elite) |

---

## Diagrama General (Entidad-Relación)

```mermaid
erDiagram
    users {
        BIGINT id PK
        VARCHAR nombre
        VARCHAR apellidos
        VARCHAR email UK
        DATE fecha_nacimiento
        ENUM rol "cliente|mesero|admin"
        TINYINT activo
        BIGINT referido_por FK
    }

    categorias_menu {
        SMALLINT id PK
        VARCHAR nombre
        VARCHAR slug UK
        SMALLINT orden
    }

    productos {
        BIGINT id PK
        SMALLINT categoria_id FK
        VARCHAR nombre
        DECIMAL precio
        TINYINT es_bebida
        ENUM tipo_bebida
        TINYINT disponible
    }

    promociones {
        BIGINT id PK
        VARCHAR titulo
        ENUM tipo
        DATE fecha_inicio
        DATE fecha_fin
        TINYINT activo
    }

    promo_productos {
        BIGINT promo_id FK
        BIGINT producto_id FK
    }

    pedidos {
        BIGINT id PK
        BIGINT user_id FK
        BIGINT mesero_id FK
        VARCHAR folio UK
        ENUM estado
        DECIMAL total
        INT puntos_ganados
    }

    pedido_items {
        BIGINT id PK
        BIGINT pedido_id FK
        BIGINT producto_id FK
        DECIMAL precio_unitario
        SMALLINT cantidad
        SMALLINT puntos_bar
    }

    niveles_fidelidad {
        TINYINT id PK
        VARCHAR nombre
        INT puntos_minimos
        INT puntos_maximos
        DECIMAL multiplicador
    }

    pop_points {
        BIGINT id PK
        BIGINT user_id FK
        TINYINT nivel_id FK
        INT puntos_totales
        INT puntos_actuales
    }

    pop_points_transacciones {
        BIGINT id PK
        BIGINT user_id FK
        ENUM tipo
        INT puntos
        INT saldo_post
        BIGINT pedido_id FK
    }

    meseros {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR numero_empleado UK
    }

    bar_stars_transacciones {
        BIGINT id PK
        BIGINT mesero_id FK
        BIGINT pedido_id FK
        ENUM tipo
        SMALLINT puntos
        CHAR periodo_mes
    }

    bar_stars_ranking {
        BIGINT id PK
        BIGINT mesero_id FK
        CHAR periodo_mes
        TINYINT posicion
        INT puntos_total
    }

    datos_fiscales_clientes {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR rfc
        VARCHAR razon_social
        VARCHAR regimen_fiscal
        CHAR codigo_postal
    }

    solicitudes_cfdi {
        BIGINT id PK
        BIGINT user_id FK
        BIGINT pedido_id FK
        VARCHAR folio_ticket
        ENUM estado
        VARCHAR uuid_cfdi UK
        VARCHAR xml_url
        VARCHAR pdf_url
    }

    cfdi_log {
        BIGINT id PK
        BIGINT solicitud_id FK
        VARCHAR estado_anterior
        VARCHAR estado_nuevo
        BIGINT actor_id FK
    }

    testimonios {
        BIGINT id PK
        BIGINT user_id FK
        TINYINT calificacion
        ENUM origen
        TINYINT visible
    }

    users ||--o{ pedidos : "realiza"
    users ||--o{ pop_points : "tiene"
    users ||--o{ pop_points_transacciones : "acumula"
    users ||--o| meseros : "es"
    users ||--o{ datos_fiscales_clientes : "guarda"
    users ||--o{ solicitudes_cfdi : "solicita"
    users ||--o{ testimonios : "escribe"
    users ||--o{ reservaciones : "realiza"
    users ||--o{ users : "refiere"

    categorias_menu ||--o{ productos : "contiene"
    productos }o--o{ promociones : "incluido en"
    productos ||--o{ pedido_items : "aparece en"
    promo_productos }|--|| promociones : ""
    promo_productos }|--|| productos : ""

    pedidos ||--|{ pedido_items : "detalla"
    pedidos ||--o{ bar_stars_transacciones : "genera"
    pedidos ||--o| solicitudes_cfdi : "factura"

    niveles_fidelidad ||--o{ pop_points : "asigna"
    pop_points_transacciones }o--|| pedidos : "referencia"

    meseros ||--|{ bar_stars_transacciones : "acumula"
    meseros ||--o{ bar_stars_ranking : "aparece"
    meseros }|--|| users : ""

    solicitudes_cfdi ||--o{ cfdi_log : "registra"
    datos_fiscales_clientes ||--o{ solicitudes_cfdi : "precarga"
```

---

## Módulo 1 — Usuarios & Autenticación

### Diagrama

```mermaid
erDiagram
    users {
        BIGINT id PK
        VARCHAR nombre
        VARCHAR apellidos
        VARCHAR email UK
        VARCHAR password
        VARCHAR telefono
        DATE fecha_nacimiento
        VARCHAR avatar_url
        ENUM rol "cliente|mesero|admin"
        TINYINT activo
        BIGINT referido_por FK
        TIMESTAMP deleted_at
    }

    personal_access_tokens {
        BIGINT id PK
        VARCHAR tokenable_type
        BIGINT tokenable_id
        VARCHAR name
        VARCHAR token UK
        TEXT abilities
        TIMESTAMP last_used_at
        TIMESTAMP expires_at
    }

    password_reset_tokens {
        VARCHAR email PK
        VARCHAR token
        TIMESTAMP created_at
    }

    users ||--o{ personal_access_tokens : "posee tokens"
    users ||--o{ password_reset_tokens : "solicita reset"
    users }o--o| users : "referido_por"
```

### Roles del Sistema

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| `cliente` | Usuario registrado que ordena y acumula puntos | Público + dashboard propio |
| `mesero` | Personal de sala | Gestión de pedidos + ranking Bar Stars |
| `admin` | Administrador | Panel completo (CRUD + CFDI + ranking) |

> **Nota:** La autenticación usa **Laravel Sanctum** (`personal_access_tokens`). El token nunca viaja en el body del request — regla de oro del proyecto.

---

## Módulo 2 — Menú & Catálogo

### Diagrama

```mermaid
erDiagram
    categorias_menu {
        SMALLINT id PK
        VARCHAR nombre
        VARCHAR slug UK
        TEXT descripcion
        VARCHAR icono
        VARCHAR imagen_url
        SMALLINT orden
        TINYINT activo
    }

    productos {
        BIGINT id PK
        SMALLINT categoria_id FK
        VARCHAR nombre
        VARCHAR slug UK
        TEXT descripcion
        DECIMAL precio
        DECIMAL precio_promo
        VARCHAR imagen_url
        TINYINT es_nuevo
        TINYINT es_popular
        TINYINT es_picante
        TINYINT es_vegetariano
        TINYINT es_bebida
        ENUM tipo_bebida
        TINYINT disponible
        SMALLINT orden
        TIMESTAMP deleted_at
    }

    categorias_menu ||--|{ productos : "agrupa"
```

### Categorías predefinidas

| Orden | Categoría | Descripción |
|-------|-----------|-------------|
| 1 | 🍣 Sushi | 40+ rollos, nigiri, sashimi y creaciones de autor |
| 2 | 🍗 Alitas | Crujientes con 10 salsas secretas |
| 3 | 🔥 Boneless | Pechuga empanizada al momento |
| 4 | 🥞 Crepas | Dulces y saladas, receta tradicional |
| 5 | 🍹 Bebidas | Coctelería, margaritas, pitchers, botellas |
| 6 | 🍿 Snacks | Para picar y compartir |

> Los productos con `es_bebida = 1` y un `tipo_bebida` definido generan puntos en el sistema **POP Bar Stars**.

---

## Módulo 3 — Promociones

### Diagrama

```mermaid
erDiagram
    promociones {
        BIGINT id PK
        VARCHAR titulo
        VARCHAR slug UK
        ENUM tipo
        DECIMAL valor_descuento
        DATE fecha_inicio
        DATE fecha_fin
        JSON dias_aplicables
        TIME hora_inicio
        TIME hora_fin
        TINYINT activo
        TINYINT destacada
        TINYINT requiere_puntos
        INT puntos_minimos
        VARCHAR codigo UK
    }

    promo_productos {
        BIGINT promo_id FK
        BIGINT producto_id FK
    }

    productos {
        BIGINT id PK
        VARCHAR nombre
    }

    promociones }o--o{ productos : "aplica a"
    promo_productos }|--|| promociones : ""
    promo_productos }|--|| productos : ""
```

### Tipos de Promoción

| Tipo | Ejemplo |
|------|---------|
| `porcentaje` | 20% de descuento en sushi |
| `2x1` | Sushiércoles — 2x1 en rollos seleccionados |
| `precio_fijo` | Combo especial a $199 MXN |
| `producto_gratis` | Rollo gratis en tu visita #5 (POP VIP) |
| `puntos_dobles` | 2x puntos en días de bajo tráfico |
| `personalizado` | Cualquier otra mecánica |

---

## Módulo 4 — Sistema de Lealtad POP Points

### Diagrama

```mermaid
erDiagram
    niveles_fidelidad {
        TINYINT id PK
        VARCHAR nombre
        INT puntos_minimos
        INT puntos_maximos
        DECIMAL multiplicador
        VARCHAR icono
        VARCHAR color_hex
        JSON beneficios
    }

    pop_points {
        BIGINT id PK
        BIGINT user_id FK
        TINYINT nivel_id FK
        INT puntos_totales
        INT puntos_actuales
        TIMESTAMP nivel_desde
        TIMESTAMP ultimo_check_in
    }

    pop_points_transacciones {
        BIGINT id PK
        BIGINT user_id FK
        ENUM tipo
        INT puntos
        INT saldo_post
        BIGINT pedido_id FK
        BIGINT promo_id FK
        BIGINT referido_id FK
        DECIMAL multiplicador
        TIMESTAMP created_at
    }

    niveles_fidelidad ||--o{ pop_points : "asigna nivel"
    pop_points }|--|| users : "pertenece a"
    pop_points_transacciones }|--|| users : "pertenece a"
```

### Niveles y Multiplicadores

| Nivel | Puntos | Multiplicador | Beneficios clave |
|-------|--------|---------------|-----------------|
| 🎖️ POP Fan | 0 – 499 | ×1.00 | Acceso básico, 1 pt por $10 MXN |
| ❤️ POP Lover | 500 – 1,499 | ×1.10 | +10% pts, promo exclusiva mensual, bebida de cumpleaños |
| 🏆 POP VIP | 1,500 – 2,999 | ×1.25 | +25% pts, rollo gratis c/5 visitas, acceso anticipado |
| 💎 POP Elite | 3,000+ | ×1.50 | +50% pts, reserva prioritaria, eventos, 1 buffet/mes |

### Formas de Ganar Puntos

| Acción | Puntos | Campo `tipo` |
|--------|--------|--------------|
| Primer registro | +50 | `ganado_registro` |
| Compra ($10 MXN = 1 pt) | Variable | `ganado_compra` |
| Check-in en restaurante | +25 | `ganado_checkin` |
| Reseña verificada Google | +100 | `ganado_resena` |
| Referir un amigo | +200 | `ganado_referido` |
| Cumpleaños automático | +150 | `ganado_cumpleanos` |
| Compra en día bajo tráfico | ×2 pts | `ganado_dia_bajo` |
| Share en redes sociales | +30 | `ganado_social` |

---

## Módulo 5 — Pedidos

### Diagrama

```mermaid
erDiagram
    pedidos {
        BIGINT id PK
        BIGINT user_id FK
        BIGINT mesero_id FK
        VARCHAR foodbooking_order_id UK
        VARCHAR folio UK
        ENUM tipo "mesa|llevar|delivery|online"
        ENUM estado
        DECIMAL subtotal
        DECIMAL descuento
        DECIMAL impuesto
        DECIMAL total
        INT puntos_ganados
        TINYINT dia_bajo_trafico
        ENUM metodo_pago
        TINYINT pagado
    }

    pedido_items {
        BIGINT id PK
        BIGINT pedido_id FK
        BIGINT producto_id FK
        VARCHAR nombre_producto
        DECIMAL precio_unitario
        SMALLINT cantidad
        DECIMAL subtotal
        VARCHAR notas
        SMALLINT puntos_bar
    }

    pedidos ||--|{ pedido_items : "contiene"
    pedidos }o--|| users : "cliente"
    pedidos }o--o| users : "mesero asignado"
```

### Flujo de Estado de Pedido

```mermaid
stateDiagram-v2
    [*] --> pendiente : Pedido creado
    pendiente --> en_preparacion : Cocina confirma
    en_preparacion --> listo : Platos listos
    listo --> entregado : Mesero entrega
    pendiente --> cancelado : Cliente/admin cancela
    en_preparacion --> cancelado : Admin cancela
```

> **Integración FoodBooking:** El campo `foodbooking_order_id` guarda la referencia del pedido externo. El folio interno sigue el formato `POP-YYYYMMDD-NNNN`.

---

## Módulo 6 — POP Bar Stars (Ranking de Meseros)

### Diagrama

```mermaid
erDiagram
    meseros {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR numero_empleado UK
        DATE fecha_ingreso
        TINYINT activo
    }

    bar_stars_transacciones {
        BIGINT id PK
        BIGINT mesero_id FK
        BIGINT pedido_id FK
        BIGINT pedido_item_id FK
        ENUM tipo
        SMALLINT puntos
        DECIMAL multiplicador
        CHAR periodo_mes "YYYY-MM"
    }

    bar_stars_ranking {
        BIGINT id PK
        BIGINT mesero_id FK
        CHAR periodo_mes
        TINYINT posicion
        INT puntos_total
        DECIMAL ventas_total
        SMALLINT bebidas_vendidas
    }

    meseros ||--|{ bar_stars_transacciones : "acumula"
    meseros ||--o{ bar_stars_ranking : "aparece en"
    meseros }|--|| users : "extiende"
```

### Tabla de Puntos por Venta

| Acción | Puntos | `tipo` |
|--------|--------|--------|
| Vender 1 coctel / margarita | +10 | `coctel_margarita` |
| Vender 1 bebida premium | +15 | `bebida_premium` |
| Vender 1 jarra / compartida | +25 | `jarra_compartida` |
| Venta de botella completa | +50 | `botella_completa` |
| Combo comida + bebida | +20 | `combo_comida_bebida` |
| Upselling (upgrade de bebida) | +15 | `upselling` |
| Mejor calificación con mención | +30 | `calificacion_cliente` |
| "Bebida del mes" especial | ×2 sobre pts | `bebida_del_mes` |

> El campo `periodo_mes` (`YYYY-MM`) permite agrupar y resetear el ranking mensualmente. `bar_stars_ranking` es un **snapshot desnormalizado** que se recalcula al cierre de cada mes.

---

## Módulo 7 — Facturación CFDI 4.0

### Diagrama

```mermaid
erDiagram
    datos_fiscales_clientes {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR rfc
        VARCHAR razon_social
        VARCHAR regimen_fiscal
        VARCHAR uso_cfdi_default
        CHAR codigo_postal
        VARCHAR email_facturacion
        TINYINT es_default
    }

    solicitudes_cfdi {
        BIGINT id PK
        BIGINT user_id FK
        BIGINT pedido_id FK
        BIGINT datos_fiscales_id FK
        VARCHAR folio_ticket
        DECIMAL monto_ticket
        VARCHAR rfc_receptor
        VARCHAR razon_social
        VARCHAR regimen_fiscal
        VARCHAR uso_cfdi
        CHAR codigo_postal
        VARCHAR email_receptor
        VARCHAR ticket_url
        ENUM estado
        VARCHAR uuid_cfdi UK
        VARCHAR xml_url
        VARCHAR pdf_url
        JSON pac_respuesta
        TINYINT intentos
        TEXT error_mensaje
        TIMESTAMP timbrado_at
        TIMESTAMP enviado_at
        BIGINT cancelado_por FK
    }

    cfdi_log {
        BIGINT id PK
        BIGINT solicitud_id FK
        VARCHAR estado_anterior
        VARCHAR estado_nuevo
        BIGINT actor_id FK
        TIMESTAMP created_at
    }

    usuarios ||--o{ datos_fiscales_clientes : "guarda RFC"
    datos_fiscales_clientes ||--o{ solicitudes_cfdi : "precarga datos"
    usuarios ||--o{ solicitudes_cfdi : "solicita factura"
    solicitudes_cfdi ||--|{ cfdi_log : "audita cambios"
```

### Ciclo de Vida de una Solicitud CFDI

```mermaid
stateDiagram-v2
    direction LR
    [*] --> pendiente : Cliente sube ticket + datos SAT
    pendiente --> procesando : Job en cola (Laravel)
    procesando --> timbrado : PAC timbra exitosamente
    timbrado --> enviado : XML+PDF enviados por email
    procesando --> error : Fallo PAC o datos inválidos
    error --> procesando : Admin reintenta
    timbrado --> cancelado : Admin + contador autorizan
    pendiente --> cancelado : Admin cancela manualmente

    note right of timbrado : uuid_cfdi registrado\nSLA &lt; 5 min PAC
    note right of enviado : Estado final exitoso
```

### Campos Obligatorios CFDI 4.0

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `rfc_receptor` | Cliente | 12-13 caracteres, validado vs SAT |
| `razon_social` | Cliente | Debe coincidir **exactamente** con el SAT |
| `regimen_fiscal` | Cliente | Código SAT (ej: `626` Simplificado de Confianza) |
| `uso_cfdi` | Cliente | Código SAT (ej: `G03` Gastos en general) |
| `codigo_postal` | Cliente | C.P. fiscal de 5 dígitos |
| `folio_ticket` | Ticket físico | Folio del comprobante del restaurante |
| `monto_ticket` | Ticket físico | Monto total del consumo |

> **Regla crítica:** El sistema **NUNCA rechaza automáticamente** solicitudes tardías. La decisión de cancelación es manual: admin + contadora.

---

## Módulo 8 — Engagement (Testimonios)

```mermaid
erDiagram
    testimonios {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR nombre_display
        VARCHAR avatar_url
        TINYINT calificacion "1-5 estrellas"
        TEXT texto
        ENUM origen "google|interno|whatsapp|facebook"
        TINYINT puntos_otorgados
        TINYINT verificado
        TINYINT visible
        SMALLINT orden
    }

    testimonios }o--o| users : "vinculado a"
```

> Los testimonios de Google con `puntos_otorgados = 0` quedan pendientes de verificación manual. Al aprobarlos, se ejecuta la transacción de +100 pts en `pop_points_transacciones`.

---

## Módulo 9 — Configuración & Auditoría

### Parámetros de Configuración

| Clave | Valor inicial | Descripción |
|-------|---------------|-------------|
| `iva_porcentaje` | `16` | IVA aplicado en pedidos |
| `puntos_por_peso` | `0.1` | 1 pt por cada $10 MXN |
| `puntos_bienvenida` | `50` | Bonus de registro |
| `cfdi_sla_horas` | `24` | SLA máximo facturación |
| `pac_proveedor` | `facturama` | Proveedor PAC activo |
| `restaurant_rfc` | `PPG200115XY3` | RFC del emisor |
| `bebida_del_mes_multiplicador` | `2.0` | ×2 pts Bar Stars |

### Auditoría (activity_log)

```mermaid
erDiagram
    activity_log {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR accion
        VARCHAR modelo
        BIGINT modelo_id
        JSON datos_anteriores
        JSON datos_nuevos
        VARCHAR ip
        TIMESTAMP created_at
    }

    activity_log }o--o| users : "realizada por"
```

---

## Módulo 10 — Horarios de Atención

```mermaid
erDiagram
    horarios_atencion {
        TINYINT id PK
        TINYINT dia_semana "0=Lunes…6=Domingo"
        VARCHAR dia_nombre
        TIME hora_apertura
        TIME hora_cierre
        TINYINT activo
        BIGINT updated_by FK
    }

    horarios_especiales {
        BIGINT id PK
        DATE fecha UK
        VARCHAR nombre
        ENUM tipo "cerrado|horario_especial"
        TIME hora_apertura
        TIME hora_cierre
        TINYINT activo
        BIGINT updated_by FK
    }
```

> Ambas tablas se gestionan desde el panel admin. `horarios_especiales` prevalece sobre `horarios_atencion` cuando existe una entrada para la fecha consultada.

---

## Módulo 11 — Contenido Web (CMS Ligero)

```mermaid
erDiagram
    contenido_web {
        BIGINT id PK
        VARCHAR seccion "hero|about|contacto|footer|seo…"
        VARCHAR clave UK
        TEXT valor
        ENUM tipo "texto|html|imagen_url|json|color|url"
        TINYINT activo
        SMALLINT orden
        BIGINT updated_by FK
    }

    galeria {
        BIGINT id PK
        VARCHAR titulo
        VARCHAR imagen_url
        VARCHAR imagen_thumb
        ENUM categoria "platos|ambiente|eventos|promociones|equipo|general"
        SMALLINT orden
        TINYINT activo
        BIGINT updated_by FK
    }
```

### Secciones predefinidas `contenido_web`

| Sección | Descripción |
|---------|-------------|
| `hero` | Título, subtítulo, CTA e imagen principal del landing |
| `about` | Historia del restaurante, valores, chef |
| `contacto` | Dirección, teléfono, email, mapa embed URL |
| `footer` | Texto legal, horarios resumidos, redes sociales |
| `seo` | Meta title, meta description, OG image por página |

---

## Módulo 12 — Reservaciones

```mermaid
erDiagram
    reservaciones {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR nombre
        VARCHAR telefono
        TINYINT personas
        DATE fecha
        TIME hora
        VARCHAR ocasion
        ENUM estado "pendiente|confirmada|cancelada|completada|no_show"
        BIGINT confirmada_por FK
        TIMESTAMP confirmada_at
    }

    reservaciones }o--o| users : "cliente registrado"
```

### Flujo de Estado

```mermaid
stateDiagram-v2
    [*] --> pendiente : Cliente solicita
    pendiente --> confirmada : Admin confirma
    pendiente --> cancelada : Cliente/admin cancela
    confirmada --> completada : Visita completada
    confirmada --> cancelada : Cancela antes de fecha
    confirmada --> no_show : No se presentó
```

> Reservaciones prioritarias son un beneficio de niveles **POP VIP** y **POP Elite**. Clientes no registrados pueden reservar igual pero sin beneficios de prioridad.

---

## Guía de Relaciones Clave

```mermaid
graph TD
    U(users) --> |cliente| P(pedidos)
    U --> |mesero| M(meseros)
    U --> |lealtad| PP(pop_points)
    U --> |facturación| SCFDI(solicitudes_cfdi)

    P --> |genera| PI(pedido_items)
    P --> |acumula| PPT(pop_points_transacciones)
    P --> |Bar Stars| BST(bar_stars_transacciones)

    PI --> |producto| PR(productos)
    PR --> |categoría| CAT(categorias_menu)

    M --> |ranking| BST
    BST --> |consolida| BSR(bar_stars_ranking)

    PP --> |nivel| NF(niveles_fidelidad)
    PPT --> |saldo| PP

    SCFDI --> |audita| CLOG(cfdi_log)
    SCFDI --> |datos SAT| DFC(datos_fiscales_clientes)

    style U fill:#D96725,color:#fff
    style PP fill:#F2C777,color:#0D0D0D
    style SCFDI fill:#732817,color:#fff
    style M fill:#D96725,color:#fff
```

---

## Convenciones del Schema

| Convención | Detalle |
|------------|---------|
| **PKs** | `BIGINT UNSIGNED AUTO_INCREMENT` en tablas transaccionales; `SMALLINT/TINYINT` en catálogos |
| **Soft deletes** | `deleted_at TIMESTAMP NULL` en `users`, `productos`, `promociones` |
| **Timestamps** | `created_at` y `updated_at` en todas las tablas; `created_at` solo en logs |
| **Importes** | `DECIMAL(10,2)` para totales, `DECIMAL(8,2)` para precios unitarios |
| **Enumeraciones** | `ENUM(...)` para estados y tipos con valores finitos |
| **JSON** | Para estructuras flexibles: beneficios, dias_aplicables, pac_respuesta |
| **Índices** | En todas las FKs + columnas de búsqueda frecuente (estado, fecha, rol) |
| **Charset** | `utf8mb4` para soporte completo de emojis y caracteres especiales |
| **Zona horaria** | `UTC-6` Centro México configurada a nivel de conexión |

---

## Consideraciones de Seguridad

- ✅ **Prepared statements** — Obligatorio en todas las consultas (PDO / Laravel Query Builder)
- ✅ **Contraseñas** — `bcrypt` en el campo `password` (never plain text)
- ✅ **Tokens** — Gestionados por Sanctum; solo se almacena el hash en `personal_access_tokens`
- ✅ **RFC** — Validación de patrón `[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}` en frontend + backend
- ✅ **Archivos CFDI** — `ticket_url`, `xml_url`, `pdf_url` deben almacenarse fuera del webroot

---

*Generado para POP PEROTE · Justo Sierra No. 11, Col. Amado Nervo, Perote, Veracruz*
