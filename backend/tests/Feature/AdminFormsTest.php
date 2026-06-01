<?php

namespace Tests\Feature;

use App\Models\Mesero;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminFormsTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'Test Admin',
            'email' => 'admin-forms@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }

    public function test_admin_can_create_complete_menu_item(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/admin/menu', [
            'name' => 'Rollo de prueba',
            'description' => 'Descripción visible en menú.',
            'category' => 'Sushi',
            'price' => 150,
            'cost' => 60,
            'stock' => 80,
            'status' => 'available',
            'active' => true,
            'featured' => true,
            'hasPromo' => true,
            'promoPrice' => 120,
            'allergens' => ['Soya'],
        ]);

        $response->assertCreated()->assertJsonFragment(['featured' => true, 'status' => 'available']);
        $this->assertDatabaseHas('productos', ['nombre' => 'Rollo de prueba', 'destacado' => true]);
    }

    public function test_admin_can_create_indefinite_weekday_promotion(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/admin/promociones', [
            'name' => 'Promo recurrente',
            'type' => 'happy_hour',
            'discount' => '2x1',
            'indefinite' => true,
            'daysActive' => ['lunes', 'miercoles'],
            'status' => 'activa',
        ]);

        $response->assertCreated()
            ->assertJsonFragment(['indefinite' => true, 'daysActive' => ['lunes', 'miercoles']]);
        $this->assertDatabaseHas('promociones', [
            'titulo' => 'Promo recurrente',
            'dia_inicio' => null,
            'dia_fin' => null,
            'indefinida' => true,
        ]);
    }

    public function test_finite_promotion_requires_date_range(): void
    {
        $this->actingAs($this->admin)->postJson('/api/admin/promociones', [
            'name' => 'Promo incompleta',
            'type' => 'descuento',
            'indefinite' => false,
            'daysActive' => ['lunes'],
            'status' => 'activa',
        ])->assertUnprocessable()->assertJsonValidationErrors(['startDate', 'endDate']);
    }

    public function test_admin_can_create_reward_and_validated_user(): void
    {
        $this->actingAs($this->admin)->postJson('/api/admin/recompensas', [
            'nombre' => 'Bebida gratis',
            'puntos_requeridos' => 100,
            'imagen' => 'https://example.com/recompensa.webp',
            'disponible' => true,
            'categoria' => 'bebidas',
            'tier' => 'fan',
        ])->assertCreated();

        $this->actingAs($this->admin)->postJson('/api/admin/usuarios', [
            'name' => 'Cliente Test',
            'email' => 'cliente-forms@test.com',
            'password' => 'password',
            'role' => 'cliente',
            'phone' => '2821234567',
            'rfc' => 'XAXX010101000',
            'status' => 'pendiente',
        ])->assertCreated()->assertJsonFragment(['status' => 'pendiente']);
    }

    public function test_admin_can_apply_global_ranking_multiplier(): void
    {
        $user = User::create([
            'name' => 'Mesero Test',
            'email' => 'mesero-multiplier@test.com',
            'password' => bcrypt('password'),
            'role' => 'mesero',
        ]);
        Mesero::create(['user_id' => $user->id, 'nombre' => 'Mesero Test', 'activo' => true]);

        $this->actingAs($this->admin)->postJson('/api/admin/ranking/multiplicador', [
            'multiplier' => 2,
        ])->assertOk();

        $this->assertDatabaseHas('meseros', ['nombre' => 'Mesero Test', 'point_multiplier' => 2]);
    }

    public function test_public_image_route_only_serves_allowed_admin_images(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('menu/00000000-0000-0000-0000-000000000000.webp', 'image');

        $this->get('/api/storage/menu/00000000-0000-0000-0000-000000000000.webp')->assertOk();
        $this->get('/api/storage/tickets/private.webp')->assertNotFound();
    }
}
