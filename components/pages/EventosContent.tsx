'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { Event } from '@/types';

function excerpt(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

export function EventosContent({ events }: { events: Event[] }) {
  const { t, lang } = useLanguage();
  const locale = lang === 'es' ? es : enUS;

  return (
    <main className="min-h-screen container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-navy">
        {t('pages.events')}
      </h1>
      <p className="text-base sm:text-lg text-gray-text mb-6 sm:mb-8">{t('pages.eventsDesc')}</p>

      <div className="space-y-4 sm:space-y-6">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/eventos/${event.id}`}
            className="block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl active:scale-[0.99] transition-all border border-navy/5 touch-manipulation"
          >
            {event.image && (
              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-navy/5">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="object-cover"
                  unoptimized={event.image.startsWith('data:')}
                />
              </div>
            )}
            <div className="p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-navy break-words">
                {event.title}
              </h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-text mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                  <span className="font-semibold shrink-0">{t('pages.date')}:</span>
                  <span>{format(new Date(event.date), 'dd MMMM yyyy', { locale })}</span>
                </div>
                {event.time && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                    <span className="font-semibold shrink-0">{t('pages.time')}:</span>
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2">
                    <span className="font-semibold shrink-0">{t('pages.location')}:</span>
                    <span className="break-words line-clamp-1">{event.location}</span>
                  </div>
                )}
              </div>
              {event.description && (
                <p className="text-gray-700 text-sm sm:text-base line-clamp-3 mb-3">
                  {excerpt(event.description)}
                </p>
              )}
              <span className="inline-flex text-sm font-semibold text-navy">
                {t('pages.viewEvent')} →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 text-gray-text">
          <p>{t('pages.eventsEmpty')}</p>
        </div>
      )}
    </main>
  );
}
