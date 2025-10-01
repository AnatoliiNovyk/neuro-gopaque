import React from 'react';
import { Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/alexnova', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/alexnova', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com/alexnova', label: 'YouTube' },
    { icon: Mail, href: 'mailto:contact@alexnova.music', label: 'Email' }
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              ALEX NOVA
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Український музичний продюсер та діджей, що створює унікальні електронні композиції.
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
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
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
            © 2025 ALEX NOVA. Всі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
}