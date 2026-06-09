<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketRedeem extends Model
{
    use HasFactory;

    protected $fillable = [
        'ref',
        'folio_ticket',
        'total',
        'subtotal',
        'iva',
        'puntos',
        'hash_verificacion',
        'foto_ticket_path',
        'mesero_id',
        'user_id',
        'ts_emision',
        'fecha_emision_ticket',
        'fecha_expiracion',
        'canjeado_at',
        'ip_canje',
        'ip_generacion',
        'user_agent',
        'estado_validacion',
    ];

    protected $casts = [
        'total' => 'integer',
        'subtotal' => 'decimal:2',
        'iva' => 'decimal:2',
        'puntos' => 'integer',
        'ts_emision' => 'integer',
        'fecha_emision_ticket' => 'datetime',
        'fecha_expiracion' => 'datetime',
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

    public function scopePendientes($query)
    {
        return $query->whereNull('canjeado_at')->where('estado_validacion', 'valido');
    }

    public function scopeCanjeados($query)
    {
        return $query->whereNotNull('canjeado_at');
    }

    public function scopeExpirados($query)
    {
        return $query->whereNull('canjeado_at')
            ->whereNotNull('fecha_expiracion')
            ->where('fecha_expiracion', '<', now());
    }

    public function scopeDelMesero($query, int $meseroId)
    {
        return $query->where('mesero_id', $meseroId);
    }

    public function getEstadoLegibleAttribute(): string
    {
        if ($this->canjeado_at) {
            return 'canjeado';
        }

        if ($this->fecha_expiracion && $this->fecha_expiracion->isPast()) {
            return 'expirado';
        }

        if ($this->estado_validacion === 'rechazado') {
            return 'rechazado';
        }

        return 'pendiente';
    }
}
