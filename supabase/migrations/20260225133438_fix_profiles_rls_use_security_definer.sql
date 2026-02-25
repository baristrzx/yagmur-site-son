/*
  # Fix profiles RLS using a security definer helper function

  ## Problem
  The previous fix relied on JWT app_metadata which may not be populated.
  The real role is stored in the profiles table, but querying it from within
  a profiles policy causes infinite recursion.

  ## Solution
  Create a SECURITY DEFINER function that bypasses RLS to safely look up
  the current user's role, then use it in the admin policies.
*/

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (auth.uid() = id)
    OR
    (get_my_role() = 'admin')
  );

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.uid() = id)
    OR
    (get_my_role() = 'admin')
  );
