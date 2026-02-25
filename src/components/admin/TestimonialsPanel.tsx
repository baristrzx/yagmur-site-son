import { useEffect, useState } from 'react';
import { Plus, Pencil, X, Star } from 'lucide-react';
import { supabase, type Testimonial } from '../../lib/supabase';

const EMPTY: Omit<Testimonial, 'id' | 'created_at'> = {
  client_name: '', company: '', content_tr: '', content_en: '',
  rating: 5, is_published: false, order_index: 0,
};

export default function TestimonialsPanel() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('testimonials').select('*').order('order_index');
    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() { setForm({ ...EMPTY }); setEditing(null); setIsNew(true); }
  function openEdit(t: Testimonial) {
    setForm({ client_name: t.client_name, company: t.company, content_tr: t.content_tr, content_en: t.content_en, rating: t.rating, is_published: t.is_published, order_index: t.order_index });
    setEditing(t); setIsNew(false);
  }
  function closeModal() { setEditing(null); setIsNew(false); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    if (editing) {
      await supabase.from('testimonials').update(form).eq('id', editing.id);
    } else {
      await supabase.from('testimonials').insert(form);
    }
    await load(); closeModal(); setSaving(false);
  }

  async function togglePublish(t: Testimonial) {
    await supabase.from('testimonials').update({ is_published: !t.is_published }).eq('id', t.id);
    setItems(prev => prev.map(x => x.id === t.id ? { ...x, is_published: !x.is_published } : x));
  }

  async function handleDelete(id: string) {
    if (!confirm('Silmek istediğinizden emin misiniz?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    setItems(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-navy-900">Referanslar</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} referans</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Referans Ekle
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Henüz referans eklenmemiş.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map(t => (
            <div key={t.id} className={`bg-white rounded-2xl border p-5 shadow-sm ${t.is_published ? 'border-gray-200' : 'border-gray-100 opacity-70'}`}>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-gold-500 fill-gold-400' : 'text-gray-200'}`} />
                ))}
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${t.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {t.is_published ? 'Yayında' : 'Taslak'}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-3">"{t.content_tr}"</p>
              <p className="text-navy-800 text-sm font-semibold">{t.client_name}</p>
              {t.company && <p className="text-gray-400 text-xs">{t.company}</p>}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(t)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-navy-800 border border-gray-200 hover:border-navy-300 px-2.5 py-1.5 rounded-lg transition-colors">
                  <Pencil className="w-3 h-3" /> Düzenle
                </button>
                <button onClick={() => togglePublish(t)} className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${t.is_published ? 'text-orange-600 border-orange-200 hover:bg-orange-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}>
                  {t.is_published ? 'Yayından Kaldır' : 'Yayınla'}
                </button>
                <button onClick={() => handleDelete(t.id)} className="ml-auto text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"><X className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(isNew || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-serif text-xl text-navy-900">{editing ? 'Referansı Düzenle' : 'Yeni Referans'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Ad Soyad</label>
                  <input type="text" value={form.client_name} onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Şirket</label>
                  <input type="text" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" />
                </div>
              </div>
              <div>
                <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Yorum (TR)</label>
                <textarea value={form.content_tr} onChange={e => setForm(p => ({ ...p, content_tr: e.target.value }))} required rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 resize-none" />
              </div>
              <div>
                <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Yorum (EN)</label>
                <textarea value={form.content_en} onChange={e => setForm(p => ({ ...p, content_en: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Puan (1-5)</label>
                  <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(p => ({ ...p, rating: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_published} onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))} className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Yayınla</span>
                  </label>
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
