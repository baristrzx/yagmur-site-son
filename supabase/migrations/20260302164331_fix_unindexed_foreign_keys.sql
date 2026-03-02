/*
  # Fix Unindexed Foreign Keys

  ## Summary
  Adds covering indexes for all foreign key columns that were missing indexes.
  This improves JOIN and lookup query performance significantly.

  ## New Indexes
  - `blog_posts.author_id` → covers `blog_posts_author_id_fkey`
  - `blog_posts.category_id` → covers `blog_posts_category_id_fkey`
  - `case_documents.case_id` → covers `case_documents_case_id_fkey`
  - `case_documents.uploaded_by` → covers `case_documents_uploaded_by_fkey`
  - `case_notes.author_id` → covers `case_notes_author_id_fkey`
  - `case_notes.case_id` → covers `case_notes_case_id_fkey`
  - `cases.client_id` → covers `cases_client_id_fkey`
*/

CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_case_documents_case_id ON public.case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_case_documents_uploaded_by ON public.case_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_case_notes_author_id ON public.case_notes(author_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_case_id ON public.case_notes(case_id);
CREATE INDEX IF NOT EXISTS idx_cases_client_id ON public.cases(client_id);
