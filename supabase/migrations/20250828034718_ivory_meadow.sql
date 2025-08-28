/*
  # Оновлення RLS політик для адмін функцій

  1. Оновлення політик для таблиці artists
  2. Оновлення політик для Storage bucket logos
  3. Забезпечення правильного доступу для аутентифікованих користувачів
*/

-- Оновлення політик для таблиці artists
DROP POLICY IF EXISTS "Authenticated users can manage artists" ON artists;

CREATE POLICY "Allow authenticated users to manage artists"
  ON artists
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Додати політику для публічного читання
CREATE POLICY "Allow public read access to artists" 
  ON artists 
  FOR SELECT 
  TO public 
  USING (true);

-- Оновлення політик для Storage
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update logos" ON storage.objects;  
DROP POLICY IF EXISTS "Authenticated users can delete logos" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload logos"
  ON storage.objects 
  FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Allow authenticated users to update logos"
  ON storage.objects 
  FOR UPDATE 
  TO authenticated
  USING (bucket_id = 'logos')
  WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Allow authenticated users to delete logos"
  ON storage.objects 
  FOR DELETE 
  TO authenticated
  USING (bucket_id = 'logos');