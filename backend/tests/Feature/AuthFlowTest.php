<?php

namespace Tests\Feature;

use App\Models\LoyaltyTransaction;
use App\Models\Referral;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AuthFlowTest extends TestCase
{
    use RefreshDatabase;

    private function registerPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Cliente Nuevo',
            'email' => 'cliente-nuevo@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'terms_accepted' => true,
        ], $overrides);
    }

    public function test_register_creates_user_with_welcome_bonus(): void
    {
        $response = $this->postJson('/api/auth/register', $this->registerPayload());

        $response->assertCreated()
            ->assertJsonPath('user.points', 50)
            ->assertJsonStructure(['user', 'token']);

        $user = User::where('email', 'cliente-nuevo@test.com')->firstOrFail();
        $this->assertSame(50, $user->points);

        $this->assertDatabaseHas('loyalty_transactions', [
            'user_id' => $user->id,
            'points' => 50,
            'concept' => 'Bono de bienvenida',
        ]);
    }

    public function test_register_with_referral_code_creates_pending_referral(): void
    {
        $referrer = User::create([
            'name' => 'Referrer',
            'email' => 'referrer@test.com',
            'password' => bcrypt('password'),
            'role' => 'cliente',
            'referral_code' => 'REF123',
        ]);

        $response = $this->postJson('/api/auth/register', $this->registerPayload([
            'email' => 'referido@test.com',
            'ref' => 'REF123',
        ]));

        $response->assertCreated();

        $referred = User::where('email', 'referido@test.com')->firstOrFail();

        $this->assertDatabaseHas('referrals', [
            'referrer_id' => $referrer->id,
            'referred_id' => $referred->id,
            'status' => 'pending',
        ]);
    }

    public function test_login_with_valid_credentials_returns_token(): void
    {
        User::create([
            'name' => 'Cliente Login',
            'email' => 'login@test.com',
            'password' => bcrypt('password123'),
            'role' => 'cliente',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'login' => 'login@test.com',
            'password' => 'password123',
        ]);

        $response->assertOk()->assertJsonStructure(['user', 'token']);
    }

    public function test_login_with_invalid_password_returns_401(): void
    {
        User::create([
            'name' => 'Cliente Login',
            'email' => 'login2@test.com',
            'password' => bcrypt('password123'),
            'role' => 'cliente',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'login' => 'login2@test.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)->assertJsonPath('message', 'Credenciales inválidas.');
    }

    public function test_login_with_inactive_account_returns_403(): void
    {
        User::create([
            'name' => 'Cliente Inactivo',
            'email' => 'inactivo@test.com',
            'password' => bcrypt('password123'),
            'role' => 'cliente',
            'status' => 'inactivo',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'login' => 'inactivo@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)->assertJsonPath('message', 'La cuenta está inactiva.');
    }

    public function test_login_is_throttled_after_too_many_attempts(): void
    {
        User::create([
            'name' => 'Cliente Throttle',
            'email' => 'throttle@test.com',
            'password' => bcrypt('password123'),
            'role' => 'cliente',
        ]);

        $payload = ['login' => 'throttle@test.com', 'password' => 'wrongpassword'];

        for ($i = 0; $i < 6; $i++) {
            $this->postJson('/api/auth/login', $payload)->assertStatus(401);
        }

        $this->postJson('/api/auth/login', $payload)->assertStatus(429);
    }

    public function test_reset_password_with_expired_code_returns_422(): void
    {
        $user = User::create([
            'name' => 'Cliente Reset',
            'email' => 'reset-expired@test.com',
            'password' => bcrypt('oldpassword'),
            'role' => 'cliente',
        ]);

        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => Hash::make('123456'),
            'created_at' => Carbon::now()->subMinutes(20),
        ]);

        $response = $this->postJson('/api/auth/reset-password', [
            'email' => $user->email,
            'code' => '123456',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(422)->assertJsonPath('message', 'El código ha expirado. Solicita uno nuevo.');

        $this->assertFalse(Hash::check('newpassword123', $user->fresh()->password));
        $this->assertDatabaseMissing('password_reset_tokens', ['email' => $user->email]);
    }

    public function test_reset_password_with_valid_code_revokes_existing_tokens(): void
    {
        $user = User::create([
            'name' => 'Cliente Reset',
            'email' => 'reset-valid@test.com',
            'password' => bcrypt('oldpassword'),
            'role' => 'cliente',
        ]);

        $user->createToken('auth_token', ['*']);
        $this->assertDatabaseHas('personal_access_tokens', ['tokenable_id' => $user->id]);

        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => Hash::make('654321'),
            'created_at' => Carbon::now(),
        ]);

        $response = $this->postJson('/api/auth/reset-password', [
            'email' => $user->email,
            'code' => '654321',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertOk();

        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
        $this->assertDatabaseMissing('personal_access_tokens', ['tokenable_id' => $user->id]);
        $this->assertDatabaseMissing('password_reset_tokens', ['email' => $user->email]);
    }
}
