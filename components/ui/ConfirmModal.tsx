'use client';

import { useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
}: ConfirmModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              isDanger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            <FiAlertTriangle size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="modal-title" className="text-lg font-semibold text-navy mb-1">
              {title}
            </h2>
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onCancel}
            className="min-h-[44px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors touch-manipulation"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`min-h-[44px] px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation ${
              isDanger
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
