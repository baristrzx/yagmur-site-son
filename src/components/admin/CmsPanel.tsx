import { useEffect, useState } from 'react';
import { Save, CheckCircle, Plus, X } from 'lucide-react';
import { supabase, type CmsContent } from '../../lib/supabase';

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero (Ana Sayfa)',
  about: 'Hakkımda',
  approach: 'Yaklaşım',
  contact: 'İletişim',
  footer: 'Alt Bilgi',
};

type Props = {
  section: string;
};

export default function CmsPanel({ section }: Props) {
  const [items, setItems] = useState<CmsContent[]>([]);
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [showNewKey, setShowNewKey] = useState(false);

  async function load() {
    const { data } = await supabase.from('cms_content').select('*').eq('section', section).order('key');
    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => { setLoading(true); load(); }, [section]);

  useEffect(() => {
    const map: Record<string, string> = {};
    items.forEach(i => { map[i.key] = lang === 'tr' ? i.value_tr : i.value_en; });
    setEditing(map);
  }, [lang, items]);

  async function handleSave() {
    setSaving(true);
    for (const [key, value] of Object.entries(editing)) {
      const exists = items.find(i => i.key === key);
      if (exists) {
        await supabase.from('cms_content').update({ [lang === 'tr' ? 'value_tr' : 'value_en']: value, updated_at: new Date().toISOString() }).eq('id', exists.id);
      } else {
        await supabase.from('cms_content').insert({ section, key, value_tr: lang === 'tr' ? value : '', value_en: lang === 'en' ? value : '' });
      }
    }
    await load(); setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function addNewKey() {
    if (!newKey.trim()) return;
    await supabase.from('cms_content').insert({ section, key: newKey.trim(), value_tr: '', value_en: '' });
    setNewKey(''); setShowNewKey(false); await load();
  }

  async function deleteKey(id: string) {
    await supabase.from('cms_content').delete().eq('id', id);
    await load();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-navy-900">{SECTION_LABELS[section] || section}</h1>
        <p className="text-gray-500 text-sm mt-1">Bu sayfadaki metinleri Türkçe ve İngilizce olarak düzenleyin</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-wrap gap-3">
          <div className="flex gap-2">
            <button onClick={() => setLang('tr')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${lang === 'tr' ? 'bg-navy-800 text-white' : 'text-gray-500 border border-gray-200 hover:border-navy-300'}`}>Türkçe</button>
            <button onClick={() => setLang('en')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${lang === 'en' ? 'bg-navy-800 text-white' : 'text-gray-500 border border-gray-200 hover:border-navy-300'}`}>English</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowNewKey(true)} className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 hover:border-navy-300 px-3 py-1.5 rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" /> Alan Ekle
            </button>
            <button onClick={handleSave} disabled={saving}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-navy-800 hover:bg-navy-700 text-white disabled:opacity-50'}`}>
              {saved ? <><CheckCircle className="w-4 h-4" /> Kaydedildi</> : <><Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}</>}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="w-6 h-6 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" /></div>
        ) : (
          <div className="p-5 space-y-4">
            {showNewKey && (
              <div className="flex gap-2 items-center bg-navy-50 p-3 rounded-xl border border-navy-100">
                <input type="text" value={newKey} onChange={e => setNewKey(e.target.value)}
                  placeholder="Alan anahtarı (ör: subtitle)"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy-400"
                  onKeyDown={e => e.key === 'Enter' && addNewKey()} />
                <button onClick={addNewKey} className="px-3 py-2 bg-navy-800 text-white rounded-lg text-sm">Ekle</button>
                <button onClick={() => setShowNewKey(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>
            )}
            {items.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Bu bölüm için henüz içerik eklenmemiş.</p>
            ) : (
              items.map(item => (
                <div key={item.id} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-gray-500 text-xs uppercase tracking-widest font-semibold">{item.key}</label>
                    <button onClick={() => deleteKey(item.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {(editing[item.key] || '').length > 100 ? (
                    <textarea value={editing[item.key] || ''} onChange={e => setEditing(p => ({ ...p, [item.key]: e.target.value }))}
                      rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 resize-y" />
                  ) : (
                    <input type="text" value={editing[item.key] || ''} onChange={e => setEditing(p => ({ ...p, [item.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400" />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
