import React from 'react';
import { Instagram, Twitter, Youtube, Mail, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import { useArtist } from '../hooks/useArtist';

export default function Footer() {
  const { artist } = useArtist();

  // Create dynamic social links based on artist data
  const socialLinks = [
    artist?.social_links?.instagram ? {
      icon: Instagram,
      href: artist.social_links.instagram,
      label: 'Instagram',
      color: 'hover:text-pink-400'
    } : null,
    artist?.social_links?.twitter ? {
      icon: Twitter,
      href: artist.social_links.twitter,
      label: 'Twitter',
      color: 'hover:text-blue-400'
    } : null,
    artist?.social_links?.youtube ? {
      icon: Youtube,
      href: artist.social_links.youtube,
      label: 'YouTube',
      color: 'hover:text-red-400'
    } : null,
    artist?.social_links?.facebook ? {
      icon: Facebook,
      href: artist.social_links.facebook,
      label: 'Facebook',
      color: 'hover:text-blue-500'
    } : null,
    // Always show email as fallback
    {
      icon: Mail,
      href: 'mailto:contact@alexnova.music',
      label: 'Email',
      color: 'hover:text-gray-300'
    }
  ].filter(Boolean); // Remove null entries

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {artist?.name || 'ALEX NOVA'}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {artist?.bio || 'Український музичний продюсер та діджей, що створює унікальні електронні композиції.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Швидкі посилання</h4>
            <ul className="space-y-2">
              <li>
                <a href="/music" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Музика
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Новини
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Контакти
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Соціальні мережі</h4>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  className={`w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-200 ${color}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            © 2025 {artist?.name || 'ALEX NOVA'}. Всі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
}