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
        'puntos',
        'activo',
    ];

    protected $casts = [
        'puntos' => 'integer',
        'activo' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
