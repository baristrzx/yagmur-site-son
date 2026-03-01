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
import LegalPagesPanel from './LegalPagesPanel';
import SiteSettingsPanel from './SiteSettingsPanel';
import PageEditorPanel from './PageEditorPanel';
import { supabase } from '../../lib/supabase';

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
    switch (view) {
      case 'dashboard':      return <DashboardPanel onNavigate={setView} />;
      case 'page_editor':    return <PageEditorPanel />;
      case 'cases':          return <CasesPanel />;
      case 'clients':        return <ClientsPanel />;
      case 'blog_list':      return <BlogPanel initialView="list" />;
      case 'blog_new':       return <BlogPanel initialView="editor" />;
      case 'lawyers':        return <LawyersPanel />;
      case 'practice_areas': return <PracticeAreasPanel />;
      case 'testimonials':   return <TestimonialsPanel />;
      case 'messages':       return <MessagesPanel />;
      case 'legal_pages':    return <LegalPagesPanel />;
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
