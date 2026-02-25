import { useEffect, useState } from 'react';
import { UserPlus, Users, Mail, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
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
      if (!res.ok) throw new Error(result.error || 'Kullanıcı oluşturulamadı');

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
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border text-sm font-medium transition-all
          ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-navy-900">Müvekkiller</h1>
          <p className="text-gray-500 text-sm mt-1">Sisteme kayıtlı müvekkilleri yönetin</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Yeni Müvekkil
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="font-serif text-lg text-navy-800 mb-5">Yeni Müvekkil Oluştur</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Ad Soyad</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-200 transition-colors"
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
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-200 transition-colors"
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
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-gray-900 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-200 transition-colors"
                  placeholder="En az 6 karakter"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="md:col-span-3 flex gap-3 justify-end">
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
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
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
                      <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 text-xs font-semibold uppercase">
                        {client.full_name?.charAt(0) || '?'}
                      </div>
                      <span className="text-navy-900 text-sm font-medium">{client.full_name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {client.email}
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
      )}
    </div>
  );
}
