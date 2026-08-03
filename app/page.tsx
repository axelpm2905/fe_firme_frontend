import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomeContent } from '@/components/home/HomeContent';
import { NewContentNotifier } from '@/components/home/NewContentNotifier';
import { getBlogs } from '@/lib/blogs';
import { getEvents } from '@/lib/events';
import { getYouTubeContents } from '@/lib/youtube';
import { filterRecentByCreatedAt } from '@/lib/newContent';

export default async function HomePage() {
  const [allBlogs, events, videos] = await Promise.all([
    getBlogs(),
    getEvents(),
    getYouTubeContents(),
  ]);

  const blogs = allBlogs.slice(0, 3);
  const newBlogs = filterRecentByCreatedAt(allBlogs).map((b) => ({
    id: b.id,
    title: b.title,
  }));
  const newEvents = filterRecentByCreatedAt(events).map((e) => ({
    id: e.id,
    title: e.title,
  }));
  const newVideos = filterRecentByCreatedAt(videos).map((v) => ({
    id: v.id,
    title: v.title,
  }));

  return (
    <>
      <Header />
      <NewContentNotifier blogs={newBlogs} events={newEvents} videos={newVideos} />
      <HomeContent blogs={blogs} />
      <Footer />
    </>
  );
}
