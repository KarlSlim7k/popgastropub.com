<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RankingSnapshot extends Model
{
    protected $fillable = ['period_id', 'mesero_id', 'puntos', 'position', 'tier'];

    public function period()
    {
        return $this->belongsTo(RankingPeriod::class, 'period_id');
    }

    public function mesero()
    {
        return $this->belongsTo(Mesero::class);
    }
}
