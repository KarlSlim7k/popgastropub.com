<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;

class StaffMenuController extends Controller
{
    public function index()
    {
        $productos = Producto::orderBy('categoria')->orderBy('nombre')->get();

        return response()->json($productos->map(fn($p) => [
            'id' => $p->id,
            'nombre' => $p->nombre,
            'categoria' => $p->categoria,
            'precio' => (float) $p->precio,
            'disponible' => $p->disponible,
            'stock' => $p->stock,
            'imagen' => $p->imagen,
        ]));
    }

    public function toggleDisponibilidad($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->update(['disponible' => !$producto->disponible]);

        return response()->json(['id' => $producto->id, 'disponible' => $producto->disponible]);
    }
}
