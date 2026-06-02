<?php

namespace Tests\Feature;

use App\Models\Promocion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromoLandingPagesTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'Marketing Admin',
            'email' => 'marketing-admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }

    public function test_admin_can_create_disabled_landing_with_generated_slug(): void
    {
        $this->actingAs($this->admin)->postJson('/api/admin/promociones', [
            'name' => 'Sushiércoles POP',
            'type' => 'descuento',
            'indefinite' => true,
            'daysActive' => ['miercoles'],
            'status' => 'activa',
            'landingEnabled' => false,
        ])->assertCreated()->assertJsonFragment([
            'slug' => 'sushiercoles-pop',
            'landingEnabled' => false,
            'published' => false,
        ]);
    }

    public function test_slug_must_be_unique(): void
    {
        Promocion::create($this->promoAttributes(['slug' => 'promo-unica']));

        $this->actingAs($this->admin)->postJson('/api/admin/promociones', [
            'name' => 'Otra promoción',
            'slug' => 'promo-unica',
            'type' => 'descuento',
            'indefinite' => true,
            'daysActive' => ['lunes'],
            'status' => 'activa',
            'landingEnabled' => true,
        ])->assertUnprocessable()->assertJsonValidationErrors(['slug']);
    }

    public function test_admin_can_publish_enabled_landing_and_fetch_it_publicly(): void
    {
        $promo = Promocion::create($this->promoAttributes());

        $this->actingAs($this->admin)
            ->postJson("/api/admin/promociones/{$promo->id}/publish")
            ->assertOk()
            ->assertJsonFragment(['published' => true]);

        $this->getJson('/api/promociones/promo-publica')
            ->assertOk()
            ->assertJsonPath('data.titulo', 'Promo pública')
            ->assertJsonPath('data.landing_url', 'https://popgastropub.com/promo/promo-publica');
    }

    public function test_unpublished_paused_finalized_and_expired_landings_are_hidden(): void
    {
        $unpublished = Promocion::create($this->promoAttributes(['slug' => 'sin-publicar', 'published_at' => null]));
        $paused = Promocion::create($this->promoAttributes(['slug' => 'pausada', 'activa' => false, 'estado' => 'pausada']));
        $finished = Promocion::create($this->promoAttributes(['slug' => 'finalizada', 'activa' => false, 'estado' => 'finalizada']));
        $expired = Promocion::create($this->promoAttributes([
            'slug' => 'expirada',
            'indefinida' => false,
            'dia_inicio' => '2026-01-01',
            'dia_fin' => '2026-01-31',
        ]));

        foreach ([$unpublished, $paused, $finished, $expired] as $promo) {
            $this->getJson("/api/promociones/{$promo->slug}")->assertNotFound();
        }
    }

    public function test_admin_cannot_publish_disabled_landing(): void
    {
        $promo = Promocion::create($this->promoAttributes(['landing_enabled' => false]));

        $this->actingAs($this->admin)
            ->postJson("/api/admin/promociones/{$promo->id}/publish")
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['landingEnabled']);
    }

    public function test_admin_cannot_publish_landing_with_invalid_legacy_dates(): void
    {
        $promo = Promocion::create($this->promoAttributes([
            'indefinida' => false,
            'dia_inicio' => 'lunes',
            'dia_fin' => 'miercoles',
        ]));

        $this->actingAs($this->admin)
            ->postJson("/api/admin/promociones/{$promo->id}/publish")
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['startDate']);

        $this->getJson("/api/promociones/{$promo->slug}")->assertNotFound();
    }

    private function promoAttributes(array $overrides = []): array
    {
        return array_merge([
            'titulo' => 'Promo pública',
            'slug' => 'promo-publica',
            'descripcion' => 'Promoción de prueba',
            'tipo' => 'descuento',
            'descuento' => '2x1',
            'dias_activos' => 'lunes,martes,miercoles,jueves,viernes,sabado,domingo',
            'indefinida' => true,
            'activa' => true,
            'estado' => 'activa',
            'landing_enabled' => true,
            'published_at' => now(),
        ], $overrides);
    }
}
