/*
  # Update Legal Pages Table

  1. Changes
    - Add `is_published` (boolean) column - Publication status
    - Add `display_order` (integer) column - Order in footer menu
    - Add `meta_description_tr` (text, nullable) column - SEO meta description
    - Add `created_at` (timestamptz) column

  2. Security
    - Update RLS policies to use is_published field

  3. Data Migration
    - Set existing records to published
    - Set display order based on slug
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_pages' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE legal_pages ADD COLUMN is_published boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_pages' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE legal_pages ADD COLUMN display_order integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_pages' AND column_name = 'meta_description_tr'
  ) THEN
    ALTER TABLE legal_pages ADD COLUMN meta_description_tr text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_pages' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE legal_pages ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

DROP POLICY IF EXISTS "Anyone can view published legal pages" ON legal_pages;
DROP POLICY IF EXISTS "Admins can view all legal pages" ON legal_pages;
DROP POLICY IF EXISTS "Admins can insert legal pages" ON legal_pages;
DROP POLICY IF EXISTS "Admins can update legal pages" ON legal_pages;
DROP POLICY IF EXISTS "Admins can delete legal pages" ON legal_pages;

CREATE POLICY "Anyone can view published legal pages"
  ON legal_pages FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all legal pages"
  ON legal_pages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert legal pages"
  ON legal_pages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update legal pages"
  ON legal_pages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete legal pages"
  ON legal_pages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_legal_pages_published ON legal_pages(is_published) WHERE is_published = true;

UPDATE legal_pages SET is_published = true WHERE is_published IS NULL OR is_published = false;

UPDATE legal_pages SET display_order = 1 WHERE slug = 'kvkk';
UPDATE legal_pages SET display_order = 2 WHERE slug = 'cerez-politikasi';
UPDATE legal_pages SET display_order = 3 WHERE slug = 'yasal-uyari';