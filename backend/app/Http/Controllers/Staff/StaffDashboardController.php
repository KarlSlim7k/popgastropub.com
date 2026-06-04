<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Mesero;
use App\Models\MeseroPointsLog;
use Illuminate\Http\Request;

class StaffDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $mesero = Mesero::where('user_id', $user->id)->first();

        $totalPoints = 0;
        $ordersServed = 0;
        $totalSales = 0;
        $ventasHoy = 0;

        if ($mesero) {
            $totalPoints = $mesero->cocktail_points + $mesero->premium_points + $mesero->pitcher_points +
                           $mesero->bottle_points + $mesero->combo_points + $mesero->upsell_points + $mesero->rating_points;
            $ordersServed = $mesero->orders_served;
            $totalSales = (float) $mesero->total_sales;

            $ventasHoy = MeseroPointsLog::where('mesero_id', $mesero->id)
                ->whereDate('created_at', today())
                ->sum('points');
        }

        return response()->json([
            'stats' => [
                'ventas_hoy' => $ventasHoy,
                'bebidas_vendidas' => $ordersServed,
                'puntos_totales' => $totalPoints,
                'ventas_totales' => $totalSales,
            ],
            'mesero' => $mesero,
        ]);
    }
}
