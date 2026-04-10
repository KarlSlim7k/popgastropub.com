'use client';

import { RequireRole } from '@/lib/auth-provider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole roles={['admin']}>{children}</RequireRole>;
}