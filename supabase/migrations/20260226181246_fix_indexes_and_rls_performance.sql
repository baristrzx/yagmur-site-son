/*
  # Fix Security Issues: Indexes, RLS Performance, and Functions

  ## 1. Unindexed Foreign Keys
  Adding covering indexes for all foreign key columns that lack them:
  - blog_posts: author_id, category_id
  - case_documents: case_id, uploaded_by
  - case_notes: author_id, case_id
  - cases: client_id

  ## 2. RLS Auth Function Performance
  Replacing all `auth.uid()` and `auth.jwt()` calls in RLS policies with
  `(select auth.uid())` and `(select auth.jwt())` pattern to prevent
  re-evaluation per row, improving query performance at scale.

  Tables affected:
  - profiles (5 policies)
  - cases (5 policies)
  - case_documents (4 policies)
  - case_notes (5 policies)
  - blog_categories (3 policies)
  - blog_posts (4 policies)
  - lawyers (4 policies)
  - practice_areas (4 policies)
  - testimonials (4 policies)
  - contact_messages (3 policies)
  - cms_content (3 policies)
  - legal_pages (3 policies)
  - site_settings (3 policies)

  ## 3. Mutable Search Path Functions
  Setting explicit search_path on:
  - public.update_cases_last_updated
  - public.get_my_role
*/

-- ============================================================
-- SECTION 1: Add indexes for unindexed foreign keys
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_case_documents_case_id ON public.case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_case_documents_uploaded_by ON public.case_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_case_notes_author_id ON public.case_notes(author_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_case_id ON public.case_notes(case_id);
CREATE INDEX IF NOT EXISTS idx_cases_client_id ON public.cases(client_id);

-- ============================================================
-- SECTION 2: Fix RLS policies - profiles table
-- ============================================================

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow own profile insert on signup" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Allow own profile insert on signup"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- SECTION 3: Fix RLS policies - cases table
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all cases" ON public.cases;
DROP POLICY IF EXISTS "Clients can read own cases" ON public.cases;
DROP POLICY IF EXISTS "Admins can insert cases" ON public.cases;
DROP POLICY IF EXISTS "Admins can update cases" ON public.cases;
DROP POLICY IF EXISTS "Admins can delete cases" ON public.cases;

CREATE POLICY "Admins can read all cases"
  ON public.cases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Clients can read own cases"
  ON public.cases FOR SELECT
  TO authenticated
  USING (client_id = (select auth.uid()));

CREATE POLICY "Admins can insert cases"
  ON public.cases FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update cases"
  ON public.cases FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete cases"
  ON public.cases FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- SECTION 4: Fix RLS policies - case_documents table
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all case documents" ON public.case_documents;
DROP POLICY IF EXISTS "Clients can read their case documents" ON public.case_documents;
DROP POLICY IF EXISTS "Admins can insert case documents" ON public.case_documents;
DROP POLICY IF EXISTS "Admins can delete case documents" ON public.case_documents;

CREATE POLICY "Admins can read all case documents"
  ON public.case_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Clients can read their case documents"
  ON public.case_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = case_documents.case_id AND c.client_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can insert case documents"
  ON public.case_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete case documents"
  ON public.case_documents FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- SECTION 5: Fix RLS policies - case_notes table
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all case notes" ON public.case_notes;
DROP POLICY IF EXISTS "Clients can read visible notes on their cases" ON public.case_notes;
DROP POLICY IF EXISTS "Admins can insert case notes" ON public.case_notes;
DROP POLICY IF EXISTS "Admins can update case notes" ON public.case_notes;
DROP POLICY IF EXISTS "Admins can delete case notes" ON public.case_notes;

CREATE POLICY "Admins can read all case notes"
  ON public.case_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Clients can read visible notes on their cases"
  ON public.case_notes FOR SELECT
  TO authenticated
  USING (
    is_visible_to_client = true AND
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = case_notes.case_id AND c.client_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can insert case notes"
  ON public.case_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update case notes"
  ON public.case_notes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete case notes"
  ON public.case_notes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- SECTION 6: Fix RLS policies - blog_categories table
-- ============================================================

DROP POLICY IF EXISTS "Admins can insert blog categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Admins can update blog categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Admins can delete blog categories" ON public.blog_categories;

CREATE POLICY "Admins can insert blog categories"
  ON public.blog_categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update blog categories"
  ON public.blog_categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete blog categories"
  ON public.blog_categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- SECTION 7: Fix RLS policies - blog_posts table
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can insert posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete posts" ON public.blog_posts;

CREATE POLICY "Admins can read all posts"
  ON public.blog_posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert posts"
  ON public.blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update posts"
  ON public.blog_posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete posts"
  ON public.blog_posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- SECTION 8: Fix RLS policies - lawyers table
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all lawyers" ON public.lawyers;
DROP POLICY IF EXISTS "Admins can insert lawyers" ON public.lawyers;
DROP POLICY IF EXISTS "Admins can update lawyers" ON public.lawyers;
DROP POLICY IF EXISTS "Admins can delete lawyers" ON public.lawyers;

CREATE POLICY "Admins can read all lawyers"
  ON public.lawyers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert lawyers"
  ON public.lawyers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update lawyers"
  ON public.lawyers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete lawyers"
  ON public.lawyers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- SECTION 9: Fix RLS policies - practice_areas table
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all practice areas" ON public.practice_areas;
DROP POLICY IF EXISTS "Admins can insert practice areas" ON public.practice_areas;
DROP POLICY IF EXISTS "Admins can update practice areas" ON public.practice_areas;
DROP POLICY IF EXISTS "Admins can delete practice areas" ON public.practice_areas;

CREATE POLICY "Admins can read all practice areas"
  ON public.practice_areas FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert practice areas"
  ON public.practice_areas FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update practice areas"
  ON public.practice_areas FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete practice areas"
  ON public.practice_areas FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- SECTION 10: Fix RLS policies - testimonials table
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;

CREATE POLICY "Admins can read all testimonials"
  ON public.testimonials FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- SECTION 11: Fix RLS policies - contact_messages table
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can delete messages" ON public.contact_messages;

CREATE POLICY "Admins can read all messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete messages"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- SECTION 12: Fix RLS policies - cms_content table
-- ============================================================

DROP POLICY IF EXISTS "Admins can insert cms content" ON public.cms_content;
DROP POLICY IF EXISTS "Admins can update cms content" ON public.cms_content;
DROP POLICY IF EXISTS "Admins can delete cms content" ON public.cms_content;

CREATE POLICY "Admins can insert cms content"
  ON public.cms_content FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update cms content"
  ON public.cms_content FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete cms content"
  ON public.cms_content FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- SECTION 13: Fix RLS policies - legal_pages table
-- ============================================================

DROP POLICY IF EXISTS "Admins can insert legal pages" ON public.legal_pages;
DROP POLICY IF EXISTS "Admins can update legal pages" ON public.legal_pages;
DROP POLICY IF EXISTS "Admins can delete legal pages" ON public.legal_pages;

CREATE POLICY "Admins can insert legal pages"
  ON public.legal_pages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update legal pages"
  ON public.legal_pages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete legal pages"
  ON public.legal_pages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- SECTION 14: Fix RLS policies - site_settings table
-- ============================================================

DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can delete site settings" ON public.site_settings;

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete site settings"
  ON public.site_settings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- SECTION 15: Fix mutable search_path functions
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_cases_last_updated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = (select auth.uid());
$$;
