'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { UserData } from '@/types';

interface AuthContextType {
  user: { id: number; email: string; displayName: string | null } | null | undefined;
  userData: UserData | null;
  loading: boolean;
  error: Error | undefined;
  isAdmin: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  error: undefined,
  isAdmin: false,
  isAuthenticated: false,
  refreshUser: async () => {},
  signOut: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
