import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(0);

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
  }, [refetch]);

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          ...postData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      refetchPosts();
      return { success: true, data };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      refetchPosts();
      return { success: true };
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      refetchPosts();
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          published: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      refetchPosts();
      return { success: true };
    } catch (error) {
      console.error('Error toggling published status:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const refetchPosts = () => setRefetch(prev => prev + 1);

  return { 
    posts, 
    loading, 
    error,
    fetchAllPosts,
    createPost,
    updatePost,
    deletePost,
    togglePublished,
    refetchPosts
  };
}