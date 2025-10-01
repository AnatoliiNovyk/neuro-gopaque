import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Track } from '../types';

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tracks')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) {
          if (error.code === 'PGRST116') {
            // No data found, use mock tracks
            setTracks([
              {
                id: '1',
                title: 'You came like a wind in the night (Main)',
                soundcloud_url: 'https://soundcloud.com/neuro-gopaque/you-came-like-a-wind-in-the-night-main',
                soundcloud_id: '123456789',
                image_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
                description: 'Atmospheric track with deep emotional undertones',
                order_index: 1,
               created_at: new Date().toISOString(),
               audio_url: 'https://www.w3schools.com/html/horse.mp3'
              },
              {
                id: '2',
                title: 'Digital Emotions',
                soundcloud_url: 'https://soundcloud.com/neuro-gopaque/digital-emotions',
                soundcloud_id: '987654321',
                image_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
                description: 'Electronic composition with modern beats',
                order_index: 2,
               created_at: new Date().toISOString(),
               audio_url: 'https://www.w3schools.com/html/mov_bbb.mp3'
              }
            ]);
          } else {
            setError(error.message);
          }
        } else {
          setTracks(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [refetch]);

  const refetchTracks = () => setRefetch(prev => prev + 1);

  return { tracks, loading, error, refetchTracks };
}