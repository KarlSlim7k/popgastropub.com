# Mejoras Técnicas — Módulo Marketing y Campañas

## 1. Propósito del módulo

**Marketing y Campañas** es la evolución ordenada del módulo existente de Promociones. El objetivo es conservar el CRUD actual y ampliarlo para que cada promoción, evento especial o campaña pueda generar una landing page pública individual, lista para compartir directamente en redes sociales, WhatsApp o anuncios.

La mejora debe permitir:

- Crear y administrar campañas desde el panel actual.
- Publicar una URL individual por campaña.
- Configurar imagen principal, contenido y botones CTA.
- Activar formularios opcionales para captar leads.
- Previsualizar antes de publicar.
- Registrar métricas básicas de visitas, clics y leads.
- Configurar metadatos SEO y Open Graph para compartir enlaces.

## 2. Estado actual detectado

La implementación existente ya cubre una base funcional que debe reutilizarse.

### Frontend administrativo

- El menú lateral incluye la opción **Promociones** con ruta `/admin/promociones`.
- Existe una página administrativa con listado, calendario semanal, filtros y modal de alta o edición.
- El formulario permite capturar nombre, tipo, beneficio, descripción, vigencia, recurrencia indefinida, días activos, meta de redenciones, estado e imagen.
- Los estados disponibles son `activa`, `pausada` y `finalizada`.
- La imagen se carga mediante el componente reutilizable `ImageUpload` o mediante URL manual.
- La carga de archivos usa `POST /api/admin/upload` con carpeta `promociones`.

### Backend

- Existe el modelo Laravel `Promocion`.
- Existe un controlador público con `GET /api/promociones`.
- El endpoint público entrega promociones con `activa = true`, filtra la vigencia y agrega `dias_activos` normalizados y `disponible_hoy`.
- Existe un CRUD administrativo con `Route::apiResource('promociones', ...)`.
- Las rutas administrativas están protegidas por `auth:sanctum` y `role:admin`.
- El controlador administrativo traduce entre nombres del frontend y campos persistidos del dominio.
- La carga de imágenes administrativas valida extensiones `jpg`, `jpeg`, `png`, `webp` y `gif`, limita el tamaño a 4 MB y genera un nombre UUID.

### Base de datos activa según migraciones Laravel

La tabla `promociones` tiene actualmente:

| Grupo | Campos detectados |
|---|---|
| Contenido | `titulo`, `descripcion`, `tipo`, `descuento`, `imagen` |
| Precios | `precio_original`, `precio_promo` |
| Calendario | `dia_inicio`, `dia_fin`, `dias_activos`, `indefinida` |
| Estado | `activa`, `estado` |
| Seguimiento comercial | `redenciones`, `meta`, `ingresos` |
| Control | `id`, `created_at`, `updated_at` |

### Frontend público

- Existe la página general `/promociones`.
- La página muestra una promoción destacada, agenda semanal, listado activo, loading, estado vacío y reintento ante error.
- Todavía no existe una ruta individual `/promo/[slug]`.
- Todavía no existen CTA configurables, formularios públicos, leads, vista previa ni métricas por campaña.

### Hallazgos que deben resolverse durante la implementación

- `backend/database/mariadb/001_schema_pop_perote.sql` contiene un esquema histórico más amplio para `promociones`, incluyendo `slug`, pero no coincide con las migraciones Laravel ni con el modelo actualmente utilizado.
- La implementación debe tomar las migraciones Laravel aplicadas como base operativa, confirmar el esquema real del ambiente y reconciliar el archivo SQL de referencia cuando corresponda.
- La página pública `/promociones` usa una URL absoluta hardcodeada para consultar la API. Debe migrarse al wrapper de API o a `NEXT_PUBLIC_API_URL`.
- La página pública actual no usa la imagen cargada para renderizar las tarjetas y el CTA visual todavía no tiene acción configurada.

## 3. Alcance de la mejora

