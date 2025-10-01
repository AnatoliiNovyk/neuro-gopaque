import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Save, Globe, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { useArtist } from '../hooks/useArtist';

export default function ProfileManagement() {
  const { artist, loading, error } = useArtist();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = async (field: string, value: string) => {
    setSaving(true);
    setSaveStatus(null);

    // In a real implementation, you would call an API to update the artist profile
    console.log('Saving artist profile:', field, value);
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('✅ Збережено');
      setSaving(false);
      
      // Clear status after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const handleSocialLinkChange = (platform: string, url: string) => {
    const updatedSocialLinks = {
      ...artist?.social_links,
      [platform]: url
    };
    handleSave('social_links', JSON.stringify(updatedSocialLinks));
  };

  if (loading) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600/20 border border-red-600/30 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-red-300 mb-4">Помилка завантаження</h2>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Управління профілем</h2>
          <p className="text-gray-400">Редагування інформації про артиста та профілю</p>
        </div>
        
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              saveStatus.startsWith('✅') 
                ? 'bg-green-600/20 text-green-300 border border-green-600/30' 
                : 'bg-red-600/20 text-red-300 border border-red-600/30'
            }`}
          >
            {saveStatus}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <motion.div
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Основна інформація</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ім'я артиста
              </label>
              <input
                type="text"
                defaultValue={artist?.name || ''}
                onChange={(e) => handleSave('name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="ALEX NOVA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Біографія
              </label>
              <textarea
                rows={4}
                defaultValue={artist?.bio || ''}
                onChange={(e) => handleSave('bio', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Розкажіть про себе як артиста..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SoundCloud Username
              </label>
              <input
                type="text"
                defaultValue={artist?.soundcloud_username || ''}
                onChange={(e) => handleSave('soundcloud_username', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="alexnova"
              />
            </div>
          </div>
        </motion.div>

        {/* Images */}
        <motion.div
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Зображення</h3>
          </div>

          <div className="space-y-6">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Фото профілю
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700">
                  <img
                    src={artist?.image_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    defaultValue={artist?.image_url || ''}
                    onChange={(e) => handleSave('image_url', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Логотип (опціонально)
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                  {artist?.logo_url ? (
                    <img
                      src={artist.logo_url}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    defaultValue={artist?.logo_url || ''}
                    onChange={(e) => handleSave('logo_url', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Соціальні мережі</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Instagram className="w-5 h-5 text-pink-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">Instagram</label>
                <input
                  type="url"
                  defaultValue={artist?.social_links?.instagram || ''}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Twitter className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">Twitter</label>
                <input
                  type="url"
                  defaultValue={artist?.social_links?.twitter || ''}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Youtube className="w-5 h-5 text-red-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">YouTube</label>
                <input
                  type="url"
                  defaultValue={artist?.social_links?.youtube || ''}
                  onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://youtube.com/@username"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Facebook className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">Facebook</label>
                <input
                  type="url"
                  defaultValue={artist?.social_links?.facebook || ''}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://facebook.com/username"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Saving Indicator */}
      {saving && (
        <motion.div
          className="fixed bottom-8 right-8 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm font-medium">Збереження...</span>
        </motion.div>
      )}
    </div>
  );
}