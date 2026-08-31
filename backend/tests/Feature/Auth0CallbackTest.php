<?php

namespace Tests\Feature;

use App\Models\User;
use Firebase\JWT\JWT;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class Auth0CallbackTest extends TestCase
{
    use RefreshDatabase;

    private const DOMAIN = 'pop-test.auth0.com';
    private const CLIENT_ID = 'test-auth0-client-id';
    private const KID = 'test-kid-1';

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

        $jwk = [
            'kty' => 'RSA',
            'kid' => self::KID,
            'alg' => 'RS256',
            'use' => 'sig',
            'n' => $this->base64UrlEncode($details['rsa']['n']),
            'e' => $this->base64UrlEncode($details['rsa']['e']),
        ];

        Http::fake([
            'https://'.self::DOMAIN.'/.well-known/jwks.json' => Http::response(['keys' => [$jwk]], 200),
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
            'sub' => 'auth0|default-sub',
            'iat' => $now,
            'exp' => $now + 3600,
            'email' => 'default@example.com',
            'email_verified' => true,
            'name' => 'Default Name',
        ], $overrides);

        return JWT::encode($claims, $this->privateKeyPem, 'RS256', self::KID);
    }

    /**
     * Llama al callback como lo haría el navegador (Origin de primera parte),
     * para que Sanctum trate la petición como stateful y use sesión de cookie.
     */
    private function postAuth0Callback(string $idToken): TestResponse
    {
        return $this->withHeaders(['Origin' => 'https://popgastropub.com'])
            ->postJson('/api/auth/auth0/callback', ['id_token' => $idToken]);
    }

    public function test_new_user_is_created_via_auth0(): void
    {
        $token = $this->makeIdToken([
            'sub' => 'auth0|new-user-sub',
            'email' => 'newuser@example.com',
            'email_verified' => true,
            'name' => 'Auth0 New User',
        ]);

        $response = $this->postAuth0Callback($token);

        $response->assertOk();
        $response->assertJsonPath('user.email', 'newuser@example.com');
        $response->assertJsonMissingPath('user.auth0_sub');

        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
            'auth0_sub' => 'auth0|new-user-sub',
        ]);

        $this->assertAuthenticatedAs(User::where('email', 'newuser@example.com')->first());
    }

    public function test_existing_user_links_via_verified_email(): void
    {
        $existing = User::create([
            'name' => 'Cliente Existente',
            'email' => 'existing@example.com',
            'password' => bcrypt('password123'),
            'role' => 'cliente',
        ]);

        $token = $this->makeIdToken([
            'sub' => 'auth0|link-sub',
            'email' => 'existing@example.com',
            'email_verified' => true,
        ]);

        $response = $this->postAuth0Callback($token);

        $response->assertOk();
        $existing->refresh();
        $this->assertSame('auth0|link-sub', $existing->auth0_sub);
        $this->assertAuthenticatedAs($existing);

        // No se creó un usuario duplicado.
        $this->assertSame(1, User::where('email', 'existing@example.com')->count());
    }

    public function test_existing_user_is_found_by_auth0_sub_on_return_visit(): void
    {
        $existing = User::create([
            'name' => 'Cliente Auth0',
            'email' => 'returning@example.com',
            'password' => bcrypt('password123'),
            'role' => 'cliente',
            'auth0_sub' => 'auth0|returning-sub',
        ]);

        // El nombre/email pueden variar entre inicios de sesión; la resolución por
        // auth0_sub debe encontrar al mismo usuario sin volver a chequear el email.
        $token = $this->makeIdToken([
            'sub' => 'auth0|returning-sub',
            'email' => 'changed-email@example.com',
            'email_verified' => false,
        ]);

        $response = $this->postAuth0Callback($token);

        $response->assertOk();
        $this->assertAuthenticatedAs($existing);
        $this->assertSame(1, User::count());
    }

    public function test_unverified_email_cannot_link_an_existing_account(): void
    {
        $victim = User::create([
            'name' => 'Victima',
            'email' => 'victim@example.com',
            'password' => bcrypt('password123'),
            'role' => 'cliente',
        ]);

        $token = $this->makeIdToken([
            'sub' => 'auth0|attacker-sub',
            'email' => 'victim@example.com',
            'email_verified' => false,
        ]);

        $response = $this->postAuth0Callback($token);

        $response->assertStatus(422);
        $response->assertJsonPath('error', 'email_not_verified');
        $this->assertGuest();

        $victim->refresh();
        $this->assertNull($victim->auth0_sub);
    }

    public function test_inactive_user_cannot_authenticate_via_auth0(): void
    {
        User::create([
            'name' => 'Cliente Inactivo',
            'email' => 'inactivo@example.com',
            'password' => bcrypt('password123'),
            'role' => 'cliente',
            'status' => 'inactivo',
        ]);

        $token = $this->makeIdToken([
            'sub' => 'auth0|inactivo-sub',
            'email' => 'inactivo@example.com',
            'email_verified' => true,
        ]);

        $response = $this->postAuth0Callback($token);

        $response->assertStatus(403);
        $response->assertJsonPath('error', 'account_inactive');
        $this->assertGuest();
    }

    public function test_soft_deleted_user_cannot_authenticate_via_auth0(): void
    {
        $deleted = User::create([
            'name' => 'Cliente Eliminado',
            'email' => 'eliminado@example.com',
            'password' => bcrypt('password123'),
            'role' => 'cliente',
            'auth0_sub' => 'auth0|deleted-sub',
        ]);
        $deleted->delete();

        $token = $this->makeIdToken([
            'sub' => 'auth0|deleted-sub',
            'email' => 'eliminado@example.com',
            'email_verified' => true,
        ]);

        $response = $this->postAuth0Callback($token);

        $response->assertStatus(403);
        $response->assertJsonPath('error', 'account_deleted');
        $this->assertGuest();
    }

    public function test_soft_deleted_user_found_by_email_cannot_be_impersonated(): void
    {
        $deleted = User::create([
            'name' => 'Cliente Eliminado Por Email',
            'email' => 'eliminado-email@example.com',
            'password' => bcrypt('password123'),
            'role' => 'cliente',
        ]);
        $deleted->delete();

        $token = $this->makeIdToken([
            'sub' => 'auth0|new-sub-for-deleted-email',
            'email' => 'eliminado-email@example.com',
            'email_verified' => true,
        ]);

        $response = $this->postAuth0Callback($token);

        $response->assertStatus(403);
        $response->assertJsonPath('error', 'account_deleted');
        $this->assertGuest();
        $this->assertSame(1, User::withTrashed()->where('email', 'eliminado-email@example.com')->count());
    }

    public function test_invalid_signature_is_rejected(): void
    {
        $otherKeyPair = openssl_pkey_new(['private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA]);
        $otherPem = '';
        openssl_pkey_export($otherKeyPair, $otherPem);

        $now = now()->getTimestamp();
        $token = JWT::encode([
            'iss' => 'https://'.self::DOMAIN.'/',
            'aud' => self::CLIENT_ID,
            'sub' => 'auth0|forged-sub',
            'iat' => $now,
            'exp' => $now + 3600,
            'email' => 'forged@example.com',
            'email_verified' => true,
        ], $otherPem, 'RS256', self::KID);

        $response = $this->postAuth0Callback($token);

        $response->assertStatus(401);
        $response->assertJsonPath('error', 'invalid_token');
        $this->assertGuest();
    }

    public function test_wrong_audience_is_rejected(): void
    {
        $token = $this->makeIdToken(['aud' => 'some-other-client-id']);

        $response = $this->postAuth0Callback($token);

        $response->assertStatus(401);
        $this->assertGuest();
    }

    public function test_expired_token_is_rejected(): void
    {
        $now = now()->getTimestamp();
        $token = $this->makeIdToken([
            'iat' => $now - 7200,
            'exp' => $now - 3600,
        ]);

        $response = $this->postAuth0Callback($token);

        $response->assertStatus(401);
        $this->assertGuest();
    }

    public function test_missing_email_without_prior_link_is_rejected(): void
    {
        $now = now()->getTimestamp();
        $claims = [
            'iss' => 'https://'.self::DOMAIN.'/',
            'aud' => self::CLIENT_ID,
            'sub' => 'auth0|no-email-sub',
            'iat' => $now,
            'exp' => $now + 3600,
        ];
        $token = JWT::encode($claims, $this->privateKeyPem, 'RS256', self::KID);

        $response = $this->postAuth0Callback($token);

        $response->assertStatus(422);
        $response->assertJsonPath('error', 'email_required');
        $this->assertGuest();
    }
}
