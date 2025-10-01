import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Music, FileText, User, Save } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('tracks');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const tabs = [
    { id: 'tracks', label: 'Треки', icon: Music },
    { id: 'blog', label: 'Блог', icon: FileText },
    { id: 'profile', label: 'Профіль', icon: User }
  ];

  const mockTracks = [
    { id: '1', title: 'Midnight Dreams', soundcloud_url: 'https://soundcloud.com/track1' },
    { id: '2', title: 'Electric Pulse', soundcloud_url: 'https://soundcloud.com/track2' }
  ];

  const mockPosts = [
    { id: '1', title: 'Новий альбом "Digital Dreams"', published: true },
    { id: '2', title: 'Концерт у Києві', published: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-16">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Адміністрування
            </h1>
            <p className="text-lg text-gray-300">
              Управління контентом сайту
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex space-x-1 mb-8 bg-gray-700/50 rounded-lg p-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'tracks' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Управління треками</h2>
                    <motion.button
                      onClick={() => setIsAddingNew(!isAddingNew)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Додати трек</span>
                    </motion.button>
                  </div>

                  {isAddingNew && (
                    <motion.div
                      className="bg-gray-700/50 p-6 rounded-lg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">Новий трек</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Назва треку"
                          className="px-4 py-3 bg-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="url"
                          placeholder="SoundCloud URL"
                          className="px-4 py-3 bg-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <textarea
                        placeholder="Опис треку"
                        rows={3}
                        className="w-full mt-4 px-4 py-3 bg-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="flex space-x-3 mt-4">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <Save className="w-4 h-4" />
                          <span>Зберегти</span>
                        </button>
                        <button 
                          onClick={() => setIsAddingNew(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Скасувати
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    {mockTracks.map((track) => (
                      <div key={track.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">{track.title}</h3>
                          <p className="text-gray-400 text-sm">{track.soundcloud_url}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'blog' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Управління блогом</h2>
                    <motion.button
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Нова стаття</span>
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {mockPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">{post.title}</h3>
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            post.published ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'
                          }`}>
                            {post.published ? 'Опубліковано' : 'Чернетка'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Налаштування профілю</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ім'я артиста
                      </label>
                      <input
                        type="text"
                        defaultValue="ALEX NOVA"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        SoundCloud Username
                      </label>
                      <input
                        type="text"
                        defaultValue="alexnova"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Біографія
                      </label>
                      <textarea
                        rows={4}
                        defaultValue="Український музичний продюсер та діджей, що створює унікальні електронні композиції з елементами поп та хіп-хоп музики."
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <motion.button
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Save className="w-5 h-5" />
                      <span>Зберегти зміни</span>
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}