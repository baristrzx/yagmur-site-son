import { lazy, Suspense } from 'react';
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

const AdminLoginPage = lazy(() => import('./components/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const ClientLoginPage = lazy(() => import('./components/portal/ClientLoginPage'));
const ClientDashboard = lazy(() => import('./components/portal/ClientDashboard'));
const BlogDetailPage = lazy(() => import('./components/BlogDetailPage'));
const LegalPage = lazy(() => import('./components/LegalPage'));

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
    if (!user) return <Suspense fallback={<Spinner />}><AdminLoginPage /></Suspense>;
    if (!profile) return <Spinner />;
    if (profile.role !== 'admin') return <Suspense fallback={<Spinner />}><AdminLoginPage unauthorizedMessage="Bu panele erişim yetkiniz bulunmuyor." /></Suspense>;
    return <Suspense fallback={<Spinner />}><AdminDashboard /></Suspense>;
  }

  if (isClientPath) {
    if (!user) return <Suspense fallback={<Spinner />}><ClientLoginPage /></Suspense>;
    if (!profile) return <Spinner />;
    if (profile.role !== 'client') return <Suspense fallback={<Spinner />}><ClientLoginPage /></Suspense>;
    return <Suspense fallback={<Spinner />}><ClientDashboard /></Suspense>;
  }

  if (isBlogPath) {
    const slug = path.split('/blog/')[1];
    return <Suspense fallback={<Spinner />}><BlogDetailPage slug={slug} /></Suspense>;
  }

  if (isLegalPath) {
    const slug = path.substring(1);
    return <Suspense fallback={<Spinner />}><LegalPage slug={slug} /></Suspense>;
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
