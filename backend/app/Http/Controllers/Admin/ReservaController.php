<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reserva;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    public function index()
    {
        return Reserva::with('user')->orderBy('fecha', 'desc')->get();
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'estado' => 'required|in:pendiente,confirmada,cancelada,completada',
        ]);

        $reserva = Reserva::findOrFail($id);
        $reserva->update(['estado' => $validated['estado']]);

        return response()->json($reserva);
    }

    public function destroy($id)
    {
        $reserva = Reserva::findOrFail($id);
        $reserva->delete();

        return response()->json(['message' => 'Reserva eliminada.']);
    }
}
