'use client';

import { RequireRole } from '@/lib/auth-provider';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole roles={['mesero', 'admin']}>{children}</RequireRole>;
}