import { useEffect, useState } from 'react';
import { Shield, Save, CheckCircle } from 'lucide-react';
import { supabase, type LegalPage } from '../../lib/supabase';

type Props = {
  slug: string;
};

export default function LegalPagesPanel({ slug }: Props) {
  const [page, setPage] = useState<LegalPage | null>(null);
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('legal_pages').select('*').eq('slug', slug).maybeSingle();
    if (data) {
      setPage(data);
      setTitle(lang === 'tr' ? data.title_tr : data.title_en);
      setContent(lang === 'tr' ? data.content_tr : data.content_en);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [slug]);

  function switchLang(l: 'tr' | 'en') {
    setLang(l);
    if (!page) return;
    setTitle(l === 'tr' ? page.title_tr : page.title_en);
    setContent(l === 'tr' ? page.content_tr : page.content_en);
    setSaved(false);
  }

  async function handleSave() {
    if (!page) return;
    setSaving(true);
    const update = lang === 'tr'
      ? { title_tr: title, content_tr: content, updated_at: new Date().toISOString() }
      : { title_en: title, content_en: content, updated_at: new Date().toISOString() };
    await supabase.from('legal_pages').update(update).eq('id', page.id);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    load();
  }

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" />
    </div>
  );

  if (!page) return (
    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
      <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">Sayfa bulunamadı. Lütfen veritabanında bu slug ile bir kayıt oluşturun.</p>
      <p className="text-gray-400 text-sm mt-1 font-mono">{slug}</p>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-navy-900">{lang === 'tr' ? page.title_tr : page.title_en}</h1>
        <p className="text-gray-500 text-sm mt-1">Yasal metni Türkçe ve İngilizce olarak düzenleyin</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex gap-2">
            <button onClick={() => switchLang('tr')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${lang === 'tr' ? 'bg-navy-800 text-white' : 'text-gray-500 border border-gray-200 hover:border-navy-300'}`}>Türkçe</button>
            <button onClick={() => switchLang('en')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${lang === 'en' ? 'bg-navy-800 text-white' : 'text-gray-500 border border-gray-200 hover:border-navy-300'}`}>English</button>
          </div>
          <button onClick={handleSave} disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-navy-800 hover:bg-navy-700 text-white disabled:opacity-50'}`}>
            {saved ? <><CheckCircle className="w-4 h-4" /> Kaydedildi</> : <><Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}</>}
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Başlık</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" />
          </div>
          <div>
            <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">İçerik</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={22}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy-400 resize-y font-mono" />
          </div>
        </div>
      </div>
    </div>
  );
}
