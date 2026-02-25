import { useEffect, useState } from 'react';
import AdminLayout, { type AdminView } from './AdminLayout';
import DashboardPanel from './DashboardPanel';
import CasesPanel from './CasesPanel';
import ClientsPanel from './ClientsPanel';
import BlogPanel from './BlogPanel';
import LawyersPanel from './LawyersPanel';
import PracticeAreasPanel from './PracticeAreasPanel';
import TestimonialsPanel from './TestimonialsPanel';
import MessagesPanel from './MessagesPanel';
import CmsPanel from './CmsPanel';
import LegalPagesPanel from './LegalPagesPanel';
import SiteSettingsPanel from './SiteSettingsPanel';
import { supabase } from '../../lib/supabase';

const CMS_SECTION_MAP: Partial<Record<AdminView, string>> = {
  cms_hero: 'hero',
  cms_about: 'about',
  cms_approach: 'approach',
  cms_contact: 'contact',
};

const LEGAL_SLUG_MAP: Partial<Record<AdminView, string>> = {
  legal_kvkk: 'kvkk',
  legal_aydinlatma: 'aydinlatma-metni',
  legal_cerez: 'cerez-politikasi',
};

export default function AdminDashboard() {
  const [view, setView] = useState<AdminView>('dashboard');
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false)
      .then(({ count }) => setUnreadMessages(count || 0));
  }, [view]);

  function renderPanel() {
    if (CMS_SECTION_MAP[view]) {
      return <CmsPanel section={CMS_SECTION_MAP[view]!} />;
    }
    if (LEGAL_SLUG_MAP[view]) {
      return <LegalPagesPanel slug={LEGAL_SLUG_MAP[view]!} />;
    }
    switch (view) {
      case 'dashboard':      return <DashboardPanel onNavigate={setView} />;
      case 'cases':          return <CasesPanel />;
      case 'clients':        return <ClientsPanel />;
      case 'blog_list':      return <BlogPanel initialView="list" />;
      case 'blog_new':       return <BlogPanel initialView="editor" />;
      case 'lawyers':        return <LawyersPanel />;
      case 'practice_areas': return <PracticeAreasPanel />;
      case 'testimonials':   return <TestimonialsPanel />;
      case 'messages':       return <MessagesPanel />;
      case 'settings':       return <SiteSettingsPanel />;
      default:               return <DashboardPanel onNavigate={setView} />;
    }
  }

  return (
    <AdminLayout view={view} onViewChange={setView} unreadMessages={unreadMessages}>
      {renderPanel()}
    </AdminLayout>
  );
}
