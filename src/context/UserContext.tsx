// context/UserContext.tsx
'use client';
import { createContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
  id_user: string;
  username: string;
  role: string;
  url_foto_identitas?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  refreshUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = () => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      api
        .get(`/users/${parsed.id}`) // Pastikan key-nya sesuai
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error('Gagal ambil user:', err);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return <UserContext.Provider value={{ user, setUser, refreshUser }}>{children}</UserContext.Provider>;
}
