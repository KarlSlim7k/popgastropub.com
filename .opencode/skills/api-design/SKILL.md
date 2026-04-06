---
name: api-design
description: REST API design patterns and conventions for the Laravel backend of the POP Perote platform. Use when creating new API endpoints, defining response formats, handling errors, or reviewing API consistency. Covers naming conventions, HTTP methods, status codes, Sanctum authentication, and Laravel API patterns.
---

# REST API Design — POP Perote (Laravel Backend)

Convenciones para la API en Laravel. Base URL: `/api/v1`.

## Arquitectura del Router

```
routes/api.php                     ← registro de rutas API
app/Http/Controllers/              ← controladores de la API
app/Http/Resources/                ← API Resources (formato de respuesta)
app/Http/Middleware/               ← middleware (auth, CORS, rate limit)
app/Models/                        ← Eloquent models
app/Services/                      ← lógica de negocio (PAC, WhatsApp, etc.)
app/Jobs/                          ← colas de trabajo (facturación, notificaciones)
config/cors.php                    ← configuración CORS
config/sanctum.php                 ← configuración de autenticación
```

---

## 1. Convenciones de Nomenclatura

```
GET    /recursos              → listar colección (plural)
GET    /recursos/{id}         → obtener uno
POST   /recursos              → crear nuevo
PUT    /recursos/{id}         → actualizar completo
PATCH  /recursos/{id}         → actualizar parcial
DELETE /recursos/{id}         → eliminar

# Recursos anidados
GET    /pedidos/{id}/items    → items de un pedido
GET    /platillos/{id}/extras → extras de un platillo

# Acciones especiales (usar sustantivos, no verbos)
POST   /auth/login                    ✅
POST   /auth/logout                   ✅
POST   /auth/forgot-password          ✅
POST   /auth/reset-password           ✅
POST   /usuarios/{id}/activar         ✅
GET    /health                        ✅
```

**Reglas:**
- Siempre en **kebab-case** y **español** para rutas del dominio
- Sin trailing slash: `/pedidos` no `/pedidos/`
- Prefijo de versión en `routes/api.php` o RouteServiceProvider: `/api/v1/`
- Rutas públicas sin middleware de auth, rutas protegidas con `auth:sanctum`

---

## 2. Registro de Rutas en `routes/api.php`

```php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PedidoController;
use App\Http\Controllers\Api\PuntoController;
use App\Http\Controllers\Api\FacturaController;
use App\Http\Controllers\Api\MeseroController;
use Illuminate\Support\Facades\Route;

// ── PÚBLICAS (sin auth) ───────────────────────────────────────────────
Route::get('/health', fn() => response()->json(['status' => 'ok']));
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);

// ── PLATILLOS Y MENÚ (públicos para lectura) ──────────────────────────
Route::get('/platillos', [PlatilloController::class, 'index']);
Route::get('/platillos/{id}', [PlatilloController::class, 'show']);
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/promociones', [PromocionController::class, 'index']);
Route::get('/promociones/{id}', [PromocionController::class, 'show']);

// ── PROTEGIDAS — requieren Sanctum ────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/usuario/perfil', [AuthController::class, 'perfil']);
    Route::put('/usuario/perfil', [AuthController::class, 'actualizarPerfil']);

    // Pedidos
    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::get('/pedidos/{id}', [PedidoController::class, 'show']);
    Route::post('/pedidos', [PedidoController::class, 'store']);

    // POP Points
    Route::get('/puntos/mis-puntos', [PuntoController::class, 'misPuntos']);
    Route::get('/puntos/historial', [PuntoController::class, 'historial']);
    Route::post('/puntos/checkin', [PuntoController::class, 'checkin']);
    Route::get('/beneficios', [BeneficioController::class, 'index']);
    Route::post('/beneficios/{id}/canjear', [BeneficioController::class, 'canjear']);

    // Facturación
    Route::get('/facturas', [FacturaController::class, 'index']);
    Route::get('/facturas/{id}', [FacturaController::class, 'show']);
    Route::post('/facturas', [FacturaController::class, 'store']);

    // Mis facturas
    Route::get('/mis-facturas', [FacturaController::class, 'misFacturas']);
});

// ── ADMIN — requieren rol admin ───────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('admin/platillos', Admin\PlatilloController::class);
    Route::apiResource('admin/promociones', Admin\PromocionController::class);
    Route::apiResource('admin/usuarios', Admin\UsuarioController::class);
    Route::apiResource('admin/meseros', Admin\MeseroController::class);
    Route::get('/admin/dashboard', [Admin\DashboardController::class, 'index']);
    Route::get('/admin/facturas', [Admin\FacturaController::class, 'index']);
    Route::post('/admin/facturas/{id}/timbrar', [Admin\FacturaController::class, 'timbrar']);
    Route::post('/admin/facturas/{id}/cancelar', [Admin\FacturaController::class, 'cancelar']);
});

// ── MESERO — requieren rol mesero o admin ─────────────────────────────
Route::middleware(['auth:sanctum', 'role:mesero,admin'])->group(function () {
    Route::get('/mesero/ranking', [MeseroController::class, 'ranking']);
    Route::get('/mesero/mi-ranking', [MeseroController::class, 'miRanking']);
    Route::get('/mesero/historial', [MeseroController::class, 'historial']);
    Route::post('/mesero/registrar-venta', [MeseroController::class, 'registrarVenta']);
});
```

