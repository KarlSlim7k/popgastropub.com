<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\DrinkType;
use App\Models\Mesero;
use App\Models\MeseroPointsLog;
use Carbon\Carbon;
use Illuminate\Http\Request;

class StaffAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $mesero = Mesero::where('user_id', $user->id)->first();

        if (! $mesero) {
            return response()->json(['message' => 'No se encontró perfil de mesero'], 404);
        }

        $period = $request->input('period', 'all'); // week | month | all

        $logQuery = MeseroPointsLog::where('mesero_id', $mesero->id)->approved();

        if ($period === 'week') {
            $logQuery->where('created_at', '>=', Carbon::now()->startOfWeek());
        } elseif ($period === 'month') {
            $logQuery->where('created_at', '>=', Carbon::now()->startOfMonth());
        }

        $logs = $logQuery->get();

        $byCategory = $logs->groupBy('category')->map(fn ($g) => $g->sum('points'));

        // For 'all', fall back to aggregated columns if no log entries
        $useColumns = $period === 'all' && $logs->isEmpty();

        $legacyColumns = [
            'cocktail' => 'cocktail_points', 'premium' => 'premium_points',
            'pitcher' => 'pitcher_points', 'bottle' => 'bottle_points',
            'combo' => 'combo_points', 'upsell' => 'upsell_points',
        ];
        $categorias = DrinkType::active()->ordered()->get(['slug', 'label'])
            ->map(function ($type) use ($useColumns, $legacyColumns, $mesero, $byCategory) {
                $legacy = $legacyColumns[$type->slug] ?? null;

                return [
                    'name' => $type->label,
                    'key' => $type->slug,
                    'points' => $useColumns && $legacy
                        ? (int) $mesero->{$legacy}
                        : (int) ($byCategory[$type->slug] ?? 0),
                ];
            });
        $categorias->push([
            'name' => 'Calificaciones',
            'key' => 'rating',
            'points' => $useColumns ? (int) $mesero->rating_points : (int) ($byCategory['rating'] ?? 0),
        ]);

        $totalPoints = $period === 'all' ? (int) $mesero->puntos : collect($categorias)->sum('points');

        return response()->json([
            'period' => $period,
            'puntos_totales' => $totalPoints,
            'orders_served' => $mesero->orders_served,
            'avg_rating' => (float) $mesero->avg_rating,
            'total_sales' => (float) $mesero->total_sales,
            'categorias' => $categorias->map(fn ($c) => ['name' => $c['name'], 'points' => $c['points']])->values(),
        ]);
    }
}
