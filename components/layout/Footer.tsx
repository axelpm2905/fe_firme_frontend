'use client';

import Link from 'next/link';
import { FiFacebook, FiInstagram } from 'react-icons/fi';
import { useLanguage } from '@/components/providers/LanguageProvider';

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-navy text-white py-8 sm:py-10 mt-12" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <Link href="/" className="hover:text-gray-300 transition-colors">Fe Firme</Link>
            </h3>
            <p className="text-gray-300 text-sm">
              {t('footer.ministry')}
            </p>
            <p className="text-gray-300 text-sm mt-2">
              {t('footer.church')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.links')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.blogs')}
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.social')}</h4>
            <p className="text-gray-300 text-sm mb-2">{t('footer.feFirme')}</p>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.facebook.com/groups/fefirme"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Fe Firme Facebook"
              >
                <FiFacebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/fe_firme/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Fe Firme Instagram"
              >
                <FiInstagram size={24} />
              </a>
            </div>
            <p className="text-gray-300 text-sm mb-2">{t('footer.churchOasis')}</p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/iglesiaoasisdeamor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Iglesia Oasis de Amor Facebook"
              >
                <FiFacebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/igleoasisdeamor/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Iglesia Oasis de Amor Instagram"
              >
                <FiInstagram size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Fe Firme. {t('footer.copyright')}
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <a
                href="https://www.facebook.com/groups/fefirme"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <FiFacebook size={20} />
                <span className="text-sm">{t('footer.feFirmeFacebook')}</span>
              </a>
              <a
                href="https://www.instagram.com/fe_firme/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <FiInstagram size={20} />
                <span className="text-sm">{t('footer.feFirmeInstagram')}</span>
              </a>
              <a
                href="https://www.facebook.com/iglesiaoasisdeamor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <FiFacebook size={20} />
                <span className="text-sm">{t('footer.churchFacebook')}</span>
              </a>
              <a
                href="https://www.instagram.com/igleoasisdeamor/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <FiInstagram size={20} />
                <span className="text-sm">{t('footer.churchInstagram')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
