'use client';

import { usePathname } from 'next/navigation';
import { UserProvider } from '@/context/UserContext';

export function ConditionalUserProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Jangan pakai context di halaman login
  const isAuthPage = pathname === '/login';

  if (isAuthPage) {
    return <>{children}</>; // skip context
  }

  return <UserProvider>{children}</UserProvider>;
}
