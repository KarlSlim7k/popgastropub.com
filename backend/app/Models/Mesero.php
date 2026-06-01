<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mesero extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nombre',
        'iniciales',
        'puntos',
        'activo',
        'status',
        'cocktail_points',
        'premium_points',
        'pitcher_points',
        'bottle_points',
        'combo_points',
        'upsell_points',
        'rating_points',
        'total_sales',
        'orders_served',
        'avg_rating',
        'point_multiplier',
    ];

    protected $casts = [
        'puntos' => 'integer',
        'activo' => 'boolean',
        'total_sales' => 'decimal:2',
        'avg_rating' => 'decimal:1',
        'point_multiplier' => 'decimal:1',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
