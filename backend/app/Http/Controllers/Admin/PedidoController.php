<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyTransaction;
use App\Models\Pedido;
use App\Models\Referral;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    public function index()
    {
        return Pedido::with('user')->orderBy('created_at', 'desc')->get();
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'estado' => 'required|in:pendiente,preparando,listo,entregado,cancelado',
        ]);

        $pedido = DB::transaction(function () use ($validated, $id) {
            $pedido = Pedido::whereKey($id)->lockForUpdate()->firstOrFail();

            if ($pedido->puntos_acreditados_at && $validated['estado'] !== 'entregado') {
                abort(422, 'El pedido ya acreditó puntos y no puede cambiar de estado.');
            }

            $pedido->update(['estado' => $validated['estado']]);

            if ($validated['estado'] === 'entregado' && ! $pedido->puntos_acreditados_at && $pedido->user_id) {
                $this->creditDeliveredOrder($pedido);
            }

            return $pedido->fresh()->load('user');
        });

        return response()->json($pedido);
    }

    public function destroy($id)
    {
        $pedido = Pedido::findOrFail($id);

        if ($pedido->puntos_acreditados_at) {
            abort(422, 'El pedido ya acreditó puntos y no puede eliminarse.');
        }

        $pedido->delete();

        return response()->json(['message' => 'Pedido eliminado.']);
    }

    private function creditDeliveredOrder(Pedido $pedido): void
    {
        $user = User::whereKey($pedido->user_id)->lockForUpdate()->first();
        if (! $user) {
            return;
        }

        $points = (int) floor((float) $pedido->total / 10);

        $pedido->update([
            'puntos_ganados' => $points,
            'puntos_acreditados_at' => now(),
        ]);

        $user->increment('points', $points);
        $user->increment('orders_count');
        $user->increment('total_spent', (float) $pedido->total);

        if ($points > 0) {
            LoyaltyTransaction::create([
                'user_id' => $user->id,
                'points' => $points,
                'concept' => 'Pedido entregado #' . $pedido->id,
            ]);
        }

        $referral = Referral::where('referred_id', $user->id)
            ->where('status', 'pending')
            ->lockForUpdate()
            ->first();

        if (! $referral) {
            return;
        }

        $referrer = User::whereKey($referral->referrer_id)->lockForUpdate()->first();
        if ($referrer) {
            $referrer->increment('points', 200);

            LoyaltyTransaction::create([
                'user_id' => $referrer->id,
                'points' => 200,
                'concept' => 'Referido convertido: ' . $user->name,
            ]);
        }

        $referral->update(['status' => 'converted', 'converted_at' => now()]);
    }
}
