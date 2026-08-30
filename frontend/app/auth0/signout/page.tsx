'use client';

import { useEffect, useRef } from 'react';
import { fetchAPI } from '@/lib/api';
import { clearAuthSession } from '@/lib/auth-session';

/**
 * Logout coordinado: cierra primero la sesión de Laravel/Sanctum
 * (pop_perote_session) y luego navega a /auth0/logout -- ruta propia del SDK
 * de Auth0, interceptada por proxy.ts -- para cerrar también la sesión del
 * SDK y la sesión SSO en el propio Auth0 (RP-initiated logout), regresando a
 * la Allowed Logout URL registrada. Sin botón todavía (llega en Fase 2).
 */
export default function Auth0Signout() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        await fetchAPI('/auth/logout', { method: 'POST' });
      } catch {
        // Best-effort: si la sesión Laravel ya no existía o la llamada falla,
        // igual se continúa con el logout de Auth0 para no dejar SSO activo.
      }

      clearAuthSession();
      window.location.assign('/auth0/logout');
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#F2C777] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-white/60">Cerrando sesión...</p>
      </div>
    </div>
  );
}
