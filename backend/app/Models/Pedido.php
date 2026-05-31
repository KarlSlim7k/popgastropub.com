<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'foodbooking_ref',
        'items',
        'total',
        'puntos_ganados',
        'puntos_acreditados_at',
        'estado',
        'notas',
    ];

    protected $casts = [
        'items' => 'array',
        'puntos_acreditados_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
