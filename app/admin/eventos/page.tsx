import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';
import { EventsAdmin } from '@/components/admin/EventsAdmin';

export default function EventsAdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Header />
      <main className="min-h-screen bg-gray-light">
        <EventsAdmin />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
