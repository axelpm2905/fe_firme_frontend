'use client';

import Link from 'next/link';
import { FiFacebook, FiInstagram } from 'react-icons/fi';
import { useLanguage } from '@/components/providers/LanguageProvider';

const socialIconClass =
  'inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-gray-300 hover:text-white transition-colors touch-manipulation rounded-lg hover:bg-white/10';

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer
      className="bg-navy text-white py-8 sm:py-10 mt-12"
      style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <Link href="/" className="hover:text-gray-300 transition-colors inline-flex min-h-[44px] items-center">
                Fe Firme
              </Link>
            </h3>
            <p className="text-gray-300 text-sm">{t('footer.ministry')}</p>
            <p className="text-gray-300 text-sm mt-2">{t('footer.church')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.links')}</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors inline-flex items-center min-h-[44px]"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-white transition-colors inline-flex items-center min-h-[44px]"
                >
                  {t('nav.blogs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="text-gray-300 hover:text-white transition-colors inline-flex items-center min-h-[44px]"
                >
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.social')}</h4>
            <p className="text-gray-300 text-sm mb-2">{t('footer.feFirme')}</p>
            <div className="flex gap-1 mb-4">
              <a
                href="https://www.facebook.com/groups/fefirme"
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
                aria-label="Fe Firme Facebook"
              >
                <FiFacebook size={22} />
              </a>
              <a
                href="https://www.instagram.com/fe_firme/"
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
                aria-label="Fe Firme Instagram"
              >
                <FiInstagram size={22} />
              </a>
            </div>
            <p className="text-gray-300 text-sm mb-2">{t('footer.churchOasis')}</p>
            <div className="flex gap-1">
              <a
                href="https://www.facebook.com/iglesiaoasisdeamor"
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
                aria-label="Iglesia Oasis de Amor Facebook"
              >
                <FiFacebook size={22} />
              </a>
              <a
                href="https://www.instagram.com/igleoasisdeamor/"
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
                aria-label="Iglesia Oasis de Amor Instagram"
              >
                <FiInstagram size={22} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Fe Firme. {t('footer.copyright')}
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <a
                href="https://www.facebook.com/groups/fefirme"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 min-h-[44px] px-2"
              >
                <FiFacebook size={18} />
                <span className="text-sm">{t('footer.feFirmeFacebook')}</span>
              </a>
              <a
                href="https://www.instagram.com/fe_firme/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 min-h-[44px] px-2"
              >
                <FiInstagram size={18} />
                <span className="text-sm">{t('footer.feFirmeInstagram')}</span>
              </a>
              <a
                href="https://www.facebook.com/iglesiaoasisdeamor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 min-h-[44px] px-2"
              >
                <FiFacebook size={18} />
                <span className="text-sm">{t('footer.churchFacebook')}</span>
              </a>
              <a
                href="https://www.instagram.com/igleoasisdeamor/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 min-h-[44px] px-2"
              >
                <FiInstagram size={18} />
                <span className="text-sm">{t('footer.churchInstagram')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
