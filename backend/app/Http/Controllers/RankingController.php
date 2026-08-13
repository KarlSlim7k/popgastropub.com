<?php

namespace App\Http\Controllers;

use App\Models\DrinkType;
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

    public function drinkTypes()
    {
        return response()->json(DrinkType::active()->ordered()->get([
            'id', 'slug', 'label', 'points', 'icon', 'sort_order',
        ]));
    }

    public function addPoints(Request $request)
    {
        $user = $request->user();

        $types = DrinkType::active()->pluck('points', 'slug')->toArray();

        if (empty($types)) {
            return response()->json(['message' => 'No hay tipos de bebida configurados.'], 422);
        }

        $validated = $request->validate([
            'category' => 'required|in:'.implode(',', array_keys($types)),
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        $mesero = Mesero::where('user_id', $user->id)->first();
        if (! $mesero) {
            return response()->json(['message' => 'No se encontró perfil de mesero'], 404);
        }

        if (MeseroPointsLog::where('mesero_id', $mesero->id)->pending()->count() >= 20) {
            return response()->json([
                'message' => 'Tienes demasiadas ventas pendientes. Espera la revisión de un administrador.',
            ], 422);
        }

        $category = $validated['category'];
        $multiplier = (float) ($mesero->point_multiplier ?? 1.0);
        $basePoints = $types[$category] * $validated['quantity'];
        $points = (int) round($basePoints * $multiplier);

        $sale = MeseroPointsLog::create([
            'mesero_id' => $mesero->id,
            'category' => $category,
            'quantity' => $validated['quantity'],
            'points' => $points,
            'multiplier' => $multiplier,
            'status' => 'pending',
            'submitted_by' => $user->id,
        ]);

        return response()->json([
            'message' => "Venta enviada a revisión: +{$points} pts pendientes",
            'sale' => $sale,
        ], 202);
    }

    public function history(Request $request)
    {
        $mesero = Mesero::where('user_id', $request->user()->id)->first();
        if (! $mesero) {
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
