<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use App\Models\Mesero;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'totalUsers' => User::count(),
            'totalMeseros' => Mesero::where('activo', true)->count(),
            'totalFacturas' => Factura::count(),
            'facturasHoy' => Factura::whereDate('created_at', today())->count(),
            'totalPuntos' => User::sum('points'),
            'usuariosNuevosMes' => User::whereMonth('created_at', now()->month)->count(),
        ]);
    }
}
