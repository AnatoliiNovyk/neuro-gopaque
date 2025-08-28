import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Music, ExternalLink } from 'lucide-react';
import { useTracks } from '../hooks/useTracks';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default function TracksManagement() {
  const { tracks, loading, refetchTracks } = useTracks();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState(
    tracks.map(track => ({
      id: track.id,
      title: track.title,
      soundcloud_url: track.soundcloud_url,
      description: track.description || '',
      order_index: track.order_index,
      image_url: track.image_url || ''
    }))
  );

  // Update form data when tracks change
  React.useEffect(() => {
    setFormData(tracks.map(track => ({
      id: track.id,
      title: track.title,
      soundcloud_url: track.soundcloud_url,
      description: track.description || '',
      order_index: track.order_index,
      image_url: track.image_url || ''
    })));
  }, [tracks]);

  const handleInputChange = (id: string, field: string, value: string | number) => {
    setFormData(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleAddTrack = () => {
    const newTrack = {
      id: uuidv4(),
      title: 'Новий трек',
      soundcloud_url: '',
      description: '',
      order_index: formData.length + 1,
      image_url: ''
    };
    setFormData(prev => [...prev, newTrack]);
  };

  const handleDeleteTrack = async (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цей трек?')) {
      try {
        const { error } = await supabase
          .from('tracks')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setFormData(prev => prev.filter(track => track.id !== id));
        refetchTracks();
        setSuccessMessage('✅ Трек видалено!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setSuccessMessage('❌ Помилка при видаленні треку.');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      for (const track of formData) {
        const { error } = await supabase
          .from('tracks')
          .upsert({
            id: track.id,
            title: track.title,
            soundcloud_url: track.soundcloud_url,
            description: track.description,
            order_index: track.order_index,
            image_url: track.image_url,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      refetchTracks();
      setSuccessMessage('✅ Треки успішно оновлено!');
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

      {/* Add Track Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center">
          🎵 Управління треками
        </h3>
        <motion.button
          onClick={handleAddTrack}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          <span>Додати трек</span>
        </motion.button>
      </div>

      {/* Tracks List */}
      <div className="space-y-6">
        {formData.map((track, index) => (
          <div key={track.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <Music className="w-5 h-5 mr-2" />
                Трек #{index + 1}
              </h4>
              <div className="flex items-center space-x-2">
                {track.soundcloud_url && (
                  <a
                    href={track.soundcloud_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                    title="Відкрити на SoundCloud"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => handleDeleteTrack(track.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  title="Видалити трек"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Назва треку *
                </label>
                <input
                  type="text"
                  value={track.title}
                  onChange={(e) => handleInputChange(track.id, 'title', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Назва треку"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SoundCloud URL *
                </label>
                <input
                  type="url"
                  value={track.soundcloud_url}
                  onChange={(e) => handleInputChange(track.id, 'soundcloud_url', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://soundcloud.com/user/track"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL обкладинки
                </label>
                <input
                  type="url"
                  value={track.image_url}
                  onChange={(e) => handleInputChange(track.id, 'image_url', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Порядок відображення
                </label>
                <input
                  type="number"
                  value={track.order_index}
                  onChange={(e) => handleInputChange(track.id, 'order_index', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="1"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Опис треку
              </label>
              <textarea
                value={track.description}
                onChange={(e) => handleInputChange(track.id, 'description', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Опис треку або додаткова інформація"
              />
            </div>
          </div>
        ))}

        {formData.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Music className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p>Треків ще немає. Додайте перший трек!</p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.button
          onClick={handleSave}
          disabled={isUpdating || formData.length === 0}
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
              <span>Зберегти треки</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}