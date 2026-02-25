import { useEffect, useState } from 'react';
import { Plus, Pencil, X, UserCheck, Mail, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase, type Lawyer } from '../../lib/supabase';

const EMPTY: Omit<Lawyer, 'id' | 'created_at'> = {
  full_name: '', title: '', bio_tr: '', bio_en: '', photo_url: '',
  email: '', linkedin_url: '', order_index: 0, is_active: true,
};

export default function LawyersPanel() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Lawyer | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('lawyers').select('*').order('order_index');
    setLawyers(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() { setForm({ ...EMPTY }); setEditing(null); setIsNew(true); }
  function openEdit(l: Lawyer) {
    setForm({ full_name: l.full_name, title: l.title, bio_tr: l.bio_tr, bio_en: l.bio_en, photo_url: l.photo_url, email: l.email, linkedin_url: l.linkedin_url, order_index: l.order_index, is_active: l.is_active });
    setEditing(l); setIsNew(false);
  }
  function closeModal() { setEditing(null); setIsNew(false); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    if (editing) {
      await supabase.from('lawyers').update(form).eq('id', editing.id);
    } else {
      await supabase.from('lawyers').insert(form);
    }
    await load(); closeModal(); setSaving(false);
  }

  async function toggleActive(l: Lawyer) {
    await supabase.from('lawyers').update({ is_active: !l.is_active }).eq('id', l.id);
    setLawyers(prev => prev.map(x => x.id === l.id ? { ...x, is_active: !x.is_active } : x));
  }

  async function handleDelete(id: string) {
    if (!confirm('Silmek istediğinizden emin misiniz?')) return;
    await supabase.from('lawyers').delete().eq('id', id);
    setLawyers(prev => prev.filter(l => l.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-navy-900">Avukat Profilleri</h1>
          <p className="text-gray-500 text-sm mt-1">{lawyers.length} avukat</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Avukat Ekle
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" /></div>
      ) : lawyers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Henüz avukat eklenmemiş.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {lawyers.map(l => (
            <div key={l.id} className={`bg-white rounded-2xl border p-5 shadow-sm ${l.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-start gap-4">
                {l.photo_url ? (
                  <img src={l.photo_url} alt={l.full_name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 text-xl font-bold shrink-0">
                    {l.full_name?.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-navy-900 text-base font-semibold">{l.full_name}</p>
                  <p className="text-gray-500 text-sm">{l.title}</p>
                  {l.email && <p className="text-gray-400 text-xs flex items-center gap-1 mt-1"><Mail className="w-3 h-3" />{l.email}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(l)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-800 border border-gray-200 hover:border-navy-300 px-3 py-1.5 rounded-lg transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> Düzenle
                </button>
                <button onClick={() => toggleActive(l)} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${l.is_active ? 'text-green-600 border-green-200 hover:bg-green-50' : 'text-gray-400 border-gray-200 hover:bg-gray-50'}`}>
                  {l.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {l.is_active ? 'Aktif' : 'Pasif'}
                </button>
                <button onClick={() => handleDelete(l.id)} className="ml-auto text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(isNew || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-serif text-xl text-navy-900">{editing ? 'Avukatı Düzenle' : 'Yeni Avukat'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Ad Soyad</label>
                  <input type="text" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Unvan</label>
                  <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" placeholder="Avukat, Kurucu Ortak..." />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">E-posta</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Foto URL</label>
                  <input type="text" value={form.photo_url} onChange={e => setForm(p => ({ ...p, photo_url: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">LinkedIn URL</label>
                  <input type="text" value={form.linkedin_url} onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Biyografi (TR)</label>
                  <textarea value={form.bio_tr} onChange={e => setForm(p => ({ ...p, bio_tr: e.target.value }))} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 resize-none" />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Biyografi (EN)</label>
                  <textarea value={form.bio_en} onChange={e => setForm(p => ({ ...p, bio_en: e.target.value }))} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 resize-none" />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Sıra No</label>
                  <input type="number" value={form.order_index} onChange={e => setForm(p => ({ ...p, order_index: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">İptal</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {saving ? 'Kaydediliyor...' : editing ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
