<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DrinkType;
use App\Models\Mesero;
use App\Models\MeseroPointsLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;

class MeseroController extends Controller
{
    /**
     * Categorías con columna propia *_points en la tabla meseros. Cualquier
     * otra categoría (drink types nuevos creados por el admin) solo se
     * registra en mesero_points_log.
     */
    private const CORE_CATEGORIES = ['cocktail', 'premium', 'pitcher', 'bottle', 'combo', 'upsell', 'rating'];

    public function index(Request $request)
    {
        $query = Mesero::with('user');

        if ($request->has('period') && $request->input('period') !== 'todo') {
            $date = match ($request->input('period')) {
                'semana' => now()->subWeek(),
                'mes' => now()->subMonth(),
                default => null,
            };
            if ($date) {
                $query->where('updated_at', '>=', $date);
            }
        }

        $meseros = $query->orderByDesc('puntos')->get();

        $extraPoints = $this->extraPointsByMesero($meseros->pluck('id'));

        return response()->json($meseros->map(fn ($m) => $this->toFrontend($m, $extraPoints[$m->id] ?? 0)));
    }

    public function store(Request $request)
    {
        $this->validatePayload($request, true);
        $data = $this->fromFrontend($request);
        $data['puntos'] = $this->totalPoints($data);

        $mesero = DB::transaction(function () use ($request, $data) {
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('accountEmail'),
                'password' => Hash::make($request->input('password')),
                'phone' => $request->input('accountPhone'),
                'role' => 'mesero',
                'status' => $request->input('status') === 'inactivo' ? 'inactivo' : 'activo',
            ]);

            return Mesero::create(['user_id' => $user->id] + $data);
        });

        return response()->json($this->toFrontend($mesero->load('user')), 201);
    }

    public function show($id)
    {
        $mesero = Mesero::with('user')->findOrFail($id);

        return response()->json($this->toFrontend($mesero, $this->extraPointsForMesero($mesero->id)));
    }

    public function update(Request $request, $id)
    {
        $mesero = Mesero::with('user')->findOrFail($id);
        $this->validatePayload($request, false, $mesero);
        $data = $this->fromFrontend($request);
        $data['puntos'] = $this->totalPoints($data, $mesero);

        DB::transaction(function () use ($request, $mesero, $data) {
            $mesero->update($data);

            if ($mesero->user) {
                $userData = [
                    'name' => $request->input('name', $mesero->user->name),
                    'role' => 'mesero',
                    'status' => $request->input('status') === 'inactivo' ? 'inactivo' : 'activo',
                ];

                if ($request->has('accountEmail')) {
                    $userData['email'] = $request->input('accountEmail');
                }
                if ($request->has('accountPhone')) {
                    $userData['phone'] = $request->input('accountPhone');
                }
                if ($request->filled('password')) {
                    $userData['password'] = Hash::make($request->input('password'));
                }

                $mesero->user->update($userData);
                if ($mesero->user->status === 'inactivo') {
                    $mesero->user->tokens()->delete();
                }
            }
        });

        return response()->json($this->toFrontend($mesero->fresh()->load('user')));
    }

    public function destroy($id)
    {
        $mesero = Mesero::with('user')->findOrFail($id);

        DB::transaction(function () use ($mesero) {
            $mesero->user?->update(['role' => 'cliente', 'status' => 'inactivo']);
            $mesero->user?->tokens()->delete();
            $mesero->delete();
        });

        return response()->json(['message' => 'Mesero eliminado']);
    }

    public function adjustPoints(Request $request, $id)
    {
        $drinkTypeSlugs = DrinkType::pluck('slug')->toArray();
        $validCategories = implode(',', array_merge($drinkTypeSlugs, ['rating']));

        $request->validate([
            'points' => 'required|integer',
            'category' => 'required|in:'.$validCategories,
            'description' => 'nullable|string|max:255',
        ]);

        $mesero = Mesero::findOrFail($id);
        $points = (int) $request->input('points');
        $category = $request->input('category');
        $description = $request->input('description', 'Ajuste manual admin');

        $categoryField = $category.'_points';
        $hasColumn = Schema::hasColumn('meseros', $categoryField);

        if ($points > 0) {
            if ($hasColumn) {
                $mesero->increment($categoryField, $points);
            }
            $mesero->increment('puntos', $points);
        } else {
            $absPoints = abs($points);
            $currentCategoryPoints = $hasColumn
                ? (int) $mesero->{$categoryField}
                : (int) MeseroPointsLog::where('mesero_id', $mesero->id)->where('category', $category)->sum('points');

            if ($currentCategoryPoints < $absPoints) {
                abort(422, "Puntos insuficientes en categoría {$category}. Tiene {$currentCategoryPoints}, intenta restar {$absPoints}");
            }

            if ($hasColumn) {
                $mesero->decrement($categoryField, $absPoints);
            }
            $mesero->decrement('puntos', $absPoints);
        }

        MeseroPointsLog::create([
            'mesero_id' => $mesero->id,
            'category' => $category,
            'points' => $points,
            'multiplier' => 1.0,
        ]);

        $mesero = $mesero->fresh()->load('user');

        return response()->json([
            'message' => $points > 0 ? "Puntos añadidos: +{$points}" : "Puntos restados: {$points}",
            'mesero' => $this->toFrontend($mesero, $this->extraPointsForMesero($mesero->id)),
        ]);
    }

    public function pointsLog($id)
    {
        return response()->json(
            MeseroPointsLog::where('mesero_id', $id)->orderByDesc('created_at')->limit(100)->get()
        );
    }

    /**
     * Suma de mesero_points_log para categorías sin columna *_points propia
     * (drink types nuevos creados por el admin), agrupada por mesero.
     *
     * @param  Collection<int, int>  $meseroIds
     * @return array<int, int>
     */
    private function extraPointsByMesero($meseroIds): array
    {
        if ($meseroIds->isEmpty()) {
            return [];
        }

        return MeseroPointsLog::whereIn('mesero_id', $meseroIds)
            ->approved()
            ->whereNotIn('category', self::CORE_CATEGORIES)
            ->selectRaw('mesero_id, SUM(points) as extra')
            ->groupBy('mesero_id')
            ->pluck('extra', 'mesero_id')
            ->map(fn ($v) => (int) $v)
            ->toArray();
    }

    private function extraPointsForMesero(int $meseroId): int
    {
        return (int) MeseroPointsLog::where('mesero_id', $meseroId)
            ->approved()
            ->whereNotIn('category', self::CORE_CATEGORIES)
            ->sum('points');
    }

    private function toFrontend(Mesero $m, int $extraPoints = 0): array
    {
        $total = $m->cocktail_points + $m->premium_points + $m->pitcher_points +
                 $m->bottle_points + $m->combo_points + $m->upsell_points + $m->rating_points + $extraPoints;

        return [
            'id' => $m->id,
            'userId' => $m->user_id,
            'name' => $m->nombre,
            'accountEmail' => $m->user?->email ?? '',
            'accountPhone' => $m->user?->phone ?? '',
            'initials' => $m->iniciales ?: strtoupper(collect(explode(' ', $m->nombre))->map(fn ($w) => $w[0] ?? '')->join('')),
            'status' => $m->status ?? ($m->activo ? 'activo' : 'inactivo'),
            'cocktailPoints' => $m->cocktail_points ?? 0,
            'premiumPoints' => $m->premium_points ?? 0,
            'pitcherPoints' => $m->pitcher_points ?? 0,
            'bottlePoints' => $m->bottle_points ?? 0,
            'comboPoints' => $m->combo_points ?? 0,
            'upsellPoints' => $m->upsell_points ?? 0,
            'ratingPoints' => $m->rating_points ?? 0,
            'totalPoints' => $total,
            'totalSales' => (float) ($m->total_sales ?? 0),
            'ordersServed' => $m->orders_served ?? 0,
            'avgRating' => (float) ($m->avg_rating ?? 5.0),
        ];
    }

    private function fromFrontend(Request $request): array
    {
        $map = [];

        if ($request->has('name')) {
            $map['nombre'] = $request->input('name');
        }
        if ($request->has('initials')) {
            $map['iniciales'] = $request->input('initials');
        }
        if ($request->has('status')) {
            $map['status'] = $request->input('status');
            $map['activo'] = $request->input('status') === 'activo';
        }
        if ($request->has('cocktailPoints')) {
            $map['cocktail_points'] = $request->input('cocktailPoints');
        }
        if ($request->has('premiumPoints')) {
            $map['premium_points'] = $request->input('premiumPoints');
        }
        if ($request->has('pitcherPoints')) {
            $map['pitcher_points'] = $request->input('pitcherPoints');
        }
        if ($request->has('bottlePoints')) {
            $map['bottle_points'] = $request->input('bottlePoints');
        }
        if ($request->has('comboPoints')) {
            $map['combo_points'] = $request->input('comboPoints');
        }
        if ($request->has('upsellPoints')) {
            $map['upsell_points'] = $request->input('upsellPoints');
        }
        if ($request->has('ratingPoints')) {
            $map['rating_points'] = $request->input('ratingPoints');
        }
        if ($request->has('totalSales')) {
            $map['total_sales'] = $request->input('totalSales');
        }
        if ($request->has('ordersServed')) {
            $map['orders_served'] = $request->input('ordersServed');
        }
        if ($request->has('avgRating')) {
            $map['avg_rating'] = $request->input('avgRating');
        }

        return $map;
    }

    private function validatePayload(Request $request, bool $creating, ?Mesero $mesero = null): void
    {
        $emailRules = ['required', 'email', 'max:255', Rule::unique('users', 'email')];

        if (! $creating && $mesero?->user_id) {
            $emailRules[0] = 'sometimes';
            $emailRules[3] = Rule::unique('users', 'email')->ignore($mesero->user_id);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'initials' => 'nullable|string|max:5',
            'status' => 'required|in:activo,inactivo,descanso',
            'accountEmail' => $emailRules,
            'accountPhone' => 'nullable|string|max:20',
            'password' => $creating ? 'required|string|min:8' : 'nullable|string|min:8',
            'cocktailPoints' => 'nullable|integer|min:0',
            'premiumPoints' => 'nullable|integer|min:0',
            'pitcherPoints' => 'nullable|integer|min:0',
            'bottlePoints' => 'nullable|integer|min:0',
            'comboPoints' => 'nullable|integer|min:0',
            'upsellPoints' => 'nullable|integer|min:0',
            'ratingPoints' => 'nullable|integer|min:0',
            'totalSales' => 'nullable|numeric|min:0',
            'ordersServed' => 'nullable|integer|min:0',
            'avgRating' => 'nullable|numeric|min:0|max:5',
        ]);
    }

    private function totalPoints(array $data, ?Mesero $mesero = null): int
    {
        return collect([
            'cocktail_points',
            'premium_points',
            'pitcher_points',
            'bottle_points',
            'combo_points',
            'upsell_points',
            'rating_points',
        ])->sum(fn ($field) => (int) ($data[$field] ?? $mesero?->{$field} ?? 0));
    }
}
