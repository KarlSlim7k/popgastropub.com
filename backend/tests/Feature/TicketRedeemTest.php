<?php

namespace Tests\Feature;

use App\Models\Mesero;
use App\Models\TicketRedeem;
use App\Models\User;
use App\Services\QrSignatureService;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketRedeemTest extends TestCase
{
    use RefreshDatabase;

    private User $cliente;

    protected function setUp(): void
    {
        parent::setUp();

        config(['app.qr_secret' => 'test-secret']);

        $this->cliente = User::create([
            'name' => 'Cliente Ticket',
            'email' => 'cliente-ticket@test.com',
            'password' => bcrypt('password'),
            'role' => 'cliente',
            'points' => 0,
        ]);
    }

    public function test_generate_then_redeem_assigns_points_to_user_and_mesero(): void
    {
        $meseroUser = User::create([
            'name' => 'Mesero Generador',
            'email' => 'mesero-generador@test.com',
            'password' => bcrypt('password'),
            'role' => 'mesero',
        ]);

        $mesero = Mesero::create([
            'user_id' => $meseroUser->id,
            'nombre' => 'Mesero Generador',
            'puntos' => 0,
        ]);

        $generateResponse = $this->actingAs($meseroUser)->postJson('/api/staff/tickets/generate', [
            'folio' => '12345',
            'total' => 100,
            'subtotal' => 86.21,
            'iva' => 13.79,
        ]);

        $generateResponse->assertOk();

        $url = $generateResponse->json('url');
        $query = [];
        parse_str(parse_url($url, PHP_URL_QUERY), $query);

        $redeemResponse = $this->actingAs($this->cliente)->postJson('/api/tickets/redeem', [
            'total' => (int) $query['total'],
            'ref' => $query['ref'],
            'ts' => (int) $query['ts'],
            'sig' => $query['sig'],
        ]);

        $redeemResponse->assertOk()
            ->assertJsonPath('puntos', 10)
            ->assertJsonPath('balance', 10)
            ->assertJsonPath('mesero_asignado', 'Mesero Generador');

        $this->assertSame(10, $this->cliente->fresh()->points);
        $this->assertDatabaseHas('meseros', ['id' => $mesero->id, 'puntos' => 10]);
    }

    public function test_redeem_rejects_already_redeemed_ticket_with_409(): void
    {
        $signature = app(QrSignatureService::class);
        $ts = now()->timestamp;
        $sig = $signature->sign(100, 'TKT-CANJEADO', $ts);

        TicketRedeem::create([
            'ref' => 'TKT-CANJEADO',
            'total' => 100,
            'puntos' => 10,
            'ts_emision' => $ts,
            'fecha_expiracion' => now()->addHours(72),
            'canjeado_at' => now(),
            'estado_validacion' => 'valido',
        ]);

        $response = $this->actingAs($this->cliente)->postJson('/api/tickets/redeem', [
            'total' => 100,
            'ref' => 'TKT-CANJEADO',
            'ts' => $ts,
            'sig' => $sig,
        ]);

        $response->assertStatus(409);
    }

    public function test_redeem_rejects_invalid_signature_with_422(): void
    {
        $ts = now()->timestamp;

        TicketRedeem::create([
            'ref' => 'TKT-FIRMA',
            'total' => 100,
            'puntos' => 10,
            'ts_emision' => $ts,
            'fecha_expiracion' => now()->addHours(72),
            'estado_validacion' => 'valido',
        ]);

        $response = $this->actingAs($this->cliente)->postJson('/api/tickets/redeem', [
            'total' => 100,
            'ref' => 'TKT-FIRMA',
            'ts' => $ts,
            'sig' => 'firma-invalida',
        ]);

        $response->assertStatus(422)->assertJsonPath('error', 'QR inválido');
    }

    public function test_redeem_rejects_expired_qr_with_422(): void
    {
        $signature = app(QrSignatureService::class);
        $ts = now()->subHours(73)->timestamp;
        $sig = $signature->sign(100, 'TKT-VIEJO', $ts);

        $response = $this->actingAs($this->cliente)->postJson('/api/tickets/redeem', [
            'total' => 100,
            'ref' => 'TKT-VIEJO',
            'ts' => $ts,
            'sig' => $sig,
        ]);

        $response->assertStatus(422)->assertJsonPath('error', 'QR expirado');
    }

    public function test_redeem_with_unconfigured_qr_secret_returns_503(): void
    {
        config(['app.qr_secret' => '']);

        $response = $this->actingAs($this->cliente)->postJson('/api/tickets/redeem', [
            'total' => 100,
            'ref' => 'TKT-SIN-SECRETO',
            'ts' => now()->timestamp,
            'sig' => 'cualquier-firma',
        ]);

        $response->assertStatus(503);
    }

    public function test_folio_ticket_has_unique_constraint_at_db_level(): void
    {
        TicketRedeem::create([
            'ref' => 'TKT-FOLIO-1',
            'folio_ticket' => '88888',
            'total' => 100,
            'puntos' => 10,
            'ts_emision' => now()->timestamp,
            'fecha_expiracion' => now()->addHours(72),
            'estado_validacion' => 'valido',
        ]);

        $this->expectException(QueryException::class);

        TicketRedeem::create([
            'ref' => 'TKT-FOLIO-2',
            'folio_ticket' => '88888',
            'total' => 100,
            'puntos' => 10,
            'ts_emision' => now()->timestamp,
            'fecha_expiracion' => now()->addHours(72),
            'estado_validacion' => 'valido',
        ]);
    }
}
