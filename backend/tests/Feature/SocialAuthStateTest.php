<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;
use Laravel\Socialite\Two\User as SocialiteUser;
use Tests\TestCase;

class SocialAuthStateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.google.client_id' => 'test-client-id',
            'services.google.client_secret' => 'test-client-secret',
            'services.google.redirect' => 'https://api.popgastropub.com/api/auth/social/google/callback',
        ]);
    }

    private function signedState(int $expiresInMinutes): string
    {
        return Crypt::encryptString(json_encode([
            'nonce' => Str::random(32),
            'exp' => now()->addMinutes($expiresInMinutes)->getTimestamp(),
        ]));
    }

    public function test_redirect_includes_signed_state_for_oauth2_provider(): void
    {
        $mock = \Mockery::mock(GoogleProvider::class);
        $mock->shouldReceive('stateless')->once()->andReturnSelf();
        $mock->shouldReceive('with')->once()->withArgs(function (array $params) {
            if (!isset($params['state']) || !is_string($params['state'])) {
                return false;
            }

            $payload = json_decode(Crypt::decryptString($params['state']), true);

            return is_array($payload)
                && isset($payload['exp'], $payload['nonce'])
                && $payload['exp'] > now()->getTimestamp();
        })->andReturnSelf();
        $mock->shouldReceive('redirect')->once()->andReturn(redirect()->away('https://accounts.google.com/o/oauth2/auth'));

        Socialite::shouldReceive('driver')->with('google')->andReturn($mock);

        $response = $this->get('/api/auth/social/google/redirect');

        $response->assertRedirect('https://accounts.google.com/o/oauth2/auth');
    }

    public function test_callback_rejects_missing_state(): void
    {
        $response = $this->get('/api/auth/social/google/callback?code=abc');

        $this->assertStringContainsString('error=invalid_state', $response->headers->get('Location'));
    }

    public function test_callback_rejects_garbage_state(): void
    {
        $response = $this->get('/api/auth/social/google/callback?state=garbage&code=abc');

        $this->assertStringContainsString('error=invalid_state', $response->headers->get('Location'));
    }

    public function test_callback_rejects_expired_state(): void
    {
        $expired = $this->signedState(-1);

        $response = $this->get('/api/auth/social/google/callback?'.http_build_query(['state' => $expired, 'code' => 'abc']));

        $this->assertStringContainsString('error=invalid_state', $response->headers->get('Location'));
    }

    public function test_callback_with_valid_state_logs_in_via_mocked_provider(): void
    {
        $socialUser = (new SocialiteUser())->map([
            'id' => '12345',
            'email' => 'oauthuser@example.com',
            'name' => 'OAuth User',
            'avatar' => 'https://example.com/avatar.png',
        ]);

        $mock = \Mockery::mock(GoogleProvider::class);
        $mock->shouldReceive('stateless')->once()->andReturnSelf();
        $mock->shouldReceive('user')->once()->andReturn($socialUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($mock);

        $state = $this->signedState(10);

        $response = $this->get('/api/auth/social/google/callback?'.http_build_query(['state' => $state, 'code' => 'abc']));

        $location = $response->headers->get('Location');
        $this->assertStringContainsString('token=', $location);
        $this->assertStringContainsString('status=registered', $location);
        $this->assertDatabaseHas('users', ['email' => 'oauthuser@example.com']);
    }
}
