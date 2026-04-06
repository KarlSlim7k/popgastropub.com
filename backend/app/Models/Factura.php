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
        'estado',
        'uuid',
        'xml_path',
        'pdf_path',
    ];

    protected $casts = [
        'ticket_path' => 'string',
        'xml_path' => 'string',
        'pdf_path' => 'string',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
