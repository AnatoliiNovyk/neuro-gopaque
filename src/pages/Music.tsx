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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="max-w-4xl mx-auto">
              <SoundCloudPlayer />
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}