export interface AuthSessionUser {
  id: number;
  name: string;
  email: string;
  role?: string;
  points?: number;
  tier?: string;
}

export interface AuthSession {
  token: string;
  user: AuthSessionUser;
  provider?: string;
}

const AUTH_SESSION_KEY = 'pop_auth_session';

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

export function saveAuthSession(session: AuthSession): void {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.sessionStorage.getItem(AUTH_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;

    if (!parsed?.token || !parsed?.user?.email) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.removeItem(AUTH_SESSION_KEY);
}

export function normalizeRole(role?: string): string {
  return (role ?? 'cliente').trim().toLowerCase();
}

export function getRoleDashboard(role?: string): string {
  switch (normalizeRole(role)) {
    case 'admin':
      return '/admin/dashboard';
    case 'mesero':
      return '/ranking';
    default:
      return '/puntos';
  }
}
