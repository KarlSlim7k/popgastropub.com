<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Services\LoyaltyConfig;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->pedidos()->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->role === 'cliente', 403, 'Solo los clientes pueden registrar pedidos.');

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'total' => 'required|numeric|min:0.01',
            'foodbooking_ref' => 'nullable|string|max:255',
            'notas' => 'nullable|string',
        ]);

        $pedido = Pedido::create([
            ...$validated,
            'puntos_ganados' => LoyaltyConfig::pointsForAmount((float) $validated['total']),
            'estado' => 'pendiente',
            'user_id' => $request->user()->id,
        ]);

        return response()->json($pedido, 201);
    }
}
