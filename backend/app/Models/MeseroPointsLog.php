<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MeseroPointsLog extends Model
{
    protected $table = 'mesero_points_log';
    protected $fillable = ['mesero_id', 'category', 'points', 'multiplier'];

    public function mesero()
    {
        return $this->belongsTo(Mesero::class);
    }
}
