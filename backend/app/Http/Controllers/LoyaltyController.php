<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyTransaction;
use App\Models\User;
use App\Services\LoyaltyConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoyaltyController extends Controller
{
    public function points(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => $user,
            'recent_transactions' => $user->loyaltyTransactions()->latest()->limit(5)->get()
        ]);
    }

    public function tier(Request $request)
    {
        $user = $request->user();

        $tiers = [
            'fan'   => ['min' => 0,                                          'max' => LoyaltyConfig::tierMin('lover') - 1, 'name' => 'POP Fan'],
            'lover' => ['min' => LoyaltyConfig::tierMin('lover'),            'max' => LoyaltyConfig::tierMin('vip') - 1,   'name' => 'POP Lover'],
            'vip'   => ['min' => LoyaltyConfig::tierMin('vip'),              'max' => LoyaltyConfig::tierMin('elite') - 1, 'name' => 'POP VIP'],
            'elite' => ['min' => LoyaltyConfig::tierMin('elite'),            'max' => null,                                 'name' => 'POP Elite'],
        ];

        $nextTier = $this->getNextTier($user->tier, $tiers);

        return response()->json([
            'user' => $user,
            'current_tier' => $tiers[$user->tier],
            'points' => $user->points,
            'next_tier' => $nextTier,
            'progress' => [
                'current' => $user->points,
                'min' => $tiers[$user->tier]['min'],
                'max' => $tiers[$user->tier]['max'],
                'next_min' => $nextTier ? $nextTier['min'] : null,
            ]
        ]);
    }

    public function checkin(Request $request)
    {
        abort_unless($request->user()->role === 'cliente', 403, 'Solo los clientes pueden registrar check-in.');

        $user = DB::transaction(function () use ($request) {
            $user = User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();

            $alreadyCheckedIn = LoyaltyTransaction::where('user_id', $user->id)
                ->where('concept', 'Check-in restaurante')
                ->whereDate('created_at', today())
                ->exists();

            if ($alreadyCheckedIn) {
                abort(422, 'Ya registraste tu check-in de hoy.');
            }

            $user->increment('points', (int) LoyaltyConfig::get('checkin_bonus'));
            $user->update(['last_visit' => now()]);

            LoyaltyTransaction::create([
                'user_id' => $user->id,
                'points' => (int) LoyaltyConfig::get('checkin_bonus'),
                'concept' => 'Check-in restaurante',
            ]);

            return $user->fresh();
        });

        return response()->json([
            'message' => 'Check-in exitoso. +' . (int) LoyaltyConfig::get('checkin_bonus') . ' pts',
            'points' => $user->points,
            'tier' => $user->tier,
        ]);
    }

    public function history(Request $request)
    {
        return response()->json(
            $request->user()->loyaltyTransactions()->orderBy('created_at', 'desc')->get()
        );
    }

    public function earnPoints(User $user, int $points, string $concepto): LoyaltyTransaction
    {
        return DB::transaction(function () use ($user, $points, $concepto) {
            $lockedUser = User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            $lockedUser->increment('points', $points);

            return LoyaltyTransaction::create([
                'user_id' => $lockedUser->id,
                'points' => $points,
                'concept' => $concepto,
            ]);
        });
    }

    public function redeemPoints(Request $request)
    {
        abort_unless($request->user()->role === 'cliente', 403, 'Solo los clientes pueden canjear puntos.');

        $request->validate([
            'points' => 'required|integer|min:1',
            'concepto' => 'required|string',
        ]);

        $user = DB::transaction(function () use ($request) {
            $user = User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();

            if ($user->points < $request->points) {
                abort(422, 'Puntos insuficientes');
            }

            $user->decrement('points', $request->points);
            $user->update(['last_activity' => now()]);

            LoyaltyTransaction::create([
                'user_id' => $user->id,
                'points' => -$request->points,
                'concept' => $request->concepto,
            ]);

            return $user->fresh();
        });

        return response()->json([
            'message' => 'Canje exitoso',
            'points_used' => $request->points,
            'balance' => $user->points,
        ]);
    }

    private function getNextTier(string $currentTier, array $tiers): ?array
    {
        $order = ['fan', 'lover', 'vip', 'elite'];
        $currentIndex = array_search($currentTier, $order);

        if ($currentIndex === false || $currentIndex === count($order) - 1) {
            return null;
        }

        $nextTierKey = $order[$currentIndex + 1];
        return $tiers[$nextTierKey];
    }
}
  }
}
