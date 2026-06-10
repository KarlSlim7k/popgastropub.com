<?php

namespace Tests\Feature;

use App\Jobs\SendPushNotification;
use App\Models\PushSubscription;
use App\Models\Reserva;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class AdminReservaPushTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $cliente;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'Admin Reserva',
            'email' => 'admin-reserva@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $this->cliente = User::create([
            'name' => 'Cliente Reserva',
            'email' => 'cliente-reserva@test.com',
            'password' => bcrypt('password'),
            'role' => 'cliente',
        ]);

        PushSubscription::create([
            'user_id' => $this->cliente->id,
            'endpoint' => 'https://push.example.com/endpoint',
            'p256dh' => 'p256dh-key',
            'auth' => 'auth-key',
        ]);
    }

    public function test_confirming_reserva_dispatches_push_notification_job(): void
    {
        Queue::fake();

        $reserva = Reserva::create([
            'user_id' => $this->cliente->id,
            'nombre' => 'Cliente Reserva',
            'telefono' => '5512345678',
            'fecha' => '2026-07-01',
            'hora' => '20:00',
            'personas' => 2,
            'estado' => 'pendiente',
        ]);

        $response = $this->actingAs($this->admin)
            ->patchJson("/api/admin/reservas/{$reserva->id}/status", ['estado' => 'confirmada']);

        $response->assertOk()->assertJsonPath('estado', 'confirmada');

        Queue::assertPushed(SendPushNotification::class, function ($job) {
            return $job->title === 'Tu reservación en POP Perote'
                && str_contains($job->body, 'Confirmada')
                && $job->subscriptions[0]['endpoint'] === 'https://push.example.com/endpoint';
        });
    }

    public function test_pending_status_does_not_dispatch_push_notification(): void
    {
        Queue::fake();

        $reserva = Reserva::create([
            'user_id' => $this->cliente->id,
            'nombre' => 'Cliente Reserva',
            'telefono' => '5512345678',
            'fecha' => '2026-07-01',
            'hora' => '20:00',
            'personas' => 2,
            'estado' => 'confirmada',
        ]);

        $this->actingAs($this->admin)
            ->patchJson("/api/admin/reservas/{$reserva->id}/status", ['estado' => 'pendiente'])
            ->assertOk();

        Queue::assertNotPushed(SendPushNotification::class);
    }

    public function test_reserva_without_user_does_not_dispatch_push_notification(): void
    {
        Queue::fake();

        $reserva = Reserva::create([
            'user_id' => null,
            'nombre' => 'Walk-in',
            'telefono' => '5512345678',
            'fecha' => '2026-07-01',
            'hora' => '20:00',
            'personas' => 2,
            'estado' => 'pendiente',
        ]);

        $this->actingAs($this->admin)
            ->patchJson("/api/admin/reservas/{$reserva->id}/status", ['estado' => 'confirmada'])
            ->assertOk();

        Queue::assertNotPushed(SendPushNotification::class);
    }
}
