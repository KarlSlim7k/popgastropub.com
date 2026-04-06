<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promocion;
use Illuminate\Http\Request;

class PromocionController extends Controller
{
    public function index()
    {
        return response()->json(Promocion::orderBy('dia_inicio')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio_original' => 'required|numeric|min:0',
            'precio_promo' => 'required|numeric|min:0',
            'dia_inicio' => 'required|string',
            'dia_fin' => 'required|string',
            'imagen' => 'nullable|string',
            'activa' => 'boolean',
        ]);

        $promocion = Promocion::create($validated);

        return response()->json($promocion, 201);
    }

    public function show($id)
    {
        return response()->json(Promocion::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $promocion = Promocion::findOrFail($id);
        $promocion->update($request->all());

        return response()->json($promocion);
    }

    public function destroy($id)
    {
        Promocion::findOrFail($id)->delete();

        return response()->json(['message' => 'Promoción eliminada']);
    }
}
