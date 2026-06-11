<?php

namespace Tests\Feature\Admin;

use App\Models\LoyaltyTier;
use App\Models\RewardRedemption;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class PuntosControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'Admin Puntos',
            'email' => 'admin-puntos@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }

    private function createTier(string $name, string $slug, int $minPoints, ?int $maxPoints, int $sortOrder): LoyaltyTier
    {
        return LoyaltyTier::create([
            'name' => $name,
            'slug' => $slug,
            'min_points' => $minPoints,
            'max_points' => $maxPoints,
            'is_active' => true,
            'sort_order' => $sortOrder,
        ]);
    }

    private function createCliente(string $email, int $points): User
    {
        return User::create([
            'name' => 'Cliente ' . $email,
            'email' => $email,
            'password' => bcrypt('password'),
            'role' => 'cliente',
            'points' => $points,
        ]);
    }

    public function test_tiers_returns_member_counts_with_constant_query_count(): void
    {
        $fan = $this->createTier('POP Fan', 'fan', 0, 199, 0);
        $lover = $this->createTier('POP Lover', 'lover', 200, 499, 1);
        $vip = $this->createTier('POP VIP', 'vip', 500, null, 2);

        $this->createCliente('fan1@test.com', 50);
        $this->createCliente('fan2@test.com', 150);
        $this->createCliente('lover1@test.com', 250);
        $this->createCliente('vip1@test.com', 600);
        $this->createCliente('vip2@test.com', 1000);

        DB::enableQueryLog();

        $response = $this->actingAs($this->admin)->getJson('/api/admin/puntos/tiers');

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        $response->assertOk();

        $byId = collect($response->json())->keyBy('id');

        $this->assertSame(2, $byId[$fan->id]['members']);
        $this->assertSame(1, $byId[$lover->id]['members']);
        $this->assertSame(2, $byId[$vip->id]['members']);

        // Un único conteo de miembros agregado, sin importar el nº de tiers.
        $usersQueries = collect($queries)->filter(fn ($q) => str_contains($q['query'], '"users"'));
        $this->assertCount(1, $usersQueries);
    }

    public function test_top_members_returns_tier_and_redemptions_with_constant_query_count(): void
    {
        $this->createTier('POP Fan', 'fan', 0, 199, 0);
        $vip = $this->createTier('POP VIP', 'vip', 500, null, 2);

        $top = $this->createCliente('top@test.com', 1000);
        $this->createCliente('second@test.com', 50);

        RewardRedemption::create([
            'user_id' => $top->id,
            'puntos_usados' => 100,
            'estado' => 'canjeado',
        ]);
        RewardRedemption::create([
            'user_id' => $top->id,
            'puntos_usados' => 50,
            'estado' => 'canjeado',
        ]);

        DB::enableQueryLog();

        $response = $this->actingAs($this->admin)->getJson('/api/admin/puntos/top-members');

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        $response->assertOk();

        $first = $response->json()[0];
        $this->assertSame('Cliente top@test.com', $first['name']);
        $this->assertSame('POP VIP', $first['tier']);
        $this->assertSame(2, $first['redeemed']);

        // Un único conteo agrupado de redenciones y una única carga de tiers,
        // sin importar el nº de miembros del top.
        $redemptionQueries = collect($queries)->filter(fn ($q) => str_contains($q['query'], 'reward_redemptions'));
        $tierQueries = collect($queries)->filter(fn ($q) => str_contains($q['query'], 'loyalty_tiers'));
        $this->assertCount(1, $redemptionQueries);
        $this->assertCount(1, $tierQueries);
    }
}
