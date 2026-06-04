<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 50), 200);
        $query = Producto::orderBy('categoria')->orderBy('nombre');

        if ($request->input('categoria')) $query->where('categoria', $request->input('categoria'));
        if ($request->input('search')) $query->where('nombre', 'like', '%' . $request->input('search') . '%');

        if ($request->boolean('all')) {
            return response()->json(Producto::orderBy('categoria')->get()->map(fn($p) => $this->toFrontend($p)));
        }

        $paginated = $query->paginate($perPage);

        return response()->json([
            'data' => $paginated->map(fn($p) => $this->toFrontend($p)),
            'meta' => ['current_page' => $paginated->currentPage(), 'last_page' => $paginated->lastPage(), 'total' => $paginated->total()],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'bar_type' => 'nullable|string|in:cocktail,premium,pitcher,bottle,combo,upsell',
            'ranking_points' => 'nullable|integer|min:0',
            'price' => 'required|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0|max:100',
            'status' => 'nullable|string|in:available,low,out',
            'active' => 'nullable|boolean',
            'featured' => 'nullable|boolean',
            'image' => 'nullable|string|max:500',
            'allergens' => 'nullable|array',
            'allergens.*' => 'string|max:100',
            'hasPromo' => 'nullable|boolean',
            'promoPrice' => 'nullable|required_if:hasPromo,true|numeric|min:0',
        ]);

        $producto = Producto::create($this->fromFrontend($request));

        return response()->json($this->toFrontend($producto), 201);
    }

    public function show($id)
    {
        return response()->json($this->toFrontend(Producto::findOrFail($id)));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|string|max:100',
            'bar_type' => 'nullable|string|in:cocktail,premium,pitcher,bottle,combo,upsell',
            'ranking_points' => 'nullable|integer|min:0',
            'price' => 'sometimes|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0|max:100',
            'status' => 'nullable|string|in:available,low,out',
            'active' => 'nullable|boolean',
            'featured' => 'nullable|boolean',
            'image' => 'nullable|string|max:500',
            'allergens' => 'nullable|array',
            'allergens.*' => 'string|max:100',
            'hasPromo' => 'nullable|boolean',
            'promoPrice' => 'nullable|required_if:hasPromo,true|numeric|min:0',
        ]);

        $producto = Producto::findOrFail($id);
        $producto->update($this->fromFrontend($request));

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
            'description' => $p->descripcion ?? '',
            'category' => $p->categoria,
            'bar_type' => $p->bar_type,
            'ranking_points' => $p->ranking_points ?? 0,
            'price' => (float) $p->precio,
            'cost' => (float) $p->costo,
            'stock' => $p->stock,
            'status' => $p->status,
            'active' => $p->disponible,
            'featured' => $p->destacado,
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
        if ($request->has('description')) $map['descripcion'] = $request->input('description');
        if ($request->has('category')) $map['categoria'] = $request->input('category');
        if ($request->has('bar_type')) $map['bar_type'] = $request->input('bar_type');
        if ($request->has('ranking_points')) $map['ranking_points'] = $request->input('ranking_points');
        if ($request->has('price')) $map['precio'] = $request->input('price');
        if ($request->has('cost')) $map['costo'] = $request->input('cost');
        if ($request->has('stock')) $map['stock'] = $request->input('stock');
        if ($request->has('status')) $map['status'] = $request->input('status');
        if ($request->has('active')) $map['disponible'] = $request->input('active');
        if ($request->has('featured')) $map['destacado'] = $request->input('featured');
        if ($request->has('image')) $map['imagen'] = $request->input('image');
        if ($request->has('hasPromo')) {
            $map['tiene_promo'] = $request->boolean('hasPromo');
            if (! $map['tiene_promo']) $map['precio_promo'] = null;
        }
        if ($request->has('promoPrice')) $map['precio_promo'] = $request->input('promoPrice');
        if ($request->has('allergens')) $map['alergenos'] = $request->input('allergens');
        if ($request->has('rating')) $map['rating'] = $request->input('rating');
        if ($request->has('orders')) $map['pedidos_count'] = $request->input('orders');

        return $map;
    }
}
