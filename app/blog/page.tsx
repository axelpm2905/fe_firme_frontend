import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogContent } from '@/components/pages/BlogContent';
import { getBlogs } from '@/lib/blogs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Fe Firme',
  description: 'Artículos sobre Apologética Cristiana y defensa de la fe',
};

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <>
      <Header />
      <BlogContent blogs={blogs} />
      <Footer />
    </>
  );
}
