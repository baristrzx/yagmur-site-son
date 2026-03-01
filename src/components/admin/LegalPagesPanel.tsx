import { useEffect, useState } from 'react';
import { Shield, Save, CheckCircle, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase, type LegalPage } from '../../lib/supabase';
import RichTextEditor from './RichTextEditor';

export default function LegalPagesPanel() {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [selectedPage, setSelectedPage] = useState<LegalPage | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title_tr: '',
    content_tr: '',
    meta_description_tr: '',
    is_published: false,
    display_order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    setLoading(true);
    const { data } = await supabase
      .from('legal_pages')
      .select('*')
      .order('display_order', { ascending: true });
    setPages(data || []);
    setLoading(false);
  }

  function handleEdit(page: LegalPage) {
    setSelectedPage(page);
    setFormData({
      slug: page.slug,
      title_tr: page.title_tr,
      content_tr: page.content_tr,
      meta_description_tr: page.meta_description_tr || '',
      is_published: page.is_published,
      display_order: page.display_order,
    });
    setView('edit');
  }

  function handleNew() {
    setSelectedPage(null);
    setFormData({
      slug: '',
      title_tr: '',
      content_tr: '',
      meta_description_tr: '',
      is_published: false,
      display_order: pages.length + 1,
    });
    setView('edit');
  }

  async function handleSave() {
    setSaving(true);

    if (selectedPage) {
      await supabase
        .from('legal_pages')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedPage.id);
    } else {
      await supabase.from('legal_pages').insert([formData]);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setView('list');
    loadPages();
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) return;
    const { error } = await supabase.from('legal_pages').delete().eq('id', id);
    if (error) {
      alert('Silme işlemi başarısız oldu: ' + error.message);
      console.error('Delete error:', error);
    } else {
      loadPages();
    }
  }

  async function togglePublish(page: LegalPage) {
    await supabase
      .from('legal_pages')
      .update({ is_published: !page.is_published })
      .eq('id', page.id);
    loadPages();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (view === 'edit') {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-navy-900">
              {selectedPage ? 'Yasal Sayfayı Düzenle' : 'Yeni Yasal Sayfa'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Yasal sayfa içeriğini düzenleyin
            </p>
          </div>
          <button
            onClick={() => setView('list')}
            className="text-gray-600 hover:text-navy-800 text-sm font-medium"
          >
            ← Listeye Dön
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-semibold text-navy-900">Sayfa Bilgileri</h3>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-navy-800 hover:bg-navy-700 text-white disabled:opacity-50'
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Kaydedildi
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </>
              )}
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400"
                  placeholder="kvkk"
                  disabled={!!selectedPage}
                />
              </div>
              <div>
                <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">
                  Sıra
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: parseInt(e.target.value) })
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={formData.title_tr}
                onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400"
                placeholder="KVKK Aydınlatma Metni"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">
                SEO Açıklama
              </label>
              <input
                type="text"
                value={formData.meta_description_tr}
                onChange={(e) =>
                  setFormData({ ...formData, meta_description_tr: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400"
                placeholder="Sayfa açıklaması..."
              />
            </div>

            <div>
              <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">
                İçerik
              </label>
              <RichTextEditor
                value={formData.content_tr}
                onChange={(value) => setFormData({ ...formData, content_tr: value })}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 text-navy-800 border-gray-300 rounded focus:ring-navy-500"
              />
              <label htmlFor="is_published" className="text-sm text-gray-700">
                Yayında
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-navy-900">Yasal Sayfalar</h1>
          <p className="text-gray-500 text-sm mt-1">KVKK, Çerez Politikası ve diğer yasal sayfaları yönetin</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Sayfa
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {pages.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Henüz yasal sayfa bulunmuyor</p>
            <button
              onClick={handleNew}
              className="mt-4 text-navy-600 hover:text-navy-800 text-sm font-medium"
            >
              İlk sayfayı oluşturun
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Başlık
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sıra
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-navy-900">{page.title_tr}</div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {page.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{page.display_order}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(page)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        page.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {page.is_published ? 'Yayında' : 'Taslak'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(page)}
                        className="p-2 text-navy-600 hover:bg-navy-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
