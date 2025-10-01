import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export async function checkSupabaseConnection() {
  console.log('🔍 Перевірка підключення до Supabase...');
  console.log('URL:', supabaseUrl);
  console.log('Key prefix:', supabaseAnonKey.substring(0, 20) + '...');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Відсутні змінні середовища Supabase');
    return false;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Спробуємо виконати простий запит
    const { data, error } = await supabase
      .from('artists')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.error('❌ Помилка підключення до Supabase:', error.message);
      
      if (error.message.includes('relation "public.artists" does not exist')) {
        console.log('💡 Таблиця "artists" не існує. Потрібно застосувати міграції.');
        return 'MIGRATIONS_NEEDED';
      }
      
      return false;
    }

    console.log('✅ Підключення до Supabase успішне');
    console.log('📊 Дані:', data);
    return true;
  } catch (err) {
    console.error('❌ Помилка при перевірці:', err);
    return false;
  }
}

// Автоматична перевірка при завантаженні в development режимі
if (import.meta.env.DEV) {
  checkSupabaseConnection().then(result => {
    if (result === 'MIGRATIONS_NEEDED') {
      console.log(`
🚨 НЕОБХІДНО ЗАСТОСУВАТИ МІГРАЦІЇ

Схема бази даних не застосована. Виконайте наступні кроки:

1. Відкрийте панель Supabase: https://supabase.com/dashboard
2. Виберіть проект: ykrqxabhmpnjgyslkdwx
3. Перейдіть до SQL Editor
4. Виконайте міграційні скрипти з папки supabase/migrations/

АБО

Використовуйте кнопку "Connect to Supabase" у верхньому куті Bolt.
      `);
    }
  });
}