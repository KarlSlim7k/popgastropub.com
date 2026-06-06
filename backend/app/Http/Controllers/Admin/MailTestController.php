<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Throwable;

class MailTestController extends Controller
{
    public function config()
    {
        return response()->json([
            'mailer' => config('mail.default'),
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'scheme' => config('mail.mailers.smtp.scheme'),
            'username' => config('mail.mailers.smtp.username') ?: null,
            'password_configured' => !empty(config('mail.mailers.smtp.password')),
            'from_address' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
            'auto_tls' => config('mail.mailers.smtp.auto_tls'),
            'verify_peer' => config('mail.mailers.smtp.verify_peer'),
            'facturacion_email' => config('mail.facturacion.address'),
        ]);
    }

    public function send(Request $request)
    {
        $request->validate([
            'to' => 'required|email',
        ]);

        $to = $request->input('to');

        try {
            Mail::raw(
                "Correo de prueba del sistema POP Perote.\n\n"
                . "Fecha: " . now()->format('d/m/Y H:i:s') . "\n"
                . "Host: " . config('mail.mailers.smtp.host') . ':' . config('mail.mailers.smtp.port') . "\n"
                . "From: " . config('mail.from.address') . "\n\n"
                . "Si recibes este correo, la configuración SMTP es correcta.",
                function ($message) use ($to) {
                    $message->to($to)
                        ->subject('POP Perote — Correo de prueba SMTP');
                }
            );

            Log::info('MAIL_TEST_SENT', ['to' => $to, 'admin' => $request->user()->id]);

            return response()->json([
                'success' => true,
                'message' => "Correo enviado a {$to}",
            ]);
        } catch (Throwable $e) {
            Log::error('MAIL_TEST_FAILED', [
                'to' => $to,
                'admin' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
