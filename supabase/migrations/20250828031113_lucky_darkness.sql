/*
  # Схема бази даних для сайту музичного артиста

  1. Нові таблиці
    - `artists` - інформація про артиста
      - `id` (uuid, первинний ключ)
      - `name` (text) - ім'я артиста
      - `bio` (text) - біографія
      - `image_url` (text) - URL зображення
      - `soundcloud_username` (text) - SoundCloud username
      - `social_links` (jsonb) - посилання на соціальні мережі
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `tracks` - музичні треки
      - `id` (uuid, первинний ключ)
      - `title` (text) - назва треку
      - `soundcloud_url` (text) - посилання на SoundCloud
      - `soundcloud_id` (text) - ID треку в SoundCloud
      - `image_url` (text) - обкладинка треку
      - `description` (text) - опис треку
      - `order_index` (integer) - порядок відображення
      - `created_at` (timestamp)

    - `blog_posts` - записи блогу
      - `id` (uuid, первинний ключ)
      - `title` (text) - заголовок
      - `content` (text) - повний текст
      - `excerpt` (text) - короткий опис
      - `image_url` (text) - зображення статті
      - `published` (boolean) - статус публікації
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Безпека
    - Увімкнено RLS для всіх таблиць
    - Політики для читання публічного контенту
    - Політики для адміністрування (потребують аутентифікації)
*/

-- Таблиця артистів
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text DEFAULT '',
  image_url text DEFAULT '',
  soundcloud_username text DEFAULT '',
  social_links jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Таблиця треків
CREATE TABLE IF NOT EXISTS tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  soundcloud_url text NOT NULL,
  soundcloud_id text DEFAULT '',
  image_url text DEFAULT '',
  description text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Таблиця блогу
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  image_url text DEFAULT '',
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Увімкнення RLS
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Політики для публічного читання
CREATE POLICY "Anyone can read artist info"
  ON artists
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read tracks"
  ON tracks
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published = true);

-- Політики для адміністрування (потребують аутентифікації)
CREATE POLICY "Authenticated users can manage artists"
  ON artists
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage tracks"
  ON tracks
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true);

-- Індекси для оптимізації
CREATE INDEX IF NOT EXISTS tracks_order_index_idx ON tracks(order_index);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(published);
CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON blog_posts(created_at DESC);