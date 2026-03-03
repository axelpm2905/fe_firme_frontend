'use client';

import { useAuthContext } from '@/components/providers/AuthProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';

export const AuthLoadingOverlay = () => {
  const { loading } = useAuthContext();
  const { langLoading, t } = useLanguage();

  if (!loading && !langLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/90 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent"
          aria-hidden
        />
        <span className="text-white text-sm font-medium">{t('common.loading')}</span>
      </div>
    </div>
  );
};
