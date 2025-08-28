import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Music, Users, Star, Play, TrendingUp } from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { supabase } from '../lib/supabase';

export default function StatsManagement() {
  const { stats, loading, refetchStats } = useStats();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState(
    stats.map(stat => ({
      id: stat.id,
      label: stat.label,
      value: stat.value,
      icon_name: stat.icon_name,
      order_index: stat.order_index
    }))
  );

  // Update form data when stats change
  React.useEffect(() => {
    setFormData(stats.map(stat => ({
      id: stat.id,
      label: stat.label,
      value: stat.value,
      icon_name: stat.icon_name,
      order_index: stat.order_index
    })));
  }, [stats]);

  const iconOptions = [
    { value: 'music', label: 'Музика', icon: Music },
    { value: 'users', label: 'Користувачі', icon: Users },
    { value: 'star', label: 'Зірка', icon: Star },
    { value: 'play', label: 'Відтворення', icon: Play },
    { value: 'trending', label: 'Тренди', icon: TrendingUp }
  ];

  const handleInputChange = (id: string, field: string, value: string | number) => {
    setFormData(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      for (const stat of formData) {
        const { error } = await supabase
          .from('site_stats')
          .update({
            label: stat.label,
            value: stat.value,
            icon_name: stat.icon_name,
            order_index: stat.order_index,
            updated_at: new Date().toISOString()
          })
          .eq('id', stat.id);

        if (error) throw error;
      }

      refetchStats();
      setSuccessMessage('✅ Статистики успішно оновлено!');
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

      {/* Stats Management */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          📊 Управління статистиками
        </h3>
        
        <div className="space-y-6">
          {formData.map((stat, index) => {
            const IconComponent = iconOptions.find(icon => icon.value === stat.icon_name)?.icon || Music;
            
            return (
              <div key={stat.id} className="bg-gray-700/30 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white flex items-center">
                    <IconComponent className="w-5 h-5 mr-2" />
                    Статистика #{index + 1}
                  </h4>
                  <div className="text-sm text-gray-400">
                    Порядок: {stat.order_index}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Назва
                    </label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleInputChange(stat.id, 'label', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Треків"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Значення
                    </label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleInputChange(stat.id, 'value', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="50+"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Іконка
                    </label>
                    <select
                      value={stat.icon_name}
                      onChange={(e) => handleInputChange(stat.id, 'icon_name', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-600/50 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {iconOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Порядок
                    </label>
                    <input
                      type="number"
                      value={stat.order_index}
                      onChange={(e) => handleInputChange(stat.id, 'order_index', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="1"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            );
          })}
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
              <span>Зберегти статистики</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}