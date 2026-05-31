<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
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

        $puntosGanados = floor($validated['total'] / 10);

        $validated['puntos_ganados'] = $puntosGanados;
        $validated['estado'] = 'pendiente';
        $validated['user_id'] = $request->user()->id;

        $pedido = Pedido::create($validated);

        return response()->json($pedido, 201);
    }
}
