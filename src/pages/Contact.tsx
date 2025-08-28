import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContactInfo } from '../hooks/useContactInfo';

const contactSchema = z.object({
  name: z.string().min(2, 'Ім\'я має містити хоча б 2 символи'),
  email: z.string().email('Невірний формат email'),
  subject: z.string().min(5, 'Тема має містити хоча б 5 символів'),
  message: z.string().min(10, 'Повідомлення має містити хоча б 10 символів')
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { contactInfo, loading } = useContactInfo();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactForm) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Contact form submitted:', data);
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  const contactData = [
    {
      icon: Mail,
      label: 'Email',
      value: contactInfo?.email || 'contact@alexnova.music',
      href: `mailto:${contactInfo?.email || 'contact@alexnova.music'}`
    },
    {
      icon: Phone,
      label: 'Телефон',
      value: contactInfo?.phone || '+380 XX XXX XX XX',
      href: `tel:${contactInfo?.phone?.replace(/\s/g, '') || '+380xxxxxxxxx'}`
    },
    {
      icon: MapPin,
      label: 'Локація',
      value: contactInfo?.location || 'Київ, Україна',
      href: '#'
    }
  ];

  const socialLinks = [
    contactInfo?.social_links?.instagram ? {
      icon: Instagram,
      href: contactInfo.social_links.instagram,
      label: 'Instagram',
      color: 'hover:text-pink-400'
    } : null,
    contactInfo?.social_links?.twitter ? {
      icon: Twitter,
      href: contactInfo.social_links.twitter,
      label: 'Twitter',
      color: 'hover:text-blue-400'
    } : null,
    contactInfo?.social_links?.youtube ? {
      icon: Youtube,
      href: contactInfo.social_links.youtube,
      label: 'YouTube',
      color: 'hover:text-red-400'
    } : null,
    contactInfo?.social_links?.facebook ? {
      icon: Facebook,
      href: contactInfo.social_links.facebook,
      label: 'Facebook',
      color: 'hover:text-blue-500'
    } : null
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-16">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              {contactInfo?.title || 'Контакти'}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {contactInfo?.subtitle || 'Готовий до співпраці? Зв\'яжіться зі мною для обговорення проектів'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                {contactInfo?.contact_title || 'Зв\'яжіться зі мною'}
              </h2>
              
              <div className="space-y-6">
                {contactData.map(({ icon: Icon, label, value, href }, index) => (
                  <motion.a
                    key={label}
                    href={href}
                    className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors duration-200 group"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{label}</div>
                      <div className="text-white font-medium">{value}</div>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {contactInfo?.social_title || 'Соціальні мережі'}
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map(({ icon: Icon, href, label, color }) => (
                    <motion.a
                      key={label}
                      href={href}
                      className={`w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 ${color} transition-all duration-200 hover:scale-110`}
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
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {contactInfo?.form_title || 'Надіслати повідомлення'}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ім'я *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ваше ім'я"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Тема *
                  </label>
                  <input
                    {...register('subject')}
                    type="text"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Тема повідомлення"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Повідомлення *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Ваше повідомлення..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${
                    isSubmitted
                      ? 'bg-green-600 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-105'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Надсилання...</span>
                    </>
                  ) : isSubmitted ? (
                    <>
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <span>Відправлено!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{contactInfo?.form_button_text || 'Надіслати повідомлення'}</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}