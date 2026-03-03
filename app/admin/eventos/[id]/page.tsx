import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';
import { EventForm } from '@/components/admin/EventForm';

export default function EditEventPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Header />
      <main className="min-h-screen bg-gray-light">
        <EventForm eventId={params.id} />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
