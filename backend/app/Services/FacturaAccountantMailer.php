<?php

namespace App\Services;

use App\Models\Factura;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

class FacturaAccountantMailer
{
    public function deliver(Factura $factura): bool
    {
        $claimed = DB::transaction(function () use ($factura) {
            $current = Factura::lockForUpdate()->findOrFail($factura->id);
            if ($current->contadores_email_enviado_at) return null;
            if ($current->contadores_email_procesando_at?->greaterThan(now()->subMinutes(5))) return false;

            $current->update([
                'contadores_email_intentos' => $current->contadores_email_intentos + 1,
                'contadores_email_ultimo_intento_at' => now(),
                'contadores_email_procesando_at' => now(),
            ]);

            return $current->fresh();
        });

        if ($claimed === null) return true;
        if ($claimed === false) return false;

        $attempts = $claimed->contadores_email_intentos;

        try {
            $disk = TicketStorage::diskFor($claimed->ticket_path);
            abort_unless($disk->exists($claimed->ticket_path), 404, 'Ticket no encontrado.');

            Mail::raw($this->buildEmailBody($claimed), function ($message) use ($claimed, $disk) {
                $message->to(config('mail.facturacion.address'))
                    ->subject("Solicitud de Factura - {$claimed->rfc} - #{$claimed->id}")
                    ->replyTo($claimed->email, $claimed->razon_social)
                    ->attach($disk->path($claimed->ticket_path));

                if ($cc = config('mail.facturacion.cc')) {
                    $message->cc($cc);
                }
            });

            $claimed->update([
                'contadores_email_enviado_at' => now(),
                'contadores_email_siguiente_intento_at' => null,
                'contadores_email_procesando_at' => null,
                'contadores_email_error' => null,
            ]);

            Log::info('FACTURA_EMAIL_CONTADORES_ENVIADO', ['factura_id' => $claimed->id, 'intento' => $attempts]);

            return true;
        } catch (Throwable $exception) {
            $delayMinutes = min(60, max(5, 2 ** min($attempts, 6)));
            $claimed->update([
                'contadores_email_siguiente_intento_at' => now()->addMinutes($delayMinutes),
                'contadores_email_procesando_at' => null,
                'contadores_email_error' => Str::limit($exception->getMessage(), 1000),
            ]);

            Log::error('FACTURA_EMAIL_CONTADORES_ERROR', [
                'factura_id' => $claimed->id,
                'intento' => $attempts,
                'siguiente_intento_minutos' => $delayMinutes,
                'error' => $exception->getMessage(),
            ]);

            return false;
        }
    }

    public function retryPending(int $limit = 25): array
    {
        $facturas = Factura::query()
            ->whereNull('contadores_email_enviado_at')
            ->where(fn($query) => $query
                ->whereNull('contadores_email_procesando_at')
                ->orWhere('contadores_email_procesando_at', '<=', now()->subMinutes(5)))
            ->where(fn($query) => $query
                ->whereNull('contadores_email_siguiente_intento_at')
                ->orWhere('contadores_email_siguiente_intento_at', '<=', now()))
            ->orderBy('created_at')
            ->limit($limit)
            ->get();

        $sent = 0;
        foreach ($facturas as $factura) {
            if ($this->deliver($factura)) $sent++;
        }

        return ['processed' => $facturas->count(), 'sent' => $sent];
    }

    private function buildEmailBody(Factura $factura): string
    {
        return "SOLICITUD DE FACTURA #{$factura->id}\n"
            . "Fecha: " . now()->format('d/m/Y H:i') . "\n\n"
            . "DATOS FISCALES:\n"
            . "RFC: {$factura->rfc}\n"
            . "Razón Social: {$factura->razon_social}\n"
            . "Régimen Fiscal: {$factura->regimen_fiscal}\n"
            . "Código Postal: {$factura->codigo_postal}\n"
            . "Uso CFDI: {$factura->uso_cfdi}\n"
            . "Email cliente: {$factura->email}\n\n"
            . "El ticket de compra se adjunta a este correo.\n"
            . "---\nEnviado desde POP Perote - Sistema de Facturación";
    }
}
