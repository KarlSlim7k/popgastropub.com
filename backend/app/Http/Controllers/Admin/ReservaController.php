<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\PushNotificationController;
use App\Models\Mesa;
use App\Models\Reserva;
use App\Services\ReservaMailService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 20), 100);
        $paginated = Reserva::with(['user', 'mesa'])
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
            'estado' => 'sometimes|required|in:pendiente,confirmada,cancelada,completada',
            'mesa_id' => 'sometimes|nullable|exists:mesas,id',
            'notificar' => 'sometimes|boolean',
        ]);

        $reserva = Reserva::findOrFail($id);

        if (array_key_exists('mesa_id', $validated) && $validated['mesa_id']) {
            $conflicto = Reserva::where('id', '!=', $reserva->id)
                ->where('mesa_id', $validated['mesa_id'])
                ->whereDate('fecha', $reserva->fecha)
                ->whereIn('estado', ['confirmada', 'sentada'])
                ->whereRaw('ABS(TIME_TO_SEC(TIMEDIFF(hora, ?))) < ?', [$reserva->hora, 2 * 3600])
                ->exists();

            if ($conflicto) {
                return response()->json([
                    'message' => 'Esta mesa ya está asignada a otra reserva en un horario cercano.',
                ], 409);
            }
        }

        $data = [];
        if (array_key_exists('estado', $validated)) $data['estado'] = $validated['estado'];
        if (array_key_exists('mesa_id', $validated)) $data['mesa_id'] = $validated['mesa_id'];

        $reserva->update($data);

        if (array_key_exists('estado', $validated) && $validated['notificar'] ?? true) {
            app(ReservaMailService::class)->notifyCustomer($reserva, $validated['estado']);

            if ($reserva->user_id) {
                $labels = ['confirmada' => '✅ Confirmada', 'cancelada' => '❌ Cancelada', 'completada' => 'Completada'];
                if (isset($labels[$validated['estado']])) {
                    PushNotificationController::sendToUser(
                        $reserva->user_id,
                        'Tu reservación en POP Perote',
                        'Tu reserva del ' . $reserva->fecha . ' a las ' . $reserva->hora . ' está: ' . $labels[$validated['estado']]
                    );
                }
            }
        }

        return response()->json($reserva->fresh('mesa'));
    }

    public function disponibilidad(Request $request)
    {
        $mes = $request->input('mes', now()->format('Y-m'));
        $inicio = Carbon::parse($mes . '-01')->startOfMonth();
        $fin = $inicio->copy()->endOfMonth();

        $total = Mesa::activa()->count();

        $ocupadasPorDia = Reserva::whereBetween('fecha', [$inicio->toDateString(), $fin->toDateString()])
            ->whereIn('estado', ['confirmada', 'sentada'])
            ->whereNotNull('mesa_id')
            ->select('fecha')
            ->selectRaw('COUNT(DISTINCT mesa_id) as ocupadas')
            ->groupBy('fecha')
            ->pluck('ocupadas', 'fecha');

        $dias = [];
        for ($dia = $inicio->copy(); $dia->lte($fin); $dia->addDay()) {
            $fecha = $dia->toDateString();
            $ocupadas = (int) ($ocupadasPorDia[$fecha] ?? 0);
            $dias[] = [
                'fecha' => $fecha,
                'ocupadas' => $ocupadas,
                'libres' => max($total - $ocupadas, 0),
                'total' => $total,
            ];
        }

        return response()->json($dias);
    }

    public function destroy($id)
    {
        $reserva = Reserva::findOrFail($id);
        $reserva->delete();

        return response()->json(['message' => 'Reserva eliminada.']);
    }
}
