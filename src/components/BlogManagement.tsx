import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, FileText, Eye, EyeOff } from 'lucide-react';
import { useBlog } from '../hooks/useBlog';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default function BlogManagement() {
  const { posts, loading } = useBlog();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState(
    posts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image_url: post.image_url || '',
      published: post.published
    }))
  );

  // Update form data when posts change
  React.useEffect(() => {
    setFormData(posts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image_url: post.image_url || '',
      published: post.published
    })));
  }, [posts]);

  const handleInputChange = (id: string, field: string, value: string | boolean) => {
    setFormData(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleAddPost = () => {
    const newPost = {
      id: uuidv4(),
      title: 'Новий пост блогу',
      excerpt: 'Короткий опис поста...',
      content: 'Повний вміст поста...',
      image_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
      published: false
    };
    setFormData(prev => [...prev, newPost]);
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цей пост?')) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setFormData(prev => prev.filter(post => post.id !== id));
        setSuccessMessage('✅ Пост видалено!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setSuccessMessage('❌ Помилка при видаленні поста.');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      for (const post of formData) {
        const { error } = await supabase
          .from('blog_posts')
          .upsert({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            image_url: post.image_url,
            published: post.published,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      setSuccessMessage('✅ Блог пости успішно оновлено!');
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

      {/* Add Post Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center">
          📝 Управління блогом
        </h3>
        <motion.button
          onClick={handleAddPost}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          <span>Додати пост</span>
        </motion.button>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {formData.map((post, index) => (
          <div key={post.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Пост #{index + 1}
              </h4>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm ${
                  post.published 
                    ? 'bg-green-600/20 text-green-300 border border-green-600/30' 
                    : 'bg-gray-600/20 text-gray-300 border border-gray-600/30'
                }`}>
                  {post.published ? '🟢 Опубліковано' : '🔴 Чернетка'}
                </div>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  title="Видалити пост"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Заголовок поста *
                </label>
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => handleInputChange(post.id, 'title', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Заголовок поста"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL зображення
                </label>
                <input
                  type="url"
                  value={post.image_url}
                  onChange={(e) => handleInputChange(post.id, 'image_url', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Короткий опис (excerpt) *
              </label>
              <textarea
                value={post.excerpt}
                onChange={(e) => handleInputChange(post.id, 'excerpt', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Короткий опис для попереднього перегляду..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Повний контент поста *
              </label>
              <textarea
                value={post.content}
                onChange={(e) => handleInputChange(post.id, 'content', e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Повний текст статті..."
                required
              />
            </div>

            <div className="flex items-center space-x-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={post.published}
                  onChange={(e) => handleInputChange(post.id, 'published', e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  post.published ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    post.published ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </div>
                <span className="ml-2 text-gray-300">
                  {post.published ? (
                    <><Eye className="w-4 h-4 inline mr-1" />Опублікувати</>
                  ) : (
                    <><EyeOff className="w-4 h-4 inline mr-1" />Зберегти як чернетку</>
                  )}
                </span>
              </label>
            </div>
          </div>
        ))}

        {formData.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p>Постів ще немає. Додайте перший пост блогу!</p>
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
              <span>Зберегти пости</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}