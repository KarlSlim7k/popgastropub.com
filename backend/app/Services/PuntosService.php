<?php

namespace App\Services;

use App\Models\LoyaltyTransaction;
use App\Models\Mesero;
use App\Models\MeseroPointsLog;
use App\Models\TicketRedeem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PuntosService
{
    public function asignarPuntosPorCanje(TicketRedeem $ticket, User $cliente): array
    {
        return DB::transaction(function () use ($ticket, $cliente) {
            $ticket = TicketRedeem::where('id', $ticket->id)->lockForUpdate()->first();

            if (!$ticket) {
                throw new \RuntimeException('Ticket no encontrado');
            }

            if ($ticket->canjeado_at) {
                throw new \RuntimeException('Este ticket ya fue canjeado');
            }

            if ($ticket->fecha_expiracion && $ticket->fecha_expiracion->isPast()) {
                throw new \RuntimeException('El ticket ha expirado');
            }

            $puntos = $ticket->puntos;

            $ticket->update([
                'user_id' => $cliente->id,
                'canjeado_at' => now(),
            ]);

            $cliente->increment('points', $puntos);
            $cliente->refresh();

            LoyaltyTransaction::create([
                'user_id' => $cliente->id,
                'points' => $puntos,
                'concept' => sprintf('Canje QR ticket #%s', $ticket->folio_ticket ?? $ticket->ref),
            ]);

            $meseroAsignado = null;
            if ($ticket->mesero_id) {
                $mesero = Mesero::find($ticket->mesero_id);
                if ($mesero) {
                    $mesero->increment('puntos', $puntos);

                    MeseroPointsLog::create([
                        'mesero_id' => $mesero->id,
                        'points' => $puntos,
                        'multiplier' => 1.00,
                        'category' => 'ticket_qr:' . ($ticket->folio_ticket ?? $ticket->ref),
                    ]);

                    $meseroAsignado = $mesero->nombre;
                }
            }

            return [
                'puntos_sumar' => $puntos,
                'nuevo_saldo' => $cliente->points,
                'tier' => $cliente->tier,
                'mesero_asignado' => $meseroAsignado,
            ];
        });
    }
}
