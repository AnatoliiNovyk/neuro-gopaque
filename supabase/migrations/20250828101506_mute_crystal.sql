/*
  # Створення таблиці для контактної інформації

  1. Нова таблиця
    - `contact_info`
      - `id` (uuid, primary key)
      - `section_type` (text) - тип секції: 'main', 'contact', 'social'
      - `title` (text) - заголовок секції
      - `subtitle` (text) - підзаголовок
      - `email` (text) - email для контактів
      - `phone` (text) - телефон
      - `location` (text) - локація
      - `social_links` (jsonb) - посилання на соц мережі
      - `form_title` (text) - заголовок форми
      - `form_button_text` (text) - текст кнопки форми
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Безпека
    - RLS увімкнено
    - Публічний читання
    - Аутентифіковані користувачі можуть управляти
*/

CREATE TABLE IF NOT EXISTS contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type text NOT NULL DEFAULT 'main',
  title text NOT NULL DEFAULT 'Контакти',
  subtitle text DEFAULT 'Готовий до співпраці? Зв''яжіться зі мною для обговорення проектів',
  contact_title text DEFAULT 'Зв''яжіться зі мною',
  email text DEFAULT 'contact@alexnova.music',
  phone text DEFAULT '+380 XX XXX XX XX',
  location text DEFAULT 'Київ, Україна',
  social_title text DEFAULT 'Соціальні мережі',
  social_links jsonb DEFAULT '{"instagram": "https://instagram.com/alexnova", "twitter": "https://twitter.com/alexnova", "youtube": "https://youtube.com/alexnova"}',
  form_title text DEFAULT 'Надіслати повідомлення',
  form_button_text text DEFAULT 'Надіслати повідомлення',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can read contact info"
  ON contact_info
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage contact info"
  ON contact_info
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default contact info
INSERT INTO contact_info (
  section_type,
  title,
  subtitle,
  contact_title,
  email,
  phone,
  location,
  social_title,
  social_links,
  form_title,
  form_button_text
) VALUES (
  'main',
  'Контакти',
  'Готовий до співпраці? Зв''яжіться зі мною для обговорення проектів',
  'Зв''яжіться зі мною',
  'contact@alexnova.music',
  '+380 XX XXX XX XX',
  'Київ, Україна',
  'Соціальні мережі',
  '{"instagram": "https://instagram.com/alexnova", "twitter": "https://twitter.com/alexnova", "youtube": "https://youtube.com/alexnova"}',
  'Надіслати повідомлення',
  'Надіслати повідомлення'
) ON CONFLICT DO NOTHING;