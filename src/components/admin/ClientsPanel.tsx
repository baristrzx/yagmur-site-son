import { useEffect, useState } from 'react';
import { UserPlus, Users, Mail, AlertCircle, CheckCircle, Eye, EyeOff, Calendar } from 'lucide-react';
import { supabase, type Profile } from '../../lib/supabase';

export default function ClientsPanel() {
  const [clients, setClients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function loadClients() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client')
      .order('created_at', { ascending: false });
    setClients(data || []);
    setLoading(false);
  }

  useEffect(() => { loadClients(); }, []);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = (await supabase.auth.getSession()).data.session;

      const res = await fetch(`${supabaseUrl}/functions/v1/create-client-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || result.message || `Hata (${res.status}): Kullanıcı oluşturulamadı`);

      showToast('success', 'Müvekkil başarıyla oluşturuldu.');
      setFormData({ email: '', password: '', full_name: '' });
      setShowForm(false);
      loadClients();
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Bir hata oluştu.');
    }
    setSubmitting(false);
  }

  return (
    <div>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium max-w-[calc(100vw-2rem)]
          ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
          <span className="truncate">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl text-navy-900">Müvekkiller</h1>
          <p className="text-gray-500 text-sm mt-1">Sisteme kayıtlı müvekkilleri yönetin</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white px-3 sm:px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Yeni Müvekkil</span>
          <span className="sm:hidden">Yeni</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 mb-5 sm:mb-6 shadow-sm">
          <h2 className="font-serif text-base sm:text-lg text-navy-800 mb-4 sm:mb-5">Yeni Müvekkil Oluştur</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Ad Soyad</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-200 transition-colors"
                  placeholder="Ahmet Yılmaz"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">E-posta</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-200 transition-colors"
                  placeholder="ornek@email.com"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Şifre</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                    required
                    minLength={6}
                    className="w-full border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 pr-10 text-gray-900 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-200 transition-colors"
                    placeholder="En az 6 karakter"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-1">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                İptal
              </button>
              <button type="submit" disabled={submitting} className="px-5 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {submitting ? 'Oluşturuluyor...' : 'Müvekkil Oluştur'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" />
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Henüz müvekkil eklenmemiş.</p>
        </div>
      ) : (
        <>
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest">Ad Soyad</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest">E-posta</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest">Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 text-xs font-semibold uppercase shrink-0">
                          {client.full_name?.charAt(0) || '?'}
                        </div>
                        <span className="text-navy-900 text-sm font-medium">{client.full_name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(client.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-2">
            {clients.map(client => (
              <div key={client.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 text-sm font-semibold uppercase shrink-0">
                  {client.full_name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-navy-900 text-sm font-semibold truncate">{client.full_name || '—'}</p>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                    <Mail className="w-3 h-3 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                    <Calendar className="w-3 h-3 shrink-0" />
                    {new Date(client.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
