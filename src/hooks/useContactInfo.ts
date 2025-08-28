import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ContactInfo {
  id: string;
  section_type: string;
  title: string;
  subtitle: string;
  contact_title: string;
  email: string;
  phone: string;
  location: string;
  social_title: string;
  social_links: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;
  };
  form_title: string;
  form_button_text: string;
  created_at: string;
  updated_at: string;
}

export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .eq('section_type', 'main')
          .limit(1);

        if (error) {
          if (error.code === 'PGRST116') {
            // No data found, use defaults
            setContactInfo({
              id: 'default',
              section_type: 'main',
              title: 'Контакти',
              subtitle: 'Готовий до співпраці? Зв\'яжіться зі мною для обговорення проектів',
              contact_title: 'Зв\'яжіться зі мною',
              email: 'contact@alexnova.music',
              phone: '+380 XX XXX XX XX',
              location: 'Київ, Україна',
              social_title: 'Соціальні мережі',
              social_links: {
                instagram: 'https://instagram.com/alexnova',
                twitter: 'https://twitter.com/alexnova',
                youtube: 'https://youtube.com/alexnova'
              },
              form_title: 'Надіслати повідомлення',
              form_button_text: 'Надіслати повідомлення',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          } else {
            setError(error.message);
          }
        } else {
          setContactInfo(data?.[0] || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, [refetch]);

  const updateContactInfo = async (updates: Partial<ContactInfo>) => {
    try {
      const { error } = await supabase
        .from('contact_info')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('section_type', 'main');

      if (error) throw error;
      
      setRefetch(prev => prev + 1);
      return true;
    } catch (error) {
      console.error('Error updating contact info:', error);
      return false;
    }
  };

  const refetchContactInfo = () => setRefetch(prev => prev + 1);

  return { contactInfo, loading, error, updateContactInfo, refetchContactInfo };
}