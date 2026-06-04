<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyPointAction extends Model
{
    use HasFactory;

    protected $fillable = [
        'action',
        'slug',
        'points',
        'points_type',
        'icon',
        'color',
        'is_active',
        'sort_order',
        'description',
        'conditions',
    ];

    protected $casts = [
        'conditions' => 'array',
        'is_active' => 'boolean',
        'points' => 'integer',
        'sort_order' => 'integer',
    ];

    public function getConditionsAttribute($value)
    {
        return $value ? json_decode($value, true) : [];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}