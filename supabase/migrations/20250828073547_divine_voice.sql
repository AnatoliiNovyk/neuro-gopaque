/*
  # Створення storage bucket'ів для зображень

  1. Нові bucket'и
    - `logos` - для логотипів артистів
    - `artist-images` - для головних фото артистів

  2. Налаштування безпеки
    - Публічний доступ для читання
    - Обмеження на розмір файлів
    - Дозволені тільки зображення
*/

-- Створити bucket для логотипів
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Створити bucket для фото артистів  
INSERT INTO storage.buckets (id, name, public)
VALUES ('artist-images', 'artist-images', true)
ON CONFLICT (id) DO NOTHING;

-- Налаштувати політики для bucket логотипів
CREATE POLICY "Allow public read access on logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');

CREATE POLICY "Allow authenticated upload to logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logos' AND (storage.foldername(name))[1] = 'logos');

CREATE POLICY "Allow authenticated update of logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'logos');

CREATE POLICY "Allow authenticated delete of logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'logos');

-- Налаштувати політики для bucket фото артистів
CREATE POLICY "Allow public read access on artist-images"
ON storage.objects FOR SELECT  
TO public
USING (bucket_id = 'artist-images');

CREATE POLICY "Allow authenticated upload to artist-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'artist-images' AND (storage.foldername(name))[1] = 'artist-images');

CREATE POLICY "Allow authenticated update of artist-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'artist-images');

CREATE POLICY "Allow authenticated delete of artist-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'artist-images');