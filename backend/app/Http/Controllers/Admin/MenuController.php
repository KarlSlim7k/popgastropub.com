<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        return response()->json(Producto::orderBy('categoria')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'categoria' => 'required|string',
            'imagen' => 'nullable|string',
            'disponible' => 'boolean',
            'destacado' => 'boolean',
        ]);

        $producto = Producto::create($validated);

        return response()->json($producto, 201);
    }

    public function show($id)
    {
        return response()->json(Producto::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);
        $producto->update($request->all());

        return response()->json($producto);
    }

    public function destroy($id)
    {
        Producto::findOrFail($id)->delete();

        return response()->json(['message' => 'Producto eliminado']);
    }
}
