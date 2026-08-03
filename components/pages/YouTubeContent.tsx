'use client';

import { YouTubeContentCard } from '@/components/youtube/YouTubeContentCard';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { YouTubeContent } from '@/types';

export function YouTubeContent({ contents }: { contents: YouTubeContent[] }) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-navy">
        {t('pages.youtube')}
      </h1>
      <p className="text-base sm:text-lg text-gray-text mb-6 sm:mb-8">{t('pages.youtubeDesc')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
