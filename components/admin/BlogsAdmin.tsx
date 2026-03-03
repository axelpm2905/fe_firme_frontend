'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getBlogs, deleteBlog } from '@/lib/blogs';
import { Blog } from '@/types';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export const BlogsAdmin = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<Blog | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const loadBlogs = async () => {
    try {
      const blogsData = await getBlogs();
      setBlogs(blogsData);
    } catch {
      toast.error('Error al cargar blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pathname === '/admin/blogs') {
      loadBlogs();
    }
  }, [pathname]);

  const handleDeleteClick = (e: React.MouseEvent, blog: Blog) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal(blog);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    try {
      await deleteBlog(deleteModal.id);
      toast.success('Blog eliminado');
      setDeleteModal(null);
      loadBlogs();
    } catch {
      toast.error('Error al eliminar blog');
      setDeleteModal(null);
    }
  };

  const formatDate = (d: unknown) => {
    if (!d) return '';
    const date = d instanceof Date ? d : (d as { toDate?: () => Date })?.toDate?.() ?? new Date(d as string);
    return format(date, 'dd MMM yyyy', { locale: es });
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy">Gestionar Blogs</h1>
        <Link
          href="/admin/blogs/nuevo"
          className="inline-flex items-center justify-center min-h-[48px] bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-dark active:scale-95 transition-all font-semibold w-full sm:w-auto touch-manipulation"
        >
          <FiPlus className="mr-2" size={20} />
          Nuevo Blog
        </Link>
      </div>

      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-6 py-4 text-left">Título</th>
              <th className="px-6 py-4 text-left">Categoría</th>
              <th className="px-6 py-4 text-left">Fecha</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                onClick={() => router.push(`/admin/blogs/${blog.id}`)}
                className="border-t hover:bg-gray-light cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">{blog.title}</td>
                <td className="px-6 py-4">{blog.category}</td>
                <td className="px-6 py-4">{formatDate(blog.createdAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/blogs/${blog.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center text-blue-600 hover:text-blue-800 rounded"
                      aria-label="Editar"
                    >
                      <FiEdit size={20} />
                    </Link>
                    <button
                      onClick={(e) => handleDeleteClick(e, blog)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center text-red-600 hover:text-red-800 rounded"
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
        {blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => router.push(`/admin/blogs/${blog.id}`)}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 cursor-pointer hover:border-navy/30 transition-colors active:scale-[0.99]"
          >
            <h3 className="font-semibold text-navy mb-1 line-clamp-2">{blog.title}</h3>
            <div className="flex items-center justify-between text-sm text-gray-text mb-4">
              <span>{blog.category}</span>
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/blogs/${blog.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 bg-navy text-white rounded-lg font-medium"
              >
                <FiEdit size={18} />
                Editar
              </Link>
              <button
                onClick={(e) => handleDeleteClick(e, blog)}
                className="min-h-[44px] px-4 flex items-center justify-center text-red-600 border border-red-600 rounded-lg font-medium"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-12 text-gray-text bg-white rounded-lg">
          <p className="mb-4">No hay blogs aún.</p>
          <Link
            href="/admin/blogs/nuevo"
            className="inline-flex items-center justify-center min-h-[48px] bg-navy text-white px-6 py-3 rounded-lg"
          >
            <FiPlus className="mr-2" /> Crear primer blog
          </Link>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteModal}
        title="Eliminar blog"
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
