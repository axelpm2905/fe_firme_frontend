import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomeContent } from '@/components/home/HomeContent';
import { getBlogs } from '@/lib/blogs';

export default async function HomePage() {
  const blogs = await getBlogs(3);

  return (
    <>
      <Header />
      <HomeContent blogs={blogs} />
      <Footer />
    </>
  );
}
