import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, CreditCard as Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { useBlog } from '../hooks/useBlog';
import { BlogPost } from '../types';

export default function BlogManagement() {
  const { posts, loading, error } = useBlog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<BlogPost>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    published: false
  });

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setEditData(post);
  };

  const handleSave = async (id: string) => {
    // In a real implementation, you would call an API to update the post
    console.log('Saving blog post:', id, editData);
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleAdd = async () => {
    // In a real implementation, you would call an API to create a new post
    console.log('Adding new blog post:', newPost);
    setIsAdding(false);
    setNewPost({
      title: '',
      content: '',
      excerpt: '',
      image_url: '',
      published: false
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей пост?')) {
      // In a real implementation, you would call an API to delete the post
      console.log('Deleting blog post:', id);
    }
  };

  const togglePublished = async (post: BlogPost) => {
    // In a real implementation, you would call an API to toggle published status
    console.log('Toggling published status:', post.id, !post.published);
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
          <h2 className="text-2xl font-bold text-white mb-2">Управління блогом</h2>
          <p className="text-gray-400">Створення та редагування постів для блогу</p>
        </div>
        
        <motion.button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span>Додати пост</span>
        </motion.button>
      </div>

      {/* Add New Post Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Створити новий пост</h3>
          
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Заголовок</label>
              <input
                type="text"
                value={newPost.title || ''}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Заголовок поста"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Короткий опис</label>
              <textarea
                rows={2}
                value={newPost.excerpt || ''}
                onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Короткий опис для попереднього перегляду..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Зміст</label>
              <textarea
                rows={6}
                value={newPost.content || ''}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Повний зміст поста..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Зображення URL</label>
              <input
                type="url"
                value={newPost.image_url || ''}
                onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newPost.published || false}
                onChange={(e) => setNewPost({ ...newPost, published: e.target.checked })}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-300">Опублікувати зразу</label>
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

      {/* Blog Posts List */}
      <div className="space-y-4">
        {posts.map((post, index) => {
          const isEditing = editingId === post.id;
          
          return (
            <motion.div
              key={post.id}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {isEditing ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Заголовок</label>
                    <input
                      type="text"
                      value={editData.title || ''}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Короткий опис</label>
                    <textarea
                      rows={2}
                      value={editData.excerpt || ''}
                      onChange={(e) => setEditData({ ...editData, excerpt: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Зміст</label>
                    <textarea
                      rows={6}
                      value={editData.content || ''}
                      onChange={(e) => setEditData({ ...editData, content: e.target.value })}
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
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editData.published || false}
                      onChange={(e) => setEditData({ ...editData, published: e.target.checked })}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <label className="text-sm font-medium text-gray-300">Опубліковано</label>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleSave(post.id)}
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
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                      <img
                        src={post.image_url || 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg'}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-white truncate">{post.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          post.published 
                            ? 'bg-green-600/20 text-green-300' 
                            : 'bg-yellow-600/20 text-yellow-300'
                        }`}>
                          {post.published ? 'Опубліковано' : 'Чернетка'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                      <p className="text-xs text-gray-500">
                        Створено: {new Date(post.created_at).toLocaleDateString('uk-UA')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => togglePublished(post)}
                      className={`p-2 transition-colors ${
                        post.published 
                          ? 'text-green-400 hover:text-green-300' 
                          : 'text-gray-400 hover:text-yellow-400'
                      }`}
                      title={post.published ? 'Приховати' : 'Опублікувати'}
                    >
                      {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      title="Редагувати"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
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

      {posts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Немає постів</h3>
          <p className="text-gray-500 mb-4">Створіть перший пост для вашого блогу</p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Створити пост
          </button>
        </div>
      )}
    </div>
  );
}