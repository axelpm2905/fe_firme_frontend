import { api } from './api';
import type { Comment } from '@/types';

const toComment = (c: Record<string, unknown>): Comment => ({
  id: String(c.id),
  blogId: String(c.blogId),
  userId: String(c.userId),
  userEmail: c.userEmail as string,
  userName: c.userName as string,
  content: c.content as string,
  approved: c.approved as boolean,
  createdAt: c.createdAt as string,
});

export const getComments = async (
  blogId?: string,
  approvedOnly = true
): Promise<Comment[]> => {
  const params = new URLSearchParams();
  if (blogId) params.set('blogId', blogId);
  params.set('approvedOnly', String(approvedOnly));
  const data = await api<Record<string, unknown>[]>(`/api/comments?${params}`);
  return data.map(toComment);
};

export const createComment = async (
  comment: { blogId: string; content: string }
): Promise<string> => {
  const res = await api<{ id: string }>('/api/comments', {
    method: 'POST',
    body: JSON.stringify({
      blogId: parseInt(comment.blogId, 10),
      content: comment.content,
    }),
  });
  return res.id;
};

export const approveComment = async (id: string): Promise<void> => {
  await api(`/api/comments/${id}/approve`, { method: 'PATCH' });
};

export const deleteComment = async (id: string): Promise<void> => {
  await api(`/api/comments/${id}`, { method: 'DELETE' });
};
