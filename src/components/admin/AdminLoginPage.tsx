import { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type AdminLoginPageProps = {
  unauthorizedMessage?: string;
};

export default function AdminLoginPage({ unauthorizedMessage }: AdminLoginPageProps) {
  const { signIn, signOut, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError('E-posta veya şifre hatalı.');
    }
    setLoading(false);
  }

  if (unauthorizedMessage && user) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="font-serif text-2xl text-white mb-3">Erişim Reddedildi</h1>
          <p className="text-white/50 text-sm mb-8">{unauthorizedMessage}</p>
          <button
            onClick={signOut}
            className="px-6 py-3 bg-navy-700 hover:bg-navy-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-navy-800/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy-900/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#001a3a_0%,transparent_60%)]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-navy-800 border border-navy-600/50 mb-5 shadow-xl">
            <Shield className="w-7 h-7 text-gold-400" />
          </div>
          <h1 className="font-serif text-2xl text-white mb-1 tracking-wide">Admin Paneli</h1>
          <p className="text-white/35 text-xs tracking-[0.2em] uppercase">ANKH Legal — Yetkili Giriş</p>
        </div>

        <div className="bg-navy-900/80 backdrop-blur-sm border border-navy-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 bg-navy-800/60 border border-navy-700/40 rounded-xl p-4 mb-6">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <p className="text-white/50 text-xs">Bu alan yalnızca yetkili personele açıktır.</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-white/40 text-[10px] uppercase tracking-widest mb-2">
                E-posta
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-navy-800/60 border border-navy-700/60 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-gold-500/40 focus:ring-2 focus:ring-gold-500/30 transition-all"
                placeholder="admin@ankhlegal.com"
                aria-label="E-posta adresi"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-white/40 text-[10px] uppercase tracking-widest mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-navy-800/60 border border-navy-700/60 rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder-white/20 focus:outline-none focus:border-gold-500/40 focus:ring-2 focus:ring-gold-500/30 transition-all"
                  placeholder="••••••••"
                  aria-label="Şifre"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/30 rounded-lg p-1"
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-900 font-semibold py-3 rounded-xl transition-colors text-sm tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                  Doğrulanıyor...
                </span>
              ) : 'Giriş Yap'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/15 text-xs mt-6">
          © {new Date().getFullYear()} ANKH Legal
        </p>
      </div>
    </div>
  );
}
