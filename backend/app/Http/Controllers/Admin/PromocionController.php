<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promocion;
use Illuminate\Http\Request;

class PromocionController extends Controller
{
    public function index()
    {
        $promos = Promocion::orderBy('created_at', 'desc')->get();

        return response()->json($promos->map(fn($p) => $this->toFrontend($p)));
    }

    public function store(Request $request)
    {
        $data = $this->fromFrontend($request);
        $promo = Promocion::create($data);

        return response()->json($this->toFrontend($promo), 201);
    }

    public function show($id)
    {
        return response()->json($this->toFrontend(Promocion::findOrFail($id)));
    }

    public function update(Request $request, $id)
    {
        $promo = Promocion::findOrFail($id);
        $data = $this->fromFrontend($request);
        $promo->update($data);

        return response()->json($this->toFrontend($promo->fresh()));
    }

    public function destroy($id)
    {
        Promocion::findOrFail($id)->delete();

        return response()->json(['message' => 'Promoción eliminada']);
    }

    private function toFrontend(Promocion $p): array
    {
        return [
            'id' => (string) $p->id,
            'name' => $p->titulo,
            'description' => $p->descripcion ?? '',
            'type' => $p->tipo ?? 'descuento',
            'discount' => $p->descuento ?? '',
            'startDate' => $p->dia_inicio ?? '',
            'endDate' => $p->dia_fin ?? '',
            'daysActive' => $p->dias_activos ?? '',
            'status' => $p->estado ?? ($p->activa ? 'activa' : 'pausada'),
            'redemptions' => $p->redenciones ?? 0,
            'target' => $p->meta ?? 0,
            'revenue' => '$' . number_format((float) ($p->ingresos ?? 0), 0),
            'image' => $p->imagen ?? '',
            'imageAlt' => $p->titulo,
        ];
    }

    private function fromFrontend(Request $request): array
    {
        $map = [];

        if ($request->has('name')) $map['titulo'] = $request->input('name');
        if ($request->has('description')) $map['descripcion'] = $request->input('description');
        if ($request->has('type')) $map['tipo'] = $request->input('type');
        if ($request->has('discount')) $map['descuento'] = $request->input('discount');
        if ($request->has('startDate')) $map['dia_inicio'] = $request->input('startDate');
        if ($request->has('endDate')) $map['dia_fin'] = $request->input('endDate');
        if ($request->has('daysActive')) $map['dias_activos'] = $request->input('daysActive');
        if ($request->has('status')) {
            $map['estado'] = $request->input('status');
            $map['activa'] = $request->input('status') === 'activa';
        }
        if ($request->has('target')) $map['meta'] = $request->input('target');
        if ($request->has('image')) $map['imagen'] = $request->input('image');
        if ($request->has('redemptions')) $map['redenciones'] = $request->input('redemptions');

        return $map;
    }
}
