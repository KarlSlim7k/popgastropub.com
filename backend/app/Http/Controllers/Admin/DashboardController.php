<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use App\Models\Mesero;
use App\Models\Pedido;
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
        $productos = Producto::where('disponible', true)->orderBy('pedidos_count', 'desc')->limit(4)->get();
        $total = $productos->sum('pedidos_count') ?: 1;
        $colors = ['#F2C777', '#D96725', '#F2C894', '#732817'];

        $data = $productos->values()->map(function ($p, $i) use ($total, $colors) {
            return [
                'name' => $p->nombre,
                'percent' => round(($p->pedidos_count / $total) * 100),
                'color' => $colors[$i] ?? '#732817',
            ];
        });

        if ($data->isEmpty()) {
            $data = collect([
                ['name' => 'Sin datos', 'percent' => 100, 'color' => '#732817'],
            ]);
        }

        return response()->json($data);
    }

    public function topWaiters()
    {
        $meseros = Mesero::where('activo', true)
            ->orderByRaw('(cocktail_points + premium_points + pitcher_points + bottle_points + combo_points + upsell_points + rating_points) DESC')
            ->limit(3)
            ->get();

        return response()->json($meseros->map(fn($m) => [
            'initials' => $m->iniciales ?: strtoupper(collect(explode(' ', $m->nombre))->map(fn($w) => $w[0] ?? '')->join('')),
            'name' => $m->nombre,
            'orders' => $m->orders_served,
            'rating' => (float) $m->avg_rating,
            'points' => $m->cocktail_points + $m->premium_points + $m->pitcher_points + $m->bottle_points + $m->combo_points + $m->upsell_points + $m->rating_points,
        ]));
    }

    public function liveMenu()
    {
        $items = Producto::where('disponible', true)->orderBy('stock', 'asc')->limit(5)->get();

        return response()->json($items->map(fn($p) => [
            'id' => 'POP-' . str_pad($p->id, 3, '0', STR_PAD_LEFT),
            'name' => $p->nombre,
            'category' => $p->categoria,
            'price' => '$' . number_format((float) $p->precio, 2),
            'stockPercent' => $p->stock,
            'stockLabel' => $p->stock < 30 ? 'Reabastecer' : ($p->stock < 60 ? 'Normal' : 'Alta Demanda'),
            'active' => $p->disponible,
            'image' => $p->imagen ?? '',
        ]));
    }
}
