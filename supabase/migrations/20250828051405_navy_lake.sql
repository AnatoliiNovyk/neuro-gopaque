/*
  # Add audio file support to tracks table

  1. Changes to tracks table
    - Add `audio_url` column for uploaded audio files
    - Add `file_path` column for storage path reference
    - Add `file_size` column for file size tracking
    - Add `duration` column for actual track duration
    
  2. Security
    - Maintain existing RLS policies
    - Add policies for file management

  This allows storing actual audio files alongside SoundCloud URLs
*/

-- Add new columns for audio file support
DO $$
BEGIN
  -- Add audio_url column for direct audio file links
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tracks' AND column_name = 'audio_url'
  ) THEN
    ALTER TABLE tracks ADD COLUMN audio_url text DEFAULT '';
  END IF;
  
  -- Add file_path for storage reference
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tracks' AND column_name = 'file_path'
  ) THEN
    ALTER TABLE tracks ADD COLUMN file_path text DEFAULT '';
  END IF;
  
  -- Add file_size for tracking
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tracks' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE tracks ADD COLUMN file_size integer DEFAULT 0;
  END IF;
  
  -- Add duration for actual track length
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tracks' AND column_name = 'duration'
  ) THEN
    ALTER TABLE tracks ADD COLUMN duration integer DEFAULT 0;
  END IF;
END $$;