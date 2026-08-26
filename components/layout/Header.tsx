'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

type NavItem = { href: string; label: string };

export const Header = () => {
  const pathname = usePathname();
  const { user, userData, isAuthenticated, isAdmin, signOut } = useAuthContext();
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<'resources' | 'account' | null>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    setLang(lang === 'es' ? 'en' : 'es');
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDesktopMenu(null);
  }, [pathname]);

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

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!desktopNavRef.current?.contains(e.target as Node)) {
        setOpenDesktopMenu(null);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const handleSignOut = () => {
    setMobileMenuOpen(false);
    setOpenDesktopMenu(null);
    signOut();
  };

  const resourceLinks: NavItem[] = [
    { href: '/blog', label: t('nav.blogs') },
    { href: '/materiales', label: t('nav.materials') },
    { href: '/youtube', label: t('nav.youtube') },
  ];

  const topLinks: NavItem[] = [
    { href: '/', label: t('nav.home') },
    { href: '/eventos', label: t('nav.events') },
    { href: '/nosotros', label: t('nav.about') },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  const resourcesActive = resourceLinks.some((link) => isActive(link.href));

  const fullName = (userData?.displayName || user?.email || '').toString();
  const firstName = fullName.trim() ? fullName.split(/\s+/)[0] || fullName : '';

  const linkClass = (href: string) =>
    `hover:text-gray-300 transition-colors py-2 whitespace-nowrap text-sm lg:text-base ${
      isActive(href) ? 'text-gray-300 font-semibold' : ''
    }`;

  const dropdownItemClass = (href: string) =>
    `block w-full px-4 py-2.5 text-sm text-left hover:bg-navy/5 transition-colors ${
      isActive(href) ? 'text-navy font-semibold bg-navy/5' : 'text-gray-800'
    }`;

  return (
    <header
      className="bg-navy text-white shadow-lg sticky top-0 z-50"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="container mx-auto px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-3 min-h-[48px] sm:min-h-[56px]">
          <Link
            href="/"
            className="flex items-center min-h-[44px] text-base sm:text-xl md:text-2xl font-bold hover:text-gray-300 transition-colors shrink-0 tracking-wide"
            aria-label="Fe Firme - Inicio"
            style={{ letterSpacing: '0.05em', maxWidth: '7cm' }}
          >
            #APOLOGÉTICA
          </Link>

          <div ref={desktopNavRef} className="hidden md:flex items-center gap-3 lg:gap-4 ml-auto min-w-0">
            <nav className="flex items-center gap-3 lg:gap-5 flex-nowrap">
              {topLinks.slice(0, 1).map((link) => (
                <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                  {link.label}
                </Link>
              ))}

              {/* Recursos dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDesktopMenu((prev) => (prev === 'resources' ? null : 'resources'))
                  }
                  className={`inline-flex items-center gap-1 py-2 whitespace-nowrap text-sm lg:text-base hover:text-gray-300 transition-colors ${
                    resourcesActive || openDesktopMenu === 'resources'
                      ? 'text-gray-300 font-semibold'
                      : ''
                  }`}
                  aria-expanded={openDesktopMenu === 'resources'}
                  aria-haspopup="true"
                >
                  {t('nav.resources')}
                  <FiChevronDown
                    size={16}
                    className={`transition-transform ${openDesktopMenu === 'resources' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openDesktopMenu === 'resources' && (
                  <div className="absolute left-0 top-full mt-2 w-52 rounded-lg bg-white shadow-xl border border-gray-100 overflow-hidden z-50">
                    {resourceLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpenDesktopMenu(null)}
                        className={dropdownItemClass(link.href)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {topLinks.slice(1).map((link) => (
                <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                  {link.label}
                </Link>
              ))}

              <button
                onClick={toggleLanguage}
                className="px-3 py-2 rounded border border-white/50 hover:bg-white/10 transition-colors min-h-touch text-sm font-medium shrink-0"
                aria-label={lang === 'es' ? t('lang.aria') : t('lang.ariaCurrent')}
                title={lang === 'es' ? t('lang.aria') : t('lang.ariaCurrent')}
              >
                {t('lang.label')}
              </button>

              {/* Cuenta / Login */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDesktopMenu((prev) => (prev === 'account' ? null : 'account'))
                    }
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded border border-white/40 hover:bg-white/10 transition-colors min-h-touch text-sm font-medium ${
                      openDesktopMenu === 'account' ? 'bg-white/10' : ''
                    }`}
                    aria-expanded={openDesktopMenu === 'account'}
                    aria-haspopup="true"
                    title={fullName}
                  >
                    <span className="max-w-[6.5rem] truncate">{firstName || t('nav.account')}</span>
                    <FiChevronDown
                      size={16}
                      className={`transition-transform ${openDesktopMenu === 'account' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openDesktopMenu === 'account' && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white shadow-xl border border-gray-100 overflow-hidden z-50">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setOpenDesktopMenu(null)}
                          className="block w-full px-4 py-2.5 text-sm text-navy font-semibold hover:bg-navy/5"
                        >
                          {t('auth.admin')}
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="block w-full px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50"
                      >
                        {t('auth.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 px-3 lg:px-4 py-2 rounded transition-colors min-h-touch inline-flex items-center whitespace-nowrap text-sm"
                >
                  {t('auth.login')}
                </Link>
              )}
            </nav>

            <Link
              href="/"
              className="flex items-center shrink-0 hover:opacity-90 transition-opacity bg-transparent"
              aria-label="Oasis Fe Firme - Inicio"
            >
              <Image
                src="/logo-oasis-fe-firme.png"
                alt="Oasis Fe Firme"
                width={180}
                height={60}
                className="h-12 w-auto object-contain object-right bg-transparent"
                style={{ background: 'transparent' }}
                priority
              />
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-1 ml-auto shrink-0">
            <Link
              href="/"
              className="flex items-center shrink-0 hover:opacity-90 transition-opacity bg-transparent"
              aria-label="Oasis Fe Firme - Inicio"
            >
              <Image
                src="/logo-oasis-fe-firme.png"
                alt="Oasis Fe Firme"
                width={96}
                height={36}
                className="h-9 w-auto object-contain bg-transparent"
                style={{ background: 'transparent' }}
              />
            </Link>
            <button
              aria-label={mobileMenuOpen ? t('auth.closeMenu') : t('auth.openMenu')}
              aria-expanded={mobileMenuOpen}
              className="text-white p-3 -mr-1 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top)+3.5rem)] bg-navy z-40 transform transition-all duration-200 ease-out ${
          mobileMenuOpen
            ? 'opacity-100 translate-x-0 visible'
            : 'opacity-0 translate-x-full pointer-events-none invisible'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <nav className="overflow-y-auto h-full px-4 py-4 overscroll-contain">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center min-h-[48px] px-4 rounded-lg hover:bg-white/10 touch-manipulation ${
              isActive('/') ? 'text-gray-300 font-semibold bg-white/5' : ''
            }`}
          >
            {t('nav.home')}
          </Link>

          <p className="px-4 pt-4 pb-1 text-xs uppercase tracking-wider text-white/50">
            {t('nav.resources')}
          </p>
          {resourceLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center min-h-[48px] px-4 rounded-lg hover:bg-white/10 touch-manipulation ${
                isActive(link.href) ? 'text-gray-300 font-semibold bg-white/5' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}

          <p className="px-4 pt-4 pb-1 text-xs uppercase tracking-wider text-white/50">
            {t('nav.about')}
          </p>
          <Link
            href="/eventos"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center min-h-[48px] px-4 rounded-lg hover:bg-white/10 touch-manipulation ${
              isActive('/eventos') ? 'text-gray-300 font-semibold bg-white/5' : ''
            }`}
          >
            {t('nav.events')}
          </Link>
          <Link
            href="/nosotros"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center min-h-[48px] px-4 rounded-lg hover:bg-white/10 touch-manipulation ${
              isActive('/nosotros') ? 'text-gray-300 font-semibold bg-white/5' : ''
            }`}
          >
            {t('nav.about')}
          </Link>

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
              <div className="px-4 text-sm text-gray-300 truncate" title={fullName}>{firstName}</div>
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
            onClick={() => {
              toggleLanguage();
              setMobileMenuOpen(false);
            }}
            className="flex items-center min-h-[48px] px-4 rounded-lg border border-white/50 hover:bg-white/10 transition-colors font-medium touch-manipulation w-full mt-2"
          >
            {t('lang.label')} – {lang === 'es' ? t('lang.aria') : t('lang.ariaCurrent')}
          </button>
        </nav>
      </div>
    </header>
  );
};
