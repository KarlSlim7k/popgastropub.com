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
            'puntos_requeridos' => 'required|integer|min:1',
            'imagen' => 'nullable|string|max:500',
            'disponible' => 'boolean',
            'categoria' => 'nullable|string|max:100',
            'tier' => 'nullable|in:fan,lover,vip,elite',
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
            'puntos_requeridos' => 'required|integer|min:1',
            'imagen' => 'nullable|string|max:500',
            'disponible' => 'boolean',
            'categoria' => 'nullable|string|max:100',
            'tier' => 'nullable|in:fan,lover,vip,elite',
        ]);

        $recompensa = Recompensa::findOrFail($id);
        $recompensa->update($validated);

        return response()->json($recompensa);
    }

    public function destroy($id)
    {
        $recompensa = Recompensa::findOrFail($id);

        if ($recompensa->redemptions()->exists()) {
            abort(422, 'La recompensa tiene canjes registrados. Puedes pausarla, pero no eliminarla.');
        }

        $recompensa->delete();

        return response()->json(['message' => 'Recompensa eliminada.']);
    }
}
