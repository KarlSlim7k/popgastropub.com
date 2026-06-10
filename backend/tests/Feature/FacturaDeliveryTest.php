<?php

namespace Tests\Feature;

use App\Jobs\SendFacturaToAccountant;
use App\Models\Factura;
use App\Models\User;
use App\Services\FacturaAccountantMailer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FacturaDeliveryTest extends TestCase
{
    use RefreshDatabase;

    private User $cliente;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');
        config(['mail.default' => 'array']);

        $this->cliente = User::create([
            'name' => 'Cliente Factura',
            'email' => 'cliente-factura@test.com',
            'password' => bcrypt('password'),
            'role' => 'cliente',
        ]);

        $this->admin = User::create([
            'name' => 'Admin Factura',
            'email' => 'admin-factura@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }

    public function test_factura_request_is_persisted_and_dispatches_accountant_job(): void
    {
        Queue::fake();

        $response = $this->actingAs($this->cliente)->post('/api/facturas', $this->payload());

        $response->assertCreated()
            ->assertJsonPath('factura.estado', 'recibida')
            ->assertJsonPath('message', 'Solicitud recibida. Tu factura está en proceso de envío al equipo de facturación.');

        $factura = Factura::firstOrFail();
        Storage::disk('local')->assertExists($factura->ticket_path);

        Queue::assertPushed(SendFacturaToAccountant::class, fn($job) => $job->factura->id === $factura->id);
    }

    public function test_accountant_job_delivers_email_with_attachment(): void
    {
        $response = $this->actingAs($this->cliente)->post('/api/facturas', $this->payload());
        $response->assertCreated();

        $factura = Factura::firstOrFail();

        (new SendFacturaToAccountant($factura))->handle(app(FacturaAccountantMailer::class));

        $factura->refresh();
        $this->assertNotNull($factura->contadores_email_enviado_at);
        $this->assertSame(1, $factura->contadores_email_intentos);

        $transport = app('mail.manager')->mailer()->getSymfonyTransport();
        $this->assertCount(1, $transport->messages());
        $message = $transport->messages()[0]->getOriginalMessage();
        $this->assertSame(
            ['facturacion@popgastropub.com'],
            array_map(fn($address) => $address->getAddress(), $message->getTo())
        );
        $this->assertCount(1, $message->getAttachments());
    }

    public function test_failed_delivery_is_preserved_and_admin_can_retry(): void
    {
        $response = $this->actingAs($this->cliente)->post('/api/facturas', $this->payload());
        $response->assertCreated();
        $factura = Factura::firstOrFail();

        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.host' => '127.0.0.1',
            'mail.mailers.smtp.port' => 1,
            'mail.mailers.smtp.timeout' => 1,
        ]);
        app('mail.manager')->purge();

        app(FacturaAccountantMailer::class)->deliver($factura);

        $factura->refresh();
        $this->assertNull($factura->contadores_email_enviado_at);
        $this->assertNotNull($factura->contadores_email_error);
        $this->assertNotNull($factura->contadores_email_siguiente_intento_at);

        config(['mail.default' => 'array']);
        app('mail.manager')->purge();

        $this->actingAs($this->admin)
            ->postJson("/api/admin/facturas/{$factura->id}/retry-accountant-email")
            ->assertOk()
            ->assertJsonPath('factura.contadores_email_intentos', 2);

        $this->assertNotNull($factura->fresh()->contadores_email_enviado_at);
    }

    public function test_index_returns_paginated_facturas(): void
    {
        $this->actingAs($this->cliente)->post('/api/facturas', $this->payload())->assertCreated();

        $response = $this->actingAs($this->cliente)->getJson('/api/facturas');

        $response->assertOk()
            ->assertJsonStructure(['data', 'meta' => ['current_page', 'last_page', 'per_page', 'total']])
            ->assertJsonCount(1, 'data');
    }

    public function test_accountant_cc_is_only_added_when_configured(): void
    {
        config(['mail.facturacion.cc' => 'contador@popgastropub.com']);

        $response = $this->actingAs($this->cliente)->post('/api/facturas', $this->payload());
        $response->assertCreated();

        $factura = Factura::firstOrFail();
        app(FacturaAccountantMailer::class)->deliver($factura);

        $transport = app('mail.manager')->mailer()->getSymfonyTransport();
        $message = $transport->messages()[0]->getOriginalMessage();

        $this->assertSame(
            ['contador@popgastropub.com'],
            array_map(fn($address) => $address->getAddress(), $message->getCc())
        );
    }

    private function payload(): array
    {
        return [
            'rfc' => 'XAXX010101000',
            'razon_social' => 'Cliente Factura Test',
            'regimen_fiscal' => '616',
            'codigo_postal' => '91270',
            'uso_cfdi' => 'G03',
            'email' => 'cliente-factura@test.com',
            'ticket' => UploadedFile::fake()->image('ticket.jpg'),
        ];
    }
}
