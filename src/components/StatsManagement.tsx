import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Plus, CreditCard as Edit2, Trash2, Save, X, ArrowUp, ArrowDown, Music, Users, Star, Play, TrendingUp } from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { SiteStats } from '../types';

export default function StatsManagement() {
  const { stats, loading, error, createStat, updateStat, deleteStat, reorderStat } = useStats();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SiteStats>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [newStat, setNewStat] = useState<Partial<SiteStats>>({
    label: '',
    value: '',
    icon_name: 'music',
    order_index: 0
  });

  // Icon mapping for display
  const iconMap = {
    music: Music,
    users: Users,
    star: Star,
    play: Play,
    trending: TrendingUp,
    chart: BarChart3
  };

  const availableIcons = [
    { value: 'music', label: 'Музика', icon: Music },
    { value: 'users', label: 'Користувачі', icon: Users },
    { value: 'star', label: 'Зірка', icon: Star },
    { value: 'play', label: 'Відтворення', icon: Play },
    { value: 'trending', label: 'Тренди', icon: TrendingUp },
    { value: 'chart', label: 'Графік', icon: BarChart3 }
  ];

  const handleEdit = (stat: SiteStats) => {
    setEditingId(stat.id);
    setEditData(stat);
  };

  const handleSave = async (id: string) => {
    setOperationLoading(true);
    const result = await updateStat(id, editData);
    
    if (result.success) {
      setEditingId(null);
      setEditData({});
    } else {
      alert('Помилка збереження статистики: ' + result.error);
    }
    setOperationLoading(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleAdd = async () => {
    if (!newStat.label || !newStat.value) {
      alert('Назва та значення обов\'язкові');
      return;
    }

    setOperationLoading(true);
    const result = await createStat({
      label: newStat.label!,
      value: newStat.value!,
      icon_name: newStat.icon_name!,
      order_index: newStat.order_index || stats.length + 1
    });
    
    if (result.success) {
      setIsAdding(false);
      setNewStat({
        label: '',
        value: '',
        icon_name: 'music',
        order_index: 0
      });
    } else {
      alert('Помилка створення статистики: ' + result.error);
    }
    setOperationLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю статистику?')) {
      setOperationLoading(true);
      const result = await deleteStat(id);
      
      if (!result.success) {
        alert('Помилка видалення статистики: ' + result.error);
      }
      setOperationLoading(false);
    }
  };

  const moveUp = async (stat: SiteStats) => {
    if (stat.order_index > 1) {
      setOperationLoading(true);
      const result = await reorderStat(stat.id, stat.order_index - 1);
      if (!result.success) {
        alert('Помилка переміщення: ' + result.error);
      }
      setOperationLoading(false);
    }
  };

  const moveDown = async (stat: SiteStats) => {
    setOperationLoading(true);
    const result = await reorderStat(stat.id, stat.order_index + 1);
    if (!result.success) {
      alert('Помилка переміщення: ' + result.error);
    }
    setOperationLoading(false);
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
          <h2 className="text-2xl font-bold text-white mb-2">Управління статистиками</h2>
          <p className="text-gray-400">Редагування статистик, що відображаються на головній сторінці</p>
        </div>
        
        <motion.button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span>Додати статистику</span>
        </motion.button>
      </div>

      {/* Add New Stat Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Додати нову статистику</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Назва</label>
              <input
                type="text"
                value={newStat.label || ''}
                onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Треків"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Значення</label>
              <input
                type="text"
                value={newStat.value || ''}
                onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="50+"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Іконка</label>
              <select
                value={newStat.icon_name || 'music'}
                onChange={(e) => setNewStat({ ...newStat, icon_name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {availableIcons.map(icon => (
                  <option key={icon.value} value={icon.value}>{icon.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Порядок</label>
              <input
                type="number"
                value={newStat.order_index || 0}
                onChange={(e) => setNewStat({ ...newStat, order_index: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
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

      {/* Stats List */}
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const IconComponent = iconMap[stat.icon_name as keyof typeof iconMap] || BarChart3;
          const isEditing = editingId === stat.id;
          
          return (
            <motion.div
              key={stat.id}
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">Назва</label>
                      <input
                        type="text"
                        value={editData.label || ''}
                        onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Значення</label>
                      <input
                        type="text"
                        value={editData.value || ''}
                        onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Іконка</label>
                      <select
                        value={editData.icon_name || stat.icon_name}
                        onChange={(e) => setEditData({ ...editData, icon_name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {availableIcons.map(icon => (
                          <option key={icon.value} value={icon.value}>{icon.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Порядок</label>
                      <input
                        type="number"
                        value={editData.order_index || stat.order_index}
                        onChange={(e) => setEditData({ ...editData, order_index: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleSave(stat.id)}
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
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{stat.value}</h3>
                      <p className="text-gray-400">{stat.label}</p>
                      <p className="text-xs text-gray-500">Порядок: {stat.order_index}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveUp(stat)}
                      disabled={index === 0}
                      className="p-2 text-gray-400 hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Перемістити вгору"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveDown(stat)}
                      disabled={index === stats.length - 1}
                      className="p-2 text-gray-400 hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Перемістити вниз"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(stat)}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      title="Редагувати"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(stat.id)}
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

      {stats.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Немає статистик</h3>
          <p className="text-gray-500 mb-4">Додайте першу статистику для відображення на головній сторінці</p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Додати статистику
          </button>
        </div>
      )}
    </div>
  );
}