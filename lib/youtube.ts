import { api } from './api';
import type { YouTubeContent } from '@/types';

const toYouTubeContent = (y: Record<string, unknown>): YouTubeContent => ({
  id: String(y.id),
  title: y.title as string,
  description: (y.description as string) || '',
  url: y.url as string,
  createdAt: y.createdAt as string,
  updatedAt: y.updatedAt as string | undefined,
});

export const getYouTubeContents = async (): Promise<YouTubeContent[]> => {
  const data = await api<Record<string, unknown>[]>('/api/youtube');
  return data.map(toYouTubeContent);
};

export const getYouTubeContent = async (
  id: string
): Promise<YouTubeContent | null> => {
  try {
    const data = await api<Record<string, unknown>>(`/api/youtube/${id}`);
    return toYouTubeContent(data);
  } catch {
    return null;
  }
};

export const createYouTubeContent = async (
  content: Omit<YouTubeContent, 'id' | 'createdAt'>
): Promise<string> => {
  const res = await api<{ id: string }>('/api/youtube', {
    method: 'POST',
    body: JSON.stringify(content),
  });
  return res.id;
};

export const updateYouTubeContent = async (
  id: string,
  updates: Partial<YouTubeContent>
): Promise<void> => {
  await api(`/api/youtube/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const deleteYouTubeContent = async (id: string): Promise<void> => {
  await api(`/api/youtube/${id}`, { method: 'DELETE' });
};
