<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $query = Producto::where('disponible', true);

        if ($request->has('categoria')) {
            $query->where('categoria', $request->categoria);
        }

        if ($request->has('destacado')) {
            $query->where('destacado', true);
        }

        $productos = $query->orderBy('categoria')->orderBy('nombre')->get();

        return response()->json($productos);
    }

    public function show($id)
    {
        $producto = Producto::findOrFail($id);

        return response()->json($producto);
    }
}
