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
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'mesero_id' => 'required|exists:meseros,id',
            'points' => 'required|integer|min:1',
            'concepto' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $mesero = Mesero::findOrFail($request->mesero_id);
        $mesero->increment('puntos', $request->points);
        $mesero->refresh();

        return response()->json([
            'message' => "Puntos añadidos: +{$request->points}",
            'mesero' => $mesero,
        ]);
    }
}
