<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Recompensa extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'nombre',
        'descripcion',
        'puntos_requeridos',
        'imagen',
        'disponible',
        'categoria',
        'tier',
    ];

    public function redemptions()
    {
        return $this->hasMany(RewardRedemption::class);
    }
}
