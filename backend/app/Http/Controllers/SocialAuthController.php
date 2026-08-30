<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyTransaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Contracts\Provider as SocialiteProvider;
use Laravel\Socialite\Two\AbstractProvider as SocialiteOAuth2Provider;
use Laravel\Socialite\Two\User as SocialiteOAuth2User;
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

    public function redirectToProvider(Request $request, string $provider): RedirectResponse
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
                $resolved = $resolved->with(['state' => $this->generateSessionState($request, $provider)]);
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

    public function handleProviderCallback(Request $request, string $provider): RedirectResponse
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

        if ($resolved instanceof SocialiteOAuth2Provider && !$this->verifySessionState($request, $provider)) {
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

        if (!$this->isEmailVerified($driver, $socialUser)) {
            return $this->redirectToFrontend([
                'error' => 'email_not_verified',
                'provider' => $provider,
            ]);
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

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return $this->redirectToFrontend([
            'provider' => $provider,
            'status' => $isNewUser ? 'registered' : 'logged_in',
        ]);
    }

    /**
     * Antes de crear o vincular una cuenta por email hay que confirmar que el proveedor
     * realmente verificó esa dirección; de lo contrario un atacante podría apropiarse de
     * una cuenta existente registrando el mismo email sin confirmarlo.
     */
    private function isEmailVerified(string $driver, SocialiteOAuth2User $socialUser): bool
    {
        $raw = $socialUser->getRaw();

        return match ($driver) {
            'google' => in_array($raw['email_verified'] ?? null, [true, 'true', 1, '1'], true),
            // Meta solo comparte con la app direcciones de correo que la propia plataforma verificó.
            'facebook' => true,
            // X normalmente no expone email; el flujo ya se detiene antes por email vacío.
            default => false,
        };
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

    private function generateSessionState(Request $request, string $provider): string
    {
        $state = Str::random(64);

        $request->session()->put("oauth_state.{$provider}", [
            'hash' => hash('sha256', $state),
            'expires_at' => now()->addMinutes(self::STATE_TTL_MINUTES)->getTimestamp(),
        ]);

        return $state;
    }

    private function verifySessionState(Request $request, string $provider): bool
    {
        $state = (string) $request->query('state', '');
        $stored = $request->session()->pull("oauth_state.{$provider}");

        if ($state === '' || !is_array($stored)) {
            return false;
        }

        if (!isset($stored['hash'], $stored['expires_at']) || now()->getTimestamp() > (int) $stored['expires_at']) {
            return false;
        }

        return hash_equals((string) $stored['hash'], hash('sha256', $state));
    }

    private function redirectToFrontend(array $payload): RedirectResponse
    {
        $frontendUrl = rtrim((string) config('app.frontend_url', env('FRONTEND_URL', env('APP_URL', 'https://popgastropub.com'))), '/');
        $fragment = http_build_query($payload);

        return redirect()->away("{$frontendUrl}/login#{$fragment}");
    }
}
