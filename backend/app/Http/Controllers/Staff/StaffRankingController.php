<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Mesero;
use Illuminate\Http\Request;

class StaffRankingController extends Controller
{
    public function miRanking(Request $request)
    {
        $user = $request->user();
        $mesero = Mesero::where('user_id', $user->id)->first();

        if (!$mesero) {
            return response()->json(['message' => 'No se encontró perfil de mesero'], 404);
        }

        $totalPoints = $mesero->cocktail_points + $mesero->premium_points + $mesero->pitcher_points +
                       $mesero->bottle_points + $mesero->combo_points + $mesero->upsell_points + $mesero->rating_points;

        // Calculate position
        $allMeseros = Mesero::where('activo', true)->get()->map(fn($m) =>
            $m->cocktail_points + $m->premium_points + $m->pitcher_points +
            $m->bottle_points + $m->combo_points + $m->upsell_points + $m->rating_points
        )->sortDesc()->values();

        $position = $allMeseros->search($totalPoints) + 1;
        $totalMeseros = $allMeseros->count();

        // Tier calculation
        $tier = 'Rookie';
        if ($totalPoints >= 5000) $tier = 'Legend';
        elseif ($totalPoints >= 3000) $tier = 'Master';
        elseif ($totalPoints >= 1500) $tier = 'Pro';
        elseif ($totalPoints >= 500) $tier = 'Rising';

        $nextTierMin = match ($tier) {
            'Rookie' => 500, 'Rising' => 1500, 'Pro' => 3000, 'Master' => 5000, default => null,
        };

        $progress = $nextTierMin ? round(($totalPoints / $nextTierMin) * 100) : 100;

        return response()->json([
            'position' => $position,
            'total_meseros' => $totalMeseros,
            'puntos_totales' => $totalPoints,
            'tier' => $tier,
            'progress' => min(100, $progress),
            'next_tier_min' => $nextTierMin,
            'desglose' => [
                'cocktail' => $mesero->cocktail_points,
                'premium' => $mesero->premium_points,
                'pitcher' => $mesero->pitcher_points,
                'bottle' => $mesero->bottle_points,
                'combo' => $mesero->combo_points,
                'upsell' => $mesero->upsell_points,
                'rating' => $mesero->rating_points,
            ],
        ]);
    }
}
