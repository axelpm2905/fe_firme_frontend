import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getBlogBySlug, getBlogs } from '@/lib/blogs';
import { getComments } from '@/lib/comments';
import type { Blog } from '@/types';
// import { getMockComments } from '@/lib/mock/data'; // MODO MOCK DESACTIVADO
import { CommentForm } from '@/components/blog/CommentForm';
import { CommentsList } from '@/components/blog/CommentsList';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Metadata } from 'next';

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);
  
  if (!blog) {
    return {
      title: 'Blog no encontrado',
    };
  }

  return {
    title: `${blog.title} | Fe Firme`,
    description: blog.content.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.content.replace(/<[^>]*>/g, '').substring(0, 160),
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const blogs = await getBlogs();
    return blogs.map((blog: Blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug);
  
  if (!blog) {
    notFound();
  }
  
  const comments = await getComments(blog.id, true);
  // const comments = getMockComments(blog.id, true); // MODO MOCK DESACTIVADO

  return (
    <>
      <Header />
      <main className="min-h-screen container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <article>
          <span className="text-blue-600 font-semibold text-sm">{blog.category}</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4 mb-4 sm:mb-6 text-navy">{blog.title}</h1>
          <div className="text-sm text-gray-text mb-8">
            {blog.createdAt && format(
              blog.createdAt instanceof Date ? blog.createdAt : (blog.createdAt?.toDate ? blog.createdAt.toDate() : new Date(blog.createdAt)),
              'dd MMMM yyyy',
              { locale: es }
            )}
            {' • '}
            Por {blog.author}
          </div>

          {blog.featuredImage && (
            <div className="relative h-48 sm:h-64 md:h-96 w-full mb-6 sm:mb-8 rounded-lg overflow-hidden">
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-sm sm:prose-base max-w-none mb-12 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.commentsEnabled && (
            <div className="mt-12 border-t pt-8">
              <h2 className="text-2xl font-bold mb-6 text-navy">Comentarios</h2>
              <CommentForm blogId={blog.id} />
              <CommentsList comments={comments} />
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
