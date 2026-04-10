<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        RateLimiter::for('auth-login', function (Request $request) {
            $identifier = Str::lower((string) $request->input('login', $request->input('email', 'guest')));

            return [
                Limit::perMinute(6)
                    ->by("{$identifier}|{$request->ip()}")
                    ->response(fn () => response()->json(['message' => 'Demasiados intentos de inicio de sesión. Intenta de nuevo en un minuto.'], 429)),
                Limit::perMinute(20)
                    ->by($request->ip())
                    ->response(fn () => response()->json(['message' => 'Demasiadas solicitudes desde esta red. Intenta más tarde.'], 429)),
            ];
        });

        RateLimiter::for('auth-register', function (Request $request) {
            $email = Str::lower((string) $request->input('email', 'guest'));

            return [
                Limit::perMinute(4)
                    ->by("{$email}|{$request->ip()}")
                    ->response(fn () => response()->json(['message' => 'Demasiados intentos de registro. Intenta de nuevo en unos minutos.'], 429)),
                Limit::perMinute(10)
                    ->by($request->ip())
                    ->response(fn () => response()->json(['message' => 'Demasiadas solicitudes desde esta red. Intenta más tarde.'], 429)),
            ];
        });

        RateLimiter::for('auth-social', function (Request $request) {
            $provider = (string) ($request->route('provider') ?? 'social');

            return [
                Limit::perMinute(20)
                    ->by("{$provider}|{$request->ip()}")
                    ->response(fn () => response()->json(['message' => 'Demasiadas solicitudes de autenticación social. Intenta más tarde.'], 429)),
            ];
        });
    }
}
