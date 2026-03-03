'use client';

import { Comment } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CommentsListProps {
  comments: Comment[];
}

export const CommentsList = ({ comments }: CommentsListProps) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-text">
        <p>No hay comentarios aún. Sé el primero en comentar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-light p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-navy">{comment.userName}</h4>
            <span className="text-xs text-gray-text">
              {comment.createdAt && format(
                comment.createdAt instanceof Date ? comment.createdAt : (comment.createdAt?.toDate ? comment.createdAt.toDate() : new Date(comment.createdAt)),
                'dd MMM yyyy, HH:mm',
                { locale: es }
              )}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};
