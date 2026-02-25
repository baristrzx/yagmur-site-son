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

function AppContent() {
  const { user, profile, loading } = useAuth();

  const isPortalRoute =
    window.location.pathname.startsWith('/portal') ||
    window.location.pathname.startsWith('/admin') ||
    window.location.pathname.startsWith('/login');

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && isPortalRoute) {
    return <LoginPage />;
  }

  if (user && profile) {
    if (profile.role === 'admin') {
      return <AdminDashboard />;
    }
    if (profile.role === 'client') {
      return <ClientDashboard />;
    }
  }

  if (user && !profile) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
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