### Incluido

- Renombrar o agrupar el área administrativa como **Marketing y Campañas**.
- Conservar la gestión existente de promociones y extenderla para campañas.
- Generar una landing pública individual por `slug`.
- Configurar imagen principal o banner.
- Configurar CTA principal y secundario.
- Activar formularios opcionales.
- Previsualizar antes de publicar.
- Publicar y despublicar campañas.
- Registrar métricas básicas.
- Registrar leads.
- Configurar SEO y Open Graph para compartir en redes sociales.

### Fuera del alcance inicial

- Editor drag and drop complejo.
- Constructor visual tipo WordPress.
- Automatizaciones avanzadas.
- Integraciones pagadas de email marketing.
- IA generativa dentro del módulo.
- CRM completo.

## 4. Arquitectura propuesta

La evolución debe ampliar el módulo actual, no crear un sistema paralelo.

### Frontend público

| Ruta | Función |
|---|---|
| `/promociones` | Mantener el catálogo general existente. |
| `/promo/[slug]` | Renderizar la landing individual publicada. |

La landing debe usar el contenido de la campaña, imagen principal, CTA, formulario opcional, condiciones, ubicación o contacto. Debe generar metadatos SEO y Open Graph desde el servidor cuando sea posible.

### Frontend administrativo

- Cambiar la etiqueta visual de **Promociones** a **Marketing y Campañas** sin romper `/admin/promociones`.
- Extender el formulario actual con una sección **Landing pública**.
- Agregar acciones **Ver landing**, **Copiar enlace**, **Previsualizar**, **Publicar**, **Despublicar** y **Duplicar**.
- Mantener el calendario semanal, filtros y CRUD actuales.
- Agregar vistas simples para métricas y leads.

### Backend API pública

| Método | Endpoint | Función |
|---|---|---|
| `GET` | `/api/promociones` | Mantener el listado público actual. |
| `GET` | `/api/promociones/{slug}` | Consultar una campaña pública por slug. |
| `POST` | `/api/promociones/{slug}/lead` | Registrar un lead si el formulario está activo. |
| `POST` | `/api/promociones/{slug}/click` | Registrar un clic en CTA. |
| `POST` | `/api/promociones/{slug}/view` | Registrar una visita controlada. |

La consulta pública individual debe devolver únicamente campañas visibles: `landing_enabled = true`, `estado = activa`, `activa = true`, `published_at IS NOT NULL` y vigencia válida.

### Backend API administrativa

| Método | Endpoint | Función |
|---|---|---|
| `GET` | `/api/admin/promociones` | Mantener listado administrativo. |
| `POST` | `/api/admin/promociones` | Mantener alta y aceptar campos nuevos. |
| `GET` | `/api/admin/promociones/{id}` | Mantener detalle editable. |
| `PUT` | `/api/admin/promociones/{id}` | Mantener edición y aceptar campos nuevos. |
| `DELETE` | `/api/admin/promociones/{id}` | Mantener eliminación. |
| `POST` | `/api/admin/promociones/{id}/publish` | Publicar la campaña validada. |
| `POST` | `/api/admin/promociones/{id}/unpublish` | Despublicar sin borrar. |
| `POST` | `/api/admin/promociones/{id}/duplicate` | Duplicar como borrador con slug nuevo. |
| `GET` | `/api/admin/promociones/{id}/metrics` | Consultar métricas básicas. |
| `GET` | `/api/admin/promociones/{id}/leads` | Consultar leads protegidos. |
| `GET` | `/api/admin/promociones/{id}/leads.csv` | Exportar leads en CSV. |

### Base de datos

- Crear migraciones Laravel aditivas y reversibles.
- No eliminar ni renombrar campos existentes en la primera etapa.
- Mantener compatibilidad con promociones creadas antes de la mejora.
- Agregar índices para búsquedas públicas y administrativas.
- Confirmar el esquema real antes de ejecutar migraciones debido a la diferencia con `backend/database/mariadb/001_schema_pop_perote.sql`.

