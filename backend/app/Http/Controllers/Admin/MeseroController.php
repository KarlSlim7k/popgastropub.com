<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mesero;
use Illuminate\Http\Request;

class MeseroController extends Controller
{
    public function index()
    {
        return response()->json(Mesero::with('user')->orderBy('puntos', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'nombre' => 'required|string|max:255',
            'activo' => 'boolean',
        ]);

        $mesero = Mesero::create($validated);

        return response()->json($mesero, 201);
    }

    public function show($id)
    {
        return response()->json(Mesero::with('user')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $mesero = Mesero::findOrFail($id);
        $mesero->update($request->all());

        return response()->json($mesero);
    }

    public function destroy($id)
    {
        Mesero::findOrFail($id)->delete();

        return response()->json(['message' => 'Mesero eliminado']);
    }
}
