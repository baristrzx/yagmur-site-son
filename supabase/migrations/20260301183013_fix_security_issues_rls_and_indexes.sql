/*
  # Fix Security Issues - RLS Optimization and Cleanup

  ## Summary
  Comprehensive security fixes addressing RLS performance issues, duplicate policies,
  unused indexes, and insecure policy configurations.

  ## Changes Made

  ### 1. RLS Policy Performance Optimization
  - Replace all `auth.uid()` calls with `(SELECT auth.uid())` subqueries in RLS policies
  - This prevents re-evaluation of auth functions for each row, improving query performance
  - Affects tables: profiles, legal_pages, page_sections

  ### 2. Remove Duplicate RLS Policies
  - Remove duplicate "Public can read legal pages" policy on legal_pages table
  - Keep only "Anyone can view published legal pages" which properly restricts access
  - This eliminates multiple permissive policies warning

  ### 3. Fix Insecure contact_messages Policy
  - Replace "Anyone can insert contact messages" policy WITH CHECK (true)
  - Add basic validation to ensure required fields are not empty
  - Prevents submission of completely empty contact forms

  ### 4. Drop Unused Indexes
  - Remove indexes that are not being used by queries
  - Reduces storage overhead and write performance impact
  - Indexes dropped: idx_blog_posts_author_id, idx_blog_posts_category_id,
    idx_case_documents_case_id, idx_case_documents_uploaded_by,
    idx_case_notes_author_id, idx_case_notes_case_id, idx_cases_client_id,
    idx_legal_pages_published

  ### 5. Fix is_admin Function
  - Add SECURITY DEFINER and stable search_path to is_admin function
  - Prevents search_path manipulation vulnerabilities

  ## Security Impact
  - Improved RLS query performance at scale
  - Eliminated duplicate permissive policies
  - Added basic validation for contact form submissions
  - Reduced attack surface by fixing function search_path
  - Optimized database by removing unused indexes
*/

-- =====================================================
-- 1. FIX PROFILES TABLE RLS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Insert profiles" ON profiles;
DROP POLICY IF EXISTS "Read profiles" ON profiles;

CREATE POLICY "Insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((id = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "Read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING ((id = (SELECT auth.uid())) OR is_admin());

-- =====================================================
-- 2. FIX LEGAL_PAGES TABLE RLS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Admins can delete legal pages" ON legal_pages;
DROP POLICY IF EXISTS "Admins can insert legal pages" ON legal_pages;
DROP POLICY IF EXISTS "Admins can update legal pages" ON legal_pages;
DROP POLICY IF EXISTS "Admins can view all legal pages" ON legal_pages;
DROP POLICY IF EXISTS "Public can read legal pages" ON legal_pages;

CREATE POLICY "Admins can view all legal pages"
  ON legal_pages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert legal pages"
  ON legal_pages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update legal pages"
  ON legal_pages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete legal pages"
  ON legal_pages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- 3. FIX PAGE_SECTIONS TABLE RLS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Admins can read page sections" ON page_sections;
DROP POLICY IF EXISTS "Admins can insert page sections" ON page_sections;
DROP POLICY IF EXISTS "Admins can update page sections" ON page_sections;
DROP POLICY IF EXISTS "Admins can delete page sections" ON page_sections;

CREATE POLICY "Admins can read page sections"
  ON page_sections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert page sections"
  ON page_sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update page sections"
  ON page_sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete page sections"
  ON page_sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- 4. FIX CONTACT_MESSAGES TABLE RLS POLICY
-- =====================================================

DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;

CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    full_name IS NOT NULL AND 
    length(trim(full_name)) > 0 AND
    email IS NOT NULL AND 
    length(trim(email)) > 0 AND
    message IS NOT NULL AND 
    length(trim(message)) > 0
  );

-- =====================================================
-- 5. DROP UNUSED INDEXES
-- =====================================================

DROP INDEX IF EXISTS idx_blog_posts_author_id;
DROP INDEX IF EXISTS idx_blog_posts_category_id;
DROP INDEX IF EXISTS idx_case_documents_case_id;
DROP INDEX IF EXISTS idx_case_documents_uploaded_by;
DROP INDEX IF EXISTS idx_case_notes_author_id;
DROP INDEX IF EXISTS idx_case_notes_case_id;
DROP INDEX IF EXISTS idx_cases_client_id;
DROP INDEX IF EXISTS idx_legal_pages_published;

-- =====================================================
-- 6. FIX IS_ADMIN FUNCTION SECURITY
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