### Seguridad

- Mantener `auth:sanctum` y `role:admin` para operaciones administrativas.
- Aplicar validación estricta, sanitización y límites de frecuencia a endpoints públicos.
- No exponer leads, exportaciones ni métricas administrativas en rutas públicas.

### Métricas

- Registrar eventos simples por campaña: `view`, `cta_primary_click`, `cta_secondary_click` y `lead`.
- Mantener contadores agregados en `promociones` para consultas rápidas.
- Guardar eventos detallados en una tabla auxiliar para auditoría y análisis básico.
- Considerar bots, duplicados y límites de frecuencia al interpretar resultados.

## 5. Modelo de datos sugerido

### Nuevos campos en `promociones`

Agregar campos sin romper compatibilidad:

| Campo | Tipo sugerido | Uso |
|---|---|---|
| `slug` | `VARCHAR(250) NULL UNIQUE` | URL pública legible. Debe ser obligatorio al publicar. |
| `landing_enabled` | `BOOLEAN NOT NULL DEFAULT 0` | Activa la landing individual. |
| `landing_title` | `VARCHAR(255) NULL` | Título principal de landing. |
| `landing_subtitle` | `VARCHAR(500) NULL` | Subtítulo o beneficio breve. |
| `landing_content` | `TEXT NULL` | Contenido extendido sanitizado. |
| `landing_template` | `VARCHAR(50) NULL` | Plantilla controlada, no HTML arbitrario. |
| `cta_primary_text` | `VARCHAR(100) NULL` | Texto del CTA principal. |
| `cta_primary_url` | `VARCHAR(500) NULL` | URL validada del CTA principal. |
| `cta_secondary_text` | `VARCHAR(100) NULL` | Texto del CTA secundario. |
| `cta_secondary_url` | `VARCHAR(500) NULL` | URL validada del CTA secundario. |
| `form_enabled` | `BOOLEAN NOT NULL DEFAULT 0` | Activa formulario público. |
| `form_fields` | `JSON NULL` | Lista controlada de campos permitidos. |
| `seo_title` | `VARCHAR(255) NULL` | Título SEO. |
| `seo_description` | `VARCHAR(500) NULL` | Descripción SEO. |
| `og_image` | `VARCHAR(500) NULL` | Imagen para redes sociales. |
| `published_at` | `TIMESTAMP NULL` | Fecha de publicación. `NULL` significa no publicada. |
| `views_count` | `BIGINT UNSIGNED NOT NULL DEFAULT 0` | Total agregado de visitas. |
| `clicks_count` | `BIGINT UNSIGNED NOT NULL DEFAULT 0` | Total agregado de clics. |
| `leads_count` | `BIGINT UNSIGNED NOT NULL DEFAULT 0` | Total agregado de leads. |

Índices mínimos:

- Índice único para `slug`.
- Índice compuesto para `landing_enabled`, `activa`, `estado` y `published_at`.
- Índice para `published_at`.
- Conservar los campos de vigencia y días activos existentes.

### Tabla `promo_leads`

| Campo | Tipo sugerido | Notas |
|---|---|---|
| `id` | `BIGINT UNSIGNED` | Clave primaria. |
| `promocion_id` | `BIGINT UNSIGNED` | FK a `promociones`. |
| `nombre` | `VARCHAR(150) NULL` | Según configuración del formulario. |
| `telefono` | `VARCHAR(30) NULL` | Normalizar y validar longitud. |
| `email` | `VARCHAR(191) NULL` | Validar formato. |
| `mensaje` | `TEXT NULL` | Sanitizar. |
| `origen` | `VARCHAR(100) NULL` | Red, anuncio o referencia declarada. |
| `created_at` | `TIMESTAMP` | Fecha de registro. |

Agregar índice para `promocion_id, created_at`.

### Tabla `promo_events`

