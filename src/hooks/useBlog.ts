import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) {
          if (error.code === 'PGRST116') {
            // No data found, use mock posts
            setPosts([
              {
                id: '1',
                title: 'Новий альбом "Digital Dreams"',
                excerpt: 'Роботою над новим альбомом я займався понад рік...',
                content: 'Роботою над новим альбомом я займався понад рік. Це колекція треків, що відображають мою еволюцію як артиста.',
                image_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
                published: true,
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
              },
              {
                id: '2',
                title: 'Концерт у Києві',
                excerpt: 'Незабутній вечір з моїми фанами...',
                content: 'Незабутній вечір з моїми фанами у столиці. Дякую всім, хто прийшов підтримати!',
                image_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
                published: true,
                created_at: '2024-01-10T18:00:00Z',
                updated_at: '2024-01-10T18:00:00Z'
              }
            ]);
          } else {
            setError(error.message);
          }
        } else {
          setPosts(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}