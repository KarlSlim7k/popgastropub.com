<?php

namespace App\Services;

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Valida de forma independiente el ID token (JWT RS256) que Next.js recibe de Auth0
 * tras el intercambio Authorization Code + PKCE. Laravel nunca confía en lo que
 * Next.js afirma sobre el usuario: vuelve a verificar firma, issuer, audience y
 * expiración contra las claves públicas (JWKS) del propio tenant de Auth0.
 */
class Auth0IdTokenValidator
{
    private const JWKS_CACHE_TTL_HOURS = 12;
    private const REPLAY_CACHE_PREFIX = 'auth0:id_token_used:';

    /**
     * @return array<string, mixed> claims del ID token ya verificado
     *
     * @throws RuntimeException si el token es inválido, expiró, o su firma/issuer/audience no corresponden
     */
    public function validate(string $idToken): array
    {
        $domain = (string) config('services.auth0.domain');
        $clientId = (string) config('services.auth0.client_id');

        if ($domain === '' || $clientId === '') {
            throw new RuntimeException('Auth0 no está configurado (AUTH0_DOMAIN/AUTH0_CLIENT_ID).');
        }

        $keys = $this->jwksKeys($domain);

        try {
            $decoded = JWT::decode($idToken, $keys);
        } catch (\Throwable $e) {
            throw new RuntimeException('Token de Auth0 inválido: '.$e->getMessage(), previous: $e);
        }

        $claims = (array) $decoded;

        $expectedIssuer = "https://{$domain}/";
        if (($claims['iss'] ?? null) !== $expectedIssuer) {
            throw new RuntimeException('Issuer de Auth0 inesperado.');
        }

        $audience = $claims['aud'] ?? null;
        $audienceMatches = is_array($audience)
            ? in_array($clientId, $audience, true)
            : $audience === $clientId;

        if (!$audienceMatches) {
            throw new RuntimeException('Audience de Auth0 inesperado.');
        }

        if (($claims['sub'] ?? '') === '') {
            throw new RuntimeException('El token de Auth0 no incluye sub.');
        }

        $this->rejectIfAlreadyUsed($idToken, (int) ($claims['exp'] ?? 0));

        return $claims;
    }

    /**
     * @return array<string, \Firebase\JWT\Key>
     */
    private function jwksKeys(string $domain): array
    {
        // Se cachea el JSON crudo (serializable) y no las Key ya parseadas: Key envuelve
        // un OpenSSLAsymmetricKey, que PHP no permite serializar, y todo cache store de
        // Laravel (database, redis, file) serializa el valor al guardarlo.
        $jwks = Cache::remember(
            "auth0:jwks:{$domain}",
            now()->addHours(self::JWKS_CACHE_TTL_HOURS),
            function () use ($domain) {
                $response = Http::timeout(5)->get("https://{$domain}/.well-known/jwks.json");
                $response->throw();

                return $response->json();
            }
        );

        return JWK::parseKeySet($jwks);
    }

    /**
     * Un ID token válido y sin usar podría reenviarse dentro de su ventana de expiración
     * (p. ej. si el bridge Next.js->Laravel se repite); se rechaza el reintento explícito.
     */
    private function rejectIfAlreadyUsed(string $idToken, int $exp): void
    {
        $key = self::REPLAY_CACHE_PREFIX.hash('sha256', $idToken);
        $ttlSeconds = max(1, $exp - now()->getTimestamp());

        if (Cache::has($key)) {
            throw new Auth0TokenReplayException('Este token de Auth0 ya fue utilizado.');
        }

        Cache::put($key, true, $ttlSeconds);
    }
}
