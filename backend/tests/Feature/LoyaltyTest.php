<?php

namespace Tests\Feature;

use App\Models\LoyaltyTransaction;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class LoyaltyTest extends TestCase
{
    use RefreshDatabase;

    private User $cliente;

    protected function setUp(): void
    {
        parent::setUp();

        $this->cliente = User::create([
            'name' => 'Cliente Loyalty',
            'email' => 'cliente-loyalty@test.com',
            'password' => bcrypt('password'),
            'role' => 'cliente',
            'points' => 0,
        ]);
    }

    public function test_checkin_awards_points_once_per_day(): void
    {
        $response = $this->actingAs($this->cliente)->postJson('/api/loyalty/checkin');

        $response->assertOk()->assertJsonPath('points', 25);

        $this->assertDatabaseHas('loyalty_transactions', [
            'user_id' => $this->cliente->id,
            'concept' => 'Check-in restaurante',
            'points' => 25,
        ]);

        $second = $this->actingAs($this->cliente)->postJson('/api/loyalty/checkin');

        $second->assertStatus(422)->assertJsonPath('message', 'Ya registraste tu check-in de hoy.');

        $this->assertSame(25, $this->cliente->fresh()->points);
        $this->assertSame(1, LoyaltyTransaction::where('user_id', $this->cliente->id)
            ->where('concept', 'Check-in restaurante')->count());
    }

    public function test_checkin_forbidden_for_non_cliente_role(): void
    {
        $mesero = User::create([
            'name' => 'Mesero Loyalty',
            'email' => 'mesero-loyalty@test.com',
            'password' => bcrypt('password'),
            'role' => 'mesero',
        ]);

        $this->actingAs($mesero)->postJson('/api/loyalty/checkin')->assertStatus(403);
    }

    public function test_tier_calculation_uses_dynamic_settings(): void
    {
        $this->cliente->update(['points' => 250]);

        $this->actingAs($this->cliente)->getJson('/api/loyalty/tier')
            ->assertOk()
            ->assertJsonPath('current_tier.name', 'POP Fan');

        Setting::where('group', 'loyalty')->where('key', 'tier_lover_min')->update(['value' => '200']);
        Cache::forget('loyalty_settings');
        $this->cliente->refresh();

        $this->actingAs($this->cliente)->getJson('/api/loyalty/tier')
            ->assertOk()
            ->assertJsonPath('current_tier.name', 'POP Lover');
    }

    public function test_birthday_bonus_is_awarded_once_per_year(): void
    {
        $this->cliente->update(['birth_date' => '1995-08-11']);

        $this->artisan('loyalty:award-birthday-points', ['--date' => '2026-08-11'])
            ->expectsOutput('Bonos de cumpleaños otorgados: 1')
            ->assertSuccessful();

        $this->artisan('loyalty:award-birthday-points', ['--date' => '2026-08-11'])
            ->expectsOutput('Bonos de cumpleaños otorgados: 0')
            ->assertSuccessful();

        $this->assertSame(150, $this->cliente->fresh()->points);
        $this->assertDatabaseCount('loyalty_transactions', 1);
    }
}
