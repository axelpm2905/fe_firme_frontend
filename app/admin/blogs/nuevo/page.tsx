import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';
import { BlogForm } from '@/components/admin/BlogForm';

export default function NewBlogPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Header />
      <main className="min-h-screen bg-gray-light">
        <BlogForm />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
