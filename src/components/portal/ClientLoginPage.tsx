import { useState } from 'react';
import { Scale, Eye, EyeOff, AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type ClientLoginPageProps = {
  unauthorizedMessage?: string;
};

export default function ClientLoginPage({ unauthorizedMessage }: ClientLoginPageProps) {
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
      setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
    }
    setLoading(false);
  }

  if (unauthorizedMessage && user) {
    return (
      <div className="min-h-screen bg-[#001530] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="font-serif text-2xl text-white mb-3">Erişim Reddedildi</h1>
          <p className="text-white/50 text-sm mb-8">{unauthorizedMessage}</p>
          <div className="flex gap-3 justify-center">
            <a href="/" className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white/60 hover:text-white rounded-xl text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Ana Sayfa
            </a>
            <button
              onClick={signOut}
              className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 rounded-xl text-sm font-medium transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001530] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/4 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy-700/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-6">
          <a href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Ana Sayfaya Dön
          </a>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy-800 border border-gold-500/30 mb-6 shadow-lg">
            <Scale className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="font-serif text-3xl text-white mb-2 tracking-wide">ANKH Legal</h1>
          <p className="text-white/40 text-xs tracking-[0.25em] uppercase">Müvekkil Portalı</p>
        </div>

        <div className="bg-navy-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="font-serif text-xl text-white mb-1">Hoş Geldiniz</h2>
          <p className="text-white/40 text-xs mb-6">Avukatınız tarafından size sağlanan bilgilerle giriş yapın</p>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-widest mb-2">
                E-posta Adresi
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-navy-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all text-sm"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label className="block text-white/50 text-xs uppercase tracking-widest mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-navy-900/60 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/25 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-900 font-semibold py-3 rounded-xl transition-colors mt-2 text-sm tracking-wide shadow-lg shadow-gold-500/10"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                  Giriş yapılıyor...
                </span>
              ) : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-white/25 text-xs text-center leading-relaxed">
              Giriş bilgileriniz için avukatınızla iletişime geçin.
            </p>
          </div>
        </div>

        <p className="text-center text-white/15 text-xs mt-6">
          © {new Date().getFullYear()} ANKH Legal. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
