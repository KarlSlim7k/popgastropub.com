<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()) {
            return $request->user()->reservas()->orderBy('fecha', 'desc')->get();
        }

        $telefono = $request->query('telefono');

        if ($telefono) {
            return Reserva::where('telefono', $telefono)
                ->orderBy('fecha', 'desc')
                ->get();
        }

        return response()->json([]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'telefono' => 'required|string|max:50',
            'fecha' => 'required|date',
            'hora' => 'required|date_format:H:i',
            'personas' => 'required|integer|min:1',
            'notas' => 'nullable|string',
        ]);

        $validated['estado'] = 'pendiente';

        if ($request->user()) {
            $validated['user_id'] = $request->user()->id;
        }

        $reserva = Reserva::create($validated);

        return response()->json($reserva, 201);
    }
}
