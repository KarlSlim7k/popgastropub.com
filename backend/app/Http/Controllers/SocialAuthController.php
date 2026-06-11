<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyTransaction;
use App\Models\User;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Contracts\Provider as SocialiteProvider;
use Laravel\Socialite\Two\AbstractProvider as SocialiteOAuth2Provider;
use Throwable;

class SocialAuthController extends Controller
{
    private const WELCOME_POINTS = 50;

    /** Vigencia del parámetro `state` firmado (anti login-CSRF). */
    private const STATE_TTL_MINUTES = 10;

    private const PROVIDER_MAP = [
        'google' => 'google',
        'facebook' => 'facebook',
        'x' => 'x',
    ];

    public function providers(): JsonResponse
    {
        $providers = [];

        foreach (self::PROVIDER_MAP as $provider => $driver) {
            $providers[$provider] = [
                'enabled' => $this->isProviderConfigured($driver),
            ];
        }

        return response()->json([
            'providers' => $providers,
        ]);
    }

    public function redirectToProvider(string $provider): RedirectResponse
    {
        $driver = $this->resolveDriver($provider);

        if (!$driver) {
            abort(404);
        }

        if (!$this->isProviderConfigured($driver)) {
            return $this->redirectToFrontend([
                'error' => 'provider_not_configured',
                'provider' => $provider,
            ]);
        }

        try {
            $resolved = $this->resolveProvider($driver);

            if ($resolved instanceof SocialiteOAuth2Provider) {
                $resolved = $resolved->with(['state' => $this->generateSignedState()]);
            }

            return $resolved->redirect();
        } catch (Throwable $exception) {
            report($exception);

            return $this->redirectToFrontend([
                'error' => 'provider_redirect_failed',
                'provider' => $provider,
            ]);
        }
    }

    public function handleProviderCallback(string $provider): RedirectResponse
    {
        $driver = $this->resolveDriver($provider);

        if (!$driver) {
            abort(404);
        }

        if (!$this->isProviderConfigured($driver)) {
            return $this->redirectToFrontend([
                'error' => 'provider_not_configured',
                'provider' => $provider,
            ]);
        }

        $resolved = $this->resolveProvider($driver);

        if ($resolved instanceof SocialiteOAuth2Provider && !$this->verifySignedState(request('state'))) {
            return $this->redirectToFrontend([
                'error' => 'invalid_state',
                'provider' => $provider,
            ]);
        }

        try {
            $socialUser = $resolved->user();
        } catch (Throwable $exception) {
            report($exception);

            return $this->redirectToFrontend([
                'error' => 'provider_callback_failed',
                'provider' => $provider,
            ]);
        }

        $email = Str::lower(trim((string) $socialUser->getEmail()));

        if ($email === '') {
            return $this->redirectToFrontend([
                'error' => 'email_not_available',
                'provider' => $provider,
            ]);
        }

        $socialId = trim((string) $socialUser->getId());
        $avatar = trim((string) $socialUser->getAvatar());
        $displayName = trim((string) $socialUser->getName());

        if ($displayName === '') {
            $displayName = Str::headline(Str::before($email, '@'));
        }

        $user = User::where('email', $email)->first();
        $isNewUser = false;

        if (!$user) {
            $isNewUser = true;

            $user = User::create([
                'name' => $displayName,
                'email' => $email,
                'password' => Hash::make(Str::random(48)),
                'role' => 'cliente',
                'points' => self::WELCOME_POINTS,
                'email_verified_at' => now(),
                'oauth_provider' => $provider,
                'oauth_provider_id' => $socialId !== '' ? $socialId : null,
                'avatar_url' => $avatar !== '' ? $avatar : null,
            ]);

            LoyaltyTransaction::create([
                'user_id' => $user->id,
                'points' => self::WELCOME_POINTS,
                'concept' => 'Bono de bienvenida',
            ]);
        } else {
            if ($user->status === 'inactivo') {
                return $this->redirectToFrontend([
                    'error' => 'account_inactive',
                    'provider' => $provider,
                ]);
            }

            $user->forceFill([
                'name' => $user->name ?: $displayName,
                'email_verified_at' => $user->email_verified_at ?: now(),
                'oauth_provider' => $user->oauth_provider ?: $provider,
                'oauth_provider_id' => $user->oauth_provider_id ?: ($socialId !== '' ? $socialId : null),
                'avatar_url' => $avatar !== '' ? $avatar : $user->avatar_url,
            ])->save();
        }

        $user->tokens()->where('name', 'auth_token')->delete();
        $token = $user->createToken('auth_token', ['*'])->plainTextToken;

        return $this->redirectToFrontend([
            'token' => $token,
            'provider' => $provider,
            'status' => $isNewUser ? 'registered' : 'logged_in',
        ]);
    }

    private function resolveDriver(string $provider): ?string
    {
        return self::PROVIDER_MAP[$provider] ?? null;
    }

    private function isProviderConfigured(string $driver): bool
    {
        $clientId = config("services.{$driver}.client_id");
        $clientSecret = config("services.{$driver}.client_secret");
        $redirect = config("services.{$driver}.redirect");

        return !empty($clientId) && !empty($clientSecret) && !empty($redirect);
    }

    private function resolveProvider(string $driver): SocialiteProvider
    {
        $provider = Socialite::driver($driver);

        if ($provider instanceof SocialiteOAuth2Provider) {
            return $provider->stateless();
        }

        return $provider;
    }

    /**
     * Genera un `state` autocontenido (sin sesión): payload cifrado con
     * APP_KEY que incluye un nonce y una expiración corta. `handleProviderCallback`
     * lo verifica antes de canjear el `code`, evitando que se acepte cualquier
     * `code` sin pasar primero por `redirectToProvider` (login CSRF).
     */
    private function generateSignedState(): string
    {
        return Crypt::encryptString(json_encode([
            'nonce' => Str::random(32),
            'exp' => now()->addMinutes(self::STATE_TTL_MINUTES)->getTimestamp(),
        ]));
    }

    private function verifySignedState(?string $state): bool
    {
        if (!$state) {
            return false;
        }

        try {
            $payload = json_decode(Crypt::decryptString($state), true);
        } catch (DecryptException) {
            return false;
        }

        if (!is_array($payload) || !isset($payload['exp'])) {
            return false;
        }

        return now()->getTimestamp() <= (int) $payload['exp'];
    }

    private function redirectToFrontend(array $payload): RedirectResponse
    {
        $frontendUrl = rtrim((string) config('app.frontend_url', env('FRONTEND_URL', env('APP_URL', 'https://popgastropub.com'))), '/');
        $fragment = http_build_query($payload);

        return redirect()->away("{$frontendUrl}/login#{$fragment}");
    }
}
