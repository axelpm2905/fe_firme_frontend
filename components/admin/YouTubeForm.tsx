'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getYouTubeContent, createYouTubeContent, updateYouTubeContent } from '@/lib/youtube';
// import { getMockYouTubeContent, createMockYouTubeContent, updateMockYouTubeContent } from '@/lib/mock/data'; // MODO MOCK DESACTIVADO
import { YouTubeContent } from '@/types';
import toast from 'react-hot-toast';

interface YouTubeFormProps {
  contentId?: string;
}

export const YouTubeForm = ({ contentId }: YouTubeFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
  });

  useEffect(() => {
    if (contentId) {
      loadContent();
    }
  }, [contentId]);

  const loadContent = async () => {
    try {
      const content = await getYouTubeContent(contentId!); // FIREBASE ACTIVADO
      // const content = getMockYouTubeContent(contentId!); // MODO MOCK DESACTIVADO
      if (content) {
        setFormData({
          title: content.title,
          description: content.description,
          url: content.url,
        });
      }
    } catch (error: any) {
      toast.error('Error al cargar el contenido');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (contentId) {
        await updateYouTubeContent(contentId, formData); // FIREBASE ACTIVADO
        // updateMockYouTubeContent(contentId, formData); // MODO MOCK DESACTIVADO
        toast.success('Contenido actualizado exitosamente');
      } else {
        await createYouTubeContent(formData); // FIREBASE ACTIVADO
        // createMockYouTubeContent(formData); // MODO MOCK DESACTIVADO
        toast.success('Contenido creado exitosamente');
      }

      router.push('/admin/youtube');
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar el contenido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <button
        type="button"
        onClick={() => router.push('/admin/youtube')}
        className="flex items-center gap-2 text-navy hover:text-navy-dark mb-6 transition-colors"
      >
        ← Volver atrás
      </button>
      <h1 className="text-4xl font-bold mb-8 text-navy">
        {contentId ? 'Editar Contenido YouTube' : 'Nuevo Contenido YouTube'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL (canal o video de YouTube) *
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
            placeholder="https://www.youtube.com/..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : contentId ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/youtube')}
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
