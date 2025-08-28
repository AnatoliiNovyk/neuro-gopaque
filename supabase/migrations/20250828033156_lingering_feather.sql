/*
  # Додати поле для лого артиста

  1. Зміни
    - Додати поле `logo_url` до таблиці `artists`
    - Встановити значення за замовчуванням
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'artists' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE artists ADD COLUMN logo_url text DEFAULT ''::text;
  END IF;
END $$;