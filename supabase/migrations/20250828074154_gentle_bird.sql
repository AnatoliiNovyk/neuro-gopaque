/*
  # Створити таблицю статистик сайту

  1. Нова таблиця
    - `site_stats` - статистики які відображаються на головній сторінці
      - `id` (uuid, primary key)
      - `label` (текст, назва статистики)
      - `value` (текст, значення статистики)
      - `icon_name` (текст, назва іконки)
      - `order_index` (integer, порядок відображення)

  2. Безпека
    - Увімкнути RLS на таблиці `site_stats`
    - Додати політику для публічного читання
    - Додати політику для аутентифікованих користувачів
*/

-- Створити таблицю статистик
CREATE TABLE IF NOT EXISTS site_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  icon_name text NOT NULL DEFAULT 'music',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Увімкнути RLS
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

-- Політика для публічного читання
CREATE POLICY "Anyone can read site stats"
  ON site_stats
  FOR SELECT
  TO public
  USING (true);

-- Політика для аутентифікованих користувачів
CREATE POLICY "Authenticated users can manage site stats"
  ON site_stats
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Додати початкові дані
INSERT INTO site_stats (label, value, icon_name, order_index)
VALUES 
  ('Треків', '50+', 'music', 1),
  ('Фанів', '100K+', 'users', 2),
  ('Рейтинг', '4.9', 'star', 3),
  ('Прослухувань', '2M+', 'play', 4)
ON CONFLICT DO NOTHING;