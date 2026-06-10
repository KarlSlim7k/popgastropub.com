<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\LoyaltyTransaction;
use App\Http\Resources\UserResource;
use App\Mail\ResetPasswordCode;
use App\Services\LoyaltyConfig;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    private const WELCOME_POINTS = 50; // fallback; actual value from LoyaltyConfig

    public function register(Request $request)
    {
        $payload = [
            'name' => trim((string) $request->input('name')),
            'email' => Str::lower(trim((string) $request->input('email'))),
            'password' => (string) $request->input('password'),
            'password_confirmation' => (string) $request->input('password_confirmation'),
            'phone' => preg_replace('/\D+/', '', (string) $request->input('phone', '')) ?: null,
            'birth_date' => $request->input('birth_date'),
            'terms_accepted' => $request->boolean('terms_accepted'),
        ];

        $validator = Validator::make($payload, [
            'name' => ['required', 'string', 'max:255', 'regex:/^[\pL\s]+$/u'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)->letters()->numbers()],
            'phone' => ['nullable', 'regex:/^[0-9]{10}$/', 'unique:users,phone'],
            'birth_date' => ['nullable', 'date', 'before:today'],
            'terms_accepted' => ['accepted'],
        ], [
            'name.required' => 'Escribe tu nombre completo.',
            'name.string' => 'Tu nombre solo debe contener letras y espacios.',
            'name.max' => 'Tu nombre es demasiado largo (máx. 255 caracteres).',
            'name.regex' => 'Tu nombre solo puede contener letras y espacios, sin números ni símbolos.',

            'email.required' => 'Escribe tu correo electrónico.',
            'email.email' => 'Verifica el formato de tu correo. Ejemplo: tucorreo@dominio.com.',
            'email.max' => 'Tu correo es demasiado largo (máx. 255 caracteres).',
            'email.unique' => 'Este correo ya está registrado. Inicia sesión o usa otro correo.',

            'password.required' => 'Crea una contraseña para tu cuenta.',
            'password.confirmed' => 'Las contraseñas no coinciden. Verifícalas y vuelve a intentarlo.',
            'password.min' => 'Tu contraseña debe tener al menos 8 caracteres.',
            'password.letters' => 'Tu contraseña debe incluir al menos una letra.',
            'password.numbers' => 'Tu contraseña debe incluir al menos un número.',

            'phone.regex' => 'El teléfono debe tener exactamente 10 dígitos, sin espacios ni guiones.',
            'phone.unique' => 'Este número ya está registrado. Usa otro teléfono o déjalo vacío.',

            'birth_date.date' => 'Ingresa una fecha de nacimiento válida.',
            'birth_date.before' => 'La fecha de nacimiento debe ser anterior a hoy.',

            'terms_accepted.accepted' => 'Debes aceptar los Términos y la Política de Privacidad para continuar.',
        ], [
            'name' => 'nombre',
            'email' => 'correo',
            'password' => 'contraseña',
            'phone' => 'teléfono',
            'birth_date' => 'fecha de nacimiento',
            'terms_accepted' => 'términos',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'La información de registro no es válida.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = DB::transaction(function () use ($payload, $request) {
            $user = User::create([
                'name' => $payload['name'],
                'email' => $payload['email'],
                'password' => Hash::make($payload['password']),
                'phone' => $payload['phone'] ?: null,
                'points' => (int) LoyaltyConfig::get('welcome_bonus'),
                'role' => 'cliente',
            ]);

            LoyaltyTransaction::create([
                'user_id' => $user->id,
                'points' => (int) LoyaltyConfig::get('welcome_bonus'),
                'concept' => 'Bono de bienvenida',
            ]);

            $refCode = $request->input('ref') ?? $request->input('referral_code');
            if ($refCode) {
                $referrer = User::where('referral_code', $refCode)->first();
                if ($referrer && $referrer->id !== $user->id) {
                    \App\Models\Referral::create([
                        'referrer_id' => $referrer->id,
                        'referred_id' => $user->id,
                        'status' => 'pending',
                    ]);
                }
            }

            return $user;
        });

        $token = $this->issueToken($user);

        return response()->json([
            'user' => new UserResource($user),
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
        ], [
            'login.required' => 'Ingresa tu correo o teléfono para iniciar sesión.',
            'login.max' => 'El dato ingresado es demasiado largo.',
            'password.required' => 'Ingresa tu contraseña.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.max' => 'La contraseña es demasiado larga.',
        ], [
            'login' => 'correo o teléfono',
            'password' => 'contraseña',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Los datos de inicio de sesión no son válidos.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $this->findUserByIdentifier($payload['login']);

        if (!$user || !Hash::check($payload['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas.'], 401);
        }

        if ($user->status === 'inactivo') {
            return response()->json(['message' => 'La cuenta está inactiva.'], 403);
        }

        if ($user->two_factor_enabled) {
            $user->tokens()->where('name', '2fa_pending')->delete();
            $tempToken = $user->createToken('2fa_pending', ['2fa:pending'])->plainTextToken;

            return response()->json([
                'requires_2fa' => true,
                'temp_token' => $tempToken,
            ]);
        }

        $token = $this->issueToken($user);

        return response()->json([
            'user' => new UserResource($user),
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
        return response()->json(new UserResource($request->user()));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update($validated);

        return response()->json(['message' => 'Perfil actualizado', 'user' => $user->fresh()]);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json(['message' => 'La contraseña actual es incorrecta.'], 422);
        }

        $user->update(['password' => Hash::make($request->input('password'))]);

        return response()->json(['message' => 'Contraseña actualizada correctamente.']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ], [
            'email.required' => 'Escribe tu correo electrónico.',
            'email.email' => 'Verifica el formato de tu correo.',
        ]);

        $email = Str::lower(trim($request->input('email')));
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'Si el correo está registrado, recibirás un código.']);
        }

        if ($user->oauth_provider) {
            return response()->json([
                'message' => 'Tu cuenta fue creada con ' . ucfirst($user->oauth_provider) . '. Inicia sesión desde ahí.',
            ], 422);
        }

        DB::table('password_reset_tokens')->where('email', $email)->delete();

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => Hash::make($code),
            'created_at' => Carbon::now(),
        ]);

        Mail::to($user->email)->send(new ResetPasswordCode($user->name, $code));

        return response()->json(['message' => 'Si el correo está registrado, recibirás un código.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'password' => ['required', 'string', 'confirmed', Password::min(8)->letters()->numbers()],
        ], [
            'email.required' => 'Escribe tu correo electrónico.',
            'email.email' => 'Verifica el formato de tu correo.',
            'code.required' => 'Escribe el código de 6 dígitos.',
            'code.size' => 'El código debe tener exactamente 6 dígitos.',
            'password.required' => 'Crea una nueva contraseña.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.letters' => 'La contraseña debe incluir al menos una letra.',
            'password.numbers' => 'La contraseña debe incluir al menos un número.',
        ]);

        $email = Str::lower(trim($request->input('email')));
        $code = (string) $request->input('code');

        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (!$record || !Hash::check($code, $record->token)) {
            return response()->json(['message' => 'El código es incorrecto o ha expirado.'], 422);
        }

        if (Carbon::parse($record->created_at)->addMinutes(15)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            return response()->json(['message' => 'El código ha expirado. Solicita uno nuevo.'], 422);
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'No se encontró una cuenta con este correo.'], 404);
        }

        $user->update(['password' => Hash::make($request->input('password'))]);

        DB::table('password_reset_tokens')->where('email', $email)->delete();

        $user->tokens()->delete();

        return response()->json(['message' => 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.']);
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
