<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Mesero;
use App\Models\MeseroPointsLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StaffAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $mesero = Mesero::where('user_id', $user->id)->first();

        if (!$mesero) {
            return response()->json(['message' => 'No se encontró perfil de mesero'], 404);
        }

        $period = $request->input('period', 'all'); // week | month | all

        $logQuery = MeseroPointsLog::where('mesero_id', $mesero->id);

        if ($period === 'week') {
            $logQuery->where('created_at', '>=', Carbon::now()->startOfWeek());
        } elseif ($period === 'month') {
            $logQuery->where('created_at', '>=', Carbon::now()->startOfMonth());
        }

        $logs = $logQuery->get();

        $byCategory = $logs->groupBy('category')->map(fn($g) => $g->sum('points'));

        // For 'all', fall back to aggregated columns if no log entries
        $useColumns = $period === 'all' && $logs->isEmpty();

        $categorias = [
            ['name' => 'Cócteles',  'key' => 'cocktail', 'points' => $useColumns ? $mesero->cocktail_points : ($byCategory['cocktail']  ?? 0)],
            ['name' => 'Premium',   'key' => 'premium',  'points' => $useColumns ? $mesero->premium_points  : ($byCategory['premium']   ?? 0)],
            ['name' => 'Pitcher',   'key' => 'pitcher',  'points' => $useColumns ? $mesero->pitcher_points  : ($byCategory['pitcher']   ?? 0)],
            ['name' => 'Botella',   'key' => 'bottle',   'points' => $useColumns ? $mesero->bottle_points   : ($byCategory['bottle']    ?? 0)],
            ['name' => 'Combos',    'key' => 'combo',    'points' => $useColumns ? $mesero->combo_points    : ($byCategory['combo']     ?? 0)],
            ['name' => 'Upsell',    'key' => 'upsell',   'points' => $useColumns ? $mesero->upsell_points   : ($byCategory['upsell']    ?? 0)],
            ['name' => 'Rating',    'key' => 'rating',   'points' => $useColumns ? $mesero->rating_points   : ($byCategory['rating']    ?? 0)],
        ];

        $totalPoints = collect($categorias)->sum('points');

        return response()->json([
            'period' => $period,
            'puntos_totales' => $totalPoints,
            'orders_served' => $mesero->orders_served,
            'avg_rating' => (float) $mesero->avg_rating,
            'total_sales' => (float) $mesero->total_sales,
            'categorias' => array_values(array_map(fn($c) => ['name' => $c['name'], 'points' => $c['points']], $categorias)),
        ]);
    }
}
