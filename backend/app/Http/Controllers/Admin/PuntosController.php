<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyTransaction;
use App\Models\RewardRedemption;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PuntosController extends Controller
{
    public function stats()
    {
        return response()->json([
            'totalMembers' => User::where('role', 'cliente')->count(),
            'totalPointsIssued' => User::sum('points'),
            'totalRedemptions' => RewardRedemption::count(),
            'activeThisMonth' => User::where('role', 'cliente')
                ->where(function ($q) {
                    $q->whereMonth('last_visit', now()->month)
                      ->orWhereMonth('created_at', now()->month);
                })->count(),
        ]);
    }

    public function tiers()
    {
        return response()->json([
            ['name' => 'POP Fan', 'range' => '0-499 pts', 'members' => User::where('role', 'cliente')->where('points', '<', 500)->count()],
            ['name' => 'POP Lover', 'range' => '500-1,499 pts', 'members' => User::where('role', 'cliente')->whereBetween('points', [500, 1499])->count()],
            ['name' => 'POP VIP', 'range' => '1,500-2,999 pts', 'members' => User::where('role', 'cliente')->whereBetween('points', [1500, 2999])->count()],
            ['name' => 'POP Elite', 'range' => '3,000+ pts', 'members' => User::where('role', 'cliente')->where('points', '>=', 3000)->count()],
        ]);
    }

    public function topMembers()
    {
        $users = User::where('role', 'cliente')->orderBy('points', 'desc')->limit(5)->get();

        $tierColors = ['fan' => 'text-gray-300', 'lover' => 'text-pop-light-gold', 'vip' => 'text-pop-orange', 'elite' => 'text-pop-gold'];

        return response()->json($users->values()->map(function ($u, $i) use ($tierColors) {
            return [
                'rank' => $i + 1,
                'name' => $u->name,
                'initials' => strtoupper(collect(explode(' ', $u->name))->map(fn($w) => $w[0] ?? '')->join('')),
                'points' => $u->points,
                'tier' => 'POP ' . ucfirst($u->tier),
                'tierColor' => $tierColors[$u->tier] ?? 'text-gray-300',
                'visits' => $u->orders_count ?? 0,
                'orders' => $u->orders_count ?? 0,
                'redeemed' => RewardRedemption::where('user_id', $u->id)->count(),
            ];
        }));
    }

    public function activity()
    {
        $transactions = LoyaltyTransaction::with('user')->orderBy('created_at', 'desc')->limit(10)->get();

        return response()->json($transactions->map(fn($t) => [
            'id' => 'ACT-' . str_pad($t->id, 3, '0', STR_PAD_LEFT),
            'name' => $t->user?->name ?? 'Usuario',
            'initials' => strtoupper(collect(explode(' ', $t->user?->name ?? 'U'))->map(fn($w) => $w[0] ?? '')->join('')),
            'action' => $t->concept ?? 'compra',
            'points' => $t->points,
            'time' => $t->created_at->diffForHumans(),
            'tier' => 'POP ' . ucfirst($t->user?->tier ?? 'fan'),
            'tierColor' => 'text-pop-gold',
        ]));
    }

    public function redeem(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'points' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        $newPoints = DB::transaction(function () use ($request) {
            $user = User::whereKey($request->input('user_id'))->lockForUpdate()->firstOrFail();
            $points = (int) $request->input('points');
            $description = $request->input('description') ?: 'Canje manual admin';

            if ($user->role !== 'cliente') {
                abort(422, 'Solo puedes registrar canjes para clientes.');
            }

            if ($user->points < $points) {
                abort(422, 'Puntos insuficientes');
            }

            $user->decrement('points', $points);

            RewardRedemption::create([
                'user_id' => $user->id,
                'recompensa_id' => null,
                'puntos_usados' => $points,
                'estado' => 'canjeado',
                'descripcion' => $description,
            ]);

            LoyaltyTransaction::create([
                'user_id' => $user->id,
                'points' => -$points,
                'concept' => $description,
            ]);

            return $user->fresh()->points;
        });

        return response()->json(['message' => 'Canje registrado', 'newPoints' => $newPoints]);
    }
}
