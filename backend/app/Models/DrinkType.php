<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DrinkType extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'label',
        'points',
        'icon',
        'active',
        'sort_order',
    ];

    protected $casts = [
        'active' => 'boolean',
        'points' => 'integer',
        'sort_order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('label');
    }
}
