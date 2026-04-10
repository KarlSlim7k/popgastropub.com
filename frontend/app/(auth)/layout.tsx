'use client';

import { GuestOnly } from '@/lib/auth-provider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <GuestOnly>{children}</GuestOnly>;
}