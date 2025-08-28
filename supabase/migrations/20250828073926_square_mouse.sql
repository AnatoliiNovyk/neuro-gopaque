/*
  # Створити Storage Bucket'и та RLS політики

  1. Buckets
    - `logos` - для логотипів (публічний)
    - `artist-images` - для фото артистів (публічний)
  
  2. Політики
    - Публічний доступ для читання
    - Аутентифіковані користувачі можуть завантажувати/редагувати
*/

-- Створити buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('logos', 'logos', true),
  ('artist-images', 'artist-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS політики для storage.objects таблиці
-- Дозволити всім читати файли з наших buckets
CREATE POLICY "Public read access for logos and artist images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('logos', 'artist-images'));

-- Дозволити аутентифікованим користувачам завантажувати файли
CREATE POLICY "Authenticated users can upload logos and artist images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('logos', 'artist-images'));

-- Дозволити аутентифікованим користувачам оновлювати файли
CREATE POLICY "Authenticated users can update logos and artist images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id IN ('logos', 'artist-images'))
WITH CHECK (bucket_id IN ('logos', 'artist-images'));

-- Дозволити аутентифікованим користувачам видаляти файли
CREATE POLICY "Authenticated users can delete logos and artist images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id IN ('logos', 'artist-images'));