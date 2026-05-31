<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ReservaController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()) {
            return response()->json($request->user()->reservas()->orderBy('fecha', 'desc')->get());
        }

        return response()->json([]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'telefono' => 'required|string|max:50',
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required|date_format:H:i',
            'personas' => 'required|integer|min:1|max:20',
            'notas' => 'nullable|string',
        ]);

        $date = Carbon::parse($validated['fecha']);
        if ($date->dayOfWeek === Carbon::TUESDAY) {
            return response()->json(['message' => 'El restaurante está cerrado los martes.'], 422);
        }

        $hora = $validated['hora'];
        $dayOfWeek = $date->dayOfWeek;
        $closeTime = in_array($dayOfWeek, [Carbon::FRIDAY, Carbon::SATURDAY]) ? '22:00' : '21:30';
        if ($dayOfWeek === Carbon::SUNDAY) $closeTime = '21:00';

        if ($hora < '14:00' || $hora > $closeTime) {
            return response()->json(['message' => "Horario no disponible. Operamos de 14:00 a {$closeTime}."], 422);
        }

        $validated['estado'] = 'pendiente';
        if ($request->user()) {
            $validated['user_id'] = $request->user()->id;
        }

        $reserva = Reserva::create($validated);

        Log::channel('single')->info('NUEVA_RESERVA', [
            'id' => $reserva->id,
            'nombre' => $reserva->nombre,
            'telefono' => $reserva->telefono,
            'fecha' => $reserva->fecha,
            'hora' => $reserva->hora,
            'personas' => $reserva->personas,
            'user_id' => $reserva->user_id,
        ]);

        return response()->json([
            'reserva' => $reserva,
            'message' => 'Reservación creada exitosamente. El equipo de POP confirmará tu reservación.',
        ], 201);
    }

    public function cancel(Request $request, $id)
    {
        $reserva = Reserva::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();

        if ($reserva->estado === 'cancelada') {
            return response()->json(['message' => 'La reserva ya está cancelada.'], 422);
        }

        $reserva->update(['estado' => 'cancelada']);

        return response()->json(['message' => 'Reserva cancelada exitosamente.']);
    }
}
