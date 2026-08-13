<?php

namespace App\Models;

use App\Services\LoyaltyConfig;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyTier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'min_points',
        'max_points',
        'color',
        'bg_color',
        'border_color',
        'icon',
        'benefits',
        'investment_text',
        'config',
        'is_active',
        'is_featured',
        'sort_order',
    ];

    protected $casts = [
        'benefits' => 'array',
        'config' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'min_points' => 'integer',
        'max_points' => 'integer',
        'sort_order' => 'integer',
    ];

    public function getBenefitsAttribute($value)
    {
        return $value ? json_decode($value, true) : [];
    }

    public function getConfigAttribute($value)
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

    public function scopeForPoints($query, $points)
    {
        return $query->where('min_points', '<=', $points)
            ->where(function ($q) use ($points) {
                $q->whereNull('max_points')->orWhere('max_points', '>=', $points);
            });
    }

    /**
     * Resuelve el slug del tier para una cantidad de puntos.
     * Usa cache (60s) para evitar N+1 al listar usuarios.
     */
    public static function resolveSlugForPoints(int $points): string
    {
        if ($points >= LoyaltyConfig::tierMin('elite')) {
            return 'elite';
        }

        if ($points >= LoyaltyConfig::tierMin('vip')) {
            return 'vip';
        }

        if ($points >= LoyaltyConfig::tierMin('lover')) {
            return 'lover';
        }

        return 'fan';
    }
}
