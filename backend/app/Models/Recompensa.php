<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recompensa extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'puntos_requeridos',
        'imagen',
        'disponible',
    ];

    public function redemptions()
    {
        return $this->hasMany(RewardRedemption::class);
    }
}
