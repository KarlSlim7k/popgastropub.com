<?php

namespace App\Http\Controllers;

use App\Models\DrinkType;
use App\Models\Mesero;
use App\Models\MeseroPointsLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class RankingController extends Controller
{
    public function index()
    {
        $ranking = Mesero::where('activo', true)
            ->orderBy('puntos', 'desc')
            ->with('user')
            ->get();

        return response()->json($ranking);
    }

    public function addPoints(Request $request)
    {
        $user = $request->user();

        $types = DrinkType::active()->pluck('points', 'slug')->toArray();

        if (empty($types)) {
            return response()->json(['message' => 'No hay tipos de bebida configurados.'], 422);
        }

        $validated = $request->validate([
            'category' => 'required|in:' . implode(',', array_keys($types)),
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        $mesero = Mesero::where('user_id', $user->id)->first();
        if (!$mesero) {
            return response()->json(['message' => 'No se encontró perfil de mesero'], 404);
        }

        $category = $validated['category'];
        $multiplier = (float) ($mesero->point_multiplier ?? 1.0);
        $basePoints = $types[$category] * $validated['quantity'];
        $points = (int) round($basePoints * $multiplier);

        // Las columnas *_points solo existen para los tipos de bebida originales
        // (cocktail, premium, pitcher, bottle, combo, upsell). Tipos nuevos creados
        // por el admin no tienen columna propia y se reflejan solo en `puntos` y
        // en MeseroPointsLog (ver StaffAnalyticsController).
        if (Schema::hasColumn('meseros', $category . '_points')) {
            $mesero->increment($category . '_points', $points);
        }
        $mesero->increment('puntos', $points);
        $mesero->increment('orders_served', $validated['quantity']);

        MeseroPointsLog::create([
            'mesero_id' => $mesero->id,
            'category' => $category,
            'points' => $points,
            'multiplier' => $multiplier,
        ]);

        $mesero->refresh();

        $this->checkTierUp($mesero);

        return response()->json([
            'message' => "Puntos añadidos: +{$points}",
            'mesero' => $mesero,
        ]);
    }

    public function history(Request $request)
    {
        $mesero = Mesero::where('user_id', $request->user()->id)->first();
        if (!$mesero) {
            return response()->json([]);
        }

        return response()->json(
            MeseroPointsLog::where('mesero_id', $mesero->id)
                ->orderByDesc('created_at')
                ->limit(50)
                ->get()
        );
    }

    protected function checkTierUp(Mesero $mesero): void
    {
        $points = $mesero->puntos;
        $tierThresholds = [
            5000 => 'Legend',
            3000 => 'Master',
            1500 => 'Pro',
            500 => 'Rising',
        ];

        foreach ($tierThresholds as $threshold => $tier) {
            if ($points >= $threshold && $points - 1 < $threshold) {
                \App\Models\StaffNotification::send(
                    $mesero->id,
                    'tier_up',
                    "¡Subiste a {$tier}!",
                    "Alcanzaste {$points} pts y desbloqueaste el nivel {$tier}. ¡Sigue asi!",
                    ['tier' => $tier, 'points' => $points]
                );
                break;
            }
        }
    }
}
