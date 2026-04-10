'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthSession, clearAuthSession, getRoleDashboard, type AuthSession } from './auth-session';

interface AuthContextType {
  session: AuthSession | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  logout: async () => {},
  refreshSession: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshSession = useCallback(() => {
    const s = getAuthSession();
    setSession(s);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const logout = useCallback(async () => {
    if (session?.token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://popgastropub.com/api'}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.token}`, 'Content-Type': 'application/json' },
        });
      } catch {}
    }
    clearAuthSession();
    setSession(null);
    router.push('/login');
  }, [session, router]);

  return (
    <AuthContext.Provider value={{ session, isLoading, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function RequireRole({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.replace('/login');
      return;
    }
    if (!roles.includes(session.user.role ?? 'cliente')) {
      router.replace(getRoleDashboard(session.user.role));
    }
  }, [session, isLoading, roles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="w-8 h-8 border-2 border-[#F2C777] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;
  if (!roles.includes(session.user.role ?? 'cliente')) return null;

  return <>{children}</>;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.replace('/login');
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="w-8 h-8 border-2 border-[#F2C777] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (session) {
      router.replace(getRoleDashboard(session.user.role));
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="w-8 h-8 border-2 border-[#F2C777] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (session) return null;

  return <>{children}</>;
}