---
name: database-designer
description: Use when designing new database schemas, planning data migrations, optimizing existing schema, modeling data relationships, or choosing between normalization strategies for the MySQL/MariaDB database of POP Perote. Covers normalization, index strategies, zero-downtime migrations, and schema evolution with Laravel Migrations and Eloquent ORM.
license: MIT — https://github.com/alirezarezvani/claude-skills
---

# Database Designer — MySQL/MariaDB (POP Perote)

Skill para diseño experto de esquemas de base de datos, migraciones y optimización para el proyecto POP Perote.

**Motor:** MySQL/MariaDB (Hostinger) | **Charset:** utf8mb4 | **ORM:** Eloquent (Laravel)
**Archivos de migraciones:** `database/migrations/YYYY_MM_DD_HHMMSS_descripcion.php`

---

## Principios de Diseño de Schema

### Normalización

**Primera Forma Normal (1NF):** Valores atómicos, sin grupos repetidos

```php
// ❌ MAL: roles como lista separada por comas
Schema::create('usuarios', function (Blueprint $table) {
    $table->string('roles'); // 'cliente,admin'
});

// ✅ BIEN: ENUM o columna separada
Schema::create('usuarios', function (Blueprint $table) {
    $table->enum('rol', ['cliente', 'mesero', 'admin'])->default('cliente');
});
```

**Segunda Forma Normal (2NF):** Atributos no-clave dependen de toda la PK

```php
// ❌ MAL: nombre del platillo en tabla de items de pedido
Schema::create('pedido_items', function (Blueprint $table) {
    $table->string('nombre_platillo'); // ← depende solo de platillo_id
});

// ✅ BIEN: nombre del platillo en su tabla
Schema::create('pedido_items', function (Blueprint $table) {
    $table->foreignId('platillo_id')->constrained();
    $table->integer('cantidad')->default(1);
    $table->decimal('precio_unitario', 10, 2);
});
```

**Tercera Forma Normal (3NF):** Sin dependencias transitivas

---

## Patrones de Schema para POP Perote

### Relación Uno-a-Muchos

```php
// Usuarios → Puntos
Schema::create('puntos', function (Blueprint $table) {
    $table->id();
    $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
    $table->string('tipo', 50); // 'pedido', 'checkin', 'referido', 'cumpleanos'
    $table->integer('cantidad');
    $table->text('descripcion')->nullable();
    $table->foreignId('pedido_id')->nullable()->constrained('pedidos')->onDelete('set null');
    $table->timestamps();

    $table->index('usuario_id');
    $table->index('creado_en');
});
```

### Relación Muchos-a-Muchos

```php
// Usuarios ↔ Beneficios (canjes)
Schema::create('canjes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
    $table->foreignId('beneficio_id')->constrained('beneficios');
    $table->integer('puntos_costo');
    $table->string('estado', 20)->default('pendiente'); // pendiente, canjeado, usado, expirado
    $table->timestamp('canjeado_en')->useCurrent();
    $table->timestamp('usado_en')->nullable();

    $table->index('usuario_id');
    $table->index('estado');
});
```

### Tabla de Auditoría

```php
Schema::create('auditoria_log', function (Blueprint $table) {
    $table->id();
    $table->foreignId('usuario_id')->nullable()->constrained('usuarios')->onDelete('set null');
    $table->string('accion', 100);
    $table->string('tabla', 100);
    $table->unsignedBigInteger('registro_id')->nullable();
    $table->json('datos_antes')->nullable();
    $table->json('datos_despues')->nullable();
    $table->string('ip', 45)->nullable();
    $table->timestamps();

    $table->index('usuario_id');
    $table->index(['tabla', 'registro_id']);
    $table->index('creado_en');
});
```

### Tabla de Configuración Key-Value

```php
Schema::create('configuracion', function (Blueprint $table) {
    $table->id();
    $table->string('clave', 100)->unique();
    $table->json('valor');
    $table->string('descripcion', 500)->nullable();
    $table->timestamps();
});

// Ejemplos de uso
DB::table('configuracion')->insert([
    ['clave' => 'puntos_por_pesos', 'valor' => json_encode(['ratio' => 1, 'cada' => 10])],
    ['clave' => 'puntos_checkin', 'valor' => json_encode(25)],
    ['clave' => 'puntos_cumpleanos', 'valor' => json_encode(150)],
]);
```

---

## Estrategia de Índices

### Tipos de Índices en MySQL/MariaDB

