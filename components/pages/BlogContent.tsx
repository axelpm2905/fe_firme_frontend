'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { Blog } from '@/types';

function resolveDate(value: Blog['createdAt']): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'object' && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function BlogContent({ blogs }: { blogs: Blog[] }) {
  const { t, lang } = useLanguage();
  const locale = lang === 'es' ? es : enUS;

  return (
    <main className="min-h-screen container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-navy">{t('pages.blog')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
        {blogs.map((blog) => {
          const date = resolveDate(blog.createdAt);
          const excerpt = blog.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140);

          return (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl active:scale-[0.98] transition-all border border-navy/5"
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
                <div className="absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent opacity-80" />
              </div>
              <div className="p-4 sm:p-5">
                <h2 className="text-lg sm:text-xl font-bold text-navy line-clamp-2 group-hover:text-navy-dark transition-colors">
                  {blog.title}
                </h2>
                {excerpt && (
                  <p className="text-gray-text text-sm mt-2 mb-3 line-clamp-3 leading-relaxed">
                    {excerpt}{excerpt.length >= 140 ? '…' : ''}
                  </p>
                )}
                {date && (
                  <div className="text-xs text-gray-text/80">
                    {format(date, 'dd MMMM yyyy', { locale })}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
      {blogs.length === 0 && (
        <div className="text-center py-12 text-gray-text">
          <p>{t('pages.blogEmpty')}</p>
        </div>
      )}
    </main>
  );
}