| Campo | Tipo sugerido | Notas |
|---|---|---|
| `id` | `BIGINT UNSIGNED` | Clave primaria. |
| `promocion_id` | `BIGINT UNSIGNED` | FK a `promociones`. |
| `event_type` | `VARCHAR(50)` | `view`, clic o `lead`. |
| `ip_hash` | `VARCHAR(64) NULL` | Hash no reversible; no guardar IP directa. |
| `user_agent` | `VARCHAR(500) NULL` | Limitar longitud. |
| `referrer` | `VARCHAR(500) NULL` | Limitar longitud y sanitizar. |
| `created_at` | `TIMESTAMP` | Fecha del evento. |

Agregar índices para `promocion_id, event_type, created_at` y para análisis por fecha.

## 6. Fases de implementación

### Fase 1 — Base de landing pages

- Crear `slug`.
- Agregar `landing_enabled`.
- Crear página pública `/promo/[slug]`.
- Crear endpoint público por slug.
- Agregar botón **Ver landing**.
- Agregar botón **Copiar enlace**.
- Validar que solo promociones activas, publicadas y vigentes se vean públicamente.

### Fase 2 — Editor de contenido y CTA

- Agregar campos de landing.
- Configurar CTA principal.
- Configurar CTA secundario.
- Permitir URL hacia FoodBooking, WhatsApp, menú, ubicación o URL externa validada.
- Agregar vista previa.
- Renderizar la imagen cargada en la landing.

### Fase 3 — Formularios y leads

- Crear tabla `promo_leads`.
- Agregar formulario público opcional.
- Guardar leads.
- Agregar panel administrativo para ver leads.
- Agregar exportación básica CSV.

### Fase 4 — Métricas

- Crear tabla `promo_events`.
- Registrar vistas.
- Registrar clics.
- Registrar envíos de formulario.
- Mostrar métricas en el panel.
- Calcular conversión básica: clics por visita y leads por visita.

### Fase 5 — Pulido, SEO y seguridad

- Agregar SEO title.
- Agregar SEO description.
- Agregar Open Graph image.
- Validar slugs.
- Aplicar rate limiting.
- Sanitizar contenido.
- Agregar tests.
- Revisar responsive.
- Eliminar URL absoluta hardcodeada en la página pública general.

## 7. Reglas de seguridad

- [ ] Validar rol `admin` en endpoints protegidos.
- [ ] No permitir publicar campañas sin slug válido y único.
- [ ] Sanitizar contenido HTML si se permite texto enriquecido.
- [ ] Preferir plantillas controladas y texto estructurado sobre HTML libre.
- [ ] Validar URLs externas y permitir únicamente protocolos seguros.
- [ ] Evitar XSS en títulos, descripciones, CTA y formularios.
- [ ] Aplicar rate limit a formularios y endpoints públicos de métricas.
- [ ] No exponer leads en endpoints públicos.
- [ ] Proteger métricas y exportaciones.
- [ ] Usar CSRF y Sanctum según corresponda al mecanismo de autenticación.
- [ ] Validar tamaño y tipo de imágenes.
- [ ] Evitar subir archivos ejecutables.
- [ ] No guardar IP directa; usar hash si se registra analítica.
- [ ] Aplicar principio de mínimo privilegio.
- [ ] Escapar fórmulas peligrosas al exportar CSV para evitar CSV injection.

## 8. Reglas de calidad de código

- [ ] Mantener nombres consistentes en español dentro del dominio del proyecto.
- [ ] No duplicar lógica de promociones.
- [ ] Reutilizar el modelo, CRUD, `ImageUpload` y upload administrativo existentes.
- [ ] Separar componentes administrativos, componentes públicos y lógica API.
- [ ] Evitar hardcodear URLs absolutas si existe `NEXT_PUBLIC_API_URL`.
- [ ] Mantener compatibilidad con promociones existentes.
- [ ] No romper `/promociones`.
- [ ] Usar migraciones reversibles.
- [ ] Agregar índices a `slug`, estado y `published_at`.
- [ ] Manejar estados vacíos, loading y errores.
- [ ] Mantener diseño alineado al estilo visual de POP PEROTE.
- [ ] Confirmar y reconciliar la diferencia entre migraciones Laravel y el SQL histórico antes de desplegar.
- [ ] Usar `next/image` con dimensiones definidas al implementar imágenes nuevas.

