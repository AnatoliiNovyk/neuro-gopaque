import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Music } from 'lucide-react';
import { useTracks } from '../hooks/useTracks';

interface SoundCloudPlayerProps {
  trackUrl?: string;
  title?: string;
  imageUrl?: string;
  description?: string;
}

// Function to extract track ID or full URL from SoundCloud URL
const getSoundCloudEmbedUrl = (url: string): string => {
  // If it's already a full SoundCloud URL, encode it for the embed
  if (url.includes('soundcloud.com/')) {
    const encodedUrl = encodeURIComponent(url);
    return `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23a855f7&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
  }
  
  // If it's just an ID, construct the API URL
  const encodedUrl = encodeURIComponent(`https://api.soundcloud.com/tracks/${url}`);
  return `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23a855f7&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
};

export default function SoundCloudPlayer({ 
  trackUrl, 
  title, 
  imageUrl, 
  description 
}: SoundCloudPlayerProps) {
  const { tracks, loading } = useTracks();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  // Filter tracks that have SoundCloud URLs
  const validTracks = tracks.filter(track => 
    track.soundcloud_url && 
    track.soundcloud_url.trim() !== '' &&
    (track.soundcloud_url.includes('soundcloud.com') || /^\d+$/.test(track.soundcloud_url))
  );

  if (validTracks.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Music className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-4">
          Треків поки що немає
        </h3>
        <p className="text-gray-300 mb-6">
          Додайте SoundCloud треки через адмін панель для їх відображення тут
        </p>
        <a 
          href="/admin" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Перейти до адмін панелі
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          🎵 SoundCloud Плеєр
        </h2>
        <p className="text-gray-300">
          Слухайте мої треки прямо з SoundCloud
        </p>
      </motion.div>

      {validTracks.map((track, index) => (
        <motion.div
          key={track.id}
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          {/* Track Header */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {track.title}
                </h3>
                {track.description && (
                  <p className="text-gray-400 text-sm">
                    {track.description}
                  </p>
                )}
              </div>
              <motion.a
                href={track.soundcloud_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-4 h-4" />
                <span>SoundCloud</span>
              </motion.a>
            </div>
          </div>

          {/* SoundCloud Embed */}
          <div className="p-6">
            <div className="bg-gray-900/50 rounded-xl p-4">
              <iframe
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={getSoundCloudEmbedUrl(track.soundcloud_url)}
                className="rounded-lg"
                title={`SoundCloud player for ${track.title}`}
              />
              
              {/* Custom styling for SoundCloud attribution */}
              <div className="mt-3 pt-3 border-t border-gray-700/30">
                <p className="text-xs text-gray-500 text-center">
                  Powered by{' '}
                  <a 
                    href="https://soundcloud.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    SoundCloud
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

    </div>
  );
}