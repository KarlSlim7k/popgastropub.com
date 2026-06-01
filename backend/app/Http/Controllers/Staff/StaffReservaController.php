<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Reserva;
use App\Models\Setting;
use Illuminate\Http\Request;

class StaffReservaController extends Controller
{
    public function index(Request $request)
    {
        $fecha = $request->input('fecha', today()->toDateString());

        $reservas = Reserva::whereDate('fecha', $fecha)->orderBy('hora')->get();

        $settings = Setting::getGroup('restaurant');
        $totalMesas = (int) ($settings['total_mesas'] ?? 12);
        $ocupadas = $reservas->whereIn('estado', ['confirmada', 'sentada'])->count();

        return response()->json([
            'fecha' => $fecha,
            'reservas' => $reservas,
            'salon' => [
                'total_mesas' => $totalMesas,
                'ocupadas' => $ocupadas,
                'disponibles' => $totalMesas - $ocupadas,
                'ocupacion_pct' => round(($ocupadas / $totalMesas) * 100),
            ],
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,confirmada,sentada,completada,cancelada,no_show',
        ]);

        $reserva = Reserva::findOrFail($id);
        $reserva->update(['estado' => $request->input('estado')]);

        return response()->json($reserva);
    }
}
