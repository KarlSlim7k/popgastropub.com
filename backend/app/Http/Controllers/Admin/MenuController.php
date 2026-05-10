<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        $productos = Producto::orderBy('categoria')->get();

        return response()->json($productos->map(fn($p) => $this->toFrontend($p)));
    }

    public function store(Request $request)
    {
        $data = $this->fromFrontend($request);

        $producto = Producto::create($data);

        return response()->json($this->toFrontend($producto), 201);
    }

    public function show($id)
    {
        return response()->json($this->toFrontend(Producto::findOrFail($id)));
    }

    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);
        $data = $this->fromFrontend($request);
        $producto->update($data);

        return response()->json($this->toFrontend($producto->fresh()));
    }

    public function destroy($id)
    {
        Producto::findOrFail($id)->delete();

        return response()->json(['message' => 'Producto eliminado']);
    }

    private function toFrontend(Producto $p): array
    {
        return [
            'id' => $p->id,
            'name' => $p->nombre,
            'category' => $p->categoria,
            'price' => (float) $p->precio,
            'cost' => (float) $p->costo,
            'stock' => $p->stock,
            'status' => $p->status,
            'active' => $p->disponible,
            'image' => $p->imagen ?? '',
            'orders' => $p->pedidos_count,
            'rating' => (float) $p->rating,
            'hasPromo' => $p->tiene_promo,
            'promoPrice' => $p->precio_promo ? (float) $p->precio_promo : null,
            'allergens' => $p->alergenos ?? [],
        ];
    }

    private function fromFrontend(Request $request): array
    {
        $map = [];

        if ($request->has('name')) $map['nombre'] = $request->input('name');
        if ($request->has('category')) $map['categoria'] = $request->input('category');
        if ($request->has('price')) $map['precio'] = $request->input('price');
        if ($request->has('cost')) $map['costo'] = $request->input('cost');
        if ($request->has('stock')) $map['stock'] = $request->input('stock');
        if ($request->has('status')) $map['status'] = $request->input('status');
        if ($request->has('active')) $map['disponible'] = $request->input('active');
        if ($request->has('image')) $map['imagen'] = $request->input('image');
        if ($request->has('hasPromo')) $map['tiene_promo'] = $request->input('hasPromo');
        if ($request->has('promoPrice')) $map['precio_promo'] = $request->input('promoPrice');
        if ($request->has('allergens')) $map['alergenos'] = $request->input('allergens');
        if ($request->has('rating')) $map['rating'] = $request->input('rating');
        if ($request->has('orders')) $map['pedidos_count'] = $request->input('orders');

        return $map;
    }
}
