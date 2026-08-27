'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { LinkifiedText } from '@/components/ui/LinkifiedText';
import type { Event } from '@/types';

export function EventDetailContent({ event }: { event: Event }) {
  const { t, lang } = useLanguage();
  const locale = lang === 'es' ? es : enUS;

  return (
    <main className="min-h-screen container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
      <Link
        href="/eventos"
        className="inline-flex items-center text-sm text-navy/70 hover:text-navy mb-6 transition-colors"
      >
        ← {t('pages.backToEvents')}
      </Link>

      <article className="bg-white rounded-2xl shadow-md border border-navy/5 overflow-hidden">
        {event.image && (
          <div className="relative aspect-[16/9] w-full bg-navy/5">
            <Image
              src={event.image}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              unoptimized={event.image.startsWith('data:')}
            />
          </div>
        )}

        <div className="p-5 sm:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy break-words leading-tight mb-6">
            {event.title}
          </h1>

          <div className="space-y-3 text-sm sm:text-base text-gray-700 mb-8 pb-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <span className="font-semibold text-navy shrink-0">{t('pages.date')}:</span>
              <span>{format(new Date(event.date), 'EEEE, dd MMMM yyyy', { locale })}</span>
            </div>
            {event.time && (
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <span className="font-semibold text-navy shrink-0">{t('pages.time')}:</span>
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <span className="font-semibold text-navy shrink-0">{t('pages.location')}:</span>
                <LinkifiedText text={event.location} as="span" className="break-words" />
              </div>
            )}
          </div>

          {event.description ? (
            <div>
              <h2 className="text-lg font-semibold text-navy mb-3">{t('pages.eventDetails')}</h2>
              <LinkifiedText
                text={event.description}
                className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap break-words"
              />
            </div>
          ) : (
            <p className="text-gray-text text-sm">{t('pages.eventNoDescription')}</p>
          )}
        </div>
      </article>
    </main>
  );
}
