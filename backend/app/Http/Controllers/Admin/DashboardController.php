<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use App\Models\Mesero;
use App\Models\Pedido;
use App\Models\Reserva;
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
            // Nuevos
            'reservasHoy' => Reserva::whereDate('fecha', today())->count(),
            'reservasPendientes' => Reserva::where('estado', 'pendiente')->count(),
            'pedidosHoy' => Pedido::whereDate('created_at', today())->count(),
            'pedidosPendientes' => Pedido::where('estado', 'pendiente')->count(),
            'ventasMes' => Pedido::whereMonth('created_at', now()->month)->sum('total'),
            'recompensasCanjeadas' => \App\Models\RewardRedemption::count(),
        ]);
    }
}
