<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
        $perPage = min((int) $request->input('per_page', 20), 100);
        $paginated = Pedido::with('user')
            ->when($request->input('estado'), fn($q, $v) => $q->where('estado', $v))
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $paginated->items(),
            'meta' => ['current_page' => $paginated->currentPage(), 'last_page' => $paginated->lastPage(), 'total' => $paginated->total()],
        ]);
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

        $points = LoyaltyConfig::pointsForAmount((float) $pedido->total);

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
            $bonus = (int) LoyaltyConfig::get('referral_bonus');
            $referrer->increment('points', $bonus);

            LoyaltyTransaction::create([
                'user_id' => $referrer->id,
                'points' => $bonus,
                'concept' => 'Referido convertido: ' . $user->name,
            ]);
        }

        $referral->update(['status' => 'converted', 'converted_at' => now()]);
    }
}
