/*
  # Add SEO fields and view count to blog_posts

  1. Changes to blog_posts table
    - `view_count` (integer, default 0) - tracks page view count
    - `meta_title_tr` (text, default '') - SEO meta title in Turkish
    - `meta_title_en` (text, default '') - SEO meta title in English
    - `meta_description_tr` (text, default '') - SEO meta description in Turkish
    - `meta_description_en` (text, default '') - SEO meta description in English

  2. Notes
    - All new columns have safe defaults so existing rows are unaffected
    - No destructive operations
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN view_count integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'meta_title_tr'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN meta_title_tr text DEFAULT '';
    ALTER TABLE blog_posts ADD COLUMN meta_title_en text DEFAULT '';
    ALTER TABLE blog_posts ADD COLUMN meta_description_tr text DEFAULT '';
    ALTER TABLE blog_posts ADD COLUMN meta_description_en text DEFAULT '';
  END IF;
END $$;
