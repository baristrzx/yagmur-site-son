import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Founder from './components/Founder';
import KnowledgeCenter from './components/KnowledgeCenter';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ClientLoginPage from './components/portal/ClientLoginPage';
import ClientDashboard from './components/portal/ClientDashboard';
import BlogDetailPage from './components/BlogDetailPage';
import LegalPage from './components/LegalPage';

function Spinner() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
    </div>
  );
}

function AppContent() {
  const { user, profile, loading } = useAuth();
  const path = window.location.pathname;

  const isAdminPath = path.startsWith('/admin');
  const isClientPath = path.startsWith('/client-panel');
  const isBlogPath = path.startsWith('/blog/');
  const legalSlugs = ['yasal-', 'kvkk', 'cerez-politikasi'];
  const isLegalPath = legalSlugs.some((s) => path.startsWith(`/${s}`));

  if (loading) return <Spinner />;

  if (isAdminPath) {
    if (!user) return <AdminLoginPage />;
    if (!profile) return <Spinner />;
    if (profile.role !== 'admin') return <AdminLoginPage unauthorizedMessage="Bu panele erişim yetkiniz bulunmuyor." />;
    return <AdminDashboard />;
  }

  if (isClientPath) {
    if (!user) return <ClientLoginPage />;
    if (!profile) return <Spinner />;
    if (profile.role !== 'client') return <ClientLoginPage />;
    return <ClientDashboard />;
  }

  if (isBlogPath) {
    const slug = path.split('/blog/')[1];
    return <BlogDetailPage slug={slug} />;
  }

  if (isLegalPath) {
    const slug = path.substring(1);
    return <LegalPage slug={slug} />;
  }

  return (
    <div className="font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Founder />
        <KnowledgeCenter />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
