<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyTransaction;
use App\Models\Recompensa;
use App\Models\RewardRedemption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecompensaController extends Controller
{
    public function index()
    {
        return Recompensa::where('disponible', true)->get();
    }

    public function history(Request $request)
    {
        return $request->user()->redemptions()
            ->with('recompensa:id,nombre,imagen,puntos_requeridos')
            ->orderByDesc('created_at')
            ->get();
    }

    public function redeem(Request $request, $id)
    {
        abort_unless($request->user()->role === 'cliente', 403, 'Solo los clientes pueden canjear recompensas.');

        $redemption = DB::transaction(function () use ($request, $id) {
            $recompensa = Recompensa::where('id', $id)
                ->where('disponible', true)
                ->lockForUpdate()
                ->first();

            if (! $recompensa) {
                abort(404, 'Recompensa no disponible.');
            }

            $user = \App\Models\User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();

            if ($user->points < $recompensa->puntos_requeridos) {
                abort(422, 'Puntos insuficientes.');
            }

            $user->decrement('points', $recompensa->puntos_requeridos);

            $redemption = RewardRedemption::create([
                'user_id' => $user->id,
                'recompensa_id' => $recompensa->id,
                'puntos_usados' => $recompensa->puntos_requeridos,
                'estado' => 'canjeado',
            ]);

            LoyaltyTransaction::create([
                'user_id' => $user->id,
                'points' => -$recompensa->puntos_requeridos,
                'concept' => 'Canje: ' . $recompensa->nombre,
            ]);

            return $redemption;
        });

        return response()->json($redemption->load('recompensa'));
    }
}
