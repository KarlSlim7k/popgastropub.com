-- =============================================================================
-- POP PEROTE — Schema MariaDB / CFDI 4.0
-- Versión: 1.0.0
-- Fecha: 2026-04-09
-- Motor: MariaDB 10.6+ / InnoDB
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- =============================================================================

SET NAMES utf8mb4;
SET time_zone = '-06:00'; -- UTC-6 (Centro México)
SET foreign_key_checks = 0;
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE DATABASE IF NOT EXISTS pop_perote
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pop_perote;

-- =============================================================================
-- MÓDULO 1: USUARIOS Y AUTENTICACIÓN
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1.1 users — Tabla central de usuarios (clientes, meseros, admins)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre              VARCHAR(100)    NOT NULL,
    apellidos           VARCHAR(100)    NOT NULL,
    email               VARCHAR(191)    NOT NULL,
    email_verified_at   TIMESTAMP       NULL     DEFAULT NULL,
    password            VARCHAR(255)    NOT NULL,
    telefono            VARCHAR(20)     NULL,
    fecha_nacimiento    DATE            NULL                    COMMENT 'Para bonus automático de cumpleaños',
    avatar_url          VARCHAR(500)    NULL,
    -- Roles del sistema: cliente | mesero | admin
    rol                 ENUM('cliente','mesero','admin') NOT NULL DEFAULT 'cliente',
    activo              TINYINT(1)      NOT NULL DEFAULT 1,
    referido_por        BIGINT UNSIGNED NULL                    COMMENT 'FK a users: quién refirió a este cliente',
    remember_token      VARCHAR(100)    NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP       NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    INDEX idx_users_rol (rol),
    INDEX idx_users_activo (activo),
    INDEX idx_users_referido (referido_por),
    CONSTRAINT fk_users_referido
        FOREIGN KEY (referido_por) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Usuarios del sistema: clientes, meseros y administradores';

