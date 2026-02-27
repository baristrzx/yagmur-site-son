/*
  # Fix profiles RLS infinite recursion (v2)

  ## Problem
  The "Read profiles" and "Insert profiles" policies query the profiles table
  from within a profiles policy, causing infinite recursion error 42P17.
  
  Previous attempts to fix this with auth.jwt() metadata didn't work because
  the role is stored in the profiles table, not in JWT metadata.

  ## Solution
  Create a SECURITY DEFINER function that bypasses RLS to check if the current
  user is an admin, then use that function in the policies.

  1. Create helper function: is_admin()
  2. Replace recursive policies with policies that use is_admin()
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Insert profiles" ON public.profiles;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Recreate SELECT policy using is_admin()
CREATE POLICY "Read profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR public.is_admin()
  );

-- Recreate INSERT policy using is_admin()
CREATE POLICY "Insert profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    id = auth.uid()
    OR public.is_admin()
  );
