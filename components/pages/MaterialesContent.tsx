'use client';

import { MaterialCard } from '@/components/materials/MaterialCard';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { Material } from '@/types';

export function MaterialesContent({ materials }: { materials: Material[] }) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-navy">
        {t('pages.materials')}
      </h1>
      <p className="text-base sm:text-lg text-gray-text mb-6 sm:mb-8">{t('pages.materialsDesc')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {materials.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </div>

      {materials.length === 0 && (
        <div className="text-center py-12 text-gray-text">
          <p>{t('pages.materialsEmpty')}</p>
        </div>
      )}
    </main>
  );
}
