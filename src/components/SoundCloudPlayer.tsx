import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';

interface SoundCloudPlayerProps {
  trackUrl: string;
  title: string;
  imageUrl?: string;
  description?: string;
}

export default function SoundCloudPlayer({ 
  trackUrl, 
  title, 
  imageUrl, 
  description 
}: SoundCloudPlayerProps) {
  // Extract track ID from SoundCloud URL for embedding
  const getEmbedUrl = (url: string) => {
    // For demo purposes, we'll use a placeholder embed
    // In production, you'd extract the actual track ID
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%238b5cf6&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
  };

  return (
    <motion.div 
      className="bg-gray-800 rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Track Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={imageUrl || 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
          {description && (
            <p className="text-gray-300 text-sm line-clamp-2">{description}</p>
          )}
        </div>
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-6 h-6 text-white ml-1" />
          </motion.button>
        </div>
      </div>

      {/* SoundCloud Embed */}
      <div className="p-4">
        <iframe
          width="100%"
          height="120"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={getEmbedUrl(trackUrl)}
          className="rounded-lg"
        ></iframe>
        
        <div className="mt-3 flex justify-between items-center">
          <a
            href={trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm font-medium">Відкрити в SoundCloud</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}