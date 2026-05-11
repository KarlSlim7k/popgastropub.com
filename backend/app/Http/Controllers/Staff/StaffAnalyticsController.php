<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Mesero;
use Illuminate\Http\Request;

class StaffAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $mesero = Mesero::where('user_id', $user->id)->first();

        if (!$mesero) {
            return response()->json(['message' => 'No se encontró perfil de mesero'], 404);
        }

        $totalPoints = $mesero->cocktail_points + $mesero->premium_points + $mesero->pitcher_points +
                       $mesero->bottle_points + $mesero->combo_points + $mesero->upsell_points + $mesero->rating_points;

        return response()->json([
            'puntos_totales' => $totalPoints,
            'orders_served' => $mesero->orders_served,
            'avg_rating' => (float) $mesero->avg_rating,
            'total_sales' => (float) $mesero->total_sales,
            'categorias' => [
                ['name' => 'Cócteles', 'points' => $mesero->cocktail_points],
                ['name' => 'Premium', 'points' => $mesero->premium_points],
                ['name' => 'Pitcher', 'points' => $mesero->pitcher_points],
                ['name' => 'Botella', 'points' => $mesero->bottle_points],
                ['name' => 'Combos', 'points' => $mesero->combo_points],
                ['name' => 'Upsell', 'points' => $mesero->upsell_points],
                ['name' => 'Rating', 'points' => $mesero->rating_points],
            ],
        ]);
    }
}
