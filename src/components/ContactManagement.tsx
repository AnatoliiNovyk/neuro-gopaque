import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Phone, Mail, MapPin, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { useContactInfo } from '../hooks/useContactInfo';

export default function ContactManagement() {
  const { contactInfo, loading, updateContactInfo } = useContactInfo();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: contactInfo?.title || 'Контакти',
    subtitle: contactInfo?.subtitle || 'Готовий до співпраці? Зв\'яжіться зі мною для обговорення проектів',
    contact_title: contactInfo?.contact_title || 'Зв\'яжіться зі мною',
    email: contactInfo?.email || 'contact@alexnova.music',
    phone: contactInfo?.phone || '+380 XX XXX XX XX',
    location: contactInfo?.location || 'Київ, Україна',
    social_title: contactInfo?.social_title || 'Соціальні мережі',
    form_title: contactInfo?.form_title || 'Надіслати повідомлення',
    form_button_text: contactInfo?.form_button_text || 'Надіслати повідомлення',
    social_links: {
      instagram: contactInfo?.social_links?.instagram || '',
      twitter: contactInfo?.social_links?.twitter || '',
      youtube: contactInfo?.social_links?.youtube || '',
      facebook: contactInfo?.social_links?.facebook || ''
    }
  });

  // Update form data when contactInfo changes
  React.useEffect(() => {
    if (contactInfo) {
      setFormData({
        title: contactInfo.title || 'Контакти',
        subtitle: contactInfo.subtitle || 'Готовий до співпраці? Зв\'яжіться зі мною для обговорення проектів',
        contact_title: contactInfo.contact_title || 'Зв\'яжіться зі мною',
        email: contactInfo.email || 'contact@alexnova.music',
        phone: contactInfo.phone || '+380 XX XXX XX XX',
        location: contactInfo.location || 'Київ, Україна',
        social_title: contactInfo.social_title || 'Соціальні мережі',
        form_title: contactInfo.form_title || 'Надіслати повідомлення',
        form_button_text: contactInfo.form_button_text || 'Надіслати повідомлення',
        social_links: {
          instagram: contactInfo.social_links?.instagram || '',
          twitter: contactInfo.social_links?.twitter || '',
          youtube: contactInfo.social_links?.youtube || '',
          facebook: contactInfo.social_links?.facebook || ''
        }
      });
    }
  }, [contactInfo]);

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
      const success = await updateContactInfo(formData);
      if (success) {
        setSuccessMessage('✅ Контактну інформацію успішно оновлено!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setSuccessMessage('❌ Помилка при збереженні. Спробуйте ще раз.');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
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

      {/* Page Settings */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          📝 Загальні налаштування сторінки
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Заголовок сторінки
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Контакти"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Підзаголовок сторінки
            </label>
            <textarea
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Готовий до співпраці? Зв'яжіться зі мною для обговорення проектів"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Заголовок секції контактів
            </label>
            <input
              type="text"
              value={formData.contact_title}
              onChange={(e) => handleInputChange('contact_title', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Зв'яжіться зі мною"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          📞 Контактна інформація
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email адреса
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="contact@domain.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Номер телефону
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="+380 XX XXX XX XX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Локація/Адреса
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Київ, Україна"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          🌐 Соціальні мережі
        </h3>
        
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Заголовок секції соціальних мереж
            </label>
            <input
              type="text"
              value={formData.social_title}
              onChange={(e) => handleInputChange('social_title', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Соціальні мережі"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <Instagram className="w-4 h-4 mr-2" />
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
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <Twitter className="w-4 h-4 mr-2" />
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
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <Youtube className="w-4 h-4 mr-2" />
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
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <Facebook className="w-4 h-4 mr-2" />
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

      {/* Contact Form Settings */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          📋 Налаштування контактної форми
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Заголовок форми
            </label>
            <input
              type="text"
              value={formData.form_title}
              onChange={(e) => handleInputChange('form_title', e.target.value)}
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
              value={formData.form_button_text}
              onChange={(e) => handleInputChange('form_button_text', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Надіслати повідомлення"
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
              <span>Зберегти зміни</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}