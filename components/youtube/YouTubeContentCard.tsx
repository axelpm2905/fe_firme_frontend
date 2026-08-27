'use client';

import { YouTubeContent } from '@/types';
import { LinkifiedText } from '@/components/ui/LinkifiedText';

interface YouTubeContentCardProps {
  content: YouTubeContent;
}

export const YouTubeContentCard = ({ content }: YouTubeContentCardProps) => {
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const videoId = getYouTubeVideoId(content.url);
  const isChannelUrl =
    content.url.includes('youtube.com/@') || content.url.includes('youtube.com/channel/');

  const channelHandleMatch = content.url.match(/youtube\.com\/(@[A-Za-z0-9_\-]+)/);
  const channelHandle = channelHandleMatch ? channelHandleMatch[1] : null;
  const channelInitial = (channelHandle || content.title || 'Y').replace('@', '').charAt(0).toUpperCase();

  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl active:scale-[0.99] transition-all">
      {videoId && thumbnailUrl ? (
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block touch-manipulation"
        >
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={thumbnailUrl}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          </div>
        </a>
      ) : isChannelUrl ? (
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gradient-to-r from-red-600 via-red-500 to-rose-500 text-white touch-manipulation"
        >
          <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center text-lg sm:text-xl font-bold shrink-0">
              {channelInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.14em] text-white/70 mb-1">
                Contenido recomendado
              </div>
              <div className="text-base sm:text-lg font-semibold truncate">
                {channelHandle || content.title}
              </div>
            </div>
          </div>
        </a>
      ) : (
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gray-900 text-white touch-manipulation"
        >
          <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.14em] text-gray-400 mb-1">
                Enlace recomendado
              </div>
              <div className="text-sm font-medium truncate">{content.url}</div>
            </div>
            <span className="shrink-0 inline-flex items-center justify-center min-h-[36px] px-3 text-xs font-semibold border border-white/30 rounded-full">
              Abrir
            </span>
          </div>
        </a>
      )}
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-navy line-clamp-2">{content.title}</h3>
        <LinkifiedText
          text={content.description}
          className="text-gray-text text-sm line-clamp-3 whitespace-pre-wrap"
        />
      </div>
    </div>
  );
};
