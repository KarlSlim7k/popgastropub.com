'use client';

import { RequireRole } from '@/lib/auth-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole roles={['cliente']}>{children}</RequireRole>;
}