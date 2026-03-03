import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';
import { BlogForm } from '@/components/admin/BlogForm';
import { getBlogs } from '@/lib/blogs';
import type { Blog } from '@/types';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    const blogs = await getBlogs();
    return blogs.map((blog: Blog) => ({ id: blog.id }));
  } catch {
    return [];
  }
}

export default function EditBlogPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Header />
      <main className="min-h-screen bg-gray-light">
        <BlogForm blogId={params.id} />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
