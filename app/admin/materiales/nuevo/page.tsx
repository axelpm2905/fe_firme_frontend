import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';
import { MaterialForm } from '@/components/admin/MaterialForm';

export default function NewMaterialPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Header />
      <main className="min-h-screen bg-gray-light">
        <MaterialForm />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
