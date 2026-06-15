<?php

namespace App\Services;

use App\Models\Reserva;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;
use Throwable;

class ReservaMailService
{
    private const CLIENTE_SUBJECTS = [
        'pendiente' => 'Recibimos tu reservación — POP Perote',
        'confirmada' => '✅ Tu reservación está confirmada — POP Perote',
        'cancelada' => 'Tu reservación fue cancelada — POP Perote',
    ];

    private function client(): PendingRequest
    {
        return Http::baseUrl('https://api.resend.com')
            ->withToken(config('services.resend.api_key'))
            ->acceptJson();
    }

    public function notifyStaff(Reserva $reserva): void
    {
        $from = config('services.resend.reservas_from_address');
        $to = config('services.resend.reservas_notify_to');

        try {
            $this->client()->post('/emails', [
                'from' => sprintf('%s <%s>', config('services.resend.from_name'), $from),
                'to' => [$to],
                'subject' => "Nueva reservación: {$reserva->nombre} — {$reserva->fecha} {$reserva->hora}",
                'html' => View::make('mail.reserva-staff', ['reserva' => $reserva])->render(),
            ])->throw();
        } catch (Throwable $e) {
            Log::error('RESERVA_MAIL_STAFF_ERROR', ['reserva_id' => $reserva->id, 'error' => $e->getMessage()]);
        }
    }

    public function notifyCustomer(Reserva $reserva, string $estado): void
    {
        if (!$reserva->email || !isset(self::CLIENTE_SUBJECTS[$estado])) {
            return;
        }

        $from = config('services.resend.confirmacion_from_address');

        try {
            $this->client()->post('/emails', [
                'from' => sprintf('%s <%s>', config('services.resend.from_name'), $from),
                'to' => [$reserva->email],
                'subject' => self::CLIENTE_SUBJECTS[$estado],
                'html' => View::make('mail.reserva-cliente', ['reserva' => $reserva, 'estado' => $estado])->render(),
            ])->throw();
        } catch (Throwable $e) {
            Log::error('RESERVA_MAIL_CLIENTE_ERROR', ['reserva_id' => $reserva->id, 'estado' => $estado, 'error' => $e->getMessage()]);
        }
    }
}
