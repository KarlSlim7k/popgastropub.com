<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mesa extends Model
{
    protected $fillable = [
        'numero',
        'capacidad',
        'activa',
    ];

    protected $casts = [
        'activa' => 'boolean',
    ];

    public function scopeActiva($query)
    {
        return $query->where('activa', true);
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }
}
