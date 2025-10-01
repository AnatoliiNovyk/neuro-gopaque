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

  const createTrack = async (trackData: Omit<Track, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .insert([trackData])
        .select()
        .single();

      if (error) throw error;
      refetchTracks();
      return { success: true, data };
    } catch (error) {
      console.error('Error creating track:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const updateTrack = async (id: string, updates: Partial<Track>) => {
    try {
      const { error } = await supabase
        .from('tracks')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      refetchTracks();
      return { success: true };
    } catch (error) {
      console.error('Error updating track:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const deleteTrack = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      refetchTracks();
      return { success: true };
    } catch (error) {
      console.error('Error deleting track:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const reorderTrack = async (id: string, newOrderIndex: number) => {
    try {
      const { error } = await supabase
        .from('tracks')
        .update({ order_index: newOrderIndex })
        .eq('id', id);

      if (error) throw error;
      refetchTracks();
      return { success: true };
    } catch (error) {
      console.error('Error reordering track:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };
  const refetchTracks = () => setRefetch(prev => prev + 1);

  return { 
    tracks, 
    loading, 
    error, 
    refetchTracks,
    createTrack,
    updateTrack,
    deleteTrack,
    reorderTrack
  };
}