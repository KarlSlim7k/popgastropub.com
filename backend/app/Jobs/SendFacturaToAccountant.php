<?php

namespace App\Jobs;

use App\Models\Factura;
use App\Services\FacturaAccountantMailer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendFacturaToAccountant implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 10;

    public function __construct(public Factura $factura)
    {
    }

    public function handle(FacturaAccountantMailer $mailer): void
    {
        $mailer->deliver($this->factura);
    }
}
