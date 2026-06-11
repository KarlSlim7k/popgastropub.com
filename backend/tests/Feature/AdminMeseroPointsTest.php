<?php

namespace Tests\Feature;

use App\Models\DrinkType;
use App\Models\Mesero;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminMeseroPointsTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Mesero $mesero;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'Test Admin',
            'email' => 'admin-points@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $meseroUser = User::create([
            'name' => 'Test Mesero',
            'email' => 'mesero-points@test.com',
            'password' => bcrypt('password'),
            'role' => 'mesero',
        ]);

        $this->mesero = Mesero::create([
            'user_id' => $meseroUser->id,
            'nombre' => 'Test Mesero',
            'iniciales' => 'TM',
            'puntos' => 100,
            'cocktail_points' => 100,
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

    public function test_adjust_points_with_drink_type_without_dedicated_column(): void
    {
        DrinkType::create([
            'slug' => 'mezcal',
            'label' => 'Mezcal',
            'points' => 30,
            'icon' => 'local_bar',
            'active' => true,
        ]);

        $response = $this->actingAs($this->admin)->postJson("/api/admin/meseros/{$this->mesero->id}/adjust-points", [
            'points' => 30,
            'category' => 'mezcal',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'Puntos añadidos: +30'])
            ->assertJsonPath('mesero.totalPoints', 130);

        $this->assertDatabaseHas('meseros', ['id' => $this->mesero->id, 'puntos' => 130]);
        $this->assertDatabaseHas('mesero_points_log', [
            'mesero_id' => $this->mesero->id,
            'category' => 'mezcal',
            'points' => 30,
        ]);

        // El total de la lista de meseros también refleja el nuevo tipo.
        $list = $this->actingAs($this->admin)->getJson('/api/admin/meseros');
        $list->assertStatus(200)->assertJsonFragment(['id' => $this->mesero->id, 'totalPoints' => 130]);
    }

    public function test_adjust_points_decrement_for_drink_type_without_dedicated_column(): void
    {
        DrinkType::create([
            'slug' => 'mezcal',
            'label' => 'Mezcal',
            'points' => 30,
            'icon' => 'local_bar',
            'active' => true,
        ]);

        $this->actingAs($this->admin)->postJson("/api/admin/meseros/{$this->mesero->id}/adjust-points", [
            'points' => 30,
            'category' => 'mezcal',
        ])->assertStatus(200);

        $response = $this->actingAs($this->admin)->postJson("/api/admin/meseros/{$this->mesero->id}/adjust-points", [
            'points' => -10,
            'category' => 'mezcal',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'Puntos restados: -10'])
            ->assertJsonPath('mesero.totalPoints', 120);

        $this->assertDatabaseHas('meseros', ['id' => $this->mesero->id, 'puntos' => 120]);
    }

    public function test_adjust_points_rejects_insufficient_for_new_category_without_log(): void
    {
        DrinkType::create([
            'slug' => 'mezcal',
            'label' => 'Mezcal',
            'points' => 30,
            'icon' => 'local_bar',
            'active' => true,
        ]);

        $response = $this->actingAs($this->admin)->postJson("/api/admin/meseros/{$this->mesero->id}/adjust-points", [
            'points' => -10,
            'category' => 'mezcal',
        ]);

        $response->assertStatus(422);
        $this->assertDatabaseHas('meseros', ['id' => $this->mesero->id, 'puntos' => 100]);
    }

    public function test_adjust_points_for_core_category_still_updates_column(): void
    {
        $response = $this->actingAs($this->admin)->postJson("/api/admin/meseros/{$this->mesero->id}/adjust-points", [
            'points' => 10,
            'category' => 'cocktail',
        ]);

        $response->assertStatus(200)->assertJsonPath('mesero.totalPoints', 110);
        $this->assertDatabaseHas('meseros', ['id' => $this->mesero->id, 'cocktail_points' => 110, 'puntos' => 110]);
    }
}
