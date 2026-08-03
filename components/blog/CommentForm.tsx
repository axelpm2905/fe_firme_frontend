'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { createComment } from '@/lib/comments';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface CommentFormProps {
  blogId: string;
}

export const CommentForm = ({ blogId }: CommentFormProps) => {
  const { user, userData, isAuthenticated } = useAuthContext();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para comentar');
      return;
    }

    if (!content.trim()) {
      toast.error('El comentario no puede estar vacío');
      return;
    }

    setLoading(true);

    try {
      await createComment({ blogId, content: content.trim() });

      toast.success('Comentario enviado. Está pendiente de aprobación.');
      setContent('');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar el comentario');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-light p-4 sm:p-6 rounded-lg text-center">
        <p className="text-gray-text mb-4 text-sm sm:text-base">
          Debes iniciar sesión para comentar
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center min-h-[48px] bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-dark active:scale-95 transition-all font-semibold touch-manipulation"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu comentario..."
        rows={4}
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent mb-4"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="min-h-[48px] bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-dark active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
      >
        {loading ? 'Enviando...' : 'Enviar comentario'}
      </button>
    </form>
  );
};
