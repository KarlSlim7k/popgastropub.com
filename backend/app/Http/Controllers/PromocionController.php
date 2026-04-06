<?php

namespace App\Http\Controllers;

use App\Models\Promocion;
use Illuminate\Http\Request;

class PromocionController extends Controller
{
    public function index()
    {
        $promociones = Promocion::where('activa', true)
            ->orderBy('dia_inicio')
            ->get();

        return response()->json($promociones);
    }
}
