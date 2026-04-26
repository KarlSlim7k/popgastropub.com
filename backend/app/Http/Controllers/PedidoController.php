<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyTransaction;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->pedidos()->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'total' => 'required|numeric|min:0',
            'foodbooking_ref' => 'nullable|string|max:255',
            'notas' => 'nullable|string',
        ]);

        $puntosGanados = floor($validated['total'] / 10);

        $validated['puntos_ganados'] = $puntosGanados;
        $validated['estado'] = 'pendiente';
        $validated['user_id'] = $request->user()->id;

        $pedido = DB::transaction(function () use ($validated, $request, $puntosGanados) {
            $pedido = Pedido::create($validated);

            $user = $request->user();
            $user->points += $puntosGanados;
            $user->save();

            LoyaltyTransaction::create([
                'user_id' => $user->id,
                'points' => $puntosGanados,
                'concept' => 'Pedido completado',
            ]);

            return $pedido;
        });

        return response()->json($pedido, 201);
    }
}
