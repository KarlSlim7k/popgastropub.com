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

    public function redeem(Request $request, $id)
    {
        $recompensa = Recompensa::where('id', $id)
            ->where('disponible', true)
            ->first();

        if (! $recompensa) {
            return response()->json(['message' => 'Recompensa no disponible.'], 404);
        }

        $user = $request->user();

        if ($user->points < $recompensa->puntos_requeridos) {
            return response()->json(['message' => 'Puntos insuficientes.'], 422);
        }

        $redemption = DB::transaction(function () use ($user, $recompensa) {
            $user->points -= $recompensa->puntos_requeridos;
            $user->save();

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
