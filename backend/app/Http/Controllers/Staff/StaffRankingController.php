<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Mesero;
use App\Models\MeseroPointsLog;
use Illuminate\Http\Request;

class StaffRankingController extends Controller
{
    public function miRanking(Request $request)
    {
        $user = $request->user();
        $mesero = Mesero::where('user_id', $user->id)->first();

        if (! $mesero) {
            return response()->json(['message' => 'No se encontró perfil de mesero'], 404);
        }

        $totalPoints = (int) $mesero->puntos;

        // Calculate position
        $allMeseros = Mesero::where('activo', true)->orderByDesc('puntos')->pluck('puntos')->values();

        $position = $allMeseros->search($totalPoints) + 1;
        $totalMeseros = $allMeseros->count();

        // Tier calculation
        $tier = 'Rookie';
        if ($totalPoints >= 5000) {
            $tier = 'Legend';
        } elseif ($totalPoints >= 3000) {
            $tier = 'Master';
        } elseif ($totalPoints >= 1500) {
            $tier = 'Pro';
        } elseif ($totalPoints >= 500) {
            $tier = 'Rising';
        }

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
                'otros' => (int) MeseroPointsLog::where('mesero_id', $mesero->id)
                    ->approved()
                    ->whereNotIn('category', ['cocktail', 'premium', 'pitcher', 'bottle', 'combo', 'upsell', 'rating'])
                    ->sum('points'),
            ],
            'ventas_pendientes' => MeseroPointsLog::where('mesero_id', $mesero->id)->pending()->count(),
        ]);
    }
}
