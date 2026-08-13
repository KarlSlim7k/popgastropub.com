<?php

namespace App\Services;

use App\Models\LoyaltyPointAction;
use App\Models\LoyaltyTier;
use App\Models\TicketRedeem;
use App\Models\User;

class LoyaltyPointsCalculator
{
    private const RESTAURANT_TIMEZONE = 'America/Mexico_City';

    private const DEFAULT_TIER_MULTIPLIERS = [
        'fan' => 1.0,
        'lover' => 1.1,
        'vip' => 1.25,
        'elite' => 1.5,
    ];

    public function calculate(TicketRedeem $ticket, User $cliente): array
    {
        $basePoints = max(0, (int) $ticket->puntos);
        $tierSlug = LoyaltyTier::resolveSlugForPoints((int) $cliente->points);
        $tierMultiplier = $this->tierMultiplier($tierSlug);
        $campaignMultiplier = $this->campaignMultiplier($ticket);
        $totalMultiplier = $tierMultiplier * $campaignMultiplier;

        return [
            'base_points' => $basePoints,
            'tier_slug' => $tierSlug,
            'tier_multiplier' => $tierMultiplier,
            'campaign_multiplier' => $campaignMultiplier,
            'total_multiplier' => $totalMultiplier,
            'total_points' => (int) floor($basePoints * $totalMultiplier),
        ];
    }

    private function tierMultiplier(string $tierSlug): float
    {
        $tier = LoyaltyTier::query()->active()->where('slug', $tierSlug)->first();
        $configured = $tier?->config['points_multiplier'] ?? null;

        if (is_numeric($configured) && (float) $configured >= 1) {
            return (float) $configured;
        }

        return self::DEFAULT_TIER_MULTIPLIERS[$tierSlug] ?? 1.0;
    }

    private function campaignMultiplier(TicketRedeem $ticket): float
    {
        $campaign = LoyaltyPointAction::query()
            ->active()
            ->where('slug', 'double_checkpoint')
            ->where('points_type', 'multiplier')
            ->first();

        if (! $campaign) {
            return 1.0;
        }

        $conditions = $campaign->conditions;
        $days = array_map('strtolower', $conditions['days'] ?? []);
        $issuedAt = ($ticket->fecha_emision_ticket ?? $ticket->created_at ?? now())
            ->copy()
            ->timezone(self::RESTAURANT_TIMEZONE);

        if (! in_array(strtolower($issuedAt->englishDayOfWeek), $days, true)) {
            return 1.0;
        }

        $multiplier = $conditions['multiplier'] ?? $campaign->points;

        return is_numeric($multiplier) && (float) $multiplier >= 1
            ? (float) $multiplier
            : 1.0;
    }
}
