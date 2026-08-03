'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useLanguage } from '@/components/providers/LanguageProvider';

export type NewContentItem = {
  id: string;
  title: string;
};

type NewContentNotifierProps = {
  blogs: NewContentItem[];
  events: NewContentItem[];
  videos: NewContentItem[];
};

export function NewContentNotifier({ blogs, events, videos }: NewContentNotifierProps) {
  const { t, lang } = useLanguage();

  useEffect(() => {
    const showGroup = (
      items: NewContentItem[],
      kind: 'blog' | 'event' | 'video',
      href: string
    ) => {
      if (items.length === 0) return;

      const label =
        items.length === 1
          ? t(`home.new.${kind}One`).replace('{title}', items[0].title)
          : t(`home.new.${kind}Many`).replace('{count}', String(items.length));

      toast.custom(
        (toastInstance) => (
          <div
            className={`${
              toastInstance.visible ? 'animate-enter' : 'animate-leave'
            } pointer-events-auto w-full max-w-sm rounded-lg bg-white shadow-lg border border-navy/10 ring-1 ring-black/5 overflow-hidden`}
          >
            <div className="p-4">
              <p className="text-sm font-semibold text-navy mb-1">{t('home.new.badge')}</p>
              <p className="text-sm text-gray-700 line-clamp-2">{label}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <Link
                  href={href}
                  onClick={() => toast.dismiss(toastInstance.id)}
                  className="inline-flex items-center justify-center min-h-[44px] px-3 text-sm font-semibold text-navy hover:underline touch-manipulation"
                >
                  {t('home.new.view')}
                </Link>
                <button
                  type="button"
                  onClick={() => toast.dismiss(toastInstance.id)}
                  className="inline-flex items-center justify-center min-h-[44px] px-3 text-sm text-gray-500 hover:text-gray-700 touch-manipulation"
                >
                  {t('home.new.dismiss')}
                </button>
              </div>
            </div>
          </div>
        ),
        {
          id: `new-${kind}`,
          duration: 6000,
          position: 'top-center',
        }
      );
    };

    const timer = setTimeout(() => {
      showGroup(blogs, 'blog', '/blog');
      showGroup(events, 'event', '/eventos');
      showGroup(videos, 'video', '/youtube');
    }, 400);

    return () => clearTimeout(timer);
  }, [blogs, events, videos, t, lang]);

  return null;
}
