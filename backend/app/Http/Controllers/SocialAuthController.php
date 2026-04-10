<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Contracts\Provider as SocialiteProvider;
use Laravel\Socialite\Two\AbstractProvider as SocialiteOAuth2Provider;
use Throwable;

class SocialAuthController extends Controller
{
    private const WELCOME_POINTS = 50;

    private const PROVIDER_MAP = [
        'google' => 'google',
        'facebook' => 'facebook',
        'x' => 'x',
    ];

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
            return $this->resolveProvider($driver)->redirect();
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

        try {
            $socialUser = $this->resolveProvider($driver)->user();
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
        } else {
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

    private function redirectToFrontend(array $payload): RedirectResponse
    {
        $frontendUrl = rtrim((string) config('app.frontend_url', env('FRONTEND_URL', env('APP_URL', 'https://popgastropub.com'))), '/');
        $fragment = http_build_query($payload);

        return redirect()->away("{$frontendUrl}/login#{$fragment}");
    }
}
