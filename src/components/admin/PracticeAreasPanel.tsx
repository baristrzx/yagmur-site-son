import { useEffect, useState } from 'react';
import { Plus, Pencil, X, Scale, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase, type PracticeArea } from '../../lib/supabase';

const EMPTY: Omit<PracticeArea, 'id' | 'created_at'> = {
  title_tr: '', title_en: '', description_tr: '', description_en: '',
  icon: '', order_index: 0, is_active: true,
};

export default function PracticeAreasPanel() {
  const [areas, setAreas] = useState<PracticeArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PracticeArea | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('practice_areas').select('*').order('order_index');
    setAreas(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() { setForm({ ...EMPTY }); setEditing(null); setIsNew(true); }
  function openEdit(a: PracticeArea) {
    setForm({ title_tr: a.title_tr, title_en: a.title_en, description_tr: a.description_tr, description_en: a.description_en, icon: a.icon, order_index: a.order_index, is_active: a.is_active });
    setEditing(a); setIsNew(false);
  }
  function closeModal() { setEditing(null); setIsNew(false); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    if (editing) {
      await supabase.from('practice_areas').update(form).eq('id', editing.id);
    } else {
      await supabase.from('practice_areas').insert(form);
    }
    await load(); closeModal(); setSaving(false);
  }

  async function toggleActive(a: PracticeArea) {
    await supabase.from('practice_areas').update({ is_active: !a.is_active }).eq('id', a.id);
    setAreas(prev => prev.map(x => x.id === a.id ? { ...x, is_active: !x.is_active } : x));
  }

  async function handleDelete(id: string) {
    if (!confirm('Silmek istediğinizden emin misiniz?')) return;
    await supabase.from('practice_areas').delete().eq('id', id);
    setAreas(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-navy-900">Çalışma Alanları</h1>
          <p className="text-gray-500 text-sm mt-1">{areas.length} alan</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Alan Ekle
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" /></div>
      ) : areas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Scale className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Henüz çalışma alanı eklenmemiş.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest">Alan Adı (TR)</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest hidden md:table-cell">Alan Adı (EN)</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest hidden sm:table-cell">Durum</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {areas.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-navy-900 text-sm font-medium">{a.title_tr}</p>
                    <p className="text-gray-400 text-xs line-clamp-1 mt-0.5">{a.description_tr}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 text-sm hidden md:table-cell">{a.title_en}</td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <button onClick={() => toggleActive(a)} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors
                      ${a.is_active ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {a.is_active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                      {a.is_active ? 'Aktif' : 'Pasif'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(a)} className="text-gray-400 hover:text-navy-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(a.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(isNew || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-serif text-xl text-navy-900">{editing ? 'Düzenle' : 'Yeni Çalışma Alanı'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Başlık (TR)</label>
                  <input type="text" value={form.title_tr} onChange={e => setForm(p => ({ ...p, title_tr: e.target.value }))} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Başlık (EN)</label>
                  <input type="text" value={form.title_en} onChange={e => setForm(p => ({ ...p, title_en: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Açıklama (TR)</label>
                  <textarea value={form.description_tr} onChange={e => setForm(p => ({ ...p, description_tr: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 resize-none" />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Açıklama (EN)</label>
                  <textarea value={form.description_en} onChange={e => setForm(p => ({ ...p, description_en: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 resize-none" />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">İkon (Lucide adı)</label>
                  <input type="text" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" placeholder="scale, briefcase..." />
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
