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

    public function test_admin_can_configure_landing_content_and_safe_ctas(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/admin/promociones', [
            'name' => 'Promo con CTA',
            'type' => 'descuento',
            'indefinite' => true,
            'daysActive' => ['viernes'],
            'status' => 'activa',
            'landingEnabled' => true,
            'landingTitle' => 'Viernes de POP',
            'landingSubtitle' => 'Un beneficio listo para compartir.',
            'landingContent' => "Primera condición.\nSegunda condición.",
            'landingTemplate' => 'clasica',
            'ctaPrimaryText' => 'Ordenar ahora',
            'ctaPrimaryUrl' => '/orden',
            'ctaSecondaryText' => 'Escribir por WhatsApp',
            'ctaSecondaryUrl' => 'https://wa.me/522821278014',
        ]);

        $response->assertCreated()->assertJsonFragment([
            'landingTitle' => 'Viernes de POP',
            'landingTemplate' => 'clasica',
            'ctaPrimaryUrl' => '/orden',
            'ctaSecondaryUrl' => 'https://wa.me/522821278014',
        ]);

        $promo = Promocion::where('slug', 'promo-con-cta')->firstOrFail();
        $promo->update(['published_at' => now()]);

        $this->getJson('/api/promociones/promo-con-cta')
            ->assertOk()
            ->assertJsonPath('data.landing_title', 'Viernes de POP')
            ->assertJsonPath('data.cta_primary_url', '/orden')
            ->assertJsonPath('data.cta_secondary_url', 'https://wa.me/522821278014');
    }

    public function test_admin_rejects_insecure_or_incomplete_ctas(): void
    {
        $payload = [
            'name' => 'Promo insegura',
            'type' => 'descuento',
            'indefinite' => true,
            'daysActive' => ['viernes'],
            'status' => 'activa',
            'landingEnabled' => true,
            'ctaPrimaryText' => 'Abrir enlace',
        ];

        $this->actingAs($this->admin)
            ->postJson('/api/admin/promociones', $payload + ['ctaPrimaryUrl' => 'javascript:alert(1)'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['ctaPrimaryUrl']);

        $this->actingAs($this->admin)
            ->postJson('/api/admin/promociones', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['ctaPrimaryUrl']);

        $this->actingAs($this->admin)
            ->postJson('/api/admin/promociones', $payload + ['ctaPrimaryUrl' => 'http://example.com'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['ctaPrimaryUrl']);

        $this->actingAs($this->admin)
            ->postJson('/api/admin/promociones', $payload + ['ctaPrimaryUrl' => '//example.com'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['ctaPrimaryUrl']);

        $this->actingAs($this->admin)
            ->postJson('/api/admin/promociones', $payload + ['ctaPrimaryUrl' => "/orden\notra-ruta"])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['ctaPrimaryUrl']);
    }

    public function test_admin_can_configure_sanitized_seo_and_open_graph_fields(): void
    {
        $this->actingAs($this->admin)->postJson('/api/admin/promociones', [
            'name' => '<b>Promo segura</b>',
            'description' => '<script>alert("xss")</script>Descripción visible',
            'type' => 'descuento',
            'indefinite' => true,
            'daysActive' => ['viernes'],
            'status' => 'activa',
            'landingEnabled' => true,
            'landingTitle' => '<strong>Landing segura</strong>',
            'landingContent' => "<style>body{display:none}</style>Primera condición.\nSegunda condición.",
            'seoTitle' => '<em>Título SEO</em>',
            'seoDescription' => '<script>alert(1)</script>Descripción SEO',
            'ogImage' => 'https://api.popgastropub.com/api/storage/promociones/banner.webp',
        ])->assertCreated()->assertJsonFragment([
            'name' => 'Promo segura',
            'description' => 'Descripción visible',
            'slug' => 'promo-segura',
            'landingTitle' => 'Landing segura',
            'landingContent' => "Primera condición.\nSegunda condición.",
            'seoTitle' => 'Título SEO',
            'seoDescription' => 'Descripción SEO',
            'ogImage' => 'https://api.popgastropub.com/api/storage/promociones/banner.webp',
        ]);

        $promo = Promocion::where('slug', 'promo-segura')->firstOrFail();
        $this->assertSame('Descripción visible', $promo->descripcion);
        $this->assertSame('Título SEO', $promo->seo_title);
    }

    public function test_admin_rejects_invalid_slug_image_and_open_graph_url(): void
    {
        $payload = [
            'name' => 'Promo validada',
            'type' => 'descuento',
            'indefinite' => true,
            'daysActive' => ['viernes'],
            'status' => 'activa',
            'landingEnabled' => true,
        ];

        $this->actingAs($this->admin)
            ->postJson('/api/admin/promociones', $payload + ['slug' => 'Slug inválido'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);

        $this->actingAs($this->admin)
            ->postJson('/api/admin/promociones', $payload + ['image' => 'javascript:alert(1)'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image']);

        $this->actingAs($this->admin)
            ->postJson('/api/admin/promociones', $payload + ['ogImage' => 'http://example.com/banner.jpg'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['ogImage']);

        $this->actingAs($this->admin)
            ->postJson('/api/admin/promociones', array_merge($payload, ['name' => '<script>alert(1)</script>']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    public function test_public_landing_does_not_expose_aggregated_admin_metrics(): void
    {
        Promocion::create($this->promoAttributes([
            'views_count' => 10,
            'clicks_count' => 5,
            'leads_count' => 2,
        ]));

        $this->getJson('/api/promociones/promo-publica')
            ->assertOk()
            ->assertJsonMissingPath('data.views_count')
            ->assertJsonMissingPath('data.clicks_count')
            ->assertJsonMissingPath('data.leads_count');
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
            'landing_template' => 'editorial',
            'published_at' => now(),
        ], $overrides);
    }
}
