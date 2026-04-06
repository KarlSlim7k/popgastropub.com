---
name: sql-expert
description: Expert SQL query writing, optimization, and database schema design for MySQL/MariaDB (POP Perote production database on Hostinger). Use when working with the database for complex queries, slow query optimization, schema migrations, index creation, or debugging SQL errors. Covers JOINs, CTEs, window functions, EXPLAIN plans, and Laravel Eloquent patterns.
license: MIT — https://github.com/QuestForTech-Investments/claude-code-skills
---

# SQL Expert Skill — MySQL/MariaDB (POP Perote)

Expert guidance para escribir, optimizar y gestionar la base de datos MySQL/MariaDB del proyecto POP Perote.

**Base de datos:** MySQL/MariaDB (Hostinger)
**Acceso:** Eloquent ORM (Laravel)
**Charset:** utf8mb4

---

## Core Capabilities

- **Escribir queries complejas** con JOINs, subqueries, CTEs y window functions
- **Optimizar queries lentas** con EXPLAIN plans e índices
- **Diseñar schemas** con normalización correcta
- **Crear índices efectivos** para rendimiento
- **Escribir migraciones** seguras con rollback
- **Depurar errores SQL** y mensajes de error
- **Manejar transacciones** con isolation levels correctos

---

## Query Writing

### SELECT con JOINs

```sql
-- INNER JOIN — solo filas coincidentes
SELECT u.id, u.nombre, u.email, u.telefono, u.nivel
FROM usuarios u
WHERE u.activo = 1 AND u.rol = 'cliente';

-- LEFT JOIN — todos los usuarios, aunque no tengan puntos
SELECT u.nombre, COALESCE(SUM(p.cantidad), 0) AS puntos_totales
FROM usuarios u
LEFT JOIN puntos p ON p.usuario_id = u.id
WHERE u.activo = 1
GROUP BY u.id, u.nombre;
```

### Eloquent equivalente

```php
// Con Eloquent
$usuarios = Usuario::withCount('puntos')
    ->where('activo', true)
    ->where('rol', 'cliente')
    ->get();

// Con Query Builder
$puntosTotales = DB::table('usuarios as u')
    ->leftJoin('puntos as p', 'p.usuario_id', '=', 'u.id')
    ->where('u.activo', true)
    ->selectRaw('u.nombre, COALESCE(SUM(p.cantidad), 0) as puntos_totales')
    ->groupBy('u.id', 'u.nombre')
    ->get();
```

### CTEs (Common Table Expressions)

```sql
-- Usuarios con más visitas en el último mes
WITH visitas_recientes AS (
    SELECT usuario_id, COUNT(*) AS visitas_mes
    FROM puntos
    WHERE tipo = 'checkin'
      AND creado_en >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
    GROUP BY usuario_id
),
top_clientes AS (
    SELECT usuario_id, visitas_mes,
           ROW_NUMBER() OVER (ORDER BY visitas_mes DESC) AS rank_posicion
    FROM visitas_recientes
    WHERE visitas_mes > 3
)
SELECT u.nombre, u.email, tc.visitas_mes, tc.rank_posicion
FROM usuarios u
INNER JOIN top_clientes tc ON tc.usuario_id = u.id
ORDER BY tc.rank_posicion;
```

### Window Functions

```sql
-- Ranking de meseros por puntos de bebidas
SELECT
    m.nombre,
    v.puntos_mes,
    ROW_NUMBER() OVER (ORDER BY v.puntos_mes DESC) AS posicion,
    RANK()       OVER (ORDER BY v.puntos_mes DESC) AS posicion_con_empates
FROM meseros m
INNER JOIN ranking_meseros v ON v.mesero_id = m.id
WHERE m.activo = 1 AND v.periodo = '2026-04';

-- Puntos acumulados por semana
SELECT
    DATE(creado_en) AS fecha,
    SUM(cantidad) AS puntos_semana,
    SUM(SUM(cantidad)) OVER (ORDER BY DATE(creado_en)) AS puntos_acumulados
FROM puntos
WHERE usuario_id = ?
GROUP BY DATE(creado_en)
ORDER BY fecha;
```

---

## Optimización de Queries

### Usar EXPLAIN en MySQL

```php
// En Laravel — solo en desarrollo
$plan = DB::select("EXPLAIN SELECT u.*, p.puntos_actuales
    FROM usuarios u
    LEFT JOIN puntos p ON p.usuario_id = u.id
    WHERE u.activo = 1 AND u.rol = 'cliente'");

Log::info(json_encode($plan));
```

**Señales de alerta en EXPLAIN:**
- `type: ALL` → Full table scan → necesita índice
- `type: ref` o `eq_ref` → bien indexado
- `rows` muy alto → filtro no efectivo
- `Extra: Using filesort` → ORDER BY sin índice apropiado

### Tips Rápidos de Optimización

```sql
-- ❌ MALO: Función en columna indexada (invalida el índice)
SELECT * FROM usuarios WHERE LOWER(email) = 'user@example.com';

-- ✅ BUENO: Mantener columna limpia
SELECT * FROM usuarios WHERE email = LOWER('user@example.com');

-- ❌ MALO: SELECT * en tabla grande
SELECT * FROM pedidos WHERE id = 5;

-- ✅ BUENO: Solo columnas necesarias
SELECT id, folio, total, estado, creado_en FROM pedidos WHERE id = 5;
```

### Problema N+1 — Usar Eager Loading

