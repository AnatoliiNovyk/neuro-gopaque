import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Plus, Edit2, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useTracks } from '../hooks/useTracks';
import { Track } from '../types';

export default function TracksManagement() {
  const { tracks, loading, error, refetchTracks } = useTracks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Track>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newTrack, setNewTrack] = useState<Partial<Track>>({
    title: '',
    soundcloud_url: '',
    soundcloud_id: '',
    image_url: '',
    description: '',
    order_index: 0
  });

  const handleEdit = (track: Track) => {
    setEditingId(track.id);
    setEditData(track);
  };

  const handleSave = async (id: string) => {
    // In a real implementation, you would call an API to update the track
    console.log('Saving track:', id, editData);
    setEditingId(null);
    setEditData({});
    refetchTracks();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleAdd = async () => {
    // In a real implementation, you would call an API to create a new track
    console.log('Adding new track:', newTrack);
    setIsAdding(false);
    setNewTrack({
      title: '',
      soundcloud_url: '',
      soundcloud_id: '',
      image_url: '',
      description: '',
      order_index: 0
    });
    refetchTracks();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей трек?')) {
      // In a real implementation, you would call an API to delete the track
      console.log('Deleting track:', id);
      refetchTracks();
    }
  };

  const moveUp = async (track: Track) => {
    // In a real implementation, you would update the order_index
    console.log('Moving up:', track.id);
    refetchTracks();
  };

  const moveDown = async (track: Track) => {
    // In a real implementation, you would update the order_index
    console.log('Moving down:', track.id);
    refetchTracks();
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
          <h2 className="text-2xl font-bold text-white mb-2">Управління треками</h2>
          <p className="text-gray-400">Редагування музичних треків та SoundCloud інтеграції</p>
        </div>
        
        <motion.button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span>Додати трек</span>
        </motion.button>
      </div>

      {/* Add New Track Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Додати новий трек</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Назва треку</label>
              <input
                type="text"
                value={newTrack.title || ''}
                onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Назва треку"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">SoundCloud URL</label>
              <input
                type="url"
                value={newTrack.soundcloud_url || ''}
                onChange={(e) => setNewTrack({ ...newTrack, soundcloud_url: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://soundcloud.com/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Зображення URL</label>
              <input
                type="url"
                value={newTrack.image_url || ''}
                onChange={(e) => setNewTrack({ ...newTrack, image_url: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Порядок</label>
              <input
                type="number"
                value={newTrack.order_index || 0}
                onChange={(e) => setNewTrack({ ...newTrack, order_index: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Опис</label>
              <textarea
                rows={3}
                value={newTrack.description || ''}
                onChange={(e) => setNewTrack({ ...newTrack, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Опис треку..."
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Зберегти</span>
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Скасувати</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Tracks List */}
      <div className="space-y-4">
        {tracks.map((track, index) => {
          const isEditing = editingId === track.id;
          
          return (
            <motion.div
              key={track.id}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {isEditing ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Назва треку</label>
                      <input
                        type="text"
                        value={editData.title || ''}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">SoundCloud URL</label>
                      <input
                        type="url"
                        value={editData.soundcloud_url || ''}
                        onChange={(e) => setEditData({ ...editData, soundcloud_url: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Зображення URL</label>
                      <input
                        type="url"
                        value={editData.image_url || ''}
                        onChange={(e) => setEditData({ ...editData, image_url: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Порядок</label>
                      <input
                        type="number"
                        value={editData.order_index || track.order_index}
                        onChange={(e) => setEditData({ ...editData, order_index: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Опис</label>
                      <textarea
                        rows={3}
                        value={editData.description || ''}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleSave(track.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Зберегти</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Скасувати</span>
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                      <img
                        src={track.image_url || 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg'}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{track.title}</h3>
                      <p className="text-gray-400 text-sm">{track.description}</p>
                      <p className="text-xs text-gray-500">Порядок: {track.order_index}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveUp(track)}
                      disabled={index === 0}
                      className="p-2 text-gray-400 hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Перемістити вгору"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveDown(track)}
                      disabled={index === tracks.length - 1}
                      className="p-2 text-gray-400 hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Перемістити вниз"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(track)}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      title="Редагувати"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(track.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Видалити"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {tracks.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Немає треків</h3>
          <p className="text-gray-500 mb-4">Додайте перший трек для відображення на сторінці музики</p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Додати трек
          </button>
        </div>
      )}
    </div>
  );
}