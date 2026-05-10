<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'costo',
        'categoria',
        'imagen',
        'disponible',
        'destacado',
        'stock',
        'status',
        'pedidos_count',
        'rating',
        'alergenos',
        'tiene_promo',
        'precio_promo',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'costo' => 'decimal:2',
        'precio_promo' => 'decimal:2',
        'rating' => 'decimal:1',
        'disponible' => 'boolean',
        'destacado' => 'boolean',
        'tiene_promo' => 'boolean',
        'alergenos' => 'array',
    ];
}
