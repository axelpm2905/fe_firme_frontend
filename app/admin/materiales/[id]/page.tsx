import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';
import { MaterialForm } from '@/components/admin/MaterialForm';

export default function EditMaterialPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Header />
      <main className="min-h-screen bg-gray-light">
        <MaterialForm materialId={params.id} />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
