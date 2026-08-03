'use client';

import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { Event } from '@/types';

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
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-navy break-words">{event.title}</h3>
            <div className="space-y-2 text-sm sm:text-base text-gray-text mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                <span className="font-semibold shrink-0">{t('pages.date')}:</span>
                <span>{format(new Date(event.date), 'dd MMMM yyyy', { locale })}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                <span className="font-semibold shrink-0">{t('pages.time')}:</span>
                <span>{event.time}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2">
                <span className="font-semibold shrink-0">{t('pages.location')}:</span>
                <span className="break-words">{event.location}</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm sm:text-base break-words">{event.description}</p>
          </div>
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
