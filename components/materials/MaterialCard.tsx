'use client';

import { Material } from '@/types';
import { useAuthContext } from '@/components/providers/AuthProvider';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiDownload, FiLock } from 'react-icons/fi';
import { LinkifiedText } from '@/components/ui/LinkifiedText';

interface MaterialCardProps {
  material: Material;
}

export const MaterialCard = ({ material }: MaterialCardProps) => {
  const { isAuthenticated } = useAuthContext();

  const handleDownload = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para descargar materiales');
      return;
    }

    const link = document.createElement('a');
    link.href = material.pdfUrl;
    link.target = '_blank';
    link.download = `${material.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl active:scale-[0.98] transition-all">
      {material.image && (
        <div className="relative h-48 w-full">
          <Image
            src={material.image}
            alt={material.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-navy line-clamp-2">{material.title}</h3>
        <LinkifiedText
          text={material.description}
          className="text-gray-text text-sm mb-4 line-clamp-3 whitespace-pre-wrap"
        />
        {isAuthenticated ? (
          <button
            onClick={handleDownload}
            className="w-full min-h-[48px] bg-navy text-white py-3 px-4 rounded-lg hover:bg-navy-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2 touch-manipulation"
          >
            <FiDownload size={18} />
            <span>Descargar PDF</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="w-full min-h-[48px] bg-gray-400 text-white py-3 px-4 rounded-lg hover:bg-gray-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 touch-manipulation text-sm sm:text-base"
          >
            <FiLock />
            <span>Inicia sesión para descargar</span>
          </Link>
        )}
      </div>
    </div>
  );
};
