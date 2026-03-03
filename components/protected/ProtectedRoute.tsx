'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  requireAuth = false,
}: ProtectedRouteProps) => {
  const { user, userData, loading, isAuthenticated, isAdmin } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredRole === 'ADMIN' && !isAdmin) {
      router.push('/');
      return;
    }
  }, [loading, isAuthenticated, isAdmin, requiredRole, requireAuth, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-text">Cargando...</div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requiredRole === 'ADMIN' && !isAdmin) {
    return null;
  }

  return <>{children}</>;
};
