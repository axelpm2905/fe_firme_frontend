import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';
import { CommentsAdmin } from '@/components/admin/CommentsAdmin';

export default function CommentsAdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Header />
      <main className="min-h-screen bg-gray-light">
        <CommentsAdmin />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
