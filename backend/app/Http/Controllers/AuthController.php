<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    private const WELCOME_POINTS = 50;

    public function register(Request $request)
    {
        $payload = [
            'name' => trim((string) $request->input('name')),
            'email' => Str::lower(trim((string) $request->input('email'))),
            'password' => (string) $request->input('password'),
            'password_confirmation' => (string) $request->input('password_confirmation'),
            'phone' => preg_replace('/\D+/', '', (string) $request->input('phone', '')),
            'birth_date' => $request->input('birth_date'),
            'terms_accepted' => $request->boolean('terms_accepted'),
        ];

        $validator = Validator::make($payload, [
            'name' => ['required', 'string', 'max:255', 'regex:/^[\pL\s]+$/u'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)->letters()->mixedCase()->numbers()->symbols()],
            'phone' => ['nullable', 'regex:/^[0-9]{10}$/', 'unique:users,phone'],
            'birth_date' => ['nullable', 'date', 'before:today'],
            'terms_accepted' => ['accepted'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'La información de registro no es válida.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'name' => $payload['name'],
            'email' => $payload['email'],
            'password' => Hash::make($payload['password']),
            'phone' => $payload['phone'] ?: null,
            'points' => self::WELCOME_POINTS,
            'role' => 'cliente',
        ]);

        $token = $this->issueToken($user);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $payload = [
            'login' => trim((string) $request->input('login', $request->input('email', ''))),
            'password' => (string) $request->input('password'),
        ];

        $validator = Validator::make($payload, [
            'login' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'max:128'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'La información de inicio de sesión no es válida.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $this->findUserByIdentifier($payload['login']);

        if (!$user || !Hash::check($payload['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas.'], 401);
        }

        $token = $this->issueToken($user);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->user()?->currentAccessToken();

        if ($token) {
            $token->delete();
        } else {
            $request->user()?->tokens()->delete();
        }

        return response()->json(['message' => 'Sesión cerrada']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    private function findUserByIdentifier(string $identifier): ?User
    {
        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            return User::where('email', Str::lower($identifier))->first();
        }

        $phoneDigits = preg_replace('/\D+/', '', $identifier) ?? '';

        if (strlen($phoneDigits) > 10) {
            $phoneDigits = substr($phoneDigits, -10);
        }

        if (strlen($phoneDigits) !== 10) {
            return null;
        }

        return User::where('phone', $phoneDigits)->first();
    }

    private function issueToken(User $user): string
    {
        $user->tokens()->where('name', 'auth_token')->delete();

        return $user->createToken('auth_token', ['*'])->plainTextToken;
    }
}
