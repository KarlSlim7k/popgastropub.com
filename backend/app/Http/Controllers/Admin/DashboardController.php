<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use App\Models\Mesero;
use App\Models\Producto;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'totalUsers' => User::count(),
            'totalMeseros' => Mesero::where('activo', true)->count(),
            'totalFacturas' => Factura::count(),
            'facturasHoy' => Factura::whereDate('created_at', today())->count(),
            'totalPuntos' => User::sum('points'),
            'usuariosNuevosMes' => User::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count(),
        ]);
    }

    public function chartData(Request $request)
    {
        $days = $request->input('period') === '7D' ? 7 : 30;
        $data = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $data[] = [
                'day' => strtoupper($date->locale('es')->isoFormat('ddd')),
                'date' => $date->toDateString(),
                'value' => Factura::whereDate('created_at', $date)->count(),
            ];
        }

        return response()->json($data);
    }

    public function salesMix()
    {
        $colors = ['#F2C777', '#D96725', '#F2C894', '#732817'];

        // Try by pedidos_count first
        $productos = Producto::where('disponible', true)
            ->beverages()
            ->orderBy('pedidos_count', 'desc')
            ->limit(4)
            ->get();

        $total = $productos->sum('pedidos_count');

        if ($total > 0) {
            $data = $productos->values()->map(function ($p, $i) use ($total, $colors) {
                return [
                    'name' => $p->nombre,
                    'percent' => round(($p->pedidos_count / $total) * 100),
                    'color' => $colors[$i] ?? '#732817',
                ];
            });

            return response()->json($data);
        }

        // Fallback: distribute equally by category
        $byCategory = Producto::where('disponible', true)
            ->beverages()
            ->selectRaw('categoria, COUNT(*) as cnt')
            ->groupBy('categoria')
            ->orderByDesc('cnt')
            ->limit(4)
            ->get();

        if ($byCategory->isNotEmpty()) {
            $catTotal = $byCategory->sum('cnt') ?: 1;
            $data = $byCategory->values()->map(function ($row, $i) use ($catTotal, $colors) {
                return [
                    'name' => $row->categoria,
                    'percent' => round(($row->cnt / $catTotal) * 100),
                    'color' => $colors[$i] ?? '#732817',
                ];
            });

            return response()->json($data);
        }

        return response()->json([
            ['name' => 'Sin productos', 'percent' => 100, 'color' => '#732817'],
        ]);
    }

    public function topWaiters()
    {
        $meseros = Mesero::where('activo', true)
            ->orderByDesc('puntos')
            ->limit(3)
            ->get();

        return response()->json($meseros->map(fn ($m) => [
            'initials' => $m->iniciales ?: strtoupper(collect(explode(' ', $m->nombre))->map(fn ($w) => $w[0] ?? '')->join('')),
            'name' => $m->nombre,
            'orders' => $m->orders_served,
            'rating' => (float) $m->avg_rating,
            'points' => (int) $m->puntos,
        ]));
    }

    public function liveMenu()
    {
        $items = Producto::where('disponible', true)
            ->beverages()
            ->orderBy('stock', 'asc')
            ->limit(5)
            ->get();

        return response()->json($items->map(fn ($p) => [
            'id' => 'POP-'.str_pad($p->id, 3, '0', STR_PAD_LEFT),
            'name' => $p->nombre,
            'category' => $p->categoria,
            'price' => '$'.number_format((float) $p->precio, 2),
            'stockPercent' => $p->stock,
            'stockLabel' => $p->stock < 30 ? 'Reabastecer' : ($p->stock < 60 ? 'Normal' : 'Alta Demanda'),
            'active' => $p->disponible,
            'image' => $p->imagen ?? '',
        ]));
    }
}
