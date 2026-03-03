'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getYouTubeContents, deleteYouTubeContent } from '@/lib/youtube';
import { YouTubeContent } from '@/types';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export const YouTubeAdmin = () => {
  const [contents, setContents] = useState<YouTubeContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<YouTubeContent | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const loadContents = async () => {
    try {
      const contentsData = await getYouTubeContents();
      setContents(contentsData);
    } catch {
      toast.error('Error al cargar contenido de YouTube');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pathname === '/admin/youtube') {
      loadContents();
    }
  }, [pathname]);

  const handleDeleteClick = (e: React.MouseEvent, content: YouTubeContent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal(content);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    try {
      await deleteYouTubeContent(deleteModal.id);
      toast.success('Contenido eliminado');
      setDeleteModal(null);
      loadContents();
    } catch {
      toast.error('Error al eliminar');
      setDeleteModal(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <button
        type="button"
        onClick={() => router.push('/admin')}
        className="flex items-center gap-2 text-navy hover:text-navy-dark mb-6 transition-colors"
      >
        ← Volver atrás
      </button>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy">Gestionar YouTube</h1>
        <Link
          href="/admin/youtube/nuevo"
          className="inline-flex items-center justify-center min-h-[48px] bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-dark w-full sm:w-auto touch-manipulation"
        >
          <FiPlus className="mr-2" size={20} />
          Nuevo Contenido
        </Link>
      </div>

      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-6 py-4 text-left">Título</th>
              <th className="px-6 py-4 text-left">URL</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((content) => (
              <tr
                key={content.id}
                onClick={() => router.push(`/admin/youtube/${content.id}`)}
                className="border-t hover:bg-gray-light cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">{content.title}</td>
                <td className="px-6 py-4">
                  <a
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:underline truncate block max-w-xs"
                  >
                    {content.url}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/youtube/${content.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center text-blue-600 rounded hover:bg-blue-50"
                      aria-label="Editar"
                    >
                      <FiEdit size={20} />
                    </Link>
                    <button
                      onClick={(e) => handleDeleteClick(e, content)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center text-red-600 rounded hover:bg-red-50"
                      aria-label="Eliminar"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {contents.map((content) => (
          <div
            key={content.id}
            onClick={() => router.push(`/admin/youtube/${content.id}`)}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 cursor-pointer hover:border-navy/30 transition-colors active:scale-[0.99]"
          >
            <h3 className="font-semibold text-navy mb-1">{content.title}</h3>
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-blue-600 truncate block mb-4"
            >
              Ver en YouTube
            </a>
            <div className="flex gap-2">
              <Link
                href={`/admin/youtube/${content.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 bg-navy text-white rounded-lg font-medium"
              >
                <FiEdit size={18} /> Editar
              </Link>
              <button
                onClick={(e) => handleDeleteClick(e, content)}
                className="min-h-[44px] px-4 flex items-center justify-center text-red-600 border border-red-600 rounded-lg font-medium"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {contents.length === 0 && (
        <div className="text-center py-12 text-gray-text bg-white rounded-lg">
          <p className="mb-4">No hay contenido de YouTube aún.</p>
          <Link
            href="/admin/youtube/nuevo"
            className="inline-flex items-center justify-center min-h-[48px] bg-navy text-white px-6 py-3 rounded-lg"
          >
            <FiPlus className="mr-2" /> Agregar contenido
          </Link>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteModal}
        title="Eliminar contenido"
        message={deleteModal ? `¿Eliminar "${deleteModal.title}"? Esta acción no se puede deshacer.` : ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal(null)}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
};
