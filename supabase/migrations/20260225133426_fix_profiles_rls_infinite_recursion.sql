/*
  # Fix infinite recursion in profiles RLS policies

  ## Problem
  "Admins can read all profiles" and "Admins can insert profiles" policies
  query the profiles table from within a profiles policy, causing infinite recursion.

  ## Solution
  Replace the recursive sub-selects with auth.jwt() metadata checks so no
  additional query to profiles is needed when evaluating the policy.
*/

DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (auth.uid() = id)
    OR
    ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    OR
    ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  );

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.uid() = id)
    OR
    ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    OR
    ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  );
