'use client';

import { YouTubeContent } from '@/types';

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {videoId && thumbnailUrl ? (
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
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
          className="block bg-gradient-to-r from-red-600 via-red-500 to-rose-500 text-white"
        >
          <div className="px-6 py-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold">
              {channelInitial}
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-[0.16em] text-white/70 mb-1">
                Canal de YouTube
              </div>
              <div className="text-lg font-semibold truncate">
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
          className="block bg-gray-900 text-white"
        >
          <div className="px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-gray-400 mb-1">
                Enlace de YouTube
              </div>
              <div className="text-sm font-medium truncate max-w-[220px] sm:max-w-xs">
                {content.url}
              </div>
            </div>
            <span className="text-xs font-semibold border border-white/30 rounded-full px-3 py-1">
              Abrir
            </span>
          </div>
        </a>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-navy">{content.title}</h3>
        <p className="text-gray-text text-sm">{content.description}</p>
      </div>
    </div>
  );
};
