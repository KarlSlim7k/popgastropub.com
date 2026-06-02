<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromoLead extends Model
{
    protected $fillable = [
        'promocion_id',
        'nombre',
        'telefono',
        'email',
        'mensaje',
        'origen',
    ];

    public function promocion()
    {
        return $this->belongsTo(Promocion::class);
    }
}
