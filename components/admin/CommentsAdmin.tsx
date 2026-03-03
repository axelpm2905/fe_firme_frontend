'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getComments, approveComment, deleteComment } from '@/lib/comments';
import { Comment } from '@/types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiCheck, FiX } from 'react-icons/fi';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export const CommentsAdmin = () => {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [deleteModal, setDeleteModal] = useState<Comment | null>(null);
  const pathname = usePathname();

  const loadComments = async () => {
    try {
      const commentsData = await getComments(undefined, false);
      setComments(commentsData);
    } catch {
      toast.error('Error al cargar comentarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pathname === '/admin/comentarios') {
      loadComments();
    }
  }, [pathname]);

  const handleApprove = async (commentId: string) => {
    try {
      await approveComment(commentId);
      toast.success('Comentario aprobado');
      loadComments();
    } catch {
      toast.error('Error al aprobar comentario');
    }
  };

  const handleDeleteClick = (comment: Comment) => {
    setDeleteModal(comment);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    try {
      await deleteComment(deleteModal.id);
      toast.success('Comentario eliminado');
      setDeleteModal(null);
      loadComments();
    } catch {
      toast.error('Error al eliminar comentario');
      setDeleteModal(null);
    }
  };

  const filteredComments = comments.filter((comment) => {
    if (filter === 'pending') return !comment.approved;
    if (filter === 'approved') return comment.approved;
    return true;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <button
        type="button"
        onClick={() => router.push('/admin')}
        className="flex items-center gap-2 text-navy hover:text-navy-dark mb-6 transition-colors"
      >
        ← Volver atrás
      </button>
      <h1 className="text-4xl font-bold mb-8 text-navy">Moderar Comentarios</h1>

      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] ${
            filter === 'pending'
              ? 'bg-navy text-white'
              : 'bg-white text-navy border border-gray-300'
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] ${
            filter === 'approved'
              ? 'bg-navy text-white'
              : 'bg-white text-navy border border-gray-300'
          }`}
        >
          Aprobados
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] ${
            filter === 'all'
              ? 'bg-navy text-white'
              : 'bg-white text-navy border border-gray-300'
          }`}
        >
          Todos
        </button>
      </div>

      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-navy">{comment.userName}</h4>
                <p className="text-sm text-gray-text">{comment.userEmail}</p>
                <p className="text-xs text-gray-text mt-1">
                  {comment.createdAt &&
                    format(
                      comment.createdAt instanceof Date
                        ? comment.createdAt
                        : new Date(comment.createdAt),
                      'dd MMM yyyy, HH:mm',
                      { locale: es }
                    )}
                </p>
              </div>
              {!comment.approved && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  Pendiente
                </span>
              )}
            </div>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{comment.content}</p>
            {!comment.approved && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(comment.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 min-h-[44px]"
                >
                  <FiCheck />
                  <span>Aprobar</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(comment)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 min-h-[44px]"
                >
                  <FiX />
                  <span>Eliminar</span>
                </button>
              </div>
            )}
            {comment.approved && (
              <button
                onClick={() => handleDeleteClick(comment)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors min-h-[44px]"
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredComments.length === 0 && (
        <div className="text-center py-12 text-gray-text">
          <p>No hay comentarios {filter === 'pending' ? 'pendientes' : filter === 'approved' ? 'aprobados' : ''}.</p>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteModal}
        title="Eliminar comentario"
        message="¿Estás seguro de eliminar este comentario? Esta acción no se puede deshacer."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal(null)}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
};
