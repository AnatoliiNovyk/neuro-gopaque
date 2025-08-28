import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Camera, Globe, Mail } from 'lucide-react';
import { useArtist } from '../hooks/useArtist';
import { supabase } from '../lib/supabase';

export default function ProfileManagement() {
  const { artist, loading } = useArtist();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: artist?.name || 'ALEX NOVA',
    bio: artist?.bio || 'Український музичний продюсер та діджей',
    image_url: artist?.image_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
    logo_url: artist?.logo_url || '',
    soundcloud_username: artist?.soundcloud_username || 'alexnova',
    social_links: {
      instagram: artist?.social_links?.instagram || '',
      twitter: artist?.social_links?.twitter || '',
      facebook: artist?.social_links?.facebook || '',
      youtube: artist?.social_links?.youtube || ''
    }
  });

  // Update form data when artist changes
  React.useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name || 'ALEX NOVA',
        bio: artist.bio || 'Український музичний продюсер та діджей',
        image_url: artist.image_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
        logo_url: artist.logo_url || '',
        soundcloud_username: artist.soundcloud_username || 'alexnova',
        social_links: {
          instagram: artist.social_links?.instagram || '',
          twitter: artist.social_links?.twitter || '',
          facebook: artist.social_links?.facebook || '',
          youtube: artist.social_links?.youtube || ''
        }
      });
    }
  }, [artist]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('artists')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', artist?.id || 'default');

      if (error) throw error;

      setSuccessMessage('✅ Профіль успішно оновлено!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setSuccessMessage('❌ Помилка при збереженні. Спробуйте ще раз.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            successMessage.includes('✅') 
              ? 'bg-green-600/20 border border-green-600/30 text-green-300' 
              : 'bg-red-600/20 border border-red-600/30 text-red-300'
          }`}
        >
          {successMessage}
        </motion.div>
      )}

      {/* Profile Information */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          👤 Основна інформація профілю
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ім'я артиста
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="ALEX NOVA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SoundCloud username
              </label>
              <input
                type="text"
                value={formData.soundcloud_username}
                onChange={(e) => handleInputChange('soundcloud_username', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="alexnova"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Біографія
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Розкажіть про себе та свою музику..."
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          🖼️ Зображення профілю
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              URL фото профілю
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://example.com/profile.jpg"
            />
            {formData.image_url && (
              <div className="mt-2">
                <img 
                  src={formData.image_url} 
                  alt="Profile preview" 
                  className="w-20 h-20 object-cover rounded-full border-2 border-purple-500"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              URL логотипу
            </label>
            <input
              type="url"
              value={formData.logo_url}
              onChange={(e) => handleInputChange('logo_url', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://example.com/logo.jpg"
            />
            {formData.logo_url && (
              <div className="mt-2">
                <img 
                  src={formData.logo_url} 
                  alt="Logo preview" 
                  className="w-20 h-20 object-cover rounded-lg border-2 border-purple-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          🌐 Соціальні мережі
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              value={formData.social_links.instagram}
              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://instagram.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Twitter URL
            </label>
            <input
              type="url"
              value={formData.social_links.twitter}
              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              YouTube URL
            </label>
            <input
              type="url"
              value={formData.social_links.youtube}
              onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://youtube.com/channel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              value={formData.social_links.facebook}
              onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://facebook.com/page"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.button
          onClick={handleSave}
          disabled={isUpdating}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          whileHover={!isUpdating ? { scale: 1.02 } : {}}
          whileTap={!isUpdating ? { scale: 0.98 } : {}}
        >
          {isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Збереження...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Зберегти профіль</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}