import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, Phone, MapPin, Globe, MessageSquare } from 'lucide-react';
import { useContactInfo } from '../hooks/useContactInfo';

// Simple debounce function to avoid adding new dependencies
function useDebounce<T extends (...args: any[]) => any>(callback: T, delay: number) {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  }, [callback, delay, debounceTimer]);

  return debouncedCallback;
}

export default function ContactManagement() {
  const { contactInfo, loading, error, updateContactInfo } = useContactInfo();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = async (field: string, value: string | object) => {
    setSaving(true);
    setSaveStatus(null);

    const success = await updateContactInfo({ [field]: value });
    
    if (success) {
      setSaveStatus('✅ Збережено');
    } else {
      setSaveStatus('❌ Помилка збереження');
    }

    setSaving(false);
    
    // Clear status after 3 seconds
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const debouncedSave = useDebounce(handleSave, 1000);

  const handleFieldChange = (field: string, value: string) => {
    debouncedSave(field, value);
  };

  const handleSocialLinkChange = (platform: string, url: string) => {
    const updatedSocialLinks = {
      ...contactInfo?.social_links,
      [platform]: url
    };
    debouncedSave('social_links', updatedSocialLinks);
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
          <h2 className="text-2xl font-bold text-white mb-2">Управління контактами</h2>
          <p className="text-gray-400">Редагування контактної інформації та налаштувань форми</p>
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
        {/* General Settings */}
        <motion.div
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Загальні налаштування</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Заголовок сторінки
              </label>
              <input
                type="text"
                defaultValue={contactInfo?.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Контакти"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Підзаголовок/Опис
              </label>
              <textarea
                rows={3}
                defaultValue={contactInfo?.subtitle || ''}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Опис сторінки контактів..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Заголовок секції контактів
              </label>
              <input
                type="text"
                defaultValue={contactInfo?.contact_title || ''}
                onChange={(e) => handleFieldChange('contact_title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Зв'яжіться зі мною"
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Контактна інформація</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email адреса
              </label>
              <input
                type="email"
                defaultValue={contactInfo?.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="contact@domain.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Телефон
              </label>
              <input
                type="text"
                defaultValue={contactInfo?.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="+380 XX XXX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Місце розташування
              </label>
              <input
                type="text"
                defaultValue={contactInfo?.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Київ, Україна"
              />
            </div>
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Заголовок секції
              </label>
              <input
                type="text"
                defaultValue={contactInfo?.social_title || ''}
                onChange={(e) => handleFieldChange('social_title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Соціальні мережі"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Instagram</label>
                <input
                  type="url"
                  defaultValue={contactInfo?.social_links?.instagram || ''}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://instagram.com/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Twitter</label>
                <input
                  type="url"
                  defaultValue={contactInfo?.social_links?.twitter || ''}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://twitter.com/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">YouTube</label>
                <input
                  type="url"
                  defaultValue={contactInfo?.social_links?.youtube || ''}
                  onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://youtube.com/@username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Facebook</label>
                <input
                  type="url"
                  defaultValue={contactInfo?.social_links?.facebook || ''}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://facebook.com/username"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form Settings */}
        <motion.div
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Налаштування форми</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Заголовок форми
              </label>
              <input
                type="text"
                defaultValue={contactInfo?.form_title || ''}
                onChange={(e) => handleFieldChange('form_title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Надіслати повідомлення"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Текст кнопки відправки
              </label>
              <input
                type="text"
                defaultValue={contactInfo?.form_button_text || ''}
                onChange={(e) => handleFieldChange('form_button_text', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Надіслати повідомлення"
              />
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