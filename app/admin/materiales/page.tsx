import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';
import { MaterialsAdmin } from '@/components/admin/MaterialsAdmin';

export default function MaterialsAdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Header />
      <main className="min-h-screen bg-gray-light">
        <MaterialsAdmin />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
