/*
  # Fix Multiple Permissive Policies

  Consolidates multiple permissive SELECT/INSERT policies into single policies
  per role to avoid the "multiple permissive policies" security warning.

  ## Tables fixed:
  - blog_posts: merge "Admins can read all posts" + "Public can read published posts"
  - case_documents: merge admin + client SELECT policies
  - case_notes: merge admin + client SELECT policies
  - cases: merge admin + client SELECT policies
  - lawyers: merge admin + public SELECT policies
  - practice_areas: merge admin + public SELECT policies
  - profiles: merge admin + user SELECT policies, merge admin + user INSERT policies
  - testimonials: merge admin + public SELECT policies

  ## Strategy:
  Each merged policy uses OR logic: allows access if user is admin OR meets the
  original non-admin condition. This preserves all existing access patterns.
*/

-- ============================================================
-- blog_posts: merge SELECT policies
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can read published posts" ON public.blog_posts;

CREATE POLICY "Read blog posts"
  ON public.blog_posts FOR SELECT
  USING (
    is_published = true
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- case_documents: merge SELECT policies
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all case documents" ON public.case_documents;
DROP POLICY IF EXISTS "Clients can read their case documents" ON public.case_documents;

CREATE POLICY "Read case documents"
  ON public.case_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = case_documents.case_id AND c.client_id = (select auth.uid())
    )
  );

-- ============================================================
-- case_notes: merge SELECT policies
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all case notes" ON public.case_notes;
DROP POLICY IF EXISTS "Clients can read visible notes on their cases" ON public.case_notes;

CREATE POLICY "Read case notes"
  ON public.case_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
    OR (
      is_visible_to_client = true AND
      EXISTS (
        SELECT 1 FROM public.cases c
        WHERE c.id = case_notes.case_id AND c.client_id = (select auth.uid())
      )
    )
  );

-- ============================================================
-- cases: merge SELECT policies
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all cases" ON public.cases;
DROP POLICY IF EXISTS "Clients can read own cases" ON public.cases;

CREATE POLICY "Read cases"
  ON public.cases FOR SELECT
  TO authenticated
  USING (
    client_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- lawyers: merge SELECT policies
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all lawyers" ON public.lawyers;
DROP POLICY IF EXISTS "Public can read active lawyers" ON public.lawyers;

CREATE POLICY "Read lawyers"
  ON public.lawyers FOR SELECT
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- practice_areas: merge SELECT policies
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all practice areas" ON public.practice_areas;
DROP POLICY IF EXISTS "Public can read active practice areas" ON public.practice_areas;

CREATE POLICY "Read practice areas"
  ON public.practice_areas FOR SELECT
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- profiles: merge SELECT policies
-- ============================================================

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;

CREATE POLICY "Read profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- profiles: merge INSERT policies
-- ============================================================

DROP POLICY IF EXISTS "Allow own profile insert on signup" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;

CREATE POLICY "Insert profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

-- ============================================================
-- testimonials: merge SELECT policies
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public can read published testimonials" ON public.testimonials;

CREATE POLICY "Read testimonials"
  ON public.testimonials FOR SELECT
  USING (
    is_published = true
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );
