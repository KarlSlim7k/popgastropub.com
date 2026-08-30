import { NextResponse } from 'next/server';
import { Auth0Client } from '@auth0/nextjs-auth0/server';

// Dominio, client ID/secret y AUTH0_SECRET se leen de las variables de entorno
// AUTH0_DOMAIN / AUTH0_CLIENT_ID / AUTH0_CLIENT_SECRET / AUTH0_SECRET / APP_BASE_URL
// (convención del SDK). El callback debe coincidir exactamente con el registrado
// en Auth0 Dashboard para la app "popgastropub-frontend": /auth0/callback.
export const auth0 = new Auth0Client({
  routes: {
    login: '/auth0/login',
    logout: '/auth0/logout',
    callback: '/auth0/callback',
  },
  async onCallback(error, ctx) {
    if (error) {
      const url = new URL('/login', ctx.appBaseUrl);
      url.searchParams.set('auth0_error', error.code ?? 'auth0_error');
      return NextResponse.redirect(url);
    }

    // El puente hacia Laravel vive en /auth0/finish: ahí se lee el ID token
    // (server-side, vía /api/auth0/id-token) y se envía a la API para crear
    // la sesión Sanctum. El SDK ya dejó su propia sesión (cookie cifrada) lista.
    return NextResponse.redirect(new URL('/auth0/finish', ctx.appBaseUrl));
  },
});
