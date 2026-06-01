<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RankingPeriod extends Model
{
    protected $fillable = ['type', 'start_date', 'end_date', 'active'];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'active' => 'boolean',
    ];

    public function snapshots()
    {
        return $this->hasMany(RankingSnapshot::class, 'period_id');
    }

    public static function current(string $type = 'monthly')
    {
        return static::where('type', $type)->where('active', true)->latest('start_date')->first();
    }
}
