import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Header />
      <main className="min-h-screen bg-gray-light">
        <AdminDashboard />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
