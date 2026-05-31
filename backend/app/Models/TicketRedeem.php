<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketRedeem extends Model
{
    use HasFactory;

    protected $fillable = [
        'ref',
        'total',
        'puntos',
        'mesero_id',
        'user_id',
        'ts_emision',
        'canjeado_at',
        'ip_canje',
    ];

    protected $casts = [
        'total' => 'integer',
        'puntos' => 'integer',
        'ts_emision' => 'integer',
        'canjeado_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mesero()
    {
        return $this->belongsTo(Mesero::class);
    }
}
