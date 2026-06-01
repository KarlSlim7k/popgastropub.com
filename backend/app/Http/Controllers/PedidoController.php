<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyTransaction;
use App\Models\Pedido;
use App\Models\Referral;
use App\Models\User;
use App\Services\LoyaltyConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->pedidos()->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->role === 'cliente', 403, 'Solo los clientes pueden registrar pedidos.');

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'total' => 'required|numeric|min:0.01',
            'foodbooking_ref' => 'nullable|string|max:255',
            'notas' => 'nullable|string',
        ]);

        $puntosGanados = LoyaltyConfig::pointsForAmount((float) $validated['total']);

        $pedido = DB::transaction(function () use ($request, $validated, $puntosGanados) {
            $pedido = Pedido::create([
                ...$validated,
                'puntos_ganados' => $puntosGanados,
                'estado' => 'pendiente',
                'user_id' => $request->user()->id,
            ]);

            $user = User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();

            if ($puntosGanados > 0) {
                $user->increment('points', $puntosGanados);
                LoyaltyTransaction::create([
                    'user_id' => $user->id,
                    'points' => $puntosGanados,
                    'concept' => "Pedido #{$pedido->id} - \${$validated['total']} MXN",
                ]);
            }

            $user->increment('orders_count');
            $user->increment('total_spent', $validated['total']);

            // Convert referral on first order
            if ($user->orders_count <= 1) {
                $this->convertReferral($user);
            }

            return $pedido;
        });

        return response()->json($pedido, 201);
    }

    private function convertReferral(User $referredUser): void
    {
        $referral = Referral::where('referred_id', $referredUser->id)
            ->where('status', 'pending')
            ->first();

        if (!$referral) return;

        $referral->update(['status' => 'converted', 'converted_at' => now()]);

        // Award referral bonus to referrer
        $referrer = User::whereKey($referral->referrer_id)->lockForUpdate()->first();
        if ($referrer) {
            $bonus = (int) LoyaltyConfig::get('referral_bonus');
            $referrer->increment('points', $bonus);
            LoyaltyTransaction::create([
                'user_id' => $referrer->id,
                'points' => $bonus,
                'concept' => "Referido convertido: {$referredUser->name}",
            ]);
        }
    }
}
