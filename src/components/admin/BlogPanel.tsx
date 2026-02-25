import { useEffect, useState } from 'react';
import { Plus, Pencil, X, BookOpen, Eye, EyeOff, BarChart2 } from 'lucide-react';
import { supabase, type BlogPost, type BlogCategory } from '../../lib/supabase';

const EMPTY_POST = {
  category_id: '' as string | null,
  slug: '',
  title_tr: '', title_en: '',
  content_tr: '', content_en: '',
  excerpt_tr: '', excerpt_en: '',
  cover_image: '',
  is_published: false,
  meta_title_tr: '', meta_title_en: '',
  meta_description_tr: '', meta_description_en: '',
};

type Props = {
  initialView?: 'list' | 'editor';
};

export default function BlogPanel({ initialView = 'list' }: Props) {
  const [posts, setPosts] = useState<(BlogPost & { blog_categories: BlogCategory | null })[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'editor'>(initialView);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ ...EMPTY_POST });
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [saving, setSaving] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  async function load() {
    const [postsRes, catsRes] = await Promise.all([
      supabase.from('blog_posts').select('*, blog_categories(*)').order('created_at', { ascending: false }),
      supabase.from('blog_categories').select('*').order('name_tr'),
    ]);
    setPosts((postsRes.data as typeof posts) || []);
    setCategories(catsRes.data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (initialView === 'editor' && view === 'list') {
      openNew();
    }
  }, [initialView]);

  function openNew() { setForm({ ...EMPTY_POST }); setEditing(null); setView('editor'); setSeoOpen(false); }
  function openEdit(p: BlogPost) {
    setForm({
      category_id: p.category_id,
      slug: p.slug,
      title_tr: p.title_tr, title_en: p.title_en,
      content_tr: p.content_tr, content_en: p.content_en,
      excerpt_tr: p.excerpt_tr, excerpt_en: p.excerpt_en,
      cover_image: p.cover_image,
      is_published: p.is_published,
      meta_title_tr: p.meta_title_tr || '', meta_title_en: p.meta_title_en || '',
      meta_description_tr: p.meta_description_tr || '', meta_description_en: p.meta_description_en || '',
    });
    setEditing(p); setView('editor'); setSeoOpen(false);
  }

  function generateSlug(title: string) {
    return title.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const payload = {
      ...form,
      category_id: form.category_id || null,
      published_at: form.is_published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    if (editing) {
      await supabase.from('blog_posts').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('blog_posts').insert(payload);
    }
    await load(); setView('list'); setSaving(false);
  }

  async function togglePublish(p: BlogPost) {
    await supabase.from('blog_posts').update({ is_published: !p.is_published, published_at: !p.is_published ? new Date().toISOString() : null }).eq('id', p.id);
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Yazıyı silmek istediğinizden emin misiniz?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  if (view === 'editor') return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setView('list')} className="text-gray-500 hover:text-navy-800 text-sm flex items-center gap-1.5 transition-colors">
          ← Blog listesine dön
        </button>
        <div className="flex gap-2">
          <button onClick={() => setLang('tr')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${lang === 'tr' ? 'bg-navy-800 text-white' : 'text-gray-500 border border-gray-200'}`}>TR</button>
          <button onClick={() => setLang('en')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${lang === 'en' ? 'bg-navy-800 text-white' : 'text-gray-500 border border-gray-200'}`}>EN</button>
        </div>
      </div>
      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-serif text-xl text-navy-900 mb-5">{editing ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Başlık ({lang.toUpperCase()})</label>
                <input type="text" value={lang === 'tr' ? form.title_tr : form.title_en}
                  onChange={e => { const v = e.target.value; setForm(p => lang === 'tr' ? { ...p, title_tr: v, slug: !editing ? generateSlug(v) : p.slug } : { ...p, title_en: v }); }}
                  required={lang === 'tr'} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" />
              </div>
              <div>
                <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Slug (URL)</label>
                <input type="text" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Kategori</label>
                <select value={form.category_id || ''} onChange={e => setForm(p => ({ ...p, category_id: e.target.value || null }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 bg-white">
                  <option value="">Kategori seçin...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name_tr}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Kapak Görseli URL</label>
                <input type="text" value={form.cover_image} onChange={e => setForm(p => ({ ...p, cover_image: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" placeholder="https://images.pexels.com/..." />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Özet ({lang.toUpperCase()})</label>
              <textarea value={lang === 'tr' ? form.excerpt_tr : form.excerpt_en}
                onChange={e => setForm(p => lang === 'tr' ? { ...p, excerpt_tr: e.target.value } : { ...p, excerpt_en: e.target.value })}
                rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 resize-none" />
            </div>
            <div>
              <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">İçerik ({lang.toUpperCase()})</label>
              <textarea value={lang === 'tr' ? form.content_tr : form.content_en}
                onChange={e => setForm(p => lang === 'tr' ? { ...p, content_tr: e.target.value } : { ...p, content_en: e.target.value })}
                rows={18} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 resize-y font-mono" />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))} className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700 font-medium">Yayınla</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <button type="button" onClick={() => setSeoOpen(!seoOpen)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
            <div>
              <p className="font-semibold text-navy-800 text-sm">SEO Meta Bilgileri</p>
              <p className="text-gray-400 text-xs mt-0.5">Arama motoru başlığı ve açıklaması</p>
            </div>
            <span className="text-gray-400 text-xs">{seoOpen ? '▲ Kapat' : '▼ Genişlet'}</span>
          </button>
          {seoOpen && (
            <div className="p-5 pt-0 space-y-4 border-t border-gray-100">
              <div>
                <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Meta Başlık ({lang.toUpperCase()})</label>
                <input type="text" maxLength={60}
                  value={lang === 'tr' ? form.meta_title_tr : form.meta_title_en}
                  onChange={e => setForm(p => lang === 'tr' ? { ...p, meta_title_tr: e.target.value } : { ...p, meta_title_en: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" placeholder="60 karaktere kadar..." />
                <p className="text-gray-400 text-xs mt-1">
                  {(lang === 'tr' ? form.meta_title_tr : form.meta_title_en).length}/60 karakter
                </p>
              </div>
              <div>
                <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Meta Açıklama ({lang.toUpperCase()})</label>
                <textarea maxLength={160}
                  value={lang === 'tr' ? form.meta_description_tr : form.meta_description_en}
                  onChange={e => setForm(p => lang === 'tr' ? { ...p, meta_description_tr: e.target.value } : { ...p, meta_description_en: e.target.value })}
                  rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 resize-none" placeholder="160 karaktere kadar..." />
                <p className="text-gray-400 text-xs mt-1">
                  {(lang === 'tr' ? form.meta_description_tr : form.meta_description_en).length}/160 karakter
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => setView('list')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">İptal</button>
          <button type="submit" disabled={saving} className="px-5 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
            {saving ? 'Kaydediliyor...' : editing ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-navy-900">Blog Yazıları</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} yazı</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Yeni Yazı
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" /></div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Henüz blog yazısı eklenmemiş.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest">Başlık</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest hidden md:table-cell">Kategori</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest hidden sm:table-cell">Durum</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest hidden lg:table-cell">Görüntülenme</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest hidden lg:table-cell">Tarih</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.cover_image && (
                        <img src={p.cover_image} alt={p.title_tr} className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block" />
                      )}
                      <div className="min-w-0">
                        <p className="text-navy-900 text-sm font-medium truncate max-w-xs">{p.title_tr}</p>
                        <p className="text-gray-400 text-xs font-mono truncate max-w-xs">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-sm hidden md:table-cell">
                    {p.blog_categories?.name_tr || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_published ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <BarChart2 className="w-3.5 h-3.5 text-gray-400" />
                      {p.view_count || 0}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs hidden lg:table-cell">
                    {new Date(p.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button onClick={() => togglePublish(p)} className={`p-1.5 rounded-lg border transition-colors ${p.is_published ? 'text-orange-500 border-orange-200 hover:bg-orange-50' : 'text-green-500 border-green-200 hover:bg-green-50'}`} title={p.is_published ? 'Yayından Kaldır' : 'Yayınla'}>
                        {p.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-navy-800 hover:border-navy-300 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
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
