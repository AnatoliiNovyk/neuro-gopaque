import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Music, 
  FileText, 
  User, 
  BarChart3, 
  Phone
} from 'lucide-react';
import AuthGuard from '../components/AuthGuard';
import ContactManagement from '../components/ContactManagement';
import StatsManagement from '../components/StatsManagement';
import ProfileManagement from '../components/ProfileManagement';
import TracksManagement from '../components/TracksManagement';
import BlogManagement from '../components/BlogManagement';
import { useTracks } from '../hooks/useTracks';
import { useBlog } from '../hooks/useBlog';
import { useStats } from '../hooks/useStats';
import { useArtist } from '../hooks/useArtist';

type TabType = 'tracks' | 'blog' | 'profile' | 'stats' | 'contacts';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>('contacts');
  
  const { tracks } = useTracks();
  const { posts } = useBlog();
  const { stats } = useStats();
  const { artist } = useArtist();

  const tabs = [
    { id: 'tracks', label: 'Треки', icon: Music, count: tracks.length },
    { id: 'blog', label: 'Блог', icon: FileText, count: posts.length },
    { id: 'profile', label: 'Профіль', icon: User, count: artist ? 1 : 0 },
    { id: 'stats', label: 'Статистики', icon: BarChart3, count: stats.length },
    { id: 'contacts', label: 'Контакти', icon: Phone, count: 1 }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'contacts':
        return <ContactManagement />;
      case 'tracks':
        return <TracksManagement />;
      case 'blog':
        return <BlogManagement />;
      case 'profile':
        return <ProfileManagement />;
      case 'stats':
        return <StatsManagement />;
      default:
        return <ContactManagement />;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Адміністрування
            </h1>
            <p className="text-xl text-gray-300">
              Управління контентом сайту
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-gray-700/50">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activeTab === tab.id 
                        ? 'bg-white/20' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}