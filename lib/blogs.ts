import { api } from './api';
import type { Blog } from '@/types';

const toBlog = (b: Record<string, unknown>): Blog => ({
  id: String(b.id),
  title: b.title as string,
  slug: b.slug as string,
  content: b.content as string,
  featuredImage: (b.featuredImage as string) || '',
  category: b.category as string,
  author: b.author as string,
  authorId: String(b.authorId),
  commentsEnabled: b.commentsEnabled as boolean,
  createdAt: b.createdAt as string,
  updatedAt: b.updatedAt as string | undefined,
});

export const getBlogs = async (limit?: number): Promise<Blog[]> => {
  try {
    const path = limit ? `/api/blogs?limit=${limit}` : '/api/blogs';
    const data = await api<Record<string, unknown>[]>(path);
    return data.map(toBlog);
  } catch {
    return [];
  }
};

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  try {
    const data = await api<Record<string, unknown>>(`/api/blogs/slug/${encodeURIComponent(slug)}`);
    return toBlog(data);
  } catch {
    return null;
  }
};

export const getBlogById = async (id: string): Promise<Blog | null> => {
  try {
    const data = await api<Record<string, unknown>>(`/api/blogs/${id}`);
    return toBlog(data);
  } catch {
    return null;
  }
};

export const createBlog = async (
  blog: Omit<Blog, 'id' | 'createdAt'>
): Promise<string> => {
  const res = await api<{ id: string }>('/api/blogs', {
    method: 'POST',
    body: JSON.stringify({
      title: blog.title,
      content: blog.content,
      category: blog.category,
      featuredImage: blog.featuredImage || null,
      commentsEnabled: blog.commentsEnabled,
      slug: blog.slug,
    }),
  });
  return res.id;
};

export const updateBlog = async (
  id: string,
  updates: Partial<Blog>
): Promise<void> => {
  await api(`/api/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: updates.title,
      content: updates.content,
      category: updates.category,
      featuredImage: updates.featuredImage ?? null,
      commentsEnabled: updates.commentsEnabled,
      slug: updates.slug,
    }),
  });
};

export const deleteBlog = async (id: string): Promise<void> => {
  await api(`/api/blogs/${id}`, { method: 'DELETE' });
};

/** Comprime la imagen a JPEG base64 para no superar el límite del API */
export const uploadBlogImage = async (file: File): Promise<string> => {
  const MAX_WIDTH = 1400;
  const QUALITY = 0.72;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo debe ser una imagen.'));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error('La imagen no puede superar 8 MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer la imagen'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo procesar la imagen'));
      img.onload = () => {
        const scale = Math.min(1, MAX_WIDTH / img.width);
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo procesar la imagen'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};
