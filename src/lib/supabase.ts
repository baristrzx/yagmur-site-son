import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'client';
  created_at: string;
};

export type Case = {
  id: string;
  client_id: string;
  case_number: string;
  title: string;
  description: string | null;
  hearing_date: string | null;
  current_stage: string;
  execution_status: string;
  lawyer_notes: string;
  last_updated: string;
  created_at: string;
};

export type CaseWithClient = Case & {
  profiles: Pick<Profile, 'full_name' | 'email'>;
};

export type CaseDocument = {
  id: string;
  case_id: string;
  uploaded_by: string;
  file_name: string;
  file_url: string;
  file_size: number;
  created_at: string;
};

export type CaseNote = {
  id: string;
  case_id: string;
  author_id: string;
  content: string;
  is_visible_to_client: boolean;
  created_at: string;
};

export type BlogCategory = {
  id: string;
  name_tr: string;
  name_en: string;
  slug: string;
  created_at: string;
};

export type BlogPost = {
  id: string;
  category_id: string | null;
  slug: string;
  title_tr: string;
  title_en: string;
  content_tr: string;
  content_en: string;
  excerpt_tr: string;
  excerpt_en: string;
  cover_image: string;
  author_id: string | null;
  is_published: boolean;
  published_at: string | null;
  view_count: number;
  meta_title_tr: string;
  meta_title_en: string;
  meta_description_tr: string;
  meta_description_en: string;
  created_at: string;
  updated_at: string;
};

export type Lawyer = {
  id: string;
  full_name: string;
  title: string;
  bio_tr: string;
  bio_en: string;
  photo_url: string;
  email: string;
  linkedin_url: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
};

export type PracticeArea = {
  id: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  icon: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
};

export type Testimonial = {
  id: string;
  client_name: string;
  company: string;
  content_tr: string;
  content_en: string;
  rating: number;
  is_published: boolean;
  order_index: number;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type LegalPage = {
  id: string;
  slug: string;
  title_tr: string;
  title_en: string;
  content_tr: string;
  content_en: string;
  meta_description_tr: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteSetting = {
  id: string;
  key: string;
  value: string;
  updated_at: string;
};

export type CmsContent = {
  id: string;
  section: string;
  key: string;
  value_tr: string;
  value_en: string;
  updated_at: string;
};