```php
// ❌ N+1: un query por fila
$pedidos = Pedido::where('estado', 'completado')->get();
foreach ($pedidos as $pedido) {
    $items = $pedido->items; // Query por cada pedido
}

// ✅ Un solo query con eager loading
$pedidos = Pedido::with(['items.platillo'])
    ->where('estado', 'completado')
    ->get();
```

---

## Índices — Estrategia para POP Perote

```php
// En migraciones de Laravel

// Usuarios (consulta más frecuente: por email y activo)
$table->index(['rol', 'activo']);
$table->unique('email');
$table->index('telefono');

// Pedidos (listado por usuario y fecha)
$table->index(['usuario_id', 'creado_en']);
$table->index('estado');
$table->index('folio');

// Puntos (acumulación por usuario)
$table->index(['usuario_id', 'creado_en']);
$table->index('tipo');

// Facturas (búsqueda por RFC y estado)
$table->index('rfc');
$table->index('estado');
$table->index(['usuario_id', 'fecha_solicitud']);

// Ranking meseros (por periodo)
$table->index(['mesero_id', 'periodo']);

// Verificar índices existentes
SHOW INDEX FROM usuarios;
```

**Cuándo crear índices:**
- ✅ Columnas en cláusulas WHERE frecuentes
- ✅ Columnas en JOINs (foreign keys)
- ✅ Columnas en ORDER BY
- ❌ Tablas pequeñas (< 1000 filas)
- ❌ Columnas con baja selectividad (booleanos)
- ❌ Columnas actualizadas muy frecuentemente

---

## Paginación Eficiente

```php
// Laravel ya optimiza la paginación automáticamente
$pedidos = Pedido::where('usuario_id', $userId)
    ->orderBy('creado_en', 'desc')
    ->paginate(20);

// Con cursor pagination (mejor rendimiento para tablas grandes)
$pedidos = Pedido::where('usuario_id', $userId)
    ->orderBy('creado_en', 'desc')
    ->cursorPaginate(20);
```

---

## Migraciones Seguras

```bash
# Con Laravel
php artisan make:migration add_ultimo_acceso_to_usuarios
php artisan migrate
```

### UPSERT en MySQL

```php
// INSERT ... ON DUPLICATE KEY UPDATE
DB::statement("
    INSERT INTO ranking_meseros (mesero_id, periodo, puntos)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
        puntos = puntos + VALUES(puntos),
        updated_at = NOW()
", [$meseroId, $periodo, $puntos]);

// Con Laravel upsert
DB::table('ranking_meseros')->upsert([
    ['mesero_id' => $meseroId, 'periodo' => $periodo, 'puntos' => $puntos],
], ['mesero_id', 'periodo'], ['puntos']);
```

---

## Transacciones

```php
// Operaciones que deben ser atómicas
DB::transaction(function () use ($userId, $total, $items) {
    // 1. Crear pedido
    $pedido = Pedido::create([
        'usuario_id' => $userId,
        'total' => $total,
        'items' => json_encode($items),
    ]);

    // 2. Acumular puntos
    $puntosGanados = floor($total / 10);
    Punto::create([
        'usuario_id' => $userId,
        'tipo' => 'pedido',
        'cantidad' => $puntosGanados,
        'pedido_id' => $pedido->id,
        'descripcion' => "Pedido #{$pedido->folio}",
    ]);

    // 3. Actualizar puntos totales del usuario
    Usuario::where('id', $userId)
        ->increment('puntos_actuales', $puntosGanados);
});
```

---

## Patrones Avanzados

### CTEs Recursivas (Jerarquías)

```sql
-- Categorías y subcategorías de menú
WITH RECURSIVE categorias_tree AS (
    SELECT id, nombre, padre_id, 0 AS nivel, orden
    FROM categorias_menu
    WHERE padre_id IS NULL

    UNION ALL

    SELECT cm.id, cm.nombre, cm.padre_id, ct.nivel + 1, cm.orden
    FROM categorias_menu cm
    INNER JOIN categorias_tree ct ON ct.id = cm.padre_id
)
SELECT * FROM categorias_tree ORDER BY nivel, orden;
```

### JSON en MySQL

```php
// Guardar y consultar configuración JSON
DB::table('configuracion')
    ->where('clave', 'preferencias')
    ->update([
        'valor' => DB::raw("JSON_SET(valor, '$.tema', '\"oscuro\"')")
    ]);

// Extraer campo de JSON
$tema = DB::table('configuracion')
    ->where('clave', 'preferencias')
    ->value(DB::raw("JSON_EXTRACT(valor, '$.tema')"));

// Buscar en JSON
$pedidos = DB::table('pedidos')
    ->whereRaw('JSON_LENGTH(items) > 5')
    ->get();
```

---

## Buenas Prácticas

1. **Siempre prepared statements** — Eloquent lo hace automáticamente
2. **Transacciones para operaciones relacionadas** — garantiza atomicidad
3. **Usar DECIMAL para dinero** — nunca FLOAT
4. **Incluir timestamps** — `created_at`, `updated_at` en todas las tablas
5. **VARCHAR en lugar de CHAR** para longitud variable
6. **IS NULL / IS NOT NULL** — nunca `= NULL`
7. **Índices en foreign keys** — siempre
8. **LIMIT en queries exploratorias** — tablas grandes pueden ser lentas sin LIMIT
9. **No SELECT *** — especificar columnas necesarias
10. **Charset utf8mb4** — necesario para emojis y caracteres especiales en español
