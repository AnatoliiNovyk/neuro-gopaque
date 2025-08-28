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

  const refetchStats = () => setRefetch(prev => prev + 1);

  return { stats, loading, error, refetchStats };
}