---

## 3. Formato de Respuesta Estandarizado

Usar **API Resources** de Laravel:

```php
// app/Http/Resources/PlatilloResource.php
class PlatilloResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'nombre'      => $this->nombre,
            'descripcion' => $this->descripcion,
            'precio'      => $this->precio,
            'categoria'   => $this->categoria?->nombre,
            'imagen_url'  => $this->imagen_url,
            'mas_vendido' => $this->mas_vendido,
            'nuevo'       => $this->nuevo,
            'activo'      => $this->activo,
        ];
    }
}

// En el controller:
return response()->json([
    'success' => true,
    'data'    => PlatilloResource::collection($platillos),
    'meta'    => [
        'pagina'        => $pagina,
        'total'         => $total,
        'por_pagina'    => $porPagina,
        'total_paginas' => $totalPaginas,
    ],
]);

// Recurso individual
return response()->json([
    'success' => true,
    'data'    => new PlatilloResource($platillo),
]);

// Recurso creado
return response()->json([
    'success' => true,
    'data'    => new PlatilloResource($platillo),
    'message' => 'Platillo creado exitosamente',
], 201);

// Error de validación (Laravel lo hace automático con FormRequest)
// Status 422 con:
{
    "message": "Los datos proporcionados no son válidos.",
    "errors": {
        "nombre": ["El nombre es obligatorio."],
        "precio": ["El precio debe ser un número positivo."]
    }
}

// Error genérico
return response()->json([
    'success' => false,
    'error'   => 'No autorizado',
], 401);

// Sin contenido (DELETE exitoso)
return response()->noContent();
```

---

## 4. HTTP Status Codes

| Situación | Código |
|-----------|--------|
| OK (GET, PUT) | `200` |
| Creado (POST) | `201` |
| Sin contenido (DELETE) | `204` |
| Request inválido | `400` |
| No autenticado (sin token) | `401` |
| Sin permiso (rol incorrecto) | `403` |
| No encontrado | `404` |
| Conflicto (email ya registrado) | `409` |
| Validación fallida | `422` |
| Rate limit | `429` |
| Error del servidor | `500` |

---

## 5. Patrón de Controlador

