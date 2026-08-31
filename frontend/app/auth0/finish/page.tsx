'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, fetchAPI, fetchWithCsrf } from '@/lib/api';
import { saveAuthSession, getRoleDashboard } from '@/lib/auth-session';
import { useAuth } from '@/lib/auth-provider';

interface Auth0CallbackUser {
  id: number;
  name: string;
  email: string;
  role?: string;
  points?: number;
  tier?: string;
}

interface Auth0CallbackResponse {
  user: Auth0CallbackUser;
}

/**
 * Puente entre la sesión de Auth0 (ya establecida por el SDK en /auth0/callback)
 * y la sesión de aplicación de Laravel. El ID token nunca se guarda: se lee una
 * sola vez desde /api/auth0/id-token y se reenvía de inmediato a la API.
 */
export default function Auth0Finish() {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // Si ya hay sesión Laravel activa (p. ej. el usuario recarga esta página
    // después de un login que ya se completó), no reintentamos el bridge: el
    // ID token del SDK ya se consumió y el anti-replay lo rechazaría. Basta
    // con confirmar la sesión existente y salir hacia el dashboard.
    async function landIfAlreadyAuthenticated(): Promise<boolean> {
      try {
        const user = await fetchAPI<Auth0CallbackUser>('/auth/me');
        saveAuthSession({ token: 'http-only-cookie', user, provider: 'auth0' });
        await refreshSession();
        router.replace(getRoleDashboard(user.role));
        return true;
      } catch {
        return false;
      }
    }

    async function bridgeAuth0ToLaravel(): Promise<void> {
      const tokenResponse = await fetch('/api/auth0/id-token', { credentials: 'include' });

      if (!tokenResponse.ok) {
        throw new Error('no_session');
      }

      const { id_token: idToken } = (await tokenResponse.json()) as { id_token: string };

      const response = await fetchWithCsrf(`${API_URL}/auth/auth0/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id_token: idToken }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(typeof body.error === 'string' ? body.error : 'auth0_bridge_failed');
      }

      const user = (body as Auth0CallbackResponse).user;
      saveAuthSession({ token: 'http-only-cookie', user, provider: 'auth0' });
      await refreshSession();
      router.replace(getRoleDashboard(user.role));
    }

    (async () => {
      if (await landIfAlreadyAuthenticated()) return;

      try {
        await bridgeAuth0ToLaravel();
      } catch (err) {
        // Puede ser una carrera con un intento anterior que ya completó el
        // login del lado de Laravel; se confirma antes de mostrar un error.
        if (await landIfAlreadyAuthenticated()) return;

        setError(err instanceof Error ? err.message : 'auth0_bridge_failed');
      }
    })();
  }, [refreshSession, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4">
      <div className="text-center max-w-sm">
        {error ? (
          <>
            <p className="text-sm text-red-300 mb-4">
              No fue posible completar el acceso con Auth0. Intenta de nuevo o usa tu correo y contraseña.
            </p>
            <button
              type="button"
              onClick={() => router.replace('/login?auth0_error=' + encodeURIComponent(error))}
              className="text-xs uppercase tracking-widest text-[#F2C777] underline underline-offset-4"
            >
              Volver al inicio de sesión
            </button>
          </>
        ) : (
          <>
            <div className="w-8 h-8 border-2 border-[#F2C777] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-white/60">Validando tu sesión...</p>
          </>
        )}
      </div>
    </div>
  );
}
