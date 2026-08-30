import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

// Lee la sesión que el SDK de Auth0 ya guardó (cookie cifrada con AUTH0_SECRET,
// HttpOnly, propia de este dominio) y devuelve el ID token en un JSON de una
// sola vez, para que /auth0/finish lo reenvíe de inmediato a Laravel. El token
// nunca se persiste en el navegador (no localStorage, no cookie legible por JS).
export async function GET() {
  const session = await auth0.getSession();
  const idToken = session?.tokenSet?.idToken;

  if (!idToken) {
    return NextResponse.json({ error: 'no_session' }, { status: 401 });
  }

  return NextResponse.json({ id_token: idToken });
}
