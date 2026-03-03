import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ApologeticaContent } from '@/components/pages/ApologeticaContent';
import { getBlogs } from '@/lib/blogs';
import type { Blog } from '@/types';

export default async function ApologeticaPage() {
  const blogs = await getBlogs();
  const apologeticaBlogs = blogs.filter((blog: Blog) => blog.category === 'Apologética');

  return (
    <>
      <Header />
      <ApologeticaContent blogs={apologeticaBlogs} />
      <Footer />
    </>
  );
}
