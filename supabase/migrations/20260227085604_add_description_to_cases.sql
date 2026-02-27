/*
  # Add description column to cases table

  1. Changes
    - Add `description` column to `cases` table
      - Type: TEXT
      - Nullable: true (to avoid issues with existing data)
      - Default: empty string for new records
    
  2. Notes
    - This column was referenced in the TypeScript types but missing from the actual schema
    - Adding as nullable to prevent data issues with existing records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cases' AND column_name = 'description'
  ) THEN
    ALTER TABLE cases ADD COLUMN description text DEFAULT '';
  END IF;
END $$;
