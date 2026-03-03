'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoginForm } from '@/components/auth/LoginForm';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';

export default function LoginPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <>
        <Header />
        <main className="min-h-screen py-12 bg-gray-light">
          <LoginForm />
        </main>
        <Footer />
      </>
    </ProtectedRoute>
  );
}
