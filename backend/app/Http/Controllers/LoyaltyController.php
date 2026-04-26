<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyTransaction;
use App\Models\User;
use Illuminate\Http\Request;

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
            'fan' => ['min' => 0, 'max' => 499, 'name' => 'POP Fan'],
            'lover' => ['min' => 500, 'max' => 1499, 'name' => 'POP Lover'],
            'vip' => ['min' => 1500, 'max' => 2999, 'name' => 'POP VIP'],
            'elite' => ['min' => 3000, 'max' => null, 'name' => 'POP Elite'],
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
        $user = $request->user();
        $user->increment('points', 25);
        $user->refresh();

        LoyaltyTransaction::create([
            'user_id' => $user->id,
            'points' => 25,
            'concept' => 'Check-in restaurante',
        ]);

        return response()->json([
            'message' => 'Check-in exitoso. +25 pts',
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
        $user->increment('points', $points);
        $user->refresh();

        return LoyaltyTransaction::create([
            'user_id' => $user->id,
            'points' => $points,
            'concept' => $concepto,
        ]);
    }

    public function redeemPoints(Request $request)
    {
        $request->validate([
            'points' => 'required|integer|min:1',
            'concepto' => 'required|string',
        ]);

        $user = $request->user();

        if ($user->points < $request->points) {
            return response()->json(['message' => 'Puntos insuficientes'], 422);
        }

        $user->decrement('points', $request->points);
        $user->refresh();

        LoyaltyTransaction::create([
            'user_id' => $user->id,
            'points' => -$request->points,
            'concept' => $request->concepto,
        ]);

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
