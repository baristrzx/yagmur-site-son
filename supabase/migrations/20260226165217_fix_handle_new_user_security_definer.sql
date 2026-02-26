
/*
  # Fix handle_new_user trigger function

  ## Problem
  The handle_new_user trigger runs when a new auth user is created.
  It tries to INSERT into the profiles table, but RLS policies require
  the `authenticated` role. The trigger runs as the `postgres` role
  without an authenticated session, causing "Database error creating new user".

  ## Fix
  Recreate the function with SECURITY DEFINER so it runs with the
  privileges of the function owner (postgres/superuser), bypassing RLS.
  Also set search_path for security best practices.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
