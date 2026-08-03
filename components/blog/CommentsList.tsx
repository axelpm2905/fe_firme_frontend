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
      <div className="text-center py-8 text-gray-text px-2">
        <p>No hay comentarios aún. Sé el primero en comentar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-light p-4 sm:p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
            <h4 className="font-semibold text-navy break-words">{comment.userName}</h4>
            <span className="text-xs text-gray-text shrink-0">
              {comment.createdAt &&
                format(
                  comment.createdAt instanceof Date
                    ? comment.createdAt
                    : comment.createdAt?.toDate
                      ? comment.createdAt.toDate()
                      : new Date(comment.createdAt),
                  'dd MMM yyyy, HH:mm',
                  { locale: es }
                )}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap break-words text-sm sm:text-base">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
};
