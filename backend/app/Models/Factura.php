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
        'contadores_email_enviado_at',
        'contadores_email_intentos',
        'contadores_email_ultimo_intento_at',
        'contadores_email_siguiente_intento_at',
        'contadores_email_procesando_at',
        'contadores_email_error',
    ];

    protected $casts = [
        'ticket_path' => 'string',
        'contadores_email_enviado_at' => 'datetime',
        'contadores_email_intentos' => 'integer',
        'contadores_email_ultimo_intento_at' => 'datetime',
        'contadores_email_siguiente_intento_at' => 'datetime',
        'contadores_email_procesando_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
