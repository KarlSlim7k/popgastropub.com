<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    private Google2FA $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * Generate a new 2FA secret and return QR code URL for enrollment.
     */
    public function setup(Request $request)
    {
        $user = $request->user();
        $secret = $this->google2fa->generateSecretKey();

        // Store temporarily (not enabled yet until verified)
        $user->update(['two_factor_secret' => $secret]);

        $qrUrl = $this->google2fa->getQRCodeUrl(
            config('app.name', 'POP Perote'),
            $user->email,
            $secret
        );

        return response()->json([
            'secret' => $secret,
            'qr_url' => $qrUrl,
        ]);
    }

    /**
     * Verify the TOTP code and enable 2FA.
     */
    public function enable(Request $request)
    {
        $request->validate(['code' => 'required|string|size:6']);
        $user = $request->user();

        if (!$user->two_factor_secret) {
            return response()->json(['message' => 'Primero genera el código QR'], 422);
        }

        $valid = $this->google2fa->verifyKey($user->two_factor_secret, $request->code);

        if (!$valid) {
            return response()->json(['message' => 'Código incorrecto'], 422);
        }

        $user->update(['two_factor_enabled' => true]);

        return response()->json(['message' => '2FA activado correctamente']);
    }

    /**
     * Disable 2FA.
     */
    public function disable(Request $request)
    {
        $request->validate(['code' => 'required|string|size:6']);
        $user = $request->user();

        if (!$user->two_factor_enabled) {
            return response()->json(['message' => '2FA no está activado'], 422);
        }

        $valid = $this->google2fa->verifyKey($user->two_factor_secret, $request->code);

        if (!$valid) {
            return response()->json(['message' => 'Código incorrecto'], 422);
        }

        $user->update(['two_factor_enabled' => false, 'two_factor_secret' => null]);

        return response()->json(['message' => '2FA desactivado']);
    }

    /**
     * Verify TOTP code during login (called with the temp token from login).
     */
    public function verify(Request $request)
    {
        $request->validate(['code' => 'required|string|size:6']);

        $token = $request->user()->currentAccessToken();
        abort_unless($token && ($token->can('2fa:pending') || $token->can('*')), 403);

        $user = $request->user();

        if (!$user->two_factor_enabled) {
            return response()->json(['message' => '2FA no está activado'], 422);
        }

        $valid = $this->google2fa->verifyKey($user->two_factor_secret, $request->code);

        if (!$valid) {
            return response()->json(['message' => 'Código incorrecto'], 422);
        }

        $token->delete();
        $user->tokens()->where('name', 'auth_token')->delete();
        $newToken = $user->createToken('auth_token', ['*'])->plainTextToken;

        return response()->json(['verified' => true, 'token' => $newToken, 'user' => $user]);
    }

    /**
     * Get 2FA status for current user.
     */
    public function status(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'enabled' => (bool) $user->two_factor_enabled,
            'has_secret' => !empty($user->two_factor_secret),
        ]);
    }
}
