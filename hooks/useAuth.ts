'use client';

import { useEffect, useState } from 'react';
import { getMe, signOut as authSignOut } from '@/lib/auth';
import type { UserData } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<{ id: number; email: string; displayName: string | null } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('fe_firme_token') : null;
    if (!token) {
      setUser(null);
      setUserData(null);
      setLoading(false);
      return;
    }
    const timeout = setTimeout(() => setLoading(false), 8000);
    try {
      const res = await getMe();
      clearTimeout(timeout);
      const u = res.user;
      setUser({ id: u.id, email: u.email, displayName: u.displayName });
      setUserData({
        uid: String(u.id),
        email: u.email,
        displayName: u.displayName,
        role: u.role,
      });
    } catch {
      setUser(null);
      setUserData(null);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const signOut = () => {
    authSignOut();
    setUser(null);
    setUserData(null);
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('fe_firme_token');
    if (!token) {
      setUser(null);
      setUserData(null);
      setLoading(false);
      return;
    }
    fetchUser();

    const handleAuthChange = () => fetchUser();
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  return {
    user,
    userData,
    loading,
    error: undefined,
    isAdmin: userData?.role === 'ADMIN',
    isAuthenticated: !!user,
    refreshUser: fetchUser,
    signOut,
  };
};
