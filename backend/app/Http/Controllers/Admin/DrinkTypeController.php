<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DrinkType;
use Illuminate\Http\Request;

class DrinkTypeController extends Controller
{
    public function index()
    {
        return response()->json(
            DrinkType::ordered()->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'slug' => 'required|string|max:50|alpha_dash|unique:drink_types,slug',
            'label' => 'required|string|max:100',
            'points' => 'required|integer|min:0',
            'icon' => 'nullable|string|max:50',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ], [
            'slug.required' => 'El identificador es obligatorio.',
            'slug.unique' => 'Este identificador ya existe.',
            'slug.alpha_dash' => 'El identificador solo puede contener letras, números y guiones.',
            'label.required' => 'El nombre es obligatorio.',
            'points.required' => 'Los puntos son obligatorios.',
            'points.min' => 'Los puntos no pueden ser negativos.',
        ]);

        $drinkType = DrinkType::create([
            'slug' => strtolower(trim($request->input('slug'))),
            'label' => trim($request->input('label')),
            'points' => (int) $request->input('points'),
            'icon' => $request->input('icon', 'local_bar'),
            'active' => $request->boolean('active', true),
            'sort_order' => (int) $request->input('sort_order', 0),
        ]);

        return response()->json($drinkType, 201);
    }

    public function show($id)
    {
        return response()->json(DrinkType::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $drinkType = DrinkType::findOrFail($id);

        $request->validate([
            'slug' => 'sometimes|string|max:50|alpha_dash|unique:drink_types,slug,' . $id,
            'label' => 'sometimes|string|max:100',
            'points' => 'sometimes|integer|min:0',
            'icon' => 'nullable|string|max:50',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ], [
            'slug.unique' => 'Este identificador ya existe.',
            'slug.alpha_dash' => 'El identificador solo puede contener letras, números y guiones.',
            'points.min' => 'Los puntos no pueden ser negativos.',
        ]);

        $data = [];
        if ($request->has('slug')) $data['slug'] = strtolower(trim($request->input('slug')));
        if ($request->has('label')) $data['label'] = trim($request->input('label'));
        if ($request->has('points')) $data['points'] = (int) $request->input('points');
        if ($request->has('icon')) $data['icon'] = $request->input('icon');
        if ($request->has('active')) $data['active'] = $request->boolean('active');
        if ($request->has('sort_order')) $data['sort_order'] = (int) $request->input('sort_order');

        $drinkType->update($data);

        return response()->json($drinkType->fresh());
    }

    public function destroy($id)
    {
        $drinkType = DrinkType::findOrFail($id);

        $productsUsingType = \App\Models\Producto::where('bar_type', $drinkType->slug)->count();
        if ($productsUsingType > 0) {
            return response()->json([
                'message' => "No se puede eliminar: {$productsUsingType} bebidas usan este tipo. Reasígnalas primero.",
            ], 422);
        }

        $drinkType->delete();

        return response()->json(['message' => 'Tipo de bebida eliminado']);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'order' => 'required|array',
            'order.*.id' => 'required|exists:drink_types,id',
            'order.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($request->input('order') as $item) {
            DrinkType::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Orden actualizado']);
    }
}
