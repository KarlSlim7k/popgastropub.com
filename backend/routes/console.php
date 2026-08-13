<?php

use App\Services\FacturaAccountantMailer;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('facturas:retry-accountant-emails {--limit=25}', function (FacturaAccountantMailer $mailer) {
    $result = $mailer->retryPending((int) $this->option('limit'));
    $this->info("Facturas procesadas: {$result['processed']}; enviadas: {$result['sent']}");
})->purpose('Reintenta correos de facturación pendientes para contadores');

Schedule::command('facturas:retry-accountant-emails --limit=25')
    ->everyMinute()
    ->withoutOverlapping();

Schedule::command('loyalty:expire-inactive-points --months=2')
    ->dailyAt('03:00')
    ->withoutOverlapping()
    ->onOneServer();

Schedule::command('loyalty:expire-points --days=60')
    ->dailyAt('03:30')
    ->withoutOverlapping()
    ->onOneServer();

Schedule::command('db:backup')
    ->dailyAt('04:00')
    ->withoutOverlapping()
    ->onOneServer();

Schedule::command('loyalty:award-birthday-points')
    ->dailyAt('00:15')
    ->withoutOverlapping()
    ->onOneServer();