```php
// B-tree (default) — igualdad, rango, ORDER BY
$table->index('email');

// Índice compuesto — el orden importa (columna más selectiva primero)
$table->index(['usuario_id', 'creado_en']);

// Índice único — enforce unicidad + mejora rendimiento
$table->unique('email');

// Índice parcial (MySQL 8.0.13+)
// Para filtrar solo activos:
$table->index(['activo', 'orden']);
```

### Índices Críticos para POP Perote

```php
// Usuarios
$table->index(['rol', 'activo']);
$table->unique('email');
$table->index('telefono');

// Pedidos
$table->index(['usuario_id', 'creado_en']);
$table->index('estado');
$table->index('folio');

// Puntos
$table->index(['usuario_id', 'creado_en']);
$table->index('tipo');

// Facturas
$table->index('rfc');
$table->index('estado');
$table->index(['usuario_id', 'fecha_solicitud']);

// Ranking meseros
$table->index(['mesero_id', 'periodo']);
```

---

## Migraciones con Laravel

```bash
# Generar migración
php artisan make:migration create_puntos_table

# Ejecutar migraciones
php artisan migrate

# Rollback último lote
php artisan migrate:rollback

# Rollback específico
php artisan migrate:rollback --step=3

# Reset total (cuidado en producción)
php artisan migrate:reset
```

### Patrón de migración segura

```php
// Fase 1: Agregar columna nullable (no bloquea tabla)
Schema::table('usuarios', function (Blueprint $table) {
    $table->timestamp('ultimo_acceso')->nullable();
});

// Fase 2: Rellenar en lotes (para tablas grandes)
// En un comando o seeder:
$affected = 1;
while ($affected > 0) {
    $affected = DB::update(
        "UPDATE usuarios SET ultimo_acceso = updated_at WHERE ultimo_acceso IS NULL LIMIT 500"
    );
}

// Fase 3: Hacer NOT NULL
Schema::table('usuarios', function (Blueprint $table) {
    $table->timestamp('ultimo_acceso')->nullable(false)->default(now())->change();
});
```

---

## Modelado de Datos — Decisiones de Diseño

### MySQL/MariaDB para POP Perote

**Usar tablas relacionales para:**
- Datos relacionales: usuarios, puntos, pedidos, beneficios, meseros, ranking
- Transacciones que requieren ACID (canjes, acumulación de puntos)
- Queries complejas con JOINs (dashboards, reportes)

**Usar columna JSON para:**
- Configuración de usuario (preferencias, notificaciones)
- Items de pedido (estructura variable con extras)
- Metadatos de promociones
- Historial de ventas de bebidas por mesero

```php
// JSON para items de pedido (estructura flexible)
Schema::table('pedidos', function (Blueprint $table) {
    $table->json('items')->nullable();
});

// Consultar dentro de JSON
$pedidos = DB::table('pedidos')
    ->whereJsonContains('items', ['platillo_id' => 5])
    ->get();

// Extraer campo de JSON
$pedidos = DB::table('pedidos')
    ->select('id', DB::raw("JSON_EXTRACT(items, '$[0].nombre') as primer_item"))
    ->get();
```

---

## Mejores Prácticas para este Stack

1. **ENGINE=InnoDB** siempre — soporte de transacciones y foreign keys
2. **utf8mb4** en todas las tablas — soporte completo de emojis y español
3. **ON DELETE CASCADE** para datos dependientes (puntos, canjes)
4. **ON DELETE SET NULL** para referencias opcionales
5. **TIMESTAMP DEFAULT CURRENT_TIMESTAMP** para `creado_en`
6. **TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP** para `updated_at`
7. **DECIMAL(10,2)** para precios, nunca FLOAT
8. **TINYINT(1)** para booleanos (`activo`, `completado`)
9. **INDEX en todas las foreign keys** — MySQL no las crea automáticamente
10. **Backup antes de migraciones destructivas** (DROP COLUMN, tipo de cambio)

---

## Checklist de Nuevo Schema

Antes de crear una nueva tabla:

- [ ] Nombre en español, plural, snake_case (`pedido_items`, `ventas_bebidas`)
- [ ] `$table->id()` como primary key
- [ ] `$table->timestamps()` para `created_at` y `updated_at`
- [ ] Foreign keys con `constrained()` y `onDelete()` correcto
- [ ] Índices en columnas frecuentemente filtradas
- [ ] Charset utf8mb4 configurado en `config/database.php`
- [ ] Modelo Eloquent creado con `fillable` o `guarded`
- [ ] Relaciones definidas en el modelo (`belongsTo`, `hasMany`, etc.)
