<?php

namespace App\Services;

use RuntimeException;

class QrSignatureService
{
    private readonly string $secret;

    public function __construct()
    {
        $this->secret = (string) config('app.qr_secret');
    }

    public function sign(int $total, string $ref, int $ts): string
    {
        $this->ensureConfigured();

        return hash_hmac('sha256', $total.$ref.$ts, $this->secret);
    }

    public function verify(int $total, string $ref, int $ts, string $sig): bool
    {
        return hash_equals($this->sign($total, $ref, $ts), $sig);
    }

    private function ensureConfigured(): void
    {
        if ($this->secret === '') {
            report(new RuntimeException('QR_SECRET no configurado'));
            abort(503, 'Servicio de tickets no disponible');
        }
    }
}
