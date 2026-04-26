<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    public function index()
    {
        return Pedido::with('user')->orderBy('created_at', 'desc')->get();
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'estado' => 'required|in:pendiente,preparando,listo,entregado,cancelado',
        ]);

        $pedido = Pedido::findOrFail($id);
        $pedido->update(['estado' => $validated['estado']]);

        return response()->json($pedido);
    }

    public function destroy($id)
    {
        $pedido = Pedido::findOrFail($id);
        $pedido->delete();

        return response()->json(['message' => 'Pedido eliminado.']);
    }
}
