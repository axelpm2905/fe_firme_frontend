import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { YouTubeContent } from '@/components/pages/YouTubeContent';
import { getYouTubeContents } from '@/lib/youtube';

export default async function YouTubePage() {
  const youtubeContents = await getYouTubeContents();

  return (
    <>
      <Header />
      <YouTubeContent contents={youtubeContents} />
      <Footer />
    </>
  );
}
