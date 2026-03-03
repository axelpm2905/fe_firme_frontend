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
  const path = limit ? `/api/blogs?limit=${limit}` : '/api/blogs';
  const data = await api<Record<string, unknown>[]>(path);
  return data.map(toBlog);
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
    body: JSON.stringify(updates),
  });
};

export const deleteBlog = async (id: string): Promise<void> => {
  await api(`/api/blogs/${id}`, { method: 'DELETE' });
};

export const uploadBlogImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Error al leer la imagen'));
    reader.readAsDataURL(file);
  });
};
