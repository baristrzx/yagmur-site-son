/*
  # Fix blog_posts INSERT RLS policy

  The existing INSERT policy for blog_posts is missing a WITH CHECK clause,
  which means it accepts any insert without verifying the caller is an admin.
  This migration drops and recreates the policy with a proper WITH CHECK.
*/

DROP POLICY IF EXISTS "Admins can insert posts" ON blog_posts;

CREATE POLICY "Admins can insert posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
  );
