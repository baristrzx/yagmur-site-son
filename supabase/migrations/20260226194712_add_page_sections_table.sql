/*
  # Add page_sections table for visual page editor

  ## Purpose
  Stores all editable content sections of the website for the visual page editor.
  Each row represents one editable field within a section, with a section identifier,
  field key, and a text value.

  ## New Tables
  - `page_sections`
    - `id` (uuid, primary key)
    - `section` (text) - e.g. 'hero', 'about', 'founder', 'expertise', 'contact'
    - `key` (text) - field name within the section
    - `value` (text) - the actual content
    - `updated_at` (timestamptz)

  ## Security
  - Enable RLS
  - Only authenticated admin users can read/write (checking profiles.role = 'admin')
*/

CREATE TABLE IF NOT EXISTS page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read page sections"
  ON page_sections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert page sections"
  ON page_sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update page sections"
  ON page_sections FOR UPDATE
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

CREATE POLICY "Admins can delete page sections"
  ON page_sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
