<?php

namespace Tests\Feature;

use App\Models\DrinkType;
use App\Models\Mesero;
use App\Models\MeseroRating;
use App\Models\StaffNotification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StaffEndpointsTest extends TestCase
{
    use RefreshDatabase;

    private User $meseroUser;
    private User $adminUser;
    private User $clienteUser;
    private Mesero $mesero;

    protected function setUp(): void
    {
        parent::setUp();

        $this->meseroUser = User::create([
            'name' => 'Test Mesero',
            'email' => 'mesero@test.com',
            'password' => bcrypt('password'),
            'role' => 'mesero',
        ]);

        $this->adminUser = User::create([
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $this->clienteUser = User::create([
            'name' => 'Test Cliente',
            'email' => 'cliente@test.com',
            'password' => bcrypt('password'),
            'role' => 'cliente',
        ]);

        $this->mesero = Mesero::create([
            'user_id' => $this->meseroUser->id,
            'nombre' => 'Test Mesero',
            'iniciales' => 'TM',
            'puntos' => 100,
            'activo' => true,
        ]);

        DrinkType::create([
            'slug' => 'cocktail',
            'label' => 'Cóctel',
            'points' => 10,
            'icon' => 'local_bar',
            'active' => true,
        ]);
    }

    // --- Role Access Tests ---

    public function test_mesero_can_access_staff_routes(): void
    {
        $response = $this->actingAs($this->meseroUser)->getJson('/api/staff/dashboard');
        $response->assertStatus(200);
    }

    public function test_admin_can_access_staff_routes(): void
    {
        $response = $this->actingAs($this->adminUser)->getJson('/api/staff/dashboard');
        $response->assertStatus(200);
    }

    public function test_cliente_cannot_access_staff_routes(): void
    {
        $response = $this->actingAs($this->clienteUser)->getJson('/api/staff/dashboard');
        $response->assertStatus(403);
    }

    public function test_unauthenticated_cannot_access_staff_routes(): void
    {
        $response = $this->getJson('/api/staff/dashboard');
        $response->assertStatus(401);
    }

    // --- Ranking Tests ---

    public function test_ranking_returns_sorted_meseros(): void
    {
        $response = $this->actingAs($this->meseroUser)->getJson('/api/ranking');
        $response->assertStatus(200)->assertJsonCount(1);
    }

    public function test_add_points_increments_mesero_score(): void
    {
        $response = $this->actingAs($this->meseroUser)->postJson('/api/ranking/points', [
            'category' => 'cocktail',
            'quantity' => 2,
        ]);

        $response->assertStatus(200)->assertJsonFragment(['message' => 'Puntos añadidos: +20']);
        $this->assertDatabaseHas('meseros', ['id' => $this->mesero->id, 'puntos' => 120]);
    }

    public function test_add_points_applies_multiplier(): void
    {
        $this->mesero->update(['point_multiplier' => 2.0]);

        $response = $this->actingAs($this->meseroUser)->postJson('/api/ranking/points', [
            'category' => 'cocktail',
            'quantity' => 1,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('meseros', ['id' => $this->mesero->id, 'puntos' => 120]); // 100 + 10*2
    }

    public function test_add_points_rejects_invalid_category(): void
    {
        $response = $this->actingAs($this->meseroUser)->postJson('/api/ranking/points', [
            'category' => 'invalid',
            'quantity' => 1,
        ]);

        $response->assertStatus(422);
    }

    public function test_add_points_with_drink_type_without_dedicated_column(): void
    {
        DrinkType::create([
            'slug' => 'mezcal',
            'label' => 'Mezcal',
            'points' => 30,
            'icon' => 'local_bar',
            'active' => true,
        ]);

        $response = $this->actingAs($this->meseroUser)->postJson('/api/ranking/points', [
            'category' => 'mezcal',
            'quantity' => 1,
        ]);

        $response->assertStatus(200)->assertJsonFragment(['message' => 'Puntos añadidos: +30']);
        $this->assertDatabaseHas('meseros', ['id' => $this->mesero->id, 'puntos' => 130]);
    }

    // --- Mi Ranking Tests ---

    public function test_mi_ranking_returns_personal_stats(): void
    {
        $response = $this->actingAs($this->meseroUser)->getJson('/api/staff/mi-ranking');
        $response->assertStatus(200)
            ->assertJsonStructure(['position', 'total_meseros', 'puntos_totales', 'tier', 'progress']);
    }

    // --- Mesero Rating (Client → Waiter) Tests ---

    public function test_client_can_rate_mesero(): void
    {
        $response = $this->actingAs($this->clienteUser)->postJson('/api/meseros/calificar', [
            'mesero_id' => $this->mesero->id,
            'rating' => 5,
            'comentario' => 'Excelente servicio',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('meseros', ['id' => $this->mesero->id, 'puntos' => 130]); // +30 pts
        $this->assertDatabaseHas('mesero_ratings', ['mesero_id' => $this->mesero->id, 'rating' => 5]);
    }

    public function test_client_cannot_rate_same_mesero_twice_per_day(): void
    {
        $this->actingAs($this->clienteUser)->postJson('/api/meseros/calificar', [
            'mesero_id' => $this->mesero->id,
            'rating' => 4,
        ]);

        $response = $this->actingAs($this->clienteUser)->postJson('/api/meseros/calificar', [
            'mesero_id' => $this->mesero->id,
            'rating' => 5,
        ]);

        $response->assertStatus(422);
    }

    public function test_rating_creates_notification_for_mesero(): void
    {
        $this->actingAs($this->clienteUser)->postJson('/api/meseros/calificar', [
            'mesero_id' => $this->mesero->id,
            'rating' => 5,
        ]);

        $this->assertDatabaseHas('staff_notifications', [
            'mesero_id' => $this->mesero->id,
            'type' => 'new_rating',
        ]);
    }

    // --- Notifications Tests ---

    public function test_mesero_can_list_notifications(): void
    {
        StaffNotification::send($this->mesero->id, 'new_rating', 'Test', 'Body');

        $response = $this->actingAs($this->meseroUser)->getJson('/api/staff/notificaciones');
        $response->assertStatus(200)->assertJsonCount(1);
    }

    public function test_mesero_can_get_unread_count(): void
    {
        StaffNotification::send($this->mesero->id, 'new_rating', 'Test', 'Body');

        $response = $this->actingAs($this->meseroUser)->getJson('/api/staff/notificaciones/count');
        $response->assertStatus(200)->assertJsonFragment(['count' => 1]);
    }

    public function test_mesero_can_mark_notifications_read(): void
    {
        StaffNotification::send($this->mesero->id, 'new_rating', 'Test', 'Body');

        $this->actingAs($this->meseroUser)->postJson('/api/staff/notificaciones/read');

        $response = $this->actingAs($this->meseroUser)->getJson('/api/staff/notificaciones/count');
        $response->assertJsonFragment(['count' => 0]);
    }

    // --- Meseros para calificar ---

    public function test_list_meseros_for_rating(): void
    {
        $response = $this->actingAs($this->clienteUser)->getJson('/api/meseros/para-calificar');
        $response->assertStatus(200)->assertJsonCount(1);
    }
}
