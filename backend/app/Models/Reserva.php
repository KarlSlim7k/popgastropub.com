<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nombre',
        'telefono',
        'fecha',
        'hora',
        'personas',
        'notas',
        'estado',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
