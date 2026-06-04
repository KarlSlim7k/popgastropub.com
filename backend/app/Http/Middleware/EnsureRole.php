<?php

namespace App\Http\Middleware;

use App\Models\Mesero;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, $roles, true)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        if (in_array('mesero', $roles, true) && $user->role === 'mesero') {
            Mesero::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'nombre' => $user->name,
                    'iniciales' => strtoupper(substr($user->name, 0, 1) . (str_contains($user->name, ' ') ? substr(explode(' ', $user->name)[1], 0, 1) : '')),
                    'puntos' => 0,
                    'cocktail_points' => 0,
                    'premium_points' => 0,
                    'pitcher_points' => 0,
                    'bottle_points' => 0,
                    'combo_points' => 0,
                    'upsell_points' => 0,
                    'rating_points' => 0,
                    'total_sales' => 0,
                    'orders_served' => 0,
                    'avg_rating' => 5.0,
                    'point_multiplier' => 1.0,
                    'activo' => true,
                    'status' => 'activo',
                ]
            );
        }

        return $next($request);
    }
}
