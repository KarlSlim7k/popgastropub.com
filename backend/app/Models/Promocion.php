<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promocion extends Model
{
    use HasFactory;

    protected $table = 'promociones';

    protected $fillable = [
        'titulo',
        'descripcion',
        'tipo',
        'descuento',
        'precio_original',
        'precio_promo',
        'dia_inicio',
        'dia_fin',
        'dias_activos',
        'imagen',
        'activa',
        'estado',
        'redenciones',
        'meta',
        'ingresos',
    ];

    protected $casts = [
        'precio_original' => 'decimal:2',
        'precio_promo' => 'decimal:2',
        'ingresos' => 'decimal:2',
        'activa' => 'boolean',
    ];
}
