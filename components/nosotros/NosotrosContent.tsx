'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';

export function NosotrosContent() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-navy">{t('nosotros.title')}</h1>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-navy">{t('nosotros.verseTitle')}</h2>
          <blockquote className="border-l-4 border-navy pl-6 py-2 my-6 italic text-gray-700 text-lg bg-gray-light/50 rounded-r-lg">
            {t('nosotros.verseText')}
          </blockquote>
          <p className="text-gray-600 text-sm mb-8">— {t('nosotros.verseRef')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-navy">{t('nosotros.firmeTitle')}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('nosotros.firmeP1')}
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('nosotros.firmeP2')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-navy">{t('nosotros.churchTitle')}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('nosotros.churchP1')}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t('nosotros.churchP2')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-navy">{t('nosotros.missionTitle')}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('nosotros.missionIntro')}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>{t('nosotros.mission1')}</li>
            <li>{t('nosotros.mission2')}</li>
            <li>{t('nosotros.mission3')}</li>
            <li>{t('nosotros.mission4')}</li>
            <li>{t('nosotros.mission5')}</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
