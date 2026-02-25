import { useState } from 'react';
import { Scale, Eye, EyeOff, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type LoginPageProps = {
  unauthorizedMessage?: string;
};

export default function LoginPage({ unauthorizedMessage }: LoginPageProps) {
  const { signIn } = useAuth();
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

  return (
    <div className="min-h-screen bg-[#001530] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy-700/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_70%,#001530)]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy-800 border border-gold-500/30 mb-6 shadow-lg">
            <Scale className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="font-serif text-3xl text-white mb-2 tracking-wide">ANKH Legal</h1>
          <p className="text-white/40 text-xs tracking-[0.25em] uppercase">Güvenli Giriş Paneli</p>
        </div>

        <div className="bg-navy-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          {unauthorizedMessage && (
            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-amber-200 text-sm">{unauthorizedMessage}</p>
            </div>
          )}

          <h2 className="font-serif text-xl text-white mb-1">Giriş Yap</h2>
          <p className="text-white/40 text-xs mb-6">Admin veya müvekkil hesabınızla giriş yapın</p>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
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
                className="w-full bg-navy-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all"
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
                  className="w-full bg-navy-900/60 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/25 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all"
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
              className="w-full bg-gold-500 hover:bg-gold-400 active:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-navy-900 font-semibold py-3 rounded-xl transition-all tracking-wide shadow-lg shadow-gold-500/10 hover:shadow-gold-500/20 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                  Giriş yapılıyor...
                </span>
              ) : 'Giriş Yap'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} ANKH Legal. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
}
