import { auth0 } from '@/lib/auth0';

// Next.js 16 renombró middleware.ts -> proxy.ts (mismo comportamiento).
// Alcance deliberadamente acotado a /auth0/*: el resto de la app (60+ rutas
// existentes) no pasa por este archivo.
export async function proxy(request: Request) {
  return auth0.middleware(request);
}

export const config = {
  matcher: ['/auth0/login', '/auth0/logout', '/auth0/callback'],
};
