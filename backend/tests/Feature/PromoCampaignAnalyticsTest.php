<?php

namespace Tests\Feature;

use App\Models\PromoEvent;
use App\Models\Promocion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromoCampaignAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'Analytics Admin',
            'email' => 'analytics-admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }

    public function test_admin_can_configure_form_and_public_lead_is_stored_and_counted(): void
    {
        $promo = Promocion::create($this->promoAttributes());

        $this->actingAs($this->admin)->putJson("/api/admin/promociones/{$promo->id}", [
            'formEnabled' => true,
            'formFields' => ['nombre', 'telefono', 'mensaje'],
        ])->assertOk()->assertJsonFragment([
            'formEnabled' => true,
            'formFields' => ['nombre', 'telefono', 'mensaje'],
        ]);

        $this->postJson('/api/promociones/analitica/lead', [
            'nombre' => '<b>Ana</b>',
            'telefono' => '282 123 4567',
            'mensaje' => 'Quiero reservar.',
            'email' => 'ignored@example.com',
            'origen' => 'instagram',
        ])->assertCreated();

        $this->assertDatabaseHas('promo_leads', [
            'promocion_id' => $promo->id,
            'nombre' => 'Ana',
            'telefono' => '282 123 4567',
            'email' => null,
            'mensaje' => 'Quiero reservar.',
            'origen' => 'instagram',
        ]);
        $this->assertDatabaseHas('promo_events', [
            'promocion_id' => $promo->id,
            'event_type' => PromoEvent::LEAD,
        ]);
        $this->assertSame(1, $promo->fresh()->leads_count);
    }

    public function test_public_lead_requires_enabled_form_and_configured_fields(): void
    {
        Promocion::create($this->promoAttributes(['form_enabled' => false]));

        $this->postJson('/api/promociones/analitica/lead', [
            'nombre' => 'Ana',
        ])->assertNotFound();

        $this->actingAs($this->admin)->postJson('/api/admin/promociones', [
            'name' => 'Formulario inválido',
            'type' => 'descuento',
            'indefinite' => true,
            'daysActive' => ['lunes'],
            'status' => 'activa',
            'landingEnabled' => true,
            'formEnabled' => true,
            'formFields' => [],
        ])->assertUnprocessable()->assertJsonValidationErrors(['formFields']);
    }

    public function test_views_are_deduplicated_and_clicks_are_counted(): void
    {
        $promo = Promocion::create($this->promoAttributes());

        $this->postJson('/api/promociones/analitica/view')->assertAccepted()->assertJson(['recorded' => true]);
        $this->postJson('/api/promociones/analitica/view')->assertAccepted()->assertJson(['recorded' => false]);
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.12'])
            ->postJson('/api/promociones/analitica/view')
            ->assertAccepted()
            ->assertJson(['recorded' => true]);

        $this->postJson('/api/promociones/analitica/click', ['type' => PromoEvent::CTA_PRIMARY_CLICK])->assertAccepted();
        $this->postJson('/api/promociones/analitica/click', ['type' => PromoEvent::CTA_SECONDARY_CLICK])->assertAccepted();
        $this->postJson('/api/promociones/analitica/click', ['type' => 'invalid'])->assertUnprocessable();

        $promo->refresh();
        $this->assertSame(2, $promo->views_count);
        $this->assertSame(2, $promo->clicks_count);
        $this->assertDatabaseCount('promo_events', 4);
    }

    public function test_metrics_leads_and_csv_are_admin_only(): void
    {
        $promo = Promocion::create($this->promoAttributes([
            'views_count' => 4,
            'clicks_count' => 2,
            'leads_count' => 1,
        ]));
        $promo->leads()->create([
            'nombre' => '=Ana',
            'telefono' => '2821234567',
            'origen' => 'facebook',
        ]);

        $this->getJson("/api/admin/promociones/{$promo->id}/metrics")->assertUnauthorized();
        $this->getJson("/api/admin/promociones/{$promo->id}/leads")->assertUnauthorized();

        $this->actingAs($this->admin)
            ->getJson("/api/admin/promociones/{$promo->id}/metrics")
            ->assertOk()
            ->assertJson([
                'viewsCount' => 4,
                'clicksCount' => 2,
                'leadsCount' => 1,
                'clickThroughRate' => 50,
                'leadConversionRate' => 25,
            ]);

        $this->actingAs($this->admin)
            ->getJson("/api/admin/promociones/{$promo->id}/leads")
            ->assertOk()
            ->assertJsonPath('data.0.nombre', '=Ana');

        $csv = $this->actingAs($this->admin)
            ->get("/api/admin/promociones/{$promo->id}/leads.csv");

        $csv
            ->assertOk()
            ->assertDownload('leads-analitica.csv');
        $this->assertStringContainsString("'=Ana", $csv->streamedContent());
    }

    private function promoAttributes(array $overrides = []): array
    {
        return array_merge([
            'titulo' => 'Promo analítica',
            'slug' => 'analitica',
            'descripcion' => 'Promoción de prueba',
            'tipo' => 'descuento',
            'dias_activos' => 'lunes,martes,miercoles,jueves,viernes,sabado,domingo',
            'indefinida' => true,
            'activa' => true,
            'estado' => 'activa',
            'landing_enabled' => true,
            'landing_template' => 'editorial',
            'form_enabled' => true,
            'form_fields' => ['nombre', 'telefono'],
            'published_at' => now(),
        ], $overrides);
    }
}
