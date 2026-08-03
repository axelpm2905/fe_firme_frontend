'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { Blog } from '@/types';

export function ApologeticaContent({ blogs }: { blogs: Blog[] }) {
  const { t, lang } = useLanguage();
  const locale = lang === 'es' ? es : enUS;

  return (
    <main className="min-h-screen container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-navy">
        {t('pages.apologetics')}
      </h1>
      <p className="text-base sm:text-lg text-gray-text mb-6 sm:mb-8">{t('pages.apologeticsDesc')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.slug}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl active:scale-[0.98] transition-all touch-manipulation"
          >
            {blog.featuredImage && (
              <div className="relative h-44 sm:h-48 w-full">
                <Image src={blog.featuredImage} alt={blog.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-4 sm:p-6">
              <span className="text-xs sm:text-sm text-blue-600 font-semibold">{blog.category}</span>
              <h2 className="text-lg sm:text-xl font-bold mt-2 mb-2 sm:mb-3 text-navy line-clamp-2">
                {blog.title}
              </h2>
              <p className="text-gray-text text-sm mb-4 line-clamp-3">
                {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
              </p>
              <div className="text-xs text-gray-text">
                {blog.createdAt &&
                  format(
                    blog.createdAt instanceof Date
                      ? blog.createdAt
                      : (blog.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(String(blog.createdAt)),
                    'dd MMMM yyyy',
                    { locale }
                  )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-12 text-gray-text">
          <p>{t('pages.apologeticsEmpty')}</p>
        </div>
      )}
    </main>
  );
}
