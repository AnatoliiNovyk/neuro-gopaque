import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SiteStats } from '../types';

export function useStats() {
  const [stats, setStats] = useState<SiteStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('site_stats')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) {
          if (error.code === 'PGRST116') {
            // No data found, use default stats
            setStats([
              {
                id: '1',
                label: 'Треків',
                value: '50+',
                icon_name: 'music',
                order_index: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: '2',
                label: 'Фанів',
                value: '100K+',
                icon_name: 'users',
                order_index: 2,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: '3',
                label: 'Рейтинг',
                value: '4.9',
                icon_name: 'star',
                order_index: 3,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: '4',
                label: 'Прослухувань',
                value: '2M+',
                icon_name: 'play',
                order_index: 4,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ]);
          } else {
            setError(error.message);
          }
        } else {
          setStats(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refetch]);

  const createStat = async (statData: Omit<SiteStats, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('site_stats')
        .insert([{
          ...statData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      refetchStats();
      return { success: true, data };
    } catch (error) {
      console.error('Error creating stat:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const updateStat = async (id: string, updates: Partial<SiteStats>) => {
    try {
      const { error } = await supabase
        .from('site_stats')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      refetchStats();
      return { success: true };
    } catch (error) {
      console.error('Error updating stat:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const deleteStat = async (id: string) => {
    try {
      const { error } = await supabase
        .from('site_stats')
        .delete()
        .eq('id', id);

      if (error) throw error;
      refetchStats();
      return { success: true };
    } catch (error) {
      console.error('Error deleting stat:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const reorderStat = async (id: string, newOrderIndex: number) => {
    try {
      const { error } = await supabase
        .from('site_stats')
        .update({ 
          order_index: newOrderIndex,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      refetchStats();
      return { success: true };
    } catch (error) {
      console.error('Error reordering stat:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };
  const refetchStats = () => setRefetch(prev => prev + 1);

  return { 
    stats, 
    loading, 
    error, 
    refetchStats,
    createStat,
    updateStat,
    deleteStat,
    reorderStat
  };
}