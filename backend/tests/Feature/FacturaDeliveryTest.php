<?php

namespace Tests\Feature;

use App\Models\Factura;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
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

        Storage::fake('public');
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

    public function test_factura_request_is_persisted_and_delivered_to_accountants(): void
    {
        $response = $this->actingAs($this->cliente)->post('/api/facturas', $this->payload());

        $response->assertCreated()->assertJsonPath('factura.estado', 'recibida');

        $factura = Factura::firstOrFail();
        $this->assertNotNull($factura->contadores_email_enviado_at);
        $this->assertSame(1, $factura->contadores_email_intentos);
        Storage::disk('public')->assertExists($factura->ticket_path);

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
        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.host' => '127.0.0.1',
            'mail.mailers.smtp.port' => 1,
            'mail.mailers.smtp.timeout' => 1,
        ]);
        app('mail.manager')->purge();

        $response = $this->actingAs($this->cliente)->post('/api/facturas', $this->payload());

        $response->assertAccepted();
        $factura = Factura::firstOrFail();
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
