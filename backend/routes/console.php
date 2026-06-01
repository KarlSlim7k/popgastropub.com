<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('facturas:retry-accountant-emails {--limit=25}', function (\App\Services\FacturaAccountantMailer $mailer) {
    $result = $mailer->retryPending((int) $this->option('limit'));
    $this->info("Facturas procesadas: {$result['processed']}; enviadas: {$result['sent']}");
})->purpose('Reintenta correos de facturación pendientes para contadores');

Schedule::command('facturas:retry-accountant-emails --limit=25')
    ->everyMinute()
    ->withoutOverlapping();