-- -----------------------------------------------------------------------------
-- 1.2 personal_access_tokens — Laravel Sanctum (API tokens)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tokenable_type  VARCHAR(255)    NOT NULL,
    tokenable_id    BIGINT UNSIGNED NOT NULL,
    name            VARCHAR(255)    NOT NULL,
    token           VARCHAR(64)     NOT NULL,
    abilities       TEXT            NULL,
    last_used_at    TIMESTAMP       NULL,
    expires_at      TIMESTAMP       NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_pat_token (token),
    INDEX idx_pat_tokenable (tokenable_type, tokenable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tokens de API de Laravel Sanctum';

-- -----------------------------------------------------------------------------
-- 1.3 password_reset_tokens — Restablecimiento de contraseña
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email       VARCHAR(191)    NOT NULL,
    token       VARCHAR(255)    NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (email),
    INDEX idx_prt_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tokens de restablecimiento de contraseña';

-- =============================================================================
-- MÓDULO 2: MENÚ Y CATÁLOGO
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 2.1 categorias_menu — Categorías del menú
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias_menu (
    id          SMALLINT UNSIGNED   NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(80)         NOT NULL,
    slug        VARCHAR(100)        NOT NULL,
    descripcion TEXT                NULL,
    icono       VARCHAR(100)        NULL    COMMENT 'Material Symbol o emoji',
    imagen_url  VARCHAR(500)        NULL,
    orden       SMALLINT UNSIGNED   NOT NULL DEFAULT 0,
    activo      TINYINT(1)          NOT NULL DEFAULT 1,
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_cat_slug (slug),
    INDEX idx_cat_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Categorías del menú: Sushi, Alitas, Boneless, Crepas, Bebidas, Snacks';

-- -----------------------------------------------------------------------------
-- 2.2 productos — Productos/platillos del menú
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    categoria_id    SMALLINT UNSIGNED   NOT NULL,
    nombre          VARCHAR(150)        NOT NULL,
    slug            VARCHAR(200)        NOT NULL,
    descripcion     TEXT                NULL,
    -- Precio base en MXN con 2 decimales
    precio          DECIMAL(8,2)        NOT NULL,
    precio_promo    DECIMAL(8,2)        NULL    COMMENT 'Precio con descuento activo',
    imagen_url      VARCHAR(500)        NULL,
    imagen_thumb    VARCHAR(500)        NULL,
    -- Badges / etiquetas visuales
    es_nuevo        TINYINT(1)          NOT NULL DEFAULT 0,
    es_popular      TINYINT(1)          NOT NULL DEFAULT 0,
    es_picante      TINYINT(1)          NOT NULL DEFAULT 0,
    es_vegetariano  TINYINT(1)          NOT NULL DEFAULT 0,
    -- Para bebidas: indica si aplica al ranking POP Bar Stars
    es_bebida       TINYINT(1)          NOT NULL DEFAULT 0,
    tipo_bebida     ENUM('coctel','margarita','premium','jarra','botella','refresco','otra') NULL,
    disponible      TINYINT(1)          NOT NULL DEFAULT 1,
    orden           SMALLINT UNSIGNED   NOT NULL DEFAULT 0,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP           NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_prod_slug (slug),
    INDEX idx_prod_categoria (categoria_id),
    INDEX idx_prod_disponible (disponible),
    INDEX idx_prod_bebida (es_bebida, tipo_bebida),
    CONSTRAINT fk_productos_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias_menu(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Productos del menú: sushi, alitas, boneless, crepas, bebidas, snacks';

-- =============================================================================
-- MÓDULO 3: PROMOCIONES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 3.1 promociones — Promociones y ofertas activas
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promociones (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    titulo          VARCHAR(200)        NOT NULL,
    slug            VARCHAR(250)        NOT NULL,
    descripcion     TEXT                NULL,
    descripcion_corta VARCHAR(300)      NULL,
    tipo            ENUM('porcentaje','2x1','precio_fijo','producto_gratis','puntos_dobles','personalizado')
                                        NOT NULL DEFAULT 'personalizado',
    -- Valor del descuento (porcentaje o precio fijo)
    valor_descuento DECIMAL(8,2)        NULL,
    imagen_banner   VARCHAR(500)        NULL,
    imagen_card     VARCHAR(500)        NULL,
    -- Vigencia
    fecha_inicio    DATE                NOT NULL,
    fecha_fin       DATE                NULL    COMMENT 'NULL = sin fecha de fin',
    -- Días de la semana aplicables (JSON, ej: ["lunes","miercoles"])
    dias_aplicables JSON                NULL,
    hora_inicio     TIME                NULL,
    hora_fin        TIME                NULL,
    -- Control
    activo          TINYINT(1)          NOT NULL DEFAULT 1,
    destacada       TINYINT(1)          NOT NULL DEFAULT 0   COMMENT 'Aparece en Hero/Banner',
    requiere_puntos TINYINT(1)          NOT NULL DEFAULT 0,
    puntos_minimos  INT UNSIGNED        NULL    COMMENT 'POP Points mínimos requeridos',
    codigo          VARCHAR(50)         NULL    COMMENT 'Código de descuento, si aplica',
    orden           SMALLINT UNSIGNED   NOT NULL DEFAULT 0,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP           NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_promo_slug (slug),
    UNIQUE KEY uq_promo_codigo (codigo),
    INDEX idx_promo_activo (activo, fecha_inicio, fecha_fin),
    INDEX idx_promo_destacada (destacada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Promociones activas, históricas y programadas';

-- -----------------------------------------------------------------------------
-- 3.2 promo_productos — Relación N:M Promoción ↔ Producto
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_productos (
    promo_id    BIGINT UNSIGNED NOT NULL,
    producto_id BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY (promo_id, producto_id),
    CONSTRAINT fk_pp_promo
        FOREIGN KEY (promo_id) REFERENCES promociones(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pp_producto
        FOREIGN KEY (producto_id) REFERENCES productos(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Productos incluidos en cada promoción';

-- =============================================================================
-- MÓDULO 4: SISTEMA DE LEALTAD — POP POINTS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 4.1 niveles_fidelidad — Definición de tiers del programa de lealtad
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS niveles_fidelidad (
    id              TINYINT UNSIGNED    NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(50)         NOT NULL    COMMENT 'Fan, Lover, VIP, Elite',
    slug            VARCHAR(60)         NOT NULL,
    puntos_minimos  INT UNSIGNED        NOT NULL,
    puntos_maximos  INT UNSIGNED        NULL        COMMENT 'NULL = sin límite superior',
    multiplicador   DECIMAL(3,2)        NOT NULL DEFAULT 1.00 COMMENT 'Factor de puntos: 1.00=base, 1.10=+10%',
    icono           VARCHAR(100)        NULL,
    color_hex       VARCHAR(7)          NULL,
    beneficios      JSON                NULL        COMMENT 'Lista de beneficios en JSON',
    orden           TINYINT UNSIGNED    NOT NULL DEFAULT 0,

    PRIMARY KEY (id),
    UNIQUE KEY uq_niv_slug (slug),
    INDEX idx_niv_puntos (puntos_minimos, puntos_maximos)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Niveles del programa POP Points: Fan(0-499), Lover(500-1499), VIP(1500-2999), Elite(3000+)';

-- -----------------------------------------------------------------------------
-- 4.2 pop_points — Saldo y nivel de cada cliente
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pop_points (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED     NOT NULL,
    nivel_id        TINYINT UNSIGNED    NOT NULL DEFAULT 1,
    puntos_totales  INT UNSIGNED        NOT NULL DEFAULT 0   COMMENT 'Acumulado histórico',
    puntos_actuales INT UNSIGNED        NOT NULL DEFAULT 0   COMMENT 'Saldo disponible para canjear',
    -- Timestamps de control de nivel
    nivel_desde     TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_check_in TIMESTAMP           NULL,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_pp_user (user_id),
    INDEX idx_pp_nivel (nivel_id),
    INDEX idx_pp_puntos_actuales (puntos_actuales),
    CONSTRAINT fk_pp_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pp_nivel
        FOREIGN KEY (nivel_id) REFERENCES niveles_fidelidad(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Saldo y nivel POP Points por cliente';

-- -----------------------------------------------------------------------------
-- 4.3 pop_points_transacciones — Libro de movimientos de puntos
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pop_points_transacciones (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED     NOT NULL,
    tipo            ENUM(
                        'ganado_compra',        -- 1 pt por $10 MXN
                        'ganado_registro',      -- 50 pts bienvenida
                        'ganado_checkin',       -- 25 pts visita
                        'ganado_resena',        -- 100 pts reseña Google
                        'ganado_referido',      -- 200 pts referido
                        'ganado_cumpleanos',    -- 150 pts automático
                        'ganado_dia_bajo',      -- 2x puntos día bajo tráfico
                        'ganado_social',        -- 30 pts share redes
                        'canjeado',             -- Canje de puntos
                        'expirado',             -- Expiración de puntos
                        'ajuste_manual',        -- Ajuste por admin
                        'reversion'             -- Reversión/cancelación
                    ) NOT NULL,
    puntos          INT                 NOT NULL COMMENT 'Positivo=ganado, Negativo=canjeado/expirado',
    saldo_post      INT UNSIGNED        NOT NULL COMMENT 'Saldo disponible después de la transacción',
    descripcion     VARCHAR(300)        NULL,
    -- Referencias opcionales
    pedido_id       BIGINT UNSIGNED     NULL,
    promo_id        BIGINT UNSIGNED     NULL,
    referido_id     BIGINT UNSIGNED     NULL    COMMENT 'user_id del amigo referido',
    admin_id        BIGINT UNSIGNED     NULL    COMMENT 'Admin que hizo el ajuste',
    -- Multiplicador aplicado
    multiplicador   DECIMAL(3,2)        NOT NULL DEFAULT 1.00,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_ppt_user (user_id),
    INDEX idx_ppt_tipo (tipo),
    INDEX idx_ppt_fecha (created_at),
    INDEX idx_ppt_pedido (pedido_id),
    CONSTRAINT fk_ppt_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_ppt_promo
        FOREIGN KEY (promo_id) REFERENCES promociones(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_ppt_referido
        FOREIGN KEY (referido_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_ppt_admin
        FOREIGN KEY (admin_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_ppt_pedido
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Historial completo de movimientos de POP Points';

-- =============================================================================
-- MÓDULO 5: PEDIDOS (integración FoodBooking + registro interno)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 5.1 pedidos — Registro de pedidos realizados
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
    id                  BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id             BIGINT UNSIGNED     NULL    COMMENT 'NULL si es anónimo/walk-in',
    mesero_id           BIGINT UNSIGNED     NULL    COMMENT 'NULL si es pedido online',
    -- Referencia externa FoodBooking
    foodbooking_order_id VARCHAR(100)       NULL,
    folio               VARCHAR(20)         NOT NULL COMMENT 'Folio interno: POP-YYYYMMDD-NNNN',
    tipo                ENUM('mesa','llevar','delivery','online') NOT NULL DEFAULT 'mesa',
    estado              ENUM('pendiente','en_preparacion','listo','entregado','cancelado')
                                            NOT NULL DEFAULT 'pendiente',
    subtotal            DECIMAL(10,2)       NOT NULL DEFAULT 0.00,
    descuento           DECIMAL(10,2)       NOT NULL DEFAULT 0.00,
    impuesto            DECIMAL(10,2)       NOT NULL DEFAULT 0.00   COMMENT 'IVA 16%',
    total               DECIMAL(10,2)       NOT NULL DEFAULT 0.00,
    -- Puntos
    puntos_ganados      INT UNSIGNED        NOT NULL DEFAULT 0,
    dia_bajo_trafico    TINYINT(1)          NOT NULL DEFAULT 0      COMMENT '1 = aplica 2x puntos',
    -- Datos de pago
    metodo_pago         ENUM('efectivo','tarjeta','transferencia','foodbooking','otro') NULL,
    pagado              TINYINT(1)          NOT NULL DEFAULT 0,
    notas               TEXT                NULL,
    created_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_pedidos_folio (folio),
    UNIQUE KEY uq_pedidos_fb (foodbooking_order_id),
    INDEX idx_pedidos_user (user_id),
    INDEX idx_pedidos_mesero (mesero_id),
    INDEX idx_pedidos_estado (estado),
    INDEX idx_pedidos_fecha (created_at),
    CONSTRAINT fk_pedidos_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_pedidos_mesero
        FOREIGN KEY (mesero_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Pedidos registrados (mesa, llevar, delivery, FoodBooking)';

-- -----------------------------------------------------------------------------
-- 5.2 pedido_items — Líneas de detalle de cada pedido
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedido_items (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    pedido_id       BIGINT UNSIGNED     NOT NULL,
    producto_id     BIGINT UNSIGNED     NULL    COMMENT 'NULL si el producto fue eliminado del catálogo',
    nombre_producto VARCHAR(150)        NOT NULL COMMENT 'Snapshot del nombre al momento del pedido',
    precio_unitario DECIMAL(8,2)        NOT NULL,
    cantidad        SMALLINT UNSIGNED   NOT NULL DEFAULT 1,
    subtotal        DECIMAL(10,2)       NOT NULL,
    notas           VARCHAR(300)        NULL,
    -- Puntos del ranking Bar Stars (solo para bebidas)
    puntos_bar      SMALLINT UNSIGNED   NOT NULL DEFAULT 0,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_pi_pedido (pedido_id),
    INDEX idx_pi_producto (producto_id),
    CONSTRAINT fk_pi_pedido
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pi_producto
        FOREIGN KEY (producto_id) REFERENCES productos(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Líneas de detalle de cada pedido';

-- =============================================================================
-- MÓDULO 6: RANKING MESEROS — POP BAR STARS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 6.1 meseros — Perfil extendido de meseros (complementa users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS meseros (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED     NOT NULL,
    numero_empleado VARCHAR(20)         NOT NULL,
    fecha_ingreso   DATE                NULL,
    activo          TINYINT(1)          NOT NULL DEFAULT 1,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_mesero_user (user_id),
    UNIQUE KEY uq_mesero_emp (numero_empleado),
    CONSTRAINT fk_mesero_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Perfil extendido de meseros para el ranking POP Bar Stars';

-- -----------------------------------------------------------------------------
-- 6.2 bar_stars_transacciones — Puntos del ranking de ventas de bebidas
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bar_stars_transacciones (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    mesero_id       BIGINT UNSIGNED     NOT NULL,
    pedido_id       BIGINT UNSIGNED     NULL,
    pedido_item_id  BIGINT UNSIGNED     NULL,
    tipo            ENUM(
                        'coctel_margarita',     -- 10 pts
                        'bebida_premium',       -- 15 pts
                        'jarra_compartida',     -- 25 pts
                        'botella_completa',     -- 50 pts
                        'combo_comida_bebida',  -- 20 pts
                        'upselling',            -- 15 pts
                        'calificacion_cliente', -- 30 pts
                        'bebida_del_mes',       -- 2x (aplicado como multiplicador)
                        'ajuste_manual'
                    ) NOT NULL,
    puntos          SMALLINT            NOT NULL,
    multiplicador   DECIMAL(3,2)        NOT NULL DEFAULT 1.00,
    descripcion     VARCHAR(200)        NULL,
    periodo_mes     CHAR(7)             NOT NULL COMMENT 'YYYY-MM para agrupar por mes',
    admin_id        BIGINT UNSIGNED     NULL,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_bst_mesero (mesero_id),
    INDEX idx_bst_periodo (periodo_mes),
    INDEX idx_bst_pedido (pedido_id),
    CONSTRAINT fk_bst_mesero
        FOREIGN KEY (mesero_id) REFERENCES meseros(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_bst_pedido
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_bst_admin
        FOREIGN KEY (admin_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_bst_pedido_item
        FOREIGN KEY (pedido_item_id) REFERENCES pedido_items(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Movimientos de puntos del ranking POP Bar Stars por mesero';

-- -----------------------------------------------------------------------------
-- 6.3 bar_stars_ranking — Snapshot mensual del ranking (desnormalizado)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bar_stars_ranking (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    mesero_id       BIGINT UNSIGNED     NOT NULL,
    periodo_mes     CHAR(7)             NOT NULL,
    posicion        TINYINT UNSIGNED    NOT NULL DEFAULT 0,
    puntos_total    INT UNSIGNED        NOT NULL DEFAULT 0,
    ventas_total    DECIMAL(10,2)       NOT NULL DEFAULT 0.00,
    bebidas_vendidas SMALLINT UNSIGNED  NOT NULL DEFAULT 0,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_bsr_mesero_periodo (mesero_id, periodo_mes),
    INDEX idx_bsr_periodo_posicion (periodo_mes, posicion),
    CONSTRAINT fk_bsr_mesero
        FOREIGN KEY (mesero_id) REFERENCES meseros(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Ranking mensual consolidado de POP Bar Stars';

-- =============================================================================
-- MÓDULO 7: FACTURACIÓN CFDI 4.0
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 7.1 datos_fiscales_clientes — RFC y datos SAT guardados por cliente
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS datos_fiscales_clientes (
    id                  BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id             BIGINT UNSIGNED     NOT NULL,
    rfc                 VARCHAR(13)         NOT NULL,
    razon_social        VARCHAR(300)        NOT NULL    COMMENT 'Exacto según SAT',
    regimen_fiscal      VARCHAR(10)         NOT NULL    COMMENT 'Código SAT ej: 626',
    uso_cfdi_default    VARCHAR(5)          NULL        COMMENT 'Código SAT ej: G03',
    codigo_postal       CHAR(5)             NOT NULL,
    email_facturacion   VARCHAR(191)        NULL,
    es_default          TINYINT(1)          NOT NULL DEFAULT 1,
    created_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_dfc_user_rfc (user_id, rfc),
    INDEX idx_dfc_user (user_id),
    INDEX idx_dfc_rfc (rfc),
    CONSTRAINT fk_dfc_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Datos fiscales SAT guardados por cliente para facturación CFDI 4.0';

-- -----------------------------------------------------------------------------
-- 7.2 solicitudes_cfdi — Solicitudes de factura enviadas por clientes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solicitudes_cfdi (
    id                  BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id             BIGINT UNSIGNED     NULL    COMMENT 'NULL si es usuario no registrado',
    pedido_id           BIGINT UNSIGNED     NULL,
    datos_fiscales_id   BIGINT UNSIGNED     NULL    COMMENT 'FK a datos_fiscales_clientes si guardados',
    -- Folio interno del ticket
    folio_ticket        VARCHAR(50)         NOT NULL,
    monto_ticket        DECIMAL(10,2)       NOT NULL,
    -- Datos fiscales del receptor (snapshot al momento de la solicitud)
    rfc_receptor        VARCHAR(13)         NOT NULL,
    razon_social        VARCHAR(300)        NOT NULL,
    regimen_fiscal      VARCHAR(10)         NOT NULL,
    uso_cfdi            VARCHAR(5)          NOT NULL,
    codigo_postal       CHAR(5)             NOT NULL,
    email_receptor      VARCHAR(191)        NOT NULL,
    -- Archivo del ticket
    ticket_url          VARCHAR(500)        NOT NULL COMMENT 'Ruta del archivo subido',
    ticket_mime         VARCHAR(100)        NULL,
    -- Estado del CFDI (flujo: pendiente→procesando→timbrado→enviado | error | cancelado)
    estado              ENUM('pendiente','procesando','timbrado','enviado','error','cancelado')
                                            NOT NULL DEFAULT 'pendiente',
    -- Respuesta del PAC
    uuid_cfdi           VARCHAR(36)         NULL    COMMENT 'UUID del CFDI timbrado',
    xml_url             VARCHAR(500)        NULL,
    pdf_url             VARCHAR(500)        NULL,
    pac_respuesta       JSON                NULL    COMMENT 'Respuesta cruda del PAC',
    -- Control
    intentos            TINYINT UNSIGNED    NOT NULL DEFAULT 0,
    error_mensaje       TEXT                NULL,
    timbrado_at         TIMESTAMP           NULL,
    enviado_at          TIMESTAMP           NULL,
    cancelado_at        TIMESTAMP           NULL,
    cancelado_por       BIGINT UNSIGNED     NULL    COMMENT 'Admin que canceló',
    motivo_cancelacion  VARCHAR(300)        NULL,
    notas_admin         TEXT                NULL,
    created_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_cfdi_uuid (uuid_cfdi),
    INDEX idx_cfdi_user (user_id),
    INDEX idx_cfdi_estado (estado),
    INDEX idx_cfdi_folio (folio_ticket),
    INDEX idx_cfdi_fecha (created_at),
    INDEX idx_cfdi_rfc (rfc_receptor),
    CONSTRAINT fk_cfdi_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_cfdi_pedido
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_cfdi_datos_fiscales
        FOREIGN KEY (datos_fiscales_id) REFERENCES datos_fiscales_clientes(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_cfdi_cancelado_por
        FOREIGN KEY (cancelado_por) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Solicitudes CFDI 4.0: ciclo de vida pendiente→procesando→timbrado→enviado';

-- -----------------------------------------------------------------------------
-- 7.3 cfdi_log — Auditoría de cambios de estado en solicitudes CFDI
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cfdi_log (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    solicitud_id    BIGINT UNSIGNED     NOT NULL,
    estado_anterior VARCHAR(20)         NULL,
    estado_nuevo    VARCHAR(20)         NOT NULL,
    descripcion     TEXT                NULL,
    actor_id        BIGINT UNSIGNED     NULL    COMMENT 'User (admin/sistema) que generó el cambio',
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_clog_solicitud (solicitud_id),
    INDEX idx_clog_actor (actor_id),
    CONSTRAINT fk_clog_solicitud
        FOREIGN KEY (solicitud_id) REFERENCES solicitudes_cfdi(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Auditoría de transiciones de estado en solicitudes CFDI';

-- =============================================================================
-- MÓDULO 8: TESTIMONIOS Y ENGAGEMENT
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 8.1 testimonios — Reseñas y testimonios de clientes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonios (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED     NULL,
    nombre_display  VARCHAR(100)        NOT NULL,
    avatar_url      VARCHAR(500)        NULL,
    calificacion    TINYINT UNSIGNED    NOT NULL DEFAULT 5  COMMENT '1-5 estrellas',
    texto           TEXT                NOT NULL,
    -- Origen: google | interno | whatsapp
    origen          ENUM('google','interno','whatsapp','facebook') NOT NULL DEFAULT 'interno',
    -- Control de puntos por reseña Google
    puntos_otorgados TINYINT(1)         NOT NULL DEFAULT 0,
    verificado      TINYINT(1)          NOT NULL DEFAULT 0,
    visible         TINYINT(1)          NOT NULL DEFAULT 0  COMMENT 'Aprobado por admin',
    orden           SMALLINT UNSIGNED   NOT NULL DEFAULT 0,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_testi_user (user_id),
    INDEX idx_testi_visible (visible, orden),
    CONSTRAINT fk_testi_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Testimonios y reseñas de clientes (Google, internos, WhatsApp)';

-- =============================================================================
-- MÓDULO 9: CONFIGURACIÓN Y AUDITORÍA
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 9.1 configuracion — Parámetros globales del sistema
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS configuracion (
    clave       VARCHAR(100)    NOT NULL,
    valor       TEXT            NOT NULL,
    tipo        ENUM('string','integer','boolean','json','decimal') NOT NULL DEFAULT 'string',
    descripcion VARCHAR(300)    NULL,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (clave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Parámetros globales del sistema (IVA, puntos por peso, SLA, etc.)';

-- -----------------------------------------------------------------------------
-- 9.2 activity_log — Auditoría general de acciones admin
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_log (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED     NULL,
    accion          VARCHAR(100)        NOT NULL,
    modelo          VARCHAR(100)        NULL    COMMENT 'Ej: Producto, Promocion',
    modelo_id       BIGINT UNSIGNED     NULL,
    datos_anteriores JSON               NULL,
    datos_nuevos    JSON               NULL,
    ip              VARCHAR(45)         NULL,
    user_agent      VARCHAR(500)        NULL,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_alog_user (user_id),
    INDEX idx_alog_modelo (modelo, modelo_id),
    INDEX idx_alog_accion (accion),
    INDEX idx_alog_fecha (created_at),
    CONSTRAINT fk_alog_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Log de auditoría de acciones administrativas';

-- =============================================================================
-- MÓDULO 10: HORARIOS DE ATENCIÓN
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 10.1 horarios_atencion — Horarios regulares semanales
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS horarios_atencion (
    id              TINYINT UNSIGNED    NOT NULL AUTO_INCREMENT,
    dia_semana      TINYINT UNSIGNED    NOT NULL COMMENT '0=Lunes … 6=Domingo',
    dia_nombre      VARCHAR(12)         NOT NULL,
    hora_apertura   TIME                NOT NULL,
    hora_cierre     TIME                NOT NULL,
    activo          TINYINT(1)          NOT NULL DEFAULT 1,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by      BIGINT UNSIGNED     NULL    COMMENT 'Admin que modificó el horario',

    PRIMARY KEY (id),
    UNIQUE KEY uq_horario_dia (dia_semana),
    CONSTRAINT fk_horario_updated_by
        FOREIGN KEY (updated_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Horarios de atención regulares por día de la semana (0=Lunes…6=Domingo)';

-- -----------------------------------------------------------------------------
-- 10.2 horarios_especiales — Días festivos o con horario diferente
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS horarios_especiales (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    fecha           DATE                NOT NULL,
    nombre          VARCHAR(150)        NOT NULL COMMENT 'Ej: Día Festivo, Navidad, Inventario',
    tipo            ENUM('cerrado','horario_especial') NOT NULL DEFAULT 'cerrado',
    hora_apertura   TIME                NULL    COMMENT 'Solo si tipo = horario_especial',
    hora_cierre     TIME                NULL,
    activo          TINYINT(1)          NOT NULL DEFAULT 1,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by      BIGINT UNSIGNED     NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_hesp_fecha (fecha),
    INDEX idx_hesp_fecha (fecha),
    CONSTRAINT fk_hesp_updated_by
        FOREIGN KEY (updated_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Horarios especiales: días festivos o cierres temporales';

-- =============================================================================
-- MÓDULO 11: CONTENIDO WEB (CMS LIGERO)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 11.1 contenido_web — Bloques de texto e imagen editables del sitio
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contenido_web (
    id          BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    seccion     VARCHAR(80)         NOT NULL COMMENT 'hero, about, contacto, footer, seo, etc.',
    clave       VARCHAR(100)        NOT NULL COMMENT 'Identificador del bloque dentro de la sección',
    valor       TEXT                NULL,
    tipo        ENUM('texto','html','imagen_url','json','color','url') NOT NULL DEFAULT 'texto',
    activo      TINYINT(1)          NOT NULL DEFAULT 1,
    orden       SMALLINT UNSIGNED   NOT NULL DEFAULT 0,
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by  BIGINT UNSIGNED     NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_cw_seccion_clave (seccion, clave),
    INDEX idx_cw_seccion (seccion, activo),
    CONSTRAINT fk_cw_updated_by
        FOREIGN KEY (updated_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Bloques de contenido editables del sitio público (CMS ligero)';

-- -----------------------------------------------------------------------------
-- 11.2 galeria — Imágenes y medios para el sitio público
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS galeria (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    titulo          VARCHAR(200)        NULL,
    descripcion     TEXT                NULL,
    imagen_url      VARCHAR(500)        NOT NULL,
    imagen_thumb    VARCHAR(500)        NULL    COMMENT 'Miniatura optimizada para listados',
    categoria       ENUM('platos','ambiente','eventos','promociones','equipo','general')
                                        NOT NULL DEFAULT 'general',
    orden           SMALLINT UNSIGNED   NOT NULL DEFAULT 0,
    activo          TINYINT(1)          NOT NULL DEFAULT 1,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by      BIGINT UNSIGNED     NULL,

    PRIMARY KEY (id),
    INDEX idx_gal_categoria (categoria, activo, orden),
    CONSTRAINT fk_gal_updated_by
        FOREIGN KEY (updated_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Galería de imágenes del sitio: platos, ambiente, eventos, equipo';

-- =============================================================================
-- MÓDULO 12: RESERVACIONES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 12.1 reservaciones — Solicitudes de mesas (beneficio POP VIP / Elite)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservaciones (
    id              BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED     NULL    COMMENT 'NULL si reserva sin cuenta registrada',
    nombre          VARCHAR(150)        NOT NULL,
    telefono        VARCHAR(20)         NOT NULL,
    email           VARCHAR(191)        NULL,
    personas        TINYINT UNSIGNED    NOT NULL DEFAULT 2,
    fecha           DATE                NOT NULL,
    hora            TIME                NOT NULL,
    ocasion         VARCHAR(100)        NULL    COMMENT 'Ej: Cumpleaños, Aniversario, Negocio',
    notas           TEXT                NULL,
    estado          ENUM('pendiente','confirmada','cancelada','completada','no_show')
                                        NOT NULL DEFAULT 'pendiente',
    confirmada_por  BIGINT UNSIGNED     NULL    COMMENT 'Admin que confirmó',
    confirmada_at   TIMESTAMP           NULL,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_res_user (user_id),
    INDEX idx_res_fecha (fecha, hora),
    INDEX idx_res_estado (estado),
    CONSTRAINT fk_res_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_res_confirmada_por
        FOREIGN KEY (confirmada_por) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Reservaciones de mesa: pendiente→confirmada→completada / cancelada / no_show';

-- =============================================================================
-- DATOS INICIALES (SEEDS ESENCIALES)
-- =============================================================================

-- Niveles de Fidelidad POP Points
INSERT INTO niveles_fidelidad (nombre, slug, puntos_minimos, puntos_maximos, multiplicador, icono, color_hex, beneficios, orden) VALUES
('POP Fan',   'pop-fan',   0,    499,  1.00, 'military_tech',   '#FFB693', '["Promos básicas","1 pt por $10 MXN"]',                                                    1),
('POP Lover', 'pop-lover', 500,  1499, 1.10, 'favorite',        '#EBC071', '["10% más pts","Promo mensual exclusiva","Bebida gratis en cumpleaños"]',                   2),
('POP VIP',   'pop-vip',   1500, 2999, 1.25, 'workspace_premium','#F2C777', '["25% más pts","Rollo gratis c/5 visitas","Acceso anticipado a promos"]',                  3),
('POP Elite', 'pop-elite', 3000, NULL, 1.50, 'diamond',         '#D96725', '["50% más pts","Reserva prioritaria","Invitación a eventos","1 buffet gratis/mes"]',        4);

-- Categorías del menú
INSERT INTO categorias_menu (nombre, slug, descripcion, icono, orden) VALUES
('Sushi',   'sushi',   'Rollos, nigiri, sashimi y creaciones de autor. +40 opciones.',    '🍣', 1),
('Alitas',  'alitas',  'Alitas crujientes con 10 salsas desde clásica hasta extrema.',    '🍗', 2),
('Boneless','boneless','Pechuga de pollo empanizada al momento.',                         '🔥', 3),
('Crepas',  'crepas',  'Dulces y saladas, preparadas con receta tradicional.',            '🥞', 4),
('Bebidas', 'bebidas', 'Coctelería, margaritas, pitchers, botellas y refrescos.',         '🍹', 5),
('Snacks',  'snacks',  'Para picar y compartir.',                                         '🍿', 6);

-- Configuración inicial
INSERT INTO configuracion (clave, valor, tipo, descripcion) VALUES
('iva_porcentaje',         '16',                  'integer', 'Porcentaje de IVA aplicado en pedidos'),
('puntos_por_peso',        '0.1',                 'decimal', 'Puntos ganados por cada peso MXN (1 pt/$10 = 0.1)'),
('puntos_bienvenida',      '50',                  'integer', 'Puntos otorgados al registrarse'),
('puntos_checkin',         '25',                  'integer', 'Puntos por check-in en restaurante'),
('puntos_resena_google',   '100',                 'integer', 'Puntos por reseña verificada en Google'),
('puntos_referido',        '200',                 'integer', 'Puntos al referir un amigo que hace su primer pedido'),
('puntos_cumpleanos',      '150',                 'integer', 'Puntos automáticos en cumpleaños'),
('puntos_social_share',    '30',                  'integer', 'Puntos por compartir en redes sociales'),
('cfdi_sla_horas',         '24',                  'integer', 'SLA máximo CFDI en horas hábiles'),
('cfdi_meses_historial',   '3',                   'integer', 'Meses que se conserva historial de facturas'),
('pac_proveedor',          'facturama',           'string',  'Proveedor PAC para timbrado CFDI'),
('restaurant_rfc',         'PPG200115XY3',        'string',  'RFC del establecimiento emisor'),
('restaurant_razon_social','POP Perote Gastronomic Editorial S.A. de C.V.', 'string', 'Razón social del emisor'),
('restaurant_regimen',     '601',                 'string',  'Régimen fiscal del emisor (Ley Personas Morales)'),
('whatsapp_numero',        '522828253243',        'string',  'Número WhatsApp Business del restaurante'),
('foodbooking_company_uid','04f4d10b-2c07-4411-895d-4437eb890919', 'string', 'UID de empresa en FoodBooking'),
('bebida_del_mes_multiplicador', '2.0',           'decimal', 'Multiplicador de puntos Bar Stars para bebida del mes'),
('bebida_del_mes_producto_id',   '0',             'integer', 'ID del producto "bebida del mes" (0 = sin asignar)'),
('reserva_max_personas',         '20',            'integer', 'Máximo de personas por reservación'),
('reserva_anticipacion_horas',   '2',             'integer', 'Horas mínimas de anticipación para reservar');

-- Horarios de atención por defecto — ajustar según horario real del restaurante
INSERT INTO horarios_atencion (dia_semana, dia_nombre, hora_apertura, hora_cierre) VALUES
(0, 'Lunes',     '13:00:00', '22:00:00'),
(1, 'Martes',    '13:00:00', '22:00:00'),
(2, 'Miércoles', '13:00:00', '23:00:00'),
(3, 'Jueves',    '13:00:00', '22:00:00'),
(4, 'Viernes',   '13:00:00', '23:00:00'),
(5, 'Sábado',    '12:00:00', '23:00:00'),
(6, 'Domingo',   '12:00:00', '21:00:00');

SET foreign_key_checks = 1;

-- =============================================================================
-- FIN DEL SCHEMA — POP PEROTE v1.0.0
-- =============================================================================
