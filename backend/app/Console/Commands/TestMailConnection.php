<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Transport\Dsn;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransportFactory;
use Throwable;

class TestMailConnection extends Command
{
    protected $signature = 'mail:test {email? : Correo de prueba para enviar}';
    protected $description = 'Diagnostica la conexión SMTP y opcionalmente envía un correo de prueba';

    public function handle(): int
    {
        $this->info('=== Diagnóstico SMTP — POP Perote ===');
        $this->newLine();

        $host = config('mail.mailers.smtp.host');
        $port = config('mail.mailers.smtp.port');
        $scheme = config('mail.mailers.smtp.scheme');
        $username = config('mail.mailers.smtp.username');
        $password = config('mail.mailers.smtp.password');
        $fromAddress = config('mail.from.address');
        $fromName = config('mail.from.name');
        $autoTls = config('mail.mailers.smtp.auto_tls');

        $this->table(
            ['Parámetro', 'Valor'],
            [
                ['MAIL_HOST', $host ?: '(vacío)'],
                ['MAIL_PORT', (string) $port],
                ['MAIL_SCHEME', $scheme ?: '(auto)'],
                ['MAIL_USERNAME', $username ?: '(vacío)'],
                ['MAIL_PASSWORD', $password ? '***configurado***' : '(vacío)'],
                ['MAIL_FROM_ADDRESS', $fromAddress],
                ['MAIL_FROM_NAME', $fromName],
                ['MAIL_AUTO_TLS', $autoTls ? 'true' : 'false'],
            ]
        );

        $this->newLine();
        $this->info('Probando conexión SMTP...');

        try {
            $useTls = $scheme === 'smtps';
            $factory = new EsmtpTransportFactory();
            $dsn = new Dsn(
                'smtp',
                $host,
                $username ?: null,
                $password ?: null,
                (int) $port,
                [
                    'auto_tls' => $autoTls ? 'true' : 'false',
                    'verify_peer' => 'false',
                ]
            );
            $transport = $factory->create($dsn);
            $transport->start();
            $this->info("Conexión SMTP exitosa a {$host}:{$port}");
            $transport->stop();
        } catch (Throwable $e) {
            $this->error("Fallo de conexión SMTP: {$e->getMessage()}");
            $this->newLine();
            $this->warn('Posibles causas:');
            $this->line('  1. El servidor SMTP no está corriendo o no es alcanzable desde este contenedor');
            $this->line('  2. Credenciales incorrectas (MAIL_USERNAME / MAIL_PASSWORD)');
            $this->line('  3. El puerto o esquema TLS no son correctos');
            $this->line('  4. La red Docker no tiene acceso al servidor SMTP');

            if (str_contains($host, 'postfix-mailcow')) {
                $this->newLine();
                $this->warn('Estás usando postfix-mailcow (red interna Docker).');
                $this->line('  Verifica que Mailcow esté corriendo: docker ps | grep mailcow');
                $this->line('  Verifica la red: docker network inspect mailcowdockerized_mailcow-network');
                $this->line('  Alternativa: cambia MAIL_HOST a mail.popgastropub.com y MAIL_PORT a 587');
            }

            return self::FAILURE;
        }

        $testEmail = $this->argument('email');
        if ($testEmail) {
            $this->newLine();
            $this->info("Enviando correo de prueba a {$testEmail}...");

            try {
                Mail::raw(
                    "Este es un correo de prueba del sistema POP Perote.\n\n"
                    . "Fecha: " . now()->format('d/m/Y H:i:s') . "\n"
                    . "Host SMTP: {$host}:{$port}\n"
                    . "From: {$fromAddress}\n\n"
                    . "Si recibes este correo, la configuración SMTP es correcta.",
                    function ($message) use ($testEmail) {
                        $message->to($testEmail)
                            ->subject('POP Perote — Correo de prueba SMTP');
                    }
                );
                $this->info("Correo enviado exitosamente a {$testEmail}");
            } catch (Throwable $e) {
                $this->error("Error al enviar correo: {$e->getMessage()}");
                return self::FAILURE;
            }
        } else {
            $this->newLine();
            $this->line('Para enviar un correo de prueba: php artisan mail:test tu@correo.com');
        }

        return self::SUCCESS;
    }
}
