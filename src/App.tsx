import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Founder from './components/Founder';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import LoginPage from './components/portal/LoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ClientDashboard from './components/portal/ClientDashboard';

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
  const isPanelPath = path.startsWith('/panel') || path.startsWith('/muvekkil-paneli');
  const isLoginPath = path.startsWith('/giris') || path.startsWith('/login');
  const isPortalPath = isAdminPath || isPanelPath || isLoginPath;

  useEffect(() => {
    if (loading) return;

    if (user && profile) {
      if (profile.role === 'admin' && !isAdminPath) {
        window.history.replaceState(null, '', '/admin');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else if (profile.role === 'client' && !isPanelPath) {
        window.history.replaceState(null, '', '/panel');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  }, [user, profile, loading]);

  if (loading) return <Spinner />;

  if (!user && isPortalPath) {
    return <LoginPage />;
  }

  if (user && profile) {
    if (profile.role === 'admin') {
      return <AdminDashboard />;
    }
    if (profile.role === 'client') {
      if (isAdminPath) {
        return <LoginPage unauthorizedMessage="Bu sayfaya erişim yetkiniz yok." />;
      }
      return <ClientDashboard />;
    }
  }

  if (user && !profile) {
    return <Spinner />;
  }

  if (isPortalPath && !user) {
    return <LoginPage />;
  }

  return (
    <div className="font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Founder />
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
