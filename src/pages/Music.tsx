import React from 'react';
import { motion } from 'framer-motion';
import { Music as MusicIcon, Headphones } from 'lucide-react';
import { useTracks } from '../hooks/useTracks';
import SoundCloudPlayer from '../components/SoundCloudPlayer';

export default function Music() {
  const { tracks, loading } = useTracks();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-16">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 mb-16"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-6">
                <Headphones className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Моя Музика
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Колекція оригінальних треків, що поєднують електронну музику з сучасними ритмами
            </p>
          </motion.div>

          {/* Featured Track */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-8 flex items-center justify-center">
              <MusicIcon className="w-6 h-6 mr-2 text-purple-400" />
              Популярні треки
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <SoundCloudPlayer
                    trackUrl={track.soundcloud_url}
                    title={track.title}
                    imageUrl={track.image_url}
                    description={track.description}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SoundCloud Profile Link */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a
              href="https://soundcloud.com/alexnova"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors duration-200"
            >
              <MusicIcon className="w-5 h-5" />
              <span>Більше на SoundCloud</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}