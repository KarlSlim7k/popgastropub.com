<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mesero;
use App\Models\RankingPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class RankingPeriodController extends Controller
{
    public function index()
    {
        $periods = RankingPeriod::with('snapshots.mesero')
            ->orderByDesc('start_date')
            ->limit(12)
            ->get();

        $current = RankingPeriod::current();

        return response()->json([
            'current' => $current,
            'history' => $periods,
        ]);
    }

    public function rotate(Request $request)
    {
        $validated = $request->validate([
            'type' => 'nullable|in:weekly,monthly',
        ]);
        $type = $validated['type'] ?? 'monthly';
        Artisan::call('ranking:rotate', ['type' => $type]);

        return response()->json(['message' => 'Periodo rotado exitosamente']);
    }

    public function setMultiplier(Request $request)
    {
        $validated = $request->validate([
            'mesero_id' => 'nullable|exists:meseros,id',
            'multiplier' => 'required|numeric|min:1|max:3',
        ]);

        if (! empty($validated['mesero_id'])) {
            Mesero::where('id', $validated['mesero_id'])->update(['point_multiplier' => $validated['multiplier']]);
            $mesero = Mesero::find($validated['mesero_id']);
            if ($mesero) {
                \App\Models\StaffNotification::send(
                    $mesero->id,
                    'multiplier',
                    '¡Multiplicador activado!',
                    "Tienes un multiplicador de {$validated['multiplier']}x puntos. ¡Aprovecha!",
                    ['multiplier' => (float) $validated['multiplier']]
                );
            }
        } else {
            $meseros = Mesero::where('activo', true)->get();
            Mesero::where('activo', true)->update(['point_multiplier' => $validated['multiplier']]);
            foreach ($meseros as $mesero) {
                \App\Models\StaffNotification::send(
                    $mesero->id,
                    'multiplier',
                    '¡Multiplicador global activado!',
                    "Todos ganan {$validated['multiplier']}x puntos. ¡Aprovecha!",
                    ['multiplier' => (float) $validated['multiplier']]
                );
            }
        }

        return response()->json(['message' => 'Multiplicador actualizado']);
    }
}
