/*
  # Legal Case Management System - Core Tables

  ## Summary
  Creates the core tables for the ANKH Legal Case Management System.

  ## New Tables

  ### profiles
  - `id` (uuid, PK) - references auth.users
  - `email` (text) - user email
  - `full_name` (text) - display name
  - `role` (text) - either 'admin' or 'client'
  - `created_at` (timestamptz)

  ### cases
  - `id` (uuid, PK)
  - `client_id` (uuid, FK -> profiles.id)
  - `case_number` (text, unique) - e.g. "2024-001"
  - `title` (text) - case title/description
  - `hearing_date` (date, nullable)
  - `current_stage` (text) - Son Aşama value
  - `execution_status` (text) - execution/enforcement status
  - `last_updated` (timestamptz) - auto-updated on row change
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on both tables
  - Admins can read/write all data
  - Clients can only read their own profile and their own cases
  - A trigger auto-creates a profile row when a user signs up
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can insert profiles (when creating client accounts)
CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Allow insert for own profile (used by trigger / signup)
CREATE POLICY "Allow own profile insert on signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  case_number text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  hearing_date date,
  current_stage text NOT NULL DEFAULT '',
  execution_status text NOT NULL DEFAULT '',
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Admins can read all cases
CREATE POLICY "Admins can read all cases"
  ON cases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Clients can read their own cases
CREATE POLICY "Clients can read own cases"
  ON cases FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

-- Admins can insert cases
CREATE POLICY "Admins can insert cases"
  ON cases FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Admins can update cases
CREATE POLICY "Admins can update cases"
  ON cases FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Admins can delete cases
CREATE POLICY "Admins can delete cases"
  ON cases FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Trigger to auto-update last_updated on cases
CREATE OR REPLACE FUNCTION update_cases_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cases_last_updated_trigger
  BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_cases_last_updated();

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
