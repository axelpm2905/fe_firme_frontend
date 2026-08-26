'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { Blog } from '@/types';

export function HomeContent({ blogs }: { blogs: Blog[] }) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-r from-navy to-navy-dark text-white py-8 sm:py-10 md:py-12 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <Link href="/" className="block bg-transparent">
            <div className="overflow-hidden flex justify-center w-full" style={{ height: 'clamp(12rem, 26vw, 22rem)' }}>
              <Image
                src="/logo-oasis-fe-firme.png"
                alt="Oasis Fe Firme - Ministerio de Apologética"
                width={800}
                height={240}
                className="h-full w-auto object-cover object-top bg-transparent"
                style={{ background: 'transparent' }}
                priority
              />
            </div>
          </Link>
          <p className="text-fluid-lg mt-2 mb-0.5 text-gray-200">
            {t('home.subtitle')}
          </p>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            {t('home.tagline')}
          </p>
        </div>
      </section>

      <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy/5 via-transparent to-navy/5" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,31,63,0.03)_100%)]" aria-hidden="true" />
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl relative">
          <p className="text-navy/40 text-xs sm:text-base uppercase tracking-[0.18em] sm:tracking-[0.3em] font-semibold mb-4 sm:mb-6 text-center">
            {t('home.mottoLabel')}
          </p>
          <blockquote className="text-center">
            <span className="font-verse text-xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-normal italic text-navy leading-relaxed block px-1">
              {t('home.mottoVerse')}
            </span>
            <cite className="font-sans not-italic text-navy-dark font-semibold text-sm sm:text-lg mt-5 sm:mt-6 block">
              {t('home.mottoRef')}
            </cite>
            <span className="text-gray-text text-xs sm:text-sm mt-1 block">{t('home.mottoVersion')}</span>
          </blockquote>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-fluid-2xl font-bold mb-6 sm:mb-8 text-navy">{t('home.latestArticles')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl active:scale-[0.98] transition-all duration-200 border border-navy/5"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-navy/10 to-navy/5">
                {blog.featuredImage ? (
                  <Image
                    src={blog.featuredImage}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-navy/25 text-4xl font-bold tracking-wider">FF</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl font-bold text-navy line-clamp-2 group-hover:text-navy-dark transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-text text-sm mt-2 line-clamp-3 leading-relaxed">
                  {blog.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 140)}…
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6 sm:mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center min-h-[48px] bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-dark active:scale-95 transition-all font-semibold touch-manipulation"
          >
            {t('home.viewAllArticles')}
          </Link>
        </div>
      </section>

      <section className="bg-gray-light py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <Link
              href="/materiales"
              className="bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-xl active:scale-[0.98] transition-all min-h-[120px] flex flex-col justify-center touch-manipulation"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-navy">{t('home.studyMaterials')}</h3>
              <p className="text-gray-text text-sm sm:text-base">
                {t('home.studyMaterialsDesc')}
              </p>
            </Link>
            <Link
              href="/youtube"
              className="bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-xl active:scale-[0.98] transition-all min-h-[120px] flex flex-col justify-center touch-manipulation"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-navy">{t('home.youtubeChannel')}</h3>
              <p className="text-gray-text text-sm sm:text-base">
                {t('home.youtubeDesc')}
              </p>
            </Link>
            <Link
              href="/eventos"
              className="bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-xl active:scale-[0.98] transition-all min-h-[120px] flex flex-col justify-center touch-manipulation"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-navy">{t('home.upcomingEvents')}</h3>
              <p className="text-gray-text text-sm sm:text-base">
                {t('home.upcomingEventsDesc')}
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
