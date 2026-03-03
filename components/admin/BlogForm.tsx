'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { getBlogById, createBlog, updateBlog, uploadBlogImage } from '@/lib/blogs';
import { Blog } from '@/types';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface BlogFormProps {
  blogId?: string;
}

export const BlogForm = ({ blogId }: BlogFormProps) => {
  const router = useRouter();
  const { user, userData } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Apologética',
    commentsEnabled: true,
    featuredImage: '',
    slug: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (blogId) {
      loadBlog();
    }
  }, [blogId]);

  const loadBlog = async () => {
    try {
      const blogData = await getBlogById(blogId!); // FIREBASE ACTIVADO
      // const blogData = getMockBlogById(blogId!); // MODO MOCK DESACTIVADO
      if (blogData) {
        setFormData({
          title: blogData.title,
          content: blogData.content,
          category: blogData.category,
          commentsEnabled: blogData.commentsEnabled,
          featuredImage: blogData.featuredImage || '',
          slug: blogData.slug,
        });
        setImagePreview(blogData.featuredImage || '');
      }
    } catch (error: any) {
      toast.error('Error al cargar el blog');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let featuredImage = formData.featuredImage;

      // Subir imagen si hay una nueva
      if (imageFile) {
        featuredImage = await uploadBlogImage(imageFile);
      }

      const blogData = {
        ...formData,
        featuredImage,
        author: userData?.displayName || user?.email?.split('@')[0] || 'Admin',
        authorId: String(user!.id),
        slug: formData.slug || generateSlug(formData.title),
      };

      if (blogId) {
        await updateBlog(blogId, blogData); // FIREBASE ACTIVADO
        // updateMockBlog(blogId, blogData); // MODO MOCK DESACTIVADO
        toast.success('Blog actualizado exitosamente');
      } else {
        await createBlog(blogData); // FIREBASE ACTIVADO
        // createMockBlog(blogData); // MODO MOCK DESACTIVADO
        toast.success('Blog creado exitosamente');
      }

      router.push('/admin/blogs');
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar el blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <button
        type="button"
        onClick={() => router.push('/admin/blogs')}
        className="flex items-center gap-2 text-navy hover:text-navy-dark mb-6 transition-colors"
      >
        ← Volver atrás
      </button>
      <h1 className="text-4xl font-bold mb-8 text-navy">
        {blogId ? 'Editar Blog' : 'Nuevo Blog'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          >
            <option value="Apologética">Apologética</option>
            <option value="Doctrina">Doctrina</option>
            <option value="Estudio Bíblico">Estudio Bíblico</option>
            <option value="Defensa de la Fe">Defensa de la Fe</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen Destacada
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {imagePreview && (
            <div className="mt-4">
              <img src={imagePreview} alt="Preview" className="max-w-md h-auto rounded-lg" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido *
          </label>
          <ReactQuill
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            theme="snow"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                ['clean'],
              ],
            }}
            className="bg-white"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.commentsEnabled}
              onChange={(e) =>
                setFormData({ ...formData, commentsEnabled: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Habilitar comentarios
            </span>
          </label>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : blogId ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/blogs')}
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
