<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyTransaction;
use App\Models\TicketRedeem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketRedeemController extends Controller
{
    private const EXPIRY_SECONDS = 72 * 3600;

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

        return DB::transaction(function () use ($v, $user, $puntos, $request) {
            $ticket = TicketRedeem::where('ref', $v['ref'])->lockForUpdate()->first();

            if ($ticket && $ticket->canjeado_at) {
                return response()->json(['error' => 'Este ticket ya fue canjeado'], 409);
            }

            if (!$ticket) {
                $ticket = new TicketRedeem([
                    'ref' => $v['ref'],
                    'total' => $v['total'],
                    'puntos' => $puntos,
                    'ts_emision' => $v['ts'],
                ]);
            }

            $ticket->user_id = $user->id;
            $ticket->canjeado_at = now();
            $ticket->ip_canje = $request->ip();
            $ticket->save();

            $user->increment('points', $puntos);
            $user->refresh();

            LoyaltyTransaction::create([
                'user_id' => $user->id,
                'points' => $puntos,
                'concept' => 'Ticket escaneado (' . $v['ref'] . ')',
            ]);

            return response()->json([
                'message' => 'Canje exitoso',
                'puntos' => $puntos,
                'balance' => $user->points,
                'tier' => $user->tier,
            ]);
        });
    }
}
