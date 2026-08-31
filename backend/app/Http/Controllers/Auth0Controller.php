<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\LoyaltyTransaction;
use App\Models\User;
use App\Services\Auth0IdTokenValidator;
use App\Services\Auth0TokenReplayException;
use App\Services\LoyaltyConfig;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Throwable;

class Auth0Controller extends Controller
{
    private const WELCOME_POINTS_FALLBACK = 50;

    public function __construct(private readonly Auth0IdTokenValidator $validator)
    {
    }

    /**
     * Puente Next.js -> Laravel: recibe el ID token que Next.js/Auth0 ya intercambió
     * (Authorization Code + PKCE), lo valida de forma independiente, resuelve o crea
     * el usuario local y establece la sesión de aplicación existente (Sanctum/web).
     *
     * Orden de resolución: auth0_sub -> email verificado -> creación. Un email no
     * verificado nunca vincula ni crea una cuenta (evita apropiación de cuentas).
     */
    public function callback(Request $request): JsonResponse
    {
        $request->validate([
            'id_token' => ['required', 'string'],
        ]);

        try {
            $claims = $this->validator->validate((string) $request->input('id_token'));
        } catch (Auth0TokenReplayException $e) {
            // No es necesariamente un ataque: puede ser una recarga tras un login ya
            // exitoso. El llamador (frontend) debe revisar si ya hay sesión antes de
            // tratar esto como un error real.
            return response()->json(['error' => 'token_already_used'], 409);
        } catch (Throwable $e) {
            report($e);

            return response()->json(['error' => 'invalid_token'], 401);
        }

        $sub = (string) ($claims['sub'] ?? '');
        $email = isset($claims['email']) && $claims['email'] !== ''
            ? Str::lower(trim((string) $claims['email']))
            : null;
        $emailVerified = ($claims['email_verified'] ?? false) === true;

        $userByAuth0Sub = User::withTrashed()->where('auth0_sub', $sub)->first();

        if ($userByAuth0Sub) {
            if ($userByAuth0Sub->trashed()) {
                return response()->json(['error' => 'account_deleted'], 403);
            }

            $user = $userByAuth0Sub;
        } else {
            if ($email === null) {
                return response()->json(['error' => 'email_required'], 422);
            }

            if (!$emailVerified) {
                return response()->json(['error' => 'email_not_verified'], 422);
            }

            $userByEmail = User::withTrashed()->where('email', $email)->first();

            if ($userByEmail) {
                if ($userByEmail->trashed()) {
                    return response()->json(['error' => 'account_deleted'], 403);
                }

                if ($userByEmail->auth0_sub && $userByEmail->auth0_sub !== $sub) {
                    // Ya vinculada a otra identidad Auth0: no se sobreescribe el vínculo existente.
                    return response()->json(['error' => 'email_linked_elsewhere'], 409);
                }

                $userByEmail->forceFill([
                    'auth0_sub' => $sub,
                    'email_verified_at' => $userByEmail->email_verified_at ?: now(),
                ])->save();

                $user = $userByEmail;
            } else {
                $user = $this->createUser($sub, $email, $claims);
            }
        }

        if ($user->status === 'inactivo') {
            return response()->json(['error' => 'account_inactive'], 403);
        }

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json([
            'user' => new UserResource($user),
        ]);
    }

    /**
     * @param array<string, mixed> $claims
     */
    private function createUser(string $sub, string $email, array $claims): User
    {
        $name = trim((string) ($claims['name'] ?? ''));
        if ($name === '') {
            $name = Str::headline(Str::before($email, '@'));
        }

        return DB::transaction(function () use ($sub, $email, $name, $claims) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make(Str::random(48)),
                'role' => 'cliente',
                'points' => (int) LoyaltyConfig::get('welcome_bonus') ?: self::WELCOME_POINTS_FALLBACK,
                'email_verified_at' => now(),
                'auth0_sub' => $sub,
                'avatar_url' => isset($claims['picture']) ? (string) $claims['picture'] : null,
            ]);

            LoyaltyTransaction::create([
                'user_id' => $user->id,
                'points' => (int) LoyaltyConfig::get('welcome_bonus') ?: self::WELCOME_POINTS_FALLBACK,
                'concept' => 'Bono de bienvenida',
            ]);

            return $user;
        });
    }
}
