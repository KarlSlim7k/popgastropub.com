'use client';

import { RequireAuth } from '@/lib/auth-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}