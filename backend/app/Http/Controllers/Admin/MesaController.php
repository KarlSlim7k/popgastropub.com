<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mesa;
use Illuminate\Http\Request;

class MesaController extends Controller
{
    public function index()
    {
        return response()->json(Mesa::orderBy('numero')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero' => 'required|integer|min:1|unique:mesas,numero',
            'capacidad' => 'required|integer|min:1',
            'activa' => 'nullable|boolean',
        ], [
            'numero.required' => 'El número de mesa es obligatorio.',
            'numero.unique' => 'Ya existe una mesa con ese número.',
            'capacidad.required' => 'La capacidad es obligatoria.',
        ]);

        $mesa = Mesa::create([
            'numero' => $validated['numero'],
            'capacidad' => $validated['capacidad'],
            'activa' => $request->boolean('activa', true),
        ]);

        return response()->json($mesa, 201);
    }

    public function show($id)
    {
        return response()->json(Mesa::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $mesa = Mesa::findOrFail($id);

        $validated = $request->validate([
            'numero' => 'sometimes|required|integer|min:1|unique:mesas,numero,' . $id,
            'capacidad' => 'sometimes|required|integer|min:1',
            'activa' => 'nullable|boolean',
        ], [
            'numero.unique' => 'Ya existe una mesa con ese número.',
        ]);

        $data = [];
        if (array_key_exists('numero', $validated)) $data['numero'] = $validated['numero'];
        if (array_key_exists('capacidad', $validated)) $data['capacidad'] = $validated['capacidad'];
        if ($request->has('activa')) $data['activa'] = $request->boolean('activa');

        $mesa->update($data);

        return response()->json($mesa->fresh());
    }

    public function destroy($id)
    {
        $mesa = Mesa::findOrFail($id);

        $enUso = $mesa->reservas()->whereIn('estado', ['confirmada', 'sentada'])->count();
        if ($enUso > 0) {
            return response()->json([
                'message' => "No se puede eliminar: {$enUso} reserva(s) activa(s) usan esta mesa.",
            ], 422);
        }

        $mesa->delete();

        return response()->json(['message' => 'Mesa eliminada.']);
    }
}
