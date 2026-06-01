<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reserva;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 20), 100);
        $paginated = Reserva::with('user')
            ->when($request->input('estado'), fn($q, $v) => $q->where('estado', $v))
            ->when($request->input('fecha'), fn($q, $v) => $q->whereDate('fecha', $v))
            ->orderBy('fecha', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $paginated->items(),
            'meta' => ['current_page' => $paginated->currentPage(), 'last_page' => $paginated->lastPage(), 'total' => $paginated->total()],
        ]);
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
