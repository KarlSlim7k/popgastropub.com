<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyTransaction;
use Illuminate\Http\Request;

class LoyaltyController extends Controller
{
    public function points(Request $request)
    {
        $user = $request->user();

        return response()->json($user);
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

        return response()->json([
            'user' => $user,
            'current_tier' => $tiers[$user->tier],
            'points' => $user->points,
            'next_tier' => $this->getNextTier($user->tier, $tiers),
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
