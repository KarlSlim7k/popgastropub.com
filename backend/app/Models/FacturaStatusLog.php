<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FacturaStatusLog extends Model
{
    protected $table = 'factura_status_log';
    protected $fillable = ['factura_id', 'user_id', 'from_status', 'to_status', 'nota'];

    public function factura() { return $this->belongsTo(Factura::class); }
    public function user() { return $this->belongsTo(User::class); }
}
