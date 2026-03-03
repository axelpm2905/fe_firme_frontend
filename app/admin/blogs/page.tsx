import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';
import { BlogsAdmin } from '@/components/admin/BlogsAdmin';

export default function BlogsAdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Header />
      <main className="min-h-screen bg-gray-light">
        <BlogsAdmin />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
