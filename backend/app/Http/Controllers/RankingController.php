<?php

namespace App\Http\Controllers;

use App\Models\Mesero;
use App\Models\MeseroPointsLog;
use Illuminate\Http\Request;

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
        $categories = [
            'cocktail' => ['points' => 10, 'label' => 'Cóctel / Margarita'],
            'premium' => ['points' => 15, 'label' => 'Bebida Premium'],
            'pitcher' => ['points' => 25, 'label' => 'Pitcher / Compartida'],
            'bottle' => ['points' => 50, 'label' => 'Botella Completa'],
            'combo' => ['points' => 20, 'label' => 'Combo Comida + Bebida'],
            'upsell' => ['points' => 15, 'label' => 'Upselling'],
        ];

        $validated = $request->validate([
            'category' => 'required|in:' . implode(',', array_keys($categories)),
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        $mesero = Mesero::where('user_id', $user->id)->first();
        if (!$mesero) {
            return response()->json(['message' => 'No se encontró perfil de mesero'], 404);
        }

        $category = $validated['category'];
        $multiplier = (float) ($mesero->point_multiplier ?? 1.0);
        $basePoints = $categories[$category]['points'] * $validated['quantity'];
        $points = (int) round($basePoints * $multiplier);

        $mesero->increment($category . '_points', $points);
        $mesero->increment('puntos', $points);

        MeseroPointsLog::create([
            'mesero_id' => $mesero->id,
            'category' => $category,
            'points' => $points,
            'multiplier' => $multiplier,
        ]);

        $mesero->refresh();

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
}
