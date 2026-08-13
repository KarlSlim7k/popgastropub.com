<?php

namespace App\Services;

use App\Models\LoyaltyTransaction;
use App\Models\TicketRedeem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PuntosService
{
    public function __construct(
        private readonly ReferralService $referrals,
        private readonly LoyaltyPointsCalculator $calculator,
    ) {}

    public function asignarPuntosPorCanje(TicketRedeem $ticket, User $cliente): array
    {
        return DB::transaction(function () use ($ticket, $cliente) {
            $ticket = TicketRedeem::where('id', $ticket->id)->lockForUpdate()->first();

            if (! $ticket) {
                throw new \RuntimeException('Ticket no encontrado');
            }

            if ($ticket->canjeado_at) {
                throw new \RuntimeException('Este ticket ya fue canjeado');
            }

            if ($ticket->fecha_expiracion && $ticket->fecha_expiracion->isPast()) {
                throw new \RuntimeException('El ticket ha expirado');
            }

            $calculation = $this->calculator->calculate($ticket, $cliente);
            $puntos = $calculation['total_points'];

            $ticket->update([
                'user_id' => $cliente->id,
                'canjeado_at' => now(),
            ]);

            $cliente->increment('points', $puntos);
            $cliente->refresh();

            LoyaltyTransaction::create([
                'user_id' => $cliente->id,
                'points' => $puntos,
                'concept' => sprintf(
                    'Canje QR ticket #%s (%d base x %s)',
                    $ticket->folio_ticket ?? $ticket->ref,
                    $calculation['base_points'],
                    rtrim(rtrim(number_format($calculation['total_multiplier'], 2, '.', ''), '0'), '.')
                ),
            ]);

            $this->referrals->confirmFirstPurchase($cliente);

            return [
                'puntos_sumar' => $puntos,
                'puntos_base' => $calculation['base_points'],
                'multiplicador' => $calculation['total_multiplier'],
                'nuevo_saldo' => $cliente->points,
                'tier' => $cliente->tier,
                'mesero_asignado' => $ticket->mesero?->nombre,
            ];
        });
    }
}
