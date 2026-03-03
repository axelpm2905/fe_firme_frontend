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
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-navy">{t('pages.events')}</h1>
      <p className="text-lg text-gray-text mb-8">{t('pages.eventsDesc')}</p>

      <div className="space-y-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-navy">{event.title}</h3>
                <div className="space-y-2 text-gray-text mb-4">
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">{t('pages.date')}:</span>
                    {format(new Date(event.date), 'dd MMMM yyyy', { locale })}
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">{t('pages.time')}:</span>
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">{t('pages.location')}:</span>
                    {event.location}
                  </div>
                </div>
                <p className="text-gray-700">{event.description}</p>
              </div>
            </div>
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
