'use client';

import Link from 'next/link';
import { FiBook, FiFileText, FiYoutube, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { useLanguage } from '@/components/providers/LanguageProvider';

export const AdminDashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-navy">{t('admin.dashboard')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link
          href="/admin/blogs"
          className="bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-xl active:scale-[0.98] transition-all min-h-[140px] flex flex-col justify-center touch-manipulation"
        >
          <FiBook className="text-4xl text-navy mb-4" />
          <h2 className="text-xl font-bold mb-2 text-navy">Blogs</h2>
          <p className="text-gray-text">{t('admin.manageBlogs')}</p>
        </Link>

        <Link
          href="/admin/materiales"
          className="bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-xl active:scale-[0.98] transition-all min-h-[140px] flex flex-col justify-center touch-manipulation"
        >
          <FiFileText className="text-4xl text-navy mb-4" />
          <h2 className="text-xl font-bold mb-2 text-navy">Materiales</h2>
          <p className="text-gray-text">{t('admin.manageMaterials')}</p>
        </Link>

        <Link
          href="/admin/youtube"
          className="bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-xl active:scale-[0.98] transition-all min-h-[140px] flex flex-col justify-center touch-manipulation"
        >
          <FiYoutube className="text-4xl text-navy mb-4" />
          <h2 className="text-xl font-bold mb-2 text-navy">Contenido Recomendado</h2>
          <p className="text-gray-text">{t('admin.manageYouTube')}</p>
        </Link>

        <Link
          href="/admin/eventos"
          className="bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-xl active:scale-[0.98] transition-all min-h-[140px] flex flex-col justify-center touch-manipulation"
        >
          <FiCalendar className="text-4xl text-navy mb-4" />
          <h2 className="text-xl font-bold mb-2 text-navy">Eventos</h2>
          <p className="text-gray-text">{t('admin.manageEvents')}</p>
        </Link>

        <Link
          href="/admin/comentarios"
          className="bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-xl active:scale-[0.98] transition-all min-h-[140px] flex flex-col justify-center touch-manipulation"
        >
          <FiMessageSquare className="text-4xl text-navy mb-4" />
          <h2 className="text-xl font-bold mb-2 text-navy">Comentarios</h2>
          <p className="text-gray-text">{t('admin.moderateComments')}</p>
        </Link>
      </div>
    </div>
  );
};
