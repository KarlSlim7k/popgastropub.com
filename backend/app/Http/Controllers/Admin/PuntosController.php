<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyPointAction;
use App\Models\LoyaltyTier;
use App\Models\LoyaltyTransaction;
use App\Models\RewardRedemption;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

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
        $tiers = LoyaltyTier::active()->ordered()->get();

        $memberCounts = $this->memberCountsByTier($tiers);

        return response()->json($tiers->map(function ($tier) use ($memberCounts) {
            $members = $memberCounts[$tier->id] ?? 0;

            return [
                'id' => $tier->id,
                'name' => $tier->name,
                'slug' => $tier->slug,
                'range' => $tier->max_points
                    ? "{$tier->min_points}-{$tier->max_points} pts"
                    : "{$tier->min_points}+ pts",
                'min_points' => $tier->min_points,
                'max_points' => $tier->max_points,
                'color' => $tier->color,
                'bg_color' => $tier->bg_color,
                'border_color' => $tier->border_color,
                'icon' => $tier->icon,
                'benefits' => $tier->benefits,
                'investment_text' => $tier->investment_text,
                'config' => $tier->config,
                'members' => $members,
                'is_active' => $tier->is_active,
                'is_featured' => (bool) $tier->is_featured,
                'sort_order' => $tier->sort_order,
            ];
        }));
    }

    /**
     * Cuenta clientes por nivel en una sola query (evita N counts, uno por tier).
     *
     * @return array<int, int> conteo de miembros indexado por id de tier
     */
    private function memberCountsByTier($tiers): array
    {
        if ($tiers->isEmpty()) {
            return [];
        }

        $selects = $tiers->map(function ($tier) {
            $condition = 'points >= ' . (int) $tier->min_points;
            if ($tier->max_points !== null) {
                $condition .= ' AND points <= ' . (int) $tier->max_points;
            }

            return "SUM(CASE WHEN {$condition} THEN 1 ELSE 0 END) AS tier_{$tier->id}";
        })->implode(', ');

        $counts = User::where('role', 'cliente')->selectRaw($selects)->first();

        return $tiers->mapWithKeys(fn ($tier) => [$tier->id => (int) ($counts->{"tier_{$tier->id}"} ?? 0)])->toArray();
    }

    public function storeTier(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'slug' => 'required|string|max:50|unique:loyalty_tiers,slug',
            'min_points' => 'required|integer|min:0',
            'max_points' => 'nullable|integer|min:0',
            'color' => 'nullable|string|max:7',
            'bg_color' => 'nullable|string|max:7',
            'border_color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
            'benefits' => 'nullable|array',
            'investment_text' => 'nullable|string',
            'config' => 'nullable|array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $validated['color'] = $validated['color'] ?? '#F2C777';
        $validated['bg_color'] = $validated['bg_color'] ?? $validated['color'];
        $validated['border_color'] = $validated['border_color'] ?? $validated['color'];
        $validated['icon'] = $validated['icon'] ?? 'person';
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['is_featured'] = $validated['is_featured'] ?? false;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        $tier = LoyaltyTier::create($validated);
        Cache::forget('loyalty_tiers');
        Cache::forget('loyalty_tiers_slug_map');

        return response()->json($tier, 201);
    }

    public function updateTier(Request $request, $id)
    {
        $tier = LoyaltyTier::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:50',
            'slug' => 'sometimes|string|max:50|unique:loyalty_tiers,slug,' . $id,
            'min_points' => 'sometimes|integer|min:0',
            'max_points' => 'nullable|integer|min:0',
            'color' => 'nullable|string|max:7',
            'bg_color' => 'nullable|string|max:7',
            'border_color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
            'benefits' => 'nullable|array',
            'investment_text' => 'nullable|string',
            'config' => 'nullable|array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $tier->update($validated);
        Cache::forget('loyalty_tiers');
        Cache::forget('loyalty_tiers_slug_map');

        return response()->json($tier->fresh());
    }

    public function destroyTier($id)
    {
        $tier = LoyaltyTier::findOrFail($id);
        $tier->delete();
        Cache::forget('loyalty_tiers');
        Cache::forget('loyalty_tiers_slug_map');

        return response()->json(['message' => 'Nivel eliminado']);
    }

    public function reorderTiers(Request $request)
    {
        $request->validate([
            'tiers' => 'required|array',
            'tiers.*.id' => 'required|exists:loyalty_tiers,id',
            'tiers.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($request->input('tiers') as $tierData) {
            LoyaltyTier::where('id', $tierData['id'])->update(['sort_order' => $tierData['sort_order']]);
        }

        Cache::forget('loyalty_tiers');
        Cache::forget('loyalty_tiers_slug_map');

        return response()->json(['message' => 'Orden actualizado']);
    }

    public function pointActions()
    {
        $actions = LoyaltyPointAction::active()->ordered()->get();

        return response()->json($actions->map(function ($action) {
            return [
                'id' => $action->id,
                'action' => $action->action,
                'slug' => $action->slug,
                'points' => $action->points,
                'points_type' => $action->points_type,
                'icon' => $action->icon,
                'color' => $action->color,
                'description' => $action->description,
                'conditions' => $action->conditions,
                'is_active' => $action->is_active,
                'sort_order' => $action->sort_order,
            ];
        }));
    }

    public function storePointAction(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|string|max:100',
            'slug' => 'required|string|max:50|unique:loyalty_point_actions,slug',
            'points' => 'required|integer|min:0',
            'points_type' => 'required|in:fixed,per_amount,multiplier',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:7',
            'description' => 'nullable|string',
            'conditions' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $validated['icon'] = $validated['icon'] ?? 'token';
        $validated['color'] = $validated['color'] ?? '#F2C777';
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        $action = LoyaltyPointAction::create($validated);

        return response()->json($action, 201);
    }

    public function updatePointAction(Request $request, $id)
    {
        $action = LoyaltyPointAction::findOrFail($id);

        $validated = $request->validate([
            'action' => 'sometimes|string|max:100',
            'slug' => 'sometimes|string|max:50|unique:loyalty_point_actions,slug,' . $id,
            'points' => 'sometimes|integer|min:0',
            'points_type' => 'sometimes|in:fixed,per_amount,multiplier',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:7',
            'description' => 'nullable|string',
            'conditions' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $action->update($validated);

        return response()->json($action->fresh());
    }

    public function destroyPointAction($id)
    {
        $action = LoyaltyPointAction::findOrFail($id);
        $action->delete();

        return response()->json(['message' => 'Acción eliminada']);
    }

    public function reorderPointActions(Request $request)
    {
        $request->validate([
            'actions' => 'required|array',
            'actions.*.id' => 'required|exists:loyalty_point_actions,id',
            'actions.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($request->input('actions') as $actionData) {
            LoyaltyPointAction::where('id', $actionData['id'])->update(['sort_order' => $actionData['sort_order']]);
        }

        return response()->json(['message' => 'Orden actualizado']);
    }

    public function topMembers()
    {
        $users = User::where('role', 'cliente')->orderBy('points', 'desc')->limit(5)->get();

        $tierColors = ['fan' => 'text-gray-300', 'lover' => 'text-pop-light-gold', 'vip' => 'text-pop-orange', 'elite' => 'text-pop-gold'];

        $tiers = LoyaltyTier::orderBy('min_points', 'desc')->get();

        $redemptionCounts = RewardRedemption::whereIn('user_id', $users->pluck('id'))
            ->selectRaw('user_id, COUNT(*) as total')
            ->groupBy('user_id')
            ->pluck('total', 'user_id');

        return response()->json($users->values()->map(function ($u, $i) use ($tierColors, $tiers, $redemptionCounts) {
            $tier = $tiers->first(fn ($t) => $t->min_points <= $u->points && ($t->max_points === null || $t->max_points >= $u->points));

            return [
                'rank' => $i + 1,
                'name' => $u->name,
                'initials' => strtoupper(collect(explode(' ', $u->name))->map(fn($w) => $w[0] ?? '')->join('')),
                'points' => $u->points,
                'tier' => $tier ? $tier->name : 'POP Fan',
                'tierColor' => $tierColors[$tier->slug ?? 'fan'] ?? 'text-gray-300',
                'visits' => $u->orders_count ?? 0,
                'orders' => $u->orders_count ?? 0,
                'redeemed' => (int) ($redemptionCounts[$u->id] ?? 0),
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

    public function adjustPoints(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'points' => 'required|integer',
            'description' => 'nullable|string',
        ]);

        $newPoints = DB::transaction(function () use ($request) {
            $user = User::whereKey($request->input('user_id'))->lockForUpdate()->firstOrFail();
            $points = (int) $request->input('points');
            $description = $request->input('description') ?: 'Ajuste manual admin';

            if ($user->role !== 'cliente') {
                abort(422, 'Solo puedes ajustar puntos de clientes.');
            }

            if ($points > 0) {
                $user->increment('points', $points);
            } else {
                if ($user->points < abs($points)) {
                    abort(422, 'Puntos insuficientes para restar');
                }
                $user->decrement('points', abs($points));
            }

            LoyaltyTransaction::create([
                'user_id' => $user->id,
                'points' => $points,
                'concept' => $description,
            ]);

            return $user->fresh()->points;
        });

        return response()->json(['message' => 'Puntos ajustados', 'newPoints' => $newPoints]);
    }
}