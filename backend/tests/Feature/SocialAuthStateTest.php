<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
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

    private function sessionState(string $state, int $expiresInMinutes = 10): array
    {
        return [
            'oauth_state.google' => [
                'hash' => hash('sha256', $state),
                'expires_at' => now()->addMinutes($expiresInMinutes)->getTimestamp(),
            ],
        ];
    }

    public function test_redirect_stores_an_opaque_state_in_the_browser_session(): void
    {
        $state = null;
        $mock = \Mockery::mock(GoogleProvider::class);
        $mock->shouldReceive('stateless')->once()->andReturnSelf();
        $mock->shouldReceive('with')->once()->withArgs(function (array $params) use (&$state) {
            $state = $params['state'] ?? null;

            return is_string($state) && strlen($state) === 64;
        })->andReturnSelf();
        $mock->shouldReceive('redirect')->once()->andReturn(redirect()->away('https://accounts.google.com/o/oauth2/auth'));

        Socialite::shouldReceive('driver')->with('google')->andReturn($mock);

        $response = $this->get('/api/auth/social/google/redirect');

        $response->assertRedirect('https://accounts.google.com/o/oauth2/auth');
        $this->assertSame(hash('sha256', $state), session('oauth_state.google.hash'));
        $this->assertGreaterThan(now()->getTimestamp(), session('oauth_state.google.expires_at'));
    }

    public function test_callback_rejects_missing_state(): void
    {
        $response = $this->get('/api/auth/social/google/callback?code=abc');

        $this->assertStringContainsString('error=invalid_state', $response->headers->get('Location'));
    }

    public function test_callback_rejects_garbage_state(): void
    {
        $expected = Str::random(64);
        $response = $this->withSession($this->sessionState($expected))
            ->get('/api/auth/social/google/callback?state=garbage&code=abc');

        $this->assertStringContainsString('error=invalid_state', $response->headers->get('Location'));
        $this->assertNull(session('oauth_state.google'));
    }

    public function test_callback_rejects_expired_state(): void
    {
        $expired = Str::random(64);

        $response = $this->withSession($this->sessionState($expired, -1))
            ->get('/api/auth/social/google/callback?'.http_build_query(['state' => $expired, 'code' => 'abc']));

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

        $state = Str::random(64);

        $response = $this->withSession($this->sessionState($state))
            ->get('/api/auth/social/google/callback?'.http_build_query(['state' => $state, 'code' => 'abc']));

        $location = $response->headers->get('Location');
        $this->assertStringNotContainsString('token=', $location);
        $this->assertStringContainsString('status=registered', $location);
        $this->assertDatabaseHas('users', ['email' => 'oauthuser@example.com']);
        $this->assertAuthenticatedAs(\App\Models\User::where('email', 'oauthuser@example.com')->first());
        $this->assertNull(session('oauth_state.google'));
    }
}
