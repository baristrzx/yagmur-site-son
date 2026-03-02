/*
  # Fix Multiple Permissive SELECT Policies on legal_pages

  ## Summary
  Merges two overlapping SELECT policies on legal_pages into one combined policy.
  Having multiple permissive policies for the same role/action causes performance issues
  and confusing security behavior.

  ## Changes
  - Drop "Admins can view all legal pages" (SELECT)
  - Drop "Anyone can view published legal pages" (SELECT)
  - Create single unified SELECT policy that allows:
    - Anyone to view published pages (is_published = true)
    - Admins to view all pages (published or not)
*/

DROP POLICY IF EXISTS "Admins can view all legal pages" ON public.legal_pages;
DROP POLICY IF EXISTS "Anyone can view published legal pages" ON public.legal_pages;

CREATE POLICY "View legal pages"
  ON public.legal_pages
  FOR SELECT
  USING (
    (is_published = true)
    OR
    (EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    ))
  );
