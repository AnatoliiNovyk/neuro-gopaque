import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useBlog } from '../hooks/useBlog';

export default function Blog() {
  const { posts, loading } = useBlog();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-16">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Новини та Блог
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Останні новини, думки про музику та життя за лаштунками
            </p>
          </motion.div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Post Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image_url || 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                </div>

                {/* Post Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Alex Nova</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-200">
                    {post.title}
                  </h2>

                  <p className="text-gray-300 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <motion.button
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-medium group/btn"
                    whileHover={{ x: 5 }}
                  >
                    <span>Читати далі</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More Button */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <button className="px-8 py-3 border-2 border-purple-500 text-purple-400 font-semibold rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300">
              Завантажити більше
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}