import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';
import { YouTubeAdmin } from '@/components/admin/YouTubeAdmin';

export default function YouTubeAdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Header />
      <main className="min-h-screen bg-gray-light">
        <YouTubeAdmin />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
