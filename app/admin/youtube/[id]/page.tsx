import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';
import { YouTubeForm } from '@/components/admin/YouTubeForm';

export default function EditYouTubePage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Header />
      <main className="min-h-screen bg-gray-light">
        <YouTubeForm contentId={params.id} />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
