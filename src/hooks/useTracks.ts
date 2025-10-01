import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Track } from '../types';

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                title: 'Midnight Dreams',
                soundcloud_url: 'https://soundcloud.com/example/midnight-dreams',
                soundcloud_id: '123456789',
                image_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
                description: 'Атмосферний трек з глибокими басами',
                order_index: 1,
                created_at: new Date().toISOString()
              },
              {
                id: '2',
                title: 'Electric Pulse',
                soundcloud_url: 'https://soundcloud.com/example/electric-pulse',
                soundcloud_id: '987654321',
                image_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
                description: 'Енергійна композиція з електронними битами',
                order_index: 2,
                created_at: new Date().toISOString()
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
  }, []);

  return { tracks, loading, error };
}