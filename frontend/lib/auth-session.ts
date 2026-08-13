export interface AuthSessionUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  points?: number;
  tier?: string;
}

export interface AuthSession {
  /** Compatibility marker for existing callers; authentication lives in an HttpOnly cookie. */
  token: string;
  user: AuthSessionUser;
  provider?: string;
}

const AUTH_SESSION_KEY = 'pop_auth_session';
const COOKIE_SESSION_MARKER = 'http-only-cookie';

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function sanitizeUser(user: Partial<AuthSessionUser>): AuthSessionUser {
  return {
    id: Number(user.id),
    name: String(user.name ?? ''),
    email: String(user.email ?? ''),
    ...(user.phone ? { phone: String(user.phone) } : {}),
    ...(user.role ? { role: String(user.role) } : {}),
    ...(typeof user.points === 'number' ? { points: user.points } : {}),
    ...(user.tier ? { tier: String(user.tier) } : {}),
  };
}

export function saveAuthSession(session: AuthSession): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
    user: sanitizeUser(session.user),
    provider: session.provider,
  }));
}

export function getAuthSession(): AuthSession | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthSession>;

    if (!parsed?.user?.email) {
      return null;
    }

    // Rewrite legacy entries immediately so old bearer tokens do not remain persisted.
    const user = sanitizeUser(parsed.user);
    window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
      user,
      provider: parsed.provider,
    }));

    return {
      token: COOKIE_SESSION_MARKER,
      user,
      provider: parsed.provider,
    };
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY);
}

export function normalizeRole(role?: string): string {
  return (role ?? 'cliente').trim().toLowerCase();
}

export function getRoleDashboard(role?: string): string {
  switch (normalizeRole(role)) {
    case 'admin':
      return '/admin/dashboard';
    case 'mesero':
      return '/staff/dashboard';
    default:
      return '/puntos';
  }
}
