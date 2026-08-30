<?php

namespace Tests\Feature;

use App\Models\User;
use Firebase\JWT\JWT;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class Auth0LogoutTest extends TestCase
{
    use RefreshDatabase;

    private const DOMAIN = 'pop-test.auth0.com';
    private const CLIENT_ID = 'test-auth0-client-id';
    private const KID = 'test-kid-logout';
    private const FIRST_PARTY_HEADERS = ['Origin' => 'https://popgastropub.com'];

    private string $privateKeyPem = '';

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.auth0.domain' => self::DOMAIN,
            'services.auth0.client_id' => self::CLIENT_ID,
            'services.auth0.audience' => 'https://api.popgastropub.com',
            'sanctum.stateful' => ['popgastropub.com'],
        ]);

        $keyPair = openssl_pkey_new([
            'private_key_bits' => 2048,
            'private_key_type' => OPENSSL_KEYTYPE_RSA,
        ]);
        $details = openssl_pkey_get_details($keyPair);
        openssl_pkey_export($keyPair, $this->privateKeyPem);

        Http::fake([
            'https://'.self::DOMAIN.'/.well-known/jwks.json' => Http::response(['keys' => [[
                'kty' => 'RSA',
                'kid' => self::KID,
                'alg' => 'RS256',
                'use' => 'sig',
                'n' => $this->base64UrlEncode($details['rsa']['n']),
                'e' => $this->base64UrlEncode($details['rsa']['e']),
            ]]], 200),
        ]);
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * @param array<string, mixed> $overrides
     */
    private function makeIdToken(array $overrides = []): string
    {
        $now = now()->getTimestamp();

        $claims = array_merge([
            'iss' => 'https://'.self::DOMAIN.'/',
            'aud' => self::CLIENT_ID,
            'sub' => 'auth0|logout-sub',
            'iat' => $now,
            'exp' => $now + 3600,
            'email' => 'logout-user@example.com',
            'email_verified' => true,
            'name' => 'Logout User',
        ], $overrides);

        return JWT::encode($claims, $this->privateKeyPem, 'RS256', self::KID);
    }

    private function loginViaAuth0(string $idToken): User
    {
        $this->withHeaders(self::FIRST_PARTY_HEADERS)
            ->postJson('/api/auth/auth0/callback', ['id_token' => $idToken])
            ->assertOk();

        return User::where('email', 'logout-user@example.com')->firstOrFail();
    }

    public function test_reusing_the_same_id_token_is_rejected_as_replay(): void
    {
        $token = $this->makeIdToken();

        $this->withHeaders(self::FIRST_PARTY_HEADERS)
            ->postJson('/api/auth/auth0/callback', ['id_token' => $token])
            ->assertOk();

        // Recarga/segundo intento reutilizando el mismo id_token ya consumido.
        $this->withHeaders(self::FIRST_PARTY_HEADERS)
            ->postJson('/api/auth/auth0/callback', ['id_token' => $token])
            ->assertStatus(409)
            ->assertJsonPath('error', 'token_already_used');
    }

    public function test_replayed_token_does_not_change_who_is_authenticated(): void
    {
        $token = $this->makeIdToken();
        $user = $this->loginViaAuth0($token);

        $this->withHeaders(self::FIRST_PARTY_HEADERS)
            ->postJson('/api/auth/auth0/callback', ['id_token' => $token])
            ->assertStatus(409);

        $this->assertAuthenticatedAs($user);
    }

    public function test_logout_invalidates_the_session_established_via_auth0(): void
    {
        $user = $this->loginViaAuth0($this->makeIdToken());
        $this->assertAuthenticatedAs($user);

        $this->withHeaders(self::FIRST_PARTY_HEADERS)
            ->postJson('/api/auth/logout')
            ->assertOk();

        $this->assertGuest('web');
    }

    public function test_sanctum_endpoint_works_then_guard_is_cleared_after_logout(): void
    {
        $user = $this->loginViaAuth0($this->makeIdToken());

        $this->withHeaders(self::FIRST_PARTY_HEADERS)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('email', $user->email);

        $this->withHeaders(self::FIRST_PARTY_HEADERS)->postJson('/api/auth/logout')->assertOk();

        // Nota: dentro de un mismo método de test, PHPUnit reutiliza el guard/
        // contenedor de Laravel entre llamadas simuladas, así que una segunda
        // petición HTTP en el mismo test no reproduce de forma fiable el
        // ciclo de cookie de un navegador real (confirmado también con el
        // login local existente, no es específico de Auth0). La forma
        // establecida en este repo para verificar "sesión terminada" es
        // assertGuest(), como ya hace AuthFlowTest.
        $this->assertGuest('web');
    }

    public function test_role_protected_endpoint_works_then_guard_is_cleared_after_logout(): void
    {
        // Admin local preexistente (el alta nueva por Auth0 siempre crea role=cliente).
        // Vincular por email verificado NO debe tocar el rol -- se confirma aquí.
        $admin = User::create([
            'name' => 'Admin Existente',
            'email' => 'admin-auth0@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $this->withHeaders(self::FIRST_PARTY_HEADERS)->postJson('/api/auth/auth0/callback', [
            'id_token' => $this->makeIdToken([
                'sub' => 'auth0|admin-sub',
                'email' => 'admin-auth0@example.com',
            ]),
        ])->assertOk();

        $admin->refresh();
        $this->assertSame('admin', $admin->role);
        $this->assertSame('auth0|admin-sub', $admin->auth0_sub);

        $this->withHeaders(self::FIRST_PARTY_HEADERS)
            ->getJson('/api/admin/usuarios')
            ->assertOk();

        $this->withHeaders(self::FIRST_PARTY_HEADERS)->postJson('/api/auth/logout')->assertOk();

        $this->assertGuest('web');
    }
}
