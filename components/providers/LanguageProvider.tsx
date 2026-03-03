'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Language } from '@/lib/translations';
import { t } from '@/lib/translations';

const STORAGE_KEY = 'fe-firme-lang';

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  langLoading: boolean;
  t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'es',
  setLang: () => {},
  langLoading: false,
  t: (path) => path,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>('es');
  const [langLoading, setLangLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === 'es' || stored === 'en') {
      setLangState(stored);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, mounted]);

  const setLang = (newLang: Language) => {
    if (newLang === lang) return;
    setLangLoading(true);
    setLangState(newLang);
    setTimeout(() => setLangLoading(false), 450);
  };

  const translate = (path: string) => t(lang, path);

  return (
    <LanguageContext.Provider value={{ lang, setLang, langLoading, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};
