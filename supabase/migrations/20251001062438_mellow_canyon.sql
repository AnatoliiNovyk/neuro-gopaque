/*
  # Створення таблиці для збереження контактних повідомлень

  1. Нова таблиця
    - `contact_submissions` - повідомлення з контактної форми
      - `id` (uuid, primary key)
      - `name` (text) - ім'я відправника
      - `email` (text) - email відправника
      - `subject` (text) - тема повідомлення
      - `message` (text) - текст повідомлення
      - `created_at` (timestamp) - час створення

  2. Безпека
    - Увімкнено RLS для таблиці `contact_submissions`
    - Додано політику для вставки повідомлень (authenticated users)
    - Додано політику для читання повідомлень адміністраторами
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Увімкнути RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Політика для вставки повідомлень (через Edge Function з service role)
CREATE POLICY "Service role can insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Політика для читання повідомлень аутентифікованими користувачами (адміністраторами)
CREATE POLICY "Authenticated users can read contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Додати індекси для оптимізації
CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx 
  ON contact_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS contact_submissions_email_idx 
  ON contact_submissions(email);