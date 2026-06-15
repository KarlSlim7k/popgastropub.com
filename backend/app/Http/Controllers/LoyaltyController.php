<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyTier;
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

        $tiers = LoyaltyTier::active()->ordered()->get();
        $tierMap = $tiers->keyBy('slug')->map(fn ($t) => [
            'name' => $t->name,
            'min' => (int) $t->min_points,
            'max' => $t->max_points !== null ? (int) $t->max_points : null,
        ])->all();

        $currentSlug = $user->tier;
        $current = $tierMap[$currentSlug] ?? ['name' => 'POP Fan', 'min' => 0, 'max' => null];
        $nextTier = $this->getNextTier($currentSlug, $tiers);

        return response()->json([
            'user' => $user,
            'current_tier' => $current,
            'current_slug' => $currentSlug,
            'points' => $user->points,
            'next_tier' => $nextTier,
            'progress' => [
                'current' => $user->points,
                'min' => $current['min'],
                'max' => $current['max'],
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

    private function getNextTier(string $currentSlug, $tiers): ?array
    {
        $ordered = $tiers->pluck('slug')->all();
        $currentIndex = array_search($currentSlug, $ordered);

        if ($currentIndex === false || $currentIndex === count($ordered) - 1) {
            return null;
        }

        $nextSlug = $ordered[$currentIndex + 1];
        $nextModel = $tiers->firstWhere('slug', $nextSlug);

        if (! $nextModel) {
            return null;
        }

        return [
            'name' => $nextModel->name,
            'slug' => $nextModel->slug,
            'min' => (int) $nextModel->min_points,
            'max' => $nextModel->max_points !== null ? (int) $nextModel->max_points : null,
        ];
    }
}
