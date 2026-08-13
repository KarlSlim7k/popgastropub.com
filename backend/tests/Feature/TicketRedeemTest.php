<?php

namespace Tests\Feature;

use App\Models\Mesero;
use App\Models\LoyaltyPointAction;
use App\Models\LoyaltyTier;
use App\Models\Referral;
use App\Models\TicketRedeem;
use App\Models\User;
use App\Services\QrSignatureService;
use Illuminate\Support\Carbon;
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

    public function test_generate_then_redeem_assigns_loyalty_points_without_food_ranking_points(): void
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
        $this->assertDatabaseHas('meseros', ['id' => $mesero->id, 'puntos' => 0]);
    }

    public function test_first_ticket_redemption_converts_pending_referral_once(): void
    {
        $referrer = User::create([
            'name' => 'Cliente Referidor',
            'email' => 'referidor-ticket@test.com',
            'password' => bcrypt('password'),
            'role' => 'cliente',
            'points' => 0,
        ]);
        Referral::create([
            'referrer_id' => $referrer->id,
            'referred_id' => $this->cliente->id,
            'status' => 'pending',
        ]);

        $signature = app(QrSignatureService::class);
        $ts = now()->timestamp;
        $sig = $signature->sign(100, 'TKT-REFERIDO', $ts);
        TicketRedeem::create([
            'ref' => 'TKT-REFERIDO',
            'total' => 100,
            'puntos' => 10,
            'ts_emision' => $ts,
            'fecha_expiracion' => now()->addHours(72),
            'estado_validacion' => 'valido',
        ]);

        $this->actingAs($this->cliente)->postJson('/api/tickets/redeem', [
            'total' => 100,
            'ref' => 'TKT-REFERIDO',
            'ts' => $ts,
            'sig' => $sig,
        ])->assertOk();

        $this->assertSame(200, $referrer->fresh()->points);
        $this->assertDatabaseHas('referrals', [
            'referrer_id' => $referrer->id,
            'referred_id' => $this->cliente->id,
            'status' => 'converted',
        ]);
    }

    public function test_redeem_applies_tier_and_double_checkpoint_multipliers(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-08-10 20:00:00', 'America/Mexico_City'));
        $this->cliente->update(['points' => 500]);

        LoyaltyTier::create([
            'name' => 'POP Lover',
            'slug' => 'lover',
            'min_points' => 500,
            'max_points' => 1499,
            'config' => ['points_multiplier' => 1.1],
            'is_active' => true,
        ]);
        LoyaltyPointAction::create([
            'action' => 'Double Checkpoint',
            'slug' => 'double_checkpoint',
            'points' => 2,
            'points_type' => 'multiplier',
            'is_active' => true,
            'conditions' => ['multiplier' => 2, 'days' => ['monday', 'thursday']],
        ]);

        $issuedAt = now('America/Mexico_City')->startOfWeek()->setTime(18, 0);
        $ts = $issuedAt->timestamp;
        $signature = app(QrSignatureService::class);
        $sig = $signature->sign(100, 'TKT-DOBLE-LOVER', $ts);
        TicketRedeem::create([
            'ref' => 'TKT-DOBLE-LOVER',
            'total' => 100,
            'puntos' => 10,
            'ts_emision' => $ts,
            'fecha_emision_ticket' => $issuedAt,
            'fecha_expiracion' => now()->addHours(72),
            'estado_validacion' => 'valido',
        ]);

        $this->actingAs($this->cliente)->postJson('/api/tickets/redeem', [
            'total' => 100,
            'ref' => 'TKT-DOBLE-LOVER',
            'ts' => $ts,
            'sig' => $sig,
        ])->assertOk()
            ->assertJsonPath('puntos', 22)
            ->assertJsonPath('puntos_base', 10)
            ->assertJsonPath('multiplicador', 2.2)
            ->assertJsonPath('balance', 522);
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

    public function test_validate_endpoint_is_throttled(): void
    {
        $payload = [
            'total' => 100,
            'ref' => 'TKT-THROTTLE-VALIDATE',
            'ts' => now()->timestamp,
            'sig' => 'firma-invalida',
        ];

        for ($i = 0; $i < 20; $i++) {
            $this->getJson('/api/tickets/validate?'.http_build_query($payload))->assertStatus(422);
        }

        $this->getJson('/api/tickets/validate?'.http_build_query($payload))->assertStatus(429);
    }

    public function test_redeem_endpoint_is_throttled(): void
    {
        $payload = [
            'total' => 100,
            'ref' => 'TKT-THROTTLE-REDEEM',
            'ts' => now()->timestamp,
            'sig' => 'firma-invalida',
        ];

        for ($i = 0; $i < 20; $i++) {
            $this->actingAs($this->cliente)->postJson('/api/tickets/redeem', $payload)->assertStatus(422);
        }

        $this->actingAs($this->cliente)->postJson('/api/tickets/redeem', $payload)->assertStatus(429);
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
