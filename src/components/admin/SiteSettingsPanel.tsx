import { useEffect, useState } from 'react';
import { Settings, Save, CheckCircle } from 'lucide-react';
import { supabase, type SiteSetting } from '../../lib/supabase';

const SETTING_LABELS: Record<string, string> = {
  site_name: 'Site Adı',
  site_email: 'E-posta Adresi',
  site_phone: 'Telefon',
  site_address: 'Adres',
  site_linkedin: 'LinkedIn URL',
  site_instagram: 'Instagram URL',
  site_twitter: 'Twitter/X URL',
  resend_from_email: 'Gönderici E-posta (Resend)',
};

export default function SiteSettingsPanel() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    const { data } = await supabase.from('site_settings').select('*');
    const map: Record<string, string> = {};
    (data || []).forEach((s: SiteSetting) => { map[s.key] = s.value; });
    setSettings(map);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    }
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const groups = [
    { label: 'Genel Bilgiler', keys: ['site_name', 'site_email', 'site_phone', 'site_address'] },
    { label: 'Sosyal Medya', keys: ['site_linkedin', 'site_instagram', 'site_twitter'] },
    { label: 'Email Ayarları', keys: ['resend_from_email'] },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-navy-900">Site Ayarları</h1>
        <p className="text-gray-500 text-sm mt-1">Genel site bilgileri ve entegrasyonlar</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {groups.map(group => (
          <div key={group.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-gray-100">
              <Settings className="w-4 h-4 text-gray-400" />
              <h2 className="font-semibold text-navy-800 text-sm">{group.label}</h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.keys.map(key => (
                <div key={key}>
                  <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">{SETTING_LABELS[key] || key}</label>
                  <input type="text" value={settings[key] || ''} onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-navy-800 hover:bg-navy-700 text-white disabled:opacity-50'}`}>
            {saved ? <><CheckCircle className="w-4 h-4" /> Kaydedildi</> : <><Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}</>}
          </button>
        </div>
      </form>
    </div>
  );
}
