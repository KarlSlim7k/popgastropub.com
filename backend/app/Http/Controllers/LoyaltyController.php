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
            'recent_transactions' => $user->loyaltyTransactions()->latest()->limit(5)->get(),
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
        $tierMap = array_replace([
            'fan' => ['name' => 'POP Fan', 'min' => 0, 'max' => null],
            'lover' => ['name' => 'POP Lover', 'min' => 0, 'max' => null],
            'vip' => ['name' => 'POP VIP', 'min' => 0, 'max' => null],
            'elite' => ['name' => 'POP Elite', 'min' => 0, 'max' => null],
        ], $tierMap);

        $thresholds = [
            'lover' => LoyaltyConfig::tierMin('lover'),
            'vip' => LoyaltyConfig::tierMin('vip'),
            'elite' => LoyaltyConfig::tierMin('elite'),
        ];
        foreach ($thresholds as $slug => $min) {
            if (isset($tierMap[$slug])) {
                $tierMap[$slug]['min'] = $min;
            }
        }
        if (isset($tierMap['fan'])) {
            $tierMap['fan']['max'] = $thresholds['lover'] - 1;
        }
        if (isset($tierMap['lover'])) {
            $tierMap['lover']['max'] = $thresholds['vip'] - 1;
        }
        if (isset($tierMap['vip'])) {
            $tierMap['vip']['max'] = $thresholds['elite'] - 1;
        }

        $currentSlug = $user->tier;
        $current = $tierMap[$currentSlug] ?? ['name' => 'POP Fan', 'min' => 0, 'max' => null];
        $nextTier = $this->getNextTier($currentSlug, $tierMap);

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
            ],
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
            'message' => 'Check-in exitoso. +'.(int) LoyaltyConfig::get('checkin_bonus').' pts',
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

    private function getNextTier(string $currentSlug, array $tierMap): ?array
    {
        $ordered = ['fan', 'lover', 'vip', 'elite'];
        $currentIndex = array_search($currentSlug, $ordered);

        if ($currentIndex === false || $currentIndex === count($ordered) - 1) {
            return null;
        }

        $nextSlug = $ordered[$currentIndex + 1];
        $next = $tierMap[$nextSlug];

        return [
            'name' => $next['name'],
            'slug' => $nextSlug,
            'min' => $next['min'],
            'max' => $next['max'],
        ];
    }
}
