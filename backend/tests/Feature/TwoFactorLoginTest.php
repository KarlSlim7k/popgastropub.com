<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use PragmaRX\Google2FA\Google2FA;
use Tests\TestCase;

class TwoFactorLoginTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(array $attributes = []): User
    {
        return User::create(array_merge([
            'name' => 'Cliente Test',
            'email' => 'cliente@test.com',
            'password' => bcrypt('password123'),
            'role' => 'cliente',
        ], $attributes));
    }

    public function test_login_without_2fa_returns_full_token(): void
    {
        $this->makeUser();

        $response = $this->postJson('/api/auth/login', [
            'login' => 'cliente@test.com',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['user', 'token'])
            ->assertJsonMissing(['requires_2fa']);

        Auth::forgetGuards();

        $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer ' . $response->json('token'),
        ])->assertOk();
    }

    public function test_login_with_2fa_returns_temp_token_that_cannot_access_protected_routes(): void
    {
        $google2fa = new Google2FA();

        $this->makeUser([
            'two_factor_secret' => $google2fa->generateSecretKey(),
            'two_factor_enabled' => true,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'login' => 'cliente@test.com',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJson(['requires_2fa' => true])
            ->assertJsonStructure(['temp_token']);

        $tempToken = $response->json('temp_token');

        Auth::forgetGuards();

        $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer ' . $tempToken,
        ])->assertStatus(423);
    }

    public function test_verify_with_correct_code_issues_full_token(): void
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $this->makeUser([
            'two_factor_secret' => $secret,
            'two_factor_enabled' => true,
        ]);

        $login = $this->postJson('/api/auth/login', [
            'login' => 'cliente@test.com',
            'password' => 'password123',
        ]);

        $tempToken = $login->json('temp_token');
        $code = $google2fa->getCurrentOtp($secret);

        $verify = $this->postJson('/api/auth/2fa/verify', ['code' => $code], [
            'Authorization' => 'Bearer ' . $tempToken,
        ]);

        $verify->assertOk()
            ->assertJson(['verified' => true])
            ->assertJsonStructure(['token', 'user']);

        $fullToken = $verify->json('token');

        // Sanctum's RequestGuard caches the resolved user per guard instance;
        // force re-resolution so each call below is authenticated with its own token.
        Auth::forgetGuards();

        $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer ' . $fullToken,
        ])->assertOk();

        Auth::forgetGuards();

        // The temp token must be invalidated after a successful verification.
        $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer ' . $tempToken,
        ])->assertStatus(401);
    }

    public function test_verify_with_incorrect_code_is_rejected(): void
    {
        $google2fa = new Google2FA();

        $this->makeUser([
            'two_factor_secret' => $google2fa->generateSecretKey(),
            'two_factor_enabled' => true,
        ]);

        $login = $this->postJson('/api/auth/login', [
            'login' => 'cliente@test.com',
            'password' => 'password123',
        ]);

        $tempToken = $login->json('temp_token');

        $this->postJson('/api/auth/2fa/verify', ['code' => '000000'], [
            'Authorization' => 'Bearer ' . $tempToken,
        ])->assertStatus(422);
    }

    public function test_verify_endpoint_is_throttled(): void
    {
        $google2fa = new Google2FA();

        $this->makeUser([
            'two_factor_secret' => $google2fa->generateSecretKey(),
            'two_factor_enabled' => true,
        ]);

        $login = $this->postJson('/api/auth/login', [
            'login' => 'cliente@test.com',
            'password' => 'password123',
        ]);

        $tempToken = $login->json('temp_token');

        for ($i = 0; $i < 6; $i++) {
            $this->postJson('/api/auth/2fa/verify', ['code' => '000000'], [
                'Authorization' => 'Bearer ' . $tempToken,
            ])->assertStatus(422);
        }

        $this->postJson('/api/auth/2fa/verify', ['code' => '000000'], [
            'Authorization' => 'Bearer ' . $tempToken,
        ])->assertStatus(429);
    }
}
