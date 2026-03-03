'use client';

import { YouTubeContent } from '@/types';

interface YouTubeContentCardProps {
  content: YouTubeContent;
}

export const YouTubeContentCard = ({ content }: YouTubeContentCardProps) => {
  // Extraer ID del video de YouTube
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const videoId = getYouTubeVideoId(content.url);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {embedUrl ? (
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl}
            title={content.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video bg-gray-200 flex items-center justify-center">
          <a
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Ver en YouTube
          </a>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-navy">{content.title}</h3>
        <p className="text-gray-text text-sm">{content.description}</p>
      </div>
    </div>
  );
};
