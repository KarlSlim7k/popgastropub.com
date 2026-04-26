<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use Illuminate\Http\Request;

class FacturaController extends Controller
{
    public function index()
    {
        $facturas = Factura::with('user')->orderBy('created_at', 'desc')->get();

        return response()->json($facturas);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'estado' => 'required|in:recibida,en_proceso,enviada_contadores,completada,rechazada',
        ]);

        $factura = Factura::findOrFail($id);
        $factura->update(['estado' => $validated['estado']]);

        return response()->json($factura);
    }
}
