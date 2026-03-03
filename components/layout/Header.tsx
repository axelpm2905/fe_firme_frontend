'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export const Header = () => {
  const pathname = usePathname();
  const { user, userData, isAuthenticated, isAdmin, signOut } = useAuthContext();
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLang(lang === 'es' ? 'en' : 'es');
  };

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSignOut = () => {
    setMobileMenuOpen(false);
    signOut();
  };

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/blog', label: t('nav.blogs') },
    { href: '/apologetica', label: t('nav.apologetics') },
    { href: '/materiales', label: t('nav.materials') },
    { href: '/youtube', label: t('nav.youtube') },
    { href: '/eventos', label: t('nav.events') },
    { href: '/nosotros', label: t('nav.about') },
  ];

  const fullName = (userData?.displayName || user?.email || '').toString();
  const firstName = fullName.trim() ? fullName.split(/\s+/)[0] || fullName : '';

  return (
    <header className="bg-navy text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center h-12 sm:h-14 text-lg sm:text-xl md:text-2xl font-bold hover:text-gray-300 transition-colors shrink-0"
            aria-label="Fe Firme - Inicio"
            style={{ letterSpacing: '0.05em', maxWidth: '7cm' }}
          >
            #APOLOGÉTICA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 flex-wrap">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-gray-300 transition-colors py-2 ${
                  pathname === link.href ? 'text-gray-300 font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="bg-white text-navy px-4 py-2 rounded hover:bg-gray-200 transition-colors font-semibold min-h-touch inline-flex items-center"
              >
                {t('auth.admin')}
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 lg:gap-4">
                <span className="text-sm whitespace-nowrap" title={fullName}>{firstName}</span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors min-h-touch"
                >
                  {t('auth.logout')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors min-h-touch inline-flex items-center"
              >
                {t('auth.login')}
              </Link>
            )}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded border border-white/50 hover:bg-white/10 transition-colors min-h-touch text-sm font-medium"
              aria-label={lang === 'es' ? t('lang.aria') : t('lang.ariaCurrent')}
              title={lang === 'es' ? t('lang.aria') : t('lang.ariaCurrent')}
            >
              {t('lang.label')}
            </button>
            <Link
              href="/"
              className="ml-2 flex items-center shrink-0 hover:opacity-90 transition-opacity bg-transparent"
              aria-label="Oasis Fe Firme - Inicio"
            >
              <Image
                src="/logo-oasis-fe-firme.png"
                alt="Oasis Fe Firme"
                width={180}
                height={60}
                className="w-auto object-contain object-right bg-transparent"
                style={{ background: 'transparent', height: '3cm' }}
              />
            </Link>
          </nav>

          {/* Mobile: logo + menu button */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <Link
              href="/"
              className="flex items-center shrink-0 hover:opacity-90 transition-opacity bg-transparent"
              aria-label="Oasis Fe Firme - Inicio"
            >
              <Image
                src="/logo-oasis-fe-firme.png"
                alt="Oasis Fe Firme"
                width={140}
                height={50}
                className="w-auto object-contain bg-transparent"
                style={{ background: 'transparent', height: '3cm' }}
              />
            </Link>
            <button
              aria-label={mobileMenuOpen ? t('auth.closeMenu') : t('auth.openMenu')}
              className="text-white p-3 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Overlay con animación */}
        <div
          className={`md:hidden fixed inset-0 top-14 bg-navy z-40 transform transition-all duration-200 ease-out ${
            mobileMenuOpen ? 'opacity-100 translate-x-0 visible' : 'opacity-0 translate-x-full pointer-events-none invisible'
          }`}
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <nav className="overflow-y-auto h-full px-4 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center min-h-[48px] px-4 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation ${
                  pathname === link.href ? 'text-gray-300 font-semibold bg-white/5' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[48px] px-4 rounded-lg bg-white text-navy font-semibold hover:bg-gray-200 transition-colors mt-4 touch-manipulation"
              >
                {t('auth.admin')}
              </Link>
            )}
            {isAuthenticated ? (
              <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                <div className="px-4 text-sm text-gray-300" title={fullName}>{firstName}</div>
                <button
                  onClick={handleSignOut}
                  className="w-full min-h-[48px] bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg transition-colors font-medium touch-manipulation"
                >
                  {t('auth.logout')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center min-h-[48px] bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg transition-colors font-semibold mt-4 touch-manipulation"
              >
                {t('auth.login')}
              </Link>
            )}
            <button
              onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }}
              className="flex items-center min-h-[48px] px-4 rounded-lg border border-white/50 hover:bg-white/10 transition-colors font-medium touch-manipulation w-full mt-2"
            >
              {t('lang.label')} – {lang === 'es' ? t('lang.aria') : t('lang.ariaCurrent')}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
