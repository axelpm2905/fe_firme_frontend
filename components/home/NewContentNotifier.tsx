'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FiX } from 'react-icons/fi';
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

type Notice = {
  id: string;
  label: string;
  href: string;
};

export function NewContentNotifier({ blogs, events, videos }: NewContentNotifierProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const notices = useMemo(() => {
    const items: Notice[] = [];

    if (blogs.length === 1) {
      items.push({
        id: 'blog',
        href: '/blog',
        label: t('home.new.blogOne').replace('{title}', blogs[0].title),
      });
    } else if (blogs.length > 1) {
      items.push({
        id: 'blog',
        href: '/blog',
        label: t('home.new.blogMany').replace('{count}', String(blogs.length)),
      });
    }

    if (events.length === 1) {
      items.push({
        id: 'event',
        href: '/eventos',
        label: t('home.new.eventOne').replace('{title}', events[0].title),
      });
    } else if (events.length > 1) {
      items.push({
        id: 'event',
        href: '/eventos',
        label: t('home.new.eventMany').replace('{count}', String(events.length)),
      });
    }

    if (videos.length === 1) {
      items.push({
        id: 'video',
        href: '/youtube',
        label: t('home.new.videoOne').replace('{title}', videos[0].title),
      });
    } else if (videos.length > 1) {
      items.push({
        id: 'video',
        href: '/youtube',
        label: t('home.new.videoMany').replace('{count}', String(videos.length)),
      });
    }

    return items;
  }, [blogs, events, videos, t]);

  useEffect(() => {
    if (dismissed || notices.length === 0) return;
    const showTimer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(showTimer);
  }, [notices.length, dismissed]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      setDismissed(true);
    }, 280);
  };

  if (!visible || notices.length === 0 || dismissed) return null;

  return (
    <div
      className={`fixed z-[60] pointer-events-none
        left-3 right-3
        bottom-[calc(0.75rem+env(safe-area-inset-bottom))]
        sm:left-auto sm:right-4 sm:bottom-auto
        sm:top-[calc(4.5rem+env(safe-area-inset-top))]
        sm:w-[22rem] sm:max-w-[calc(100vw-2rem)]
      `}
      role="status"
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto rounded-2xl border border-navy/10 bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,31,63,0.12)] overflow-hidden
          transition-all duration-300 ease-out
          ${closing
            ? 'opacity-0 translate-y-4 sm:translate-y-0 sm:translate-x-4'
            : 'opacity-100 translate-y-0 sm:translate-x-0 animate-[slideUpSoft_0.35s_ease-out] sm:animate-[slideInRight_0.35s_ease-out]'
          }
        `}
      >
        <div className="flex items-start gap-2 px-3.5 py-3">
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-navy/50 mb-1.5">
              {t('home.new.badge')}
            </p>
            <ul className="space-y-1.5">
              {notices.map((notice) => (
                <li key={notice.id}>
                  <Link
                    href={notice.href}
                    onClick={handleClose}
                    className="block text-sm text-gray-700 hover:text-navy transition-colors line-clamp-2"
                  >
                    {notice.label}
                  </Link>
                </li>
              ))}
            </ul>
            {notices.length === 1 && (
              <Link
                href={notices[0].href}
                onClick={handleClose}
                className="inline-flex mt-2 text-xs font-medium text-navy/80 hover:text-navy underline-offset-2 hover:underline"
              >
                {t('home.new.view')}
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t('home.new.dismiss')}
            className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
