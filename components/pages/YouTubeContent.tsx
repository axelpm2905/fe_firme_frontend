'use client';

import { YouTubeContentCard } from '@/components/youtube/YouTubeContentCard';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { YouTubeContent } from '@/types';

export function YouTubeContent({ contents }: { contents: YouTubeContent[] }) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-navy">{t('pages.youtube')}</h1>
      <p className="text-lg text-gray-text mb-8">{t('pages.youtubeDesc')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contents.map((content) => (
          <YouTubeContentCard key={content.id} content={content} />
        ))}
      </div>

      {contents.length === 0 && (
        <div className="text-center py-12 text-gray-text">
          <p>{t('pages.youtubeEmpty')}</p>
        </div>
      )}
    </main>
  );
}
