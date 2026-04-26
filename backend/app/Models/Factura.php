<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Factura extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ticket_path',
        'rfc',
        'razon_social',
        'regimen_fiscal',
        'codigo_postal',
        'uso_cfdi',
        'email',
        'estado',
    ];

    protected $casts = [
        'ticket_path' => 'string',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
