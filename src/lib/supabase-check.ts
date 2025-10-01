import { supabase } from './supabase';

export async function checkSupabaseConnection() {
  try {
    const { error } = await supabase.from('artists').select('count', { count: 'exact' });
    
    if (error) {
      console.log('🔶 Supabase connection: Connected but no data tables found');
      console.log('💡 Click the "Connect to Supabase" button to set up your database');
    } else {
      console.log('✅ Supabase connection: Successfully connected and tables are accessible');
    }
  } catch (err) {
    console.log('❌ Supabase connection: Failed to connect');
    console.log('💡 Please check your environment variables and Supabase settings');
    console.error('Connection error:', err);
  }
}