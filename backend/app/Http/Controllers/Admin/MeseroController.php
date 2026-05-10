<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mesero;
use Illuminate\Http\Request;

class MeseroController extends Controller
{
    public function index(Request $request)
    {
        $query = Mesero::with('user');

        if ($request->has('period') && $request->input('period') !== 'todo') {
            $date = match ($request->input('period')) {
                'semana' => now()->subWeek(),
                'mes' => now()->subMonth(),
                default => null,
            };
            if ($date) {
                $query->where('updated_at', '>=', $date);
            }
        }

        $meseros = $query->orderByRaw('(cocktail_points + premium_points + pitcher_points + bottle_points + combo_points + upsell_points + rating_points) DESC')->get();

        return response()->json($meseros->map(fn($m) => $this->toFrontend($m)));
    }

    public function store(Request $request)
    {
        $data = $this->fromFrontend($request);

        if (!isset($data['nombre']) && $request->has('name')) {
            $data['nombre'] = $request->input('name');
        }

        $mesero = Mesero::create($data);

        return response()->json($this->toFrontend($mesero), 201);
    }

    public function show($id)
    {
        return response()->json($this->toFrontend(Mesero::with('user')->findOrFail($id)));
    }

    public function update(Request $request, $id)
    {
        $mesero = Mesero::findOrFail($id);
        $data = $this->fromFrontend($request);
        $mesero->update($data);

        return response()->json($this->toFrontend($mesero->fresh()));
    }

    public function destroy($id)
    {
        Mesero::findOrFail($id)->delete();

        return response()->json(['message' => 'Mesero eliminado']);
    }

    private function toFrontend(Mesero $m): array
    {
        $total = $m->cocktail_points + $m->premium_points + $m->pitcher_points +
                 $m->bottle_points + $m->combo_points + $m->upsell_points + $m->rating_points;

        return [
            'id' => $m->id,
            'name' => $m->nombre,
            'initials' => $m->iniciales ?: strtoupper(collect(explode(' ', $m->nombre))->map(fn($w) => $w[0] ?? '')->join('')),
            'status' => $m->status ?? ($m->activo ? 'activo' : 'inactivo'),
            'cocktailPoints' => $m->cocktail_points ?? 0,
            'premiumPoints' => $m->premium_points ?? 0,
            'pitcherPoints' => $m->pitcher_points ?? 0,
            'bottlePoints' => $m->bottle_points ?? 0,
            'comboPoints' => $m->combo_points ?? 0,
            'upsellPoints' => $m->upsell_points ?? 0,
            'ratingPoints' => $m->rating_points ?? 0,
            'totalPoints' => $total,
            'totalSales' => (float) ($m->total_sales ?? 0),
            'ordersServed' => $m->orders_served ?? 0,
            'avgRating' => (float) ($m->avg_rating ?? 5.0),
        ];
    }

    private function fromFrontend(Request $request): array
    {
        $map = [];

        if ($request->has('name')) $map['nombre'] = $request->input('name');
        if ($request->has('initials')) $map['iniciales'] = $request->input('initials');
        if ($request->has('status')) {
            $map['status'] = $request->input('status');
            $map['activo'] = $request->input('status') === 'activo';
        }
        if ($request->has('cocktailPoints')) $map['cocktail_points'] = $request->input('cocktailPoints');
        if ($request->has('premiumPoints')) $map['premium_points'] = $request->input('premiumPoints');
        if ($request->has('pitcherPoints')) $map['pitcher_points'] = $request->input('pitcherPoints');
        if ($request->has('bottlePoints')) $map['bottle_points'] = $request->input('bottlePoints');
        if ($request->has('comboPoints')) $map['combo_points'] = $request->input('comboPoints');
        if ($request->has('upsellPoints')) $map['upsell_points'] = $request->input('upsellPoints');
        if ($request->has('ratingPoints')) $map['rating_points'] = $request->input('ratingPoints');
        if ($request->has('totalSales')) $map['total_sales'] = $request->input('totalSales');
        if ($request->has('ordersServed')) $map['orders_served'] = $request->input('ordersServed');
        if ($request->has('avgRating')) $map['avg_rating'] = $request->input('avgRating');

        return $map;
    }
}
