<?php

namespace App\Http\Controllers;

use App\Models\TicketRedeem;
use App\Services\PuntosService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketRedeemController extends Controller
{
    private const EXPIRY_SECONDS = 72 * 3600;

    public function __construct(private readonly PuntosService $puntosService)
    {
    }

    private function check(int $total, string $ref, int $ts, string $sig): ?array
    {
        if ($total < 1) {
            return ['error' => 'Monto inválido', 'status' => 422];
        }

        $expected = hash_hmac('sha256', $total . $ref . $ts, config('app.qr_secret'));
        if (!hash_equals($expected, $sig)) {
            return ['error' => 'QR inválido', 'status' => 422];
        }

        if (now()->timestamp - $ts > self::EXPIRY_SECONDS) {
            return ['error' => 'QR expirado', 'status' => 422];
        }

        if ($ts > now()->timestamp + 300) {
            return ['error' => 'QR inválido', 'status' => 422];
        }

        return null;
    }

    public function validate(Request $request)
    {
        $v = $request->validate([
            'total' => 'required|integer|min:1',
            'ref' => 'required|string',
            'ts' => 'required|integer',
            'sig' => 'required|string',
        ]);

        if ($err = $this->check($v['total'], $v['ref'], $v['ts'], $v['sig'])) {
            return response()->json(['error' => $err['error']], $err['status']);
        }

        $ticket = TicketRedeem::where('ref', $v['ref'])->first();
        if ($ticket && $ticket->canjeado_at) {
            return response()->json(['error' => 'Este ticket ya fue canjeado'], 409);
        }

        return response()->json([
            'valid' => true,
            'total' => $v['total'],
            'puntos' => intdiv($v['total'], 10),
            'ref' => $v['ref'],
        ]);
    }

    public function redeem(Request $request)
    {
        abort_unless($request->user()->role === 'cliente', 403, 'Solo los clientes pueden canjear tickets.');

        $v = $request->validate([
            'total' => 'required|integer|min:1',
            'ref' => 'required|string',
            'ts' => 'required|integer',
            'sig' => 'required|string',
        ]);

        if ($err = $this->check($v['total'], $v['ref'], $v['ts'], $v['sig'])) {
            return response()->json(['error' => $err['error']], $err['status']);
        }

        $user = $request->user();
        $puntos = intdiv($v['total'], 10);

        try {
            $ticket = TicketRedeem::where('ref', $v['ref'])->firstOrFail();

            $resultado = $this->puntosService->asignarPuntosPorCanje($ticket, $user);

            return response()->json([
                'message' => 'Canje exitoso',
                'puntos' => $resultado['puntos_sumar'],
                'balance' => $resultado['nuevo_saldo'],
                'tier' => $resultado['tier'],
                'mesero_asignado' => $resultado['mesero_asignado'],
                'ticket' => [
                    'folio' => $ticket->folio_ticket,
                    'ref' => $ticket->ref,
                    'monto' => $ticket->total,
                ],
            ]);
        } catch (\RuntimeException $e) {
            $status = str_contains($e->getMessage(), 'ya fue canjeado') ? 409 : 422;
            return response()->json(['error' => $e->getMessage()], $status);
        }
    }
}
