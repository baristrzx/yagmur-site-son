
/*
  # Add lawyer_notes column to cases table

  ## Changes
  - New Column: `lawyer_notes` (text, nullable) on `cases` table
    - Stores informational notes written by the lawyer for the client
    - Visible to the client in their portal
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cases' AND column_name = 'lawyer_notes'
  ) THEN
    ALTER TABLE cases ADD COLUMN lawyer_notes text DEFAULT '';
  END IF;
END $$;
