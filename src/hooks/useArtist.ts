import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Artist } from '../types';

export function useArtist() {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(0);

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
  }, [refetch]);

  const updateArtist = async (updates: Partial<Artist>) => {
    try {
      if (!artist) return { success: false, error: 'No artist found' };

      const { error } = await supabase
        .from('artists')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', artist.id);

      if (error) throw error;
      refetchArtist();
      return { success: true };
    } catch (error) {
      console.error('Error updating artist:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const createArtist = async (artistData: Omit<Artist, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('artists')
        .insert([{
          ...artistData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      refetchArtist();
      return { success: true, data };
    } catch (error) {
      console.error('Error creating artist:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const refetchArtist = () => setRefetch(prev => prev + 1);

  return { 
    artist, 
    loading, 
    error,
    updateArtist,
    createArtist,
    refetchArtist
  };
}