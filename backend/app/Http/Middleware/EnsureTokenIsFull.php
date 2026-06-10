<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsFull
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->user()?->currentAccessToken();

        if ($token && $token->cant('*')) {
            return response()->json(['message' => 'Verificación 2FA pendiente.'], 423);
        }

        return $next($request);
    }
}
