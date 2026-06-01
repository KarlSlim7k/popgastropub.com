<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class LoyaltyConfig
{
    private static array $defaults = [
        'points_per_peso'  => 0.1,
        'referral_bonus'   => 200,
        'welcome_bonus'    => 50,
        'checkin_bonus'    => 25,
        'birthday_bonus'   => 150,
        'review_bonus'     => 100,
        'share_bonus'      => 30,
        'tier_lover_min'   => 500,
        'tier_vip_min'     => 1500,
        'tier_elite_min'   => 3000,
    ];

    public static function get(string $key): int|float
    {
        $settings = Cache::remember('loyalty_settings', 300, fn() => Setting::getGroup('loyalty'));
        return (float) ($settings[$key] ?? self::$defaults[$key] ?? 0);
    }

    public static function pointsForAmount(float $total): int
    {
        return (int) floor($total * self::get('points_per_peso'));
    }

    public static function tierMin(string $tier): int
    {
        return (int) self::get("tier_{$tier}_min");
    }
}
