<?php

namespace App\Http\Controllers;

use App\Models\Mesero;
use Illuminate\Http\Request;

class RankingController extends Controller
{
    public function index()
    {
        $ranking = Mesero::where('activo', true)
            ->orderBy('puntos', 'desc')
            ->with('user')
            ->get();

        return response()->json($ranking);
    }

    public function addPoints(Request $request)
    {
        $user = $request->user();

        // If no mesero_id provided, use the authenticated user's mesero
        $meseroId = $request->input('mesero_id');
        if (!$meseroId) {
            $mesero = Mesero::where('user_id', $user->id)->first();
            if (!$mesero) {
                return response()->json(['message' => 'No se encontró perfil de mesero'], 404);
            }
            $meseroId = $mesero->id;
        }

        $validator = \Illuminate\Support\Facades\Validator::make(
            ['mesero_id' => $meseroId, 'points' => $request->input('points'), 'concepto' => $request->input('concepto')],
            ['mesero_id' => 'required|exists:meseros,id', 'points' => 'required|integer|min:1', 'concepto' => 'required|string']
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $mesero = Mesero::findOrFail($meseroId);

        // Update category-specific points if provided
        $category = $request->input('category');
        if ($category) {
            $field = $category . '_points';
            if (in_array($field, ['cocktail_points', 'premium_points', 'pitcher_points', 'bottle_points', 'combo_points', 'upsell_points', 'rating_points'])) {
                $mesero->increment($field, $request->input('points'));
            }
        }

        $mesero->increment('puntos', $request->input('points'));
        $mesero->refresh();

        return response()->json([
            'message' => "Puntos añadidos: +{$request->input('points')}",
            'mesero' => $mesero,
        ]);
    }
}
