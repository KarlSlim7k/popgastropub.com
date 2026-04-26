<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Recompensa;
use Illuminate\Http\Request;

class RecompensaController extends Controller
{
    public function index()
    {
        return Recompensa::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'puntos_requeridos' => 'required|integer|min:0',
            'imagen' => 'nullable|string|max:255',
            'disponible' => 'boolean',
        ]);

        if (! isset($validated['disponible'])) {
            $validated['disponible'] = true;
        }

        $recompensa = Recompensa::create($validated);

        return response()->json($recompensa, 201);
    }

    public function show($id)
    {
        return Recompensa::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'puntos_requeridos' => 'required|integer|min:0',
            'imagen' => 'nullable|string|max:255',
            'disponible' => 'boolean',
        ]);

        $recompensa = Recompensa::findOrFail($id);
        $recompensa->update($validated);

        return response()->json($recompensa);
    }

    public function destroy($id)
    {
        $recompensa = Recompensa::findOrFail($id);
        $recompensa->delete();

        return response()->json(['message' => 'Recompensa eliminada.']);
    }
}
