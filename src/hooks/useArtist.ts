import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Artist } from '../types';

export function useArtist() {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .limit(1);

        if (error) {
          setError(error.message);
        } else if (data && data.length === 0) {
          // No data found, use default artist data
          setArtist({
            id: 'default',
            name: 'АLEX NOVA',
            bio: 'Український музичний продюсер та діджей, що створює унікальні електронні композиції з елементами поп та хіп-хоп музики.',
            image_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
            logo_url: '',
            soundcloud_username: 'alexnova',
            social_links: {
              instagram: 'https://instagram.com/alexnova',
              twitter: 'https://twitter.com/alexnova',
              youtube: 'https://youtube.com/alexnova'
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        } else {
          setArtist(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, []);

  return { artist, loading, error };
}