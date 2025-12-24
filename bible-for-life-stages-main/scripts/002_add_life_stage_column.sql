-- Migration: Add life_stage column to existing cached_content table
-- This handles the case where the table already exists without the column

-- Drop the old unique constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'cached_content_verse_reference_key'
  ) THEN
    ALTER TABLE public.cached_content DROP CONSTRAINT cached_content_verse_reference_key;
  END IF;
END $$;

-- Add life_stage column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'cached_content' 
    AND column_name = 'life_stage'
  ) THEN
    ALTER TABLE public.cached_content ADD COLUMN life_stage TEXT;
  END IF;
END $$;

-- Drop old index if exists
DROP INDEX IF EXISTS public.idx_cached_content_verse;

-- Create new composite unique constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'cached_content_verse_reference_life_stage_key'
  ) THEN
    ALTER TABLE public.cached_content 
    ADD CONSTRAINT cached_content_verse_reference_life_stage_key 
    UNIQUE(verse_reference, life_stage);
  END IF;
END $$;

-- Create new composite index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cached_content_verse_stage
  ON public.cached_content(verse_reference, life_stage);

-- Update RLS policies if they don't exist
DO $$
BEGIN
  -- Drop existing policies if they exist to recreate them
  DROP POLICY IF EXISTS "Allow public read access" ON public.cached_content;
  DROP POLICY IF EXISTS "Allow server insert access" ON public.cached_content;
  DROP POLICY IF EXISTS "Allow server update access" ON public.cached_content;
  
  -- Create read policy
  CREATE POLICY "Allow public read access" 
    ON public.cached_content 
    FOR SELECT 
    USING (true);
  
  -- Create insert policy for both anon and authenticated
  CREATE POLICY "Allow server insert access"
    ON public.cached_content
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  
  -- Create update policy for both anon and authenticated
  CREATE POLICY "Allow server update access"
    ON public.cached_content
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
END $$;
