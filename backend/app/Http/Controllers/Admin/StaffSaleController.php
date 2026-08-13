<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MeseroPointsLog;
use App\Services\MeseroSaleApprovalService;
use Illuminate\Http\Request;

class StaffSaleController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status', 'pending');
        abort_unless(in_array($status, ['pending', 'approved', 'rejected'], true), 422, 'Estado inválido.');

        $sales = MeseroPointsLog::with(['mesero.user', 'submitter:id,name', 'reviewer:id,name'])
            ->where('status', $status)
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        return response()->json($sales);
    }

    public function approve(Request $request, MeseroPointsLog $sale, MeseroSaleApprovalService $service)
    {
        return response()->json([
            'message' => 'Venta aprobada y puntos acreditados.',
            'sale' => $service->approve($sale, $request->user()),
        ]);
    }

    public function reject(Request $request, MeseroPointsLog $sale, MeseroSaleApprovalService $service)
    {
        return response()->json([
            'message' => 'Venta rechazada.',
            'sale' => $service->reject($sale, $request->user()),
        ]);
    }
}
