<?php

namespace App\Services;

use App\Models\TicketRedeem;
use Carbon\Carbon;

class TicketValidator
{
    public const WINDOW_HOURS = 24;

    public const MONTO_MINIMO = 1;

    public const MONTO_MAXIMO = 10000;

    public function validar(array $data): array
    {
        $errores = [];

        if (!preg_match('/^\d{5,6}$/', (string) $data['folio'])) {
            $errores[] = 'El folio debe tener 5 o 6 dígitos numéricos';
        }

        if (!isset($data['subtotal']) || !isset($data['iva'])) {
            $errores[] = 'Debes capturar el subtotal y el IVA del ticket';
        } else {
            $ivaEsperado = round((float) $data['subtotal'] * 0.16, 2);
            $ivaCapturado = round((float) $data['iva'], 2);

            if (abs($ivaEsperado - $ivaCapturado) > 0.01) {
                $errores[] = sprintf(
                    'El IVA no coincide con el subtotal (esperado $%.2f, capturado $%.2f)',
                    $ivaEsperado,
                    $ivaCapturado
                );
            }
        }

        $total = (float) ($data['total'] ?? 0);
        if ($total <= 0 || $total > self::MONTO_MAXIMO) {
            $errores[] = sprintf('El monto debe estar entre $%d y $%d', self::MONTO_MINIMO, self::MONTO_MAXIMO);
        }

        if (isset($data['subtotal'], $data['iva'])) {
            $suma = round((float) $data['subtotal'] + (float) $data['iva'], 2);
            if (abs($suma - $total) > 0.01) {
                $errores[] = 'El total no coincide con subtotal + IVA';
            }
        }

        if (!empty($data['folio']) && preg_match('/^\d{5,6}$/', (string) $data['folio'])) {
            $existe = TicketRedeem::where('folio_ticket', $data['folio'])->exists();
            if ($existe) {
                $errores[] = 'Este folio ya fue registrado anteriormente';
            }
        }

        if (!empty($data['fecha_emision'])) {
            try {
                $fechaEmision = Carbon::parse($data['fecha_emision']);
                $horas = $fechaEmision->diffInHours(now(), false);

                if ($horas > self::WINDOW_HOURS) {
                    $errores[] = sprintf('El ticket tiene más de %d horas de antigüedad', self::WINDOW_HOURS);
                }

                if ($fechaEmision->isFuture()) {
                    $errores[] = 'La fecha de emisión del ticket no puede ser futura';
                }
            } catch (\Throwable $e) {
                $errores[] = 'Formato de fecha de emisión inválido';
            }
        }

        return $errores;
    }

    public function esValido(array $data): bool
    {
        return empty($this->validar($data));
    }

    public function generarHash(array $data, ?string $timestamp = null): string
    {
        $ts = $timestamp ?? now()->toDateTimeString();

        $payload = implode('|', [
            $data['folio'],
            number_format((float) $data['total'], 2, '.', ''),
            number_format((float) ($data['subtotal'] ?? 0), 2, '.', ''),
            number_format((float) ($data['iva'] ?? 0), 2, '.', ''),
            $ts,
        ]);

        return hash('sha256', $payload);
    }
}