```php
// app/Http/Controllers/Api/PedidoController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PedidoResource;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    /**
     * GET /api/v1/pedidos
     *
     * Query params:
     *   pagina  (int)    Número de página, default 1
     *   q       (string) Búsqueda por folio
     *
     * Requiere: auth:sanctum (cualquier rol)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $pagina = max(1, (int) $request->query('pagina', 1));
        $busqueda = $request->query('q', '');
        $porPagina = 20;

        $query = Pedido::where('usuario_id', $user->id)
            ->with(['items.platillo'])
            ->orderBy('creado_en', 'desc');

        if ($busqueda) {
            $query->where('folio', 'like', "%{$busqueda}%");
        }

        $total = $query->count();
        $pedidos = $query->skip(($pagina - 1) * $porPagina)
            ->take($porPagina)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => PedidoResource::collection($pedidos),
            'meta'    => [
                'pagina'        => $pagina,
                'total'         => $total,
                'por_pagina'    => $porPagina,
                'total_paginas' => (int) ceil($total / $porPagina),
            ],
        ]);
    }

    /**
     * GET /api/v1/pedidos/{id}
     *
     * Requiere: auth:sanctum
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $pedido = Pedido::with(['items.platillo'])->find($id);

        if (!$pedido) {
            return response()->json([
                'success' => false,
                'error'   => 'Pedido no encontrado',
            ], 404);
        }

        // Verificar que pertenece al usuario
        if ($pedido->usuario_id !== $user->id && $user->rol !== 'admin') {
            return response()->json([
                'success' => false,
                'error'   => 'No tienes permiso para ver este pedido',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data'    => new PedidoResource($pedido),
        ]);
    }
}
```

---

## 6. Validación con FormRequest

```php
// app/Http/Requests/StorePedidoRequest.php
class StorePedidoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items'            => 'required|array|min:1',
            'items.*.platillo_id' => 'required|exists:platillos,id',
            'items.*.cantidad' => 'required|integer|min:1|max:50',
            'items.*.extras'   => 'nullable|array',
            'tipo_entrega'     => 'required|in:domicilio,recoger',
            'direccion'        => 'required_if:tipo_entrega,domicilio|string|max:500',
            'notas'            => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required'           => 'Debes agregar al menos un platillo',
            'items.*.platillo_id.exists' => 'Uno o más platillos no existen',
            'items.*.cantidad.min'     => 'La cantidad mínima es 1',
            'direccion.required_if'    => 'La dirección es obligatoria para entrega a domicilio',
        ];
    }
}
```

---

## 7. Middleware de Rol

```php
// app/Http/Middleware/CheckRole.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();

        if (!$user || !in_array($user->rol, $roles)) {
            return response()->json([
                'success' => false,
                'error'   => 'No tienes permiso para acceder a este recurso',
            ], 403);
        }

        return $next($request);
    }
}

// Registrar en bootstrap/app.php o RouteServiceProvider
// ->middleware('role:admin')
// ->middleware('role:mesero,admin')
```

---

## 8. Documentación de Endpoint (formato PHPDoc)

```php
/**
 * GET /api/v1/pedidos
 *
 * Query params:
 *   pagina  (int)    Número de página, default 1
 *   q       (string) Búsqueda por folio
 *
 * Response 200:
 *   { success: true, data: Pedido[], meta: { pagina, total, total_paginas } }
 *
 * Requiere: auth:sanctum (cualquier rol)
 */
public function index(Request $request)
```

---

## 9. Checklist de Nuevo Endpoint

Antes de hacer commit de un nuevo endpoint:

- [ ] Ruta registrada en `routes/api.php` con middleware correcto
- [ ] Método HTTP correcto (GET para lectura, POST para crear, etc.)
- [ ] `auth:sanctum` aplicado si es protegido
- [ ] Middleware de rol si aplica
- [ ] Input validado con FormRequest o `$request->validate()`
- [ ] Parámetros de URL/query sanitizados
- [ ] Consultas SQL con Eloquent/Query Builder (no raw SQL salvo necesidad)
- [ ] Respuesta usa API Resource o `response()->json()`
- [ ] Status code correcto (201 para creación, 204 para delete sin body)
- [ ] Errores loggeados con `Log::error()`, no expuestos al cliente
- [ ] Probado con `curl` o Postman en development
