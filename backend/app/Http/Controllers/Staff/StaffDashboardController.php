<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Mesero;
use App\Models\Reserva;
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

        if ($mesero) {
            $totalPoints = $mesero->cocktail_points + $mesero->premium_points + $mesero->pitcher_points +
                           $mesero->bottle_points + $mesero->combo_points + $mesero->upsell_points + $mesero->rating_points;
            $ordersServed = $mesero->orders_served;
            $totalSales = (float) $mesero->total_sales;
        }

        $reservasHoy = Reserva::whereDate('fecha', today())->where('estado', '!=', 'cancelada')->count();

        return response()->json([
            'stats' => [
                'mesas_hoy' => $reservasHoy,
                'bebidas_vendidas' => $ordersServed,
                'puntos_totales' => $totalPoints,
                'ventas_totales' => $totalSales,
            ],
            'mesero' => $mesero,
        ]);
    }
}