## 9. Pruebas requeridas

### Backend

- [ ] Crear promoción con landing desactivada.
- [ ] Crear promoción con landing activada.
- [ ] Validar slug único.
- [ ] Consultar promoción pública por slug.
- [ ] No mostrar promoción pausada.
- [ ] No mostrar promoción finalizada.
- [ ] No mostrar landing despublicada.
- [ ] No mostrar promoción fuera de vigencia.
- [ ] Guardar lead correctamente.
- [ ] Rechazar lead si el formulario está desactivado.
- [ ] Aplicar rate limit.
- [ ] Registrar clic.
- [ ] Registrar vista.
- [ ] Validar permisos administrativos.
- [ ] Exportar CSV sin ejecutar fórmulas inyectadas.

### Frontend

- [ ] Renderizar listado administrativo.
- [ ] Crear y editar campaña.
- [ ] Previsualizar landing.
- [ ] Copiar enlace.
- [ ] Renderizar landing pública.
- [ ] Mostrar CTA correctamente.
- [ ] Enviar formulario.
- [ ] Mostrar errores de validación.
- [ ] Manejar loading, error y estado vacío.
- [ ] Verificar comportamiento responsive.

## 10. Criterios de aceptación

- [ ] El administrador puede crear una campaña.
- [ ] Puede activar landing.
- [ ] Puede subir imagen.
- [ ] Puede configurar CTA.
- [ ] Puede previsualizar.
- [ ] Puede publicar y despublicar.
- [ ] Se genera una URL pública.
- [ ] La URL pública carga correctamente.
- [ ] La URL no expone campañas pausadas, finalizadas, despublicadas o fuera de vigencia.
- [ ] Se pueden guardar leads si el formulario está activo.
- [ ] Las métricas básicas se registran.
- [ ] No se rompe el módulo de promociones existente.
- [ ] `/promociones` sigue funcionando.
- [ ] Los tests principales pasan.

## 11. Riesgos técnicos

| Riesgo | Mitigación |
|---|---|
| Duplicar funcionalidades existentes | Extender el CRUD actual y compartir servicios. |
| Romper promociones actuales | Usar migraciones aditivas, valores por defecto y pruebas de regresión. |
| Diferencias entre esquema real y SQL histórico | Confirmar base desplegada y reconciliar la referencia antes de migrar. |
| Slugs duplicados | Índice único, normalización y validación al publicar. |
| XSS por contenido editable | Sanitización, escape de salida y plantillas controladas. |
| Spam en formularios públicos | Rate limit, honeypot opcional y validaciones. |
| Imágenes pesadas | Mantener límites, optimizar y usar `next/image`. |
| Métricas inexactas por bots | Rate limit, deduplicación básica y análisis prudente. |
| URLs externas maliciosas | Validar protocolos y aplicar allowlist cuando corresponda. |
| Degradación de rendimiento | Índices, contadores agregados y límites de consulta. |
| URL pública hardcodeada | Centralizar consumo de API con configuración de entorno. |

## 12. Recomendación de implementación

Implementar primero la **Fase 1** y la **Fase 2**. Estas fases entregan el valor principal: landings individuales compartibles, publicación controlada, imagen y CTA configurables, sin introducir todavía complejidad operativa por formularios o analítica detallada.

Después de validar uso real y estabilidad, avanzar a leads y métricas en la **Fase 3** y la **Fase 4**. Cerrar con SEO, seguridad y pruebas de regresión en la **Fase 5**.
