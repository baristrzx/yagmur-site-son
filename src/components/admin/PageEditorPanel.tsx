import { useEffect, useState, useCallback } from 'react';
import {
  Save, CheckCircle, ChevronDown, ChevronRight, Eye, EyeOff,
  Type, AlignLeft, Link, Image, LayoutTemplate, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

type FieldType = 'text' | 'textarea' | 'url' | 'image-url';

type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
};

type SectionDef = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  fields: FieldDef[];
};

const SECTIONS: SectionDef[] = [
  {
    id: 'hero',
    label: 'Hero (Ana Sayfa)',
    description: 'Sitenin ilk ekranındaki başlık ve butonlar',
    icon: <LayoutTemplate className="w-4 h-4" />,
    fields: [
      { key: 'badge', label: 'Rozet Metni', type: 'text', placeholder: 'Hukuk & Danışmanlık' },
      { key: 'title', label: 'Ana Başlık', type: 'textarea', placeholder: 'ANKH Legal: Hukuki Güvenlik ve...' },
      { key: 'subtitle', label: 'Alt Başlık', type: 'textarea', placeholder: 'Karmaşık hukuki süreçlerde...' },
      { key: 'cta_primary', label: 'Birincil Buton', type: 'text', placeholder: 'Ön Görüşme Talep Et' },
      { key: 'cta_secondary', label: 'İkincil Buton', type: 'text', placeholder: 'Daha Fazla Bilgi' },
      { key: 'scroll_label', label: 'Kaydırma Etiketi', type: 'text', placeholder: 'Keşfedin' },
      { key: 'background_image', label: 'Arka Plan Görseli URL', type: 'image-url', placeholder: '/WhatsApp_Image_2026-02-24_at_15.37.40.jpeg' },
    ],
  },
  {
    id: 'about',
    label: 'Hakkımızda',
    description: 'Stratejik yaklaşım bölümü',
    icon: <Type className="w-4 h-4" />,
    fields: [
      { key: 'badge', label: 'Üst Etiket', type: 'text', placeholder: 'Stratejik Yaklaşım' },
      { key: 'title', label: 'Başlık', type: 'textarea', placeholder: 'Reaktif Değil, Öngörülü Hukuk' },
      { key: 'paragraph_1', label: 'Paragraf 1', type: 'textarea', placeholder: 'ANKH Legal, stratejik dava yönetimi...' },
      { key: 'paragraph_2', label: 'Paragraf 2', type: 'textarea', placeholder: 'Hukuki meseleleri yalnızca...' },
      { key: 'paragraph_3', label: 'Paragraf 3', type: 'textarea', placeholder: 'Yaklaşımımız reaktif değil...' },
      { key: 'paragraph_4', label: 'Paragraf 4', type: 'textarea', placeholder: 'ANKH Legal, bireyler, aile işletmeleri...' },
      { key: 'cta_label', label: 'Link Metni', type: 'text', placeholder: 'Danışmanlık Alın' },
      { key: 'pillar_1_title', label: 'Sütun 1 Başlığı', type: 'text', placeholder: 'Global Perspektif' },
      { key: 'pillar_1_desc', label: 'Sütun 1 Açıklaması', type: 'textarea', placeholder: 'Uluslararası hukuk standartları...' },
      { key: 'pillar_2_title', label: 'Sütun 2 Başlığı', type: 'text', placeholder: 'Analitik Yaklaşım' },
      { key: 'pillar_2_desc', label: 'Sütun 2 Açıklaması', type: 'textarea', placeholder: 'Her davayı veri odaklı...' },
      { key: 'pillar_3_title', label: 'Sütun 3 Başlığı', type: 'text', placeholder: 'Uzun Vadeli Güvenlik' },
      { key: 'pillar_3_desc', label: 'Sütun 3 Açıklaması', type: 'textarea', placeholder: 'Anlık çözümler yerine...' },
    ],
  },
  {
    id: 'founder',
    label: 'Kurucu',
    description: 'Kurucu avukat profil bölümü',
    icon: <AlignLeft className="w-4 h-4" />,
    fields: [
      { key: 'badge', label: 'Üst Etiket', type: 'text', placeholder: 'Kurucu Avukat & Arabulucu' },
      { key: 'name', label: 'İsim', type: 'text', placeholder: 'Av. Arb. Yağmur Koçak Arat' },
      { key: 'title', label: 'Unvan', type: 'text', placeholder: 'Kurucu Avukat | Arabulucu' },
      { key: 'paragraph_1', label: 'Paragraf 1', type: 'textarea', placeholder: 'Av. Arb. Yağmur Koçak Arat...' },
      { key: 'paragraph_2', label: 'Paragraf 2', type: 'textarea', placeholder: 'Çalışma modeli...' },
      { key: 'paragraph_3', label: 'Paragraf 3', type: 'textarea', placeholder: 'Ticari, sigorta ve iş hukuku...' },
      { key: 'quote', label: 'Alıntı (İtalik)', type: 'textarea', placeholder: 'Dava süreçlerinde disiplinli...' },
      { key: 'paragraph_5', label: 'Son Paragraf', type: 'textarea', placeholder: "ANKH Legal'i, yalnızca..." },
      { key: 'credential_1', label: 'Yetkinlik 1', type: 'text', placeholder: 'Dava Yönetimi & Stratejik Çözüm Uzmanı' },
      { key: 'credential_2', label: 'Yetkinlik 2', type: 'text', placeholder: 'Hukuki Danışmanlık & Risk Analizi' },
      { key: 'cta_label', label: 'Buton Metni', type: 'text', placeholder: 'Dosya Ön Değerlendirme Talebi' },
      { key: 'photo', label: 'Fotoğraf URL', type: 'image-url', placeholder: '/WhatsApp_Image_2026-02-26_at_14.25.27.jpeg' },
    ],
  },
  {
    id: 'expertise',
    label: 'Uzmanlık Alanları',
    description: 'Hizmet alanları ve uzmanlıklar',
    icon: <AlignLeft className="w-4 h-4" />,
    fields: [
      { key: 'badge', label: 'Üst Etiket', type: 'text', placeholder: 'Uzmanlık Alanlarımız' },
      { key: 'title', label: 'Başlık', type: 'text', placeholder: 'UZMANLIKLAR' },
      { key: 'area_a_title', label: 'Alan A Başlığı', type: 'text', placeholder: 'Kurumsal Hukuk ve Stratejik Danışmanlık' },
      { key: 'area_a_desc', label: 'Alan A Açıklaması', type: 'textarea', placeholder: 'Şirketler ve girişimler için...' },
      { key: 'area_b_title', label: 'Alan B Başlığı', type: 'text', placeholder: 'Gayrimenkul, İnşaat ve Mülkiyet Yönetimi' },
      { key: 'area_b_desc', label: 'Alan B Açıklaması', type: 'textarea', placeholder: 'Taşınmaz ve mülkiyet ilişkileri...' },
      { key: 'area_c_title', label: 'Alan C Başlığı', type: 'text', placeholder: 'Uluslararası Hukuki İşlemler' },
      { key: 'area_c_desc', label: 'Alan C Açıklaması', type: 'textarea', placeholder: 'Dünya küçülürken hukuk genişliyor...' },
      { key: 'other_1_title', label: 'Diğer Alan 1 Başlığı', type: 'text', placeholder: 'İş ve Sigorta Hukuku' },
      { key: 'other_1_desc', label: 'Diğer Alan 1 Açıklaması', type: 'textarea', placeholder: 'İş ilişkilerinin yönetiminden...' },
      { key: 'other_2_title', label: 'Diğer Alan 2 Başlığı', type: 'text', placeholder: 'Aile ve Miras Hukuku' },
      { key: 'other_2_desc', label: 'Diğer Alan 2 Açıklaması', type: 'textarea', placeholder: 'Aile içi ve miras ilişkilerinde...' },
      { key: 'other_3_title', label: 'Diğer Alan 3 Başlığı', type: 'text', placeholder: 'Ceza Hukuku' },
      { key: 'other_3_desc', label: 'Diğer Alan 3 Açıklaması', type: 'textarea', placeholder: 'Soruşturma ve kovuşturma...' },
      { key: 'other_4_title', label: 'Diğer Alan 4 Başlığı', type: 'text', placeholder: 'İdari ve Düzenleyici Süreçler' },
      { key: 'other_4_desc', label: 'Diğer Alan 4 Açıklaması', type: 'textarea', placeholder: 'Kamu otoriteleriyle olan ilişkilerde...' },
    ],
  },
  {
    id: 'mediation',
    label: 'Arabuluculuk',
    description: 'Arabuluculuk hizmetleri bölümü',
    icon: <AlignLeft className="w-4 h-4" />,
    fields: [
      { key: 'title', label: 'Başlık', type: 'text', placeholder: 'ARABULUCULUK' },
      { key: 'subtitle', label: 'Alt Başlık', type: 'textarea', placeholder: 'Uyuşmazlıklarda mahkeme öncesi stratejik çözüm...' },
      { key: 'section_1_title', label: 'Bölüm 1 Başlığı', type: 'text', placeholder: 'Yapılandırılmış ve Dengeli Çözüm Süreçleri' },
      { key: 'section_1_content', label: 'Bölüm 1 İçeriği', type: 'textarea', placeholder: 'Arabuluculuk, yalnızca tarafları...' },
      { key: 'section_2_title', label: 'Bölüm 2 Başlığı', type: 'text', placeholder: 'Arabuluculuk Faaliyet Alanları' },
      { key: 'section_3_title', label: 'Bölüm 3 Başlığı', type: 'text', placeholder: 'Yaklaşım' },
      { key: 'section_3_footer', label: 'Bölüm 3 Alt Notu', type: 'textarea', placeholder: 'ANKH Legal, arabuluculuğu dava sürecine...' },
    ],
  },
  {
    id: 'contact',
    label: 'İletişim',
    description: 'İletişim bilgileri ve form bölümü',
    icon: <Link className="w-4 h-4" />,
    fields: [
      { key: 'badge', label: 'Üst Etiket', type: 'text', placeholder: 'İletişim' },
      { key: 'title', label: 'Başlık', type: 'textarea', placeholder: 'Bizimle İletişime Geçin' },
      { key: 'subtitle', label: 'Alt Başlık', type: 'textarea', placeholder: 'Hukuki süreçlerinizde...' },
      { key: 'address', label: 'Adres', type: 'textarea', placeholder: 'Foça Mah. 983. Sok. No: 18/2\nFethiye / MUĞLA' },
      { key: 'phone', label: 'Telefon', type: 'text', placeholder: '+90 505 989 57 59' },
      { key: 'email', label: 'E-posta', type: 'text', placeholder: 'info@ankhlegal.com' },
      { key: 'hours', label: 'Çalışma Saatleri', type: 'text', placeholder: 'Pzt – Cum: 09:00 – 18:00' },
      { key: 'map_label', label: 'Harita Butonu Metni', type: 'text', placeholder: "Google Maps'te Aç" },
    ],
  },
  {
    id: 'navbar',
    label: 'Navigasyon',
    description: 'Üst menü linkleri ve metinler',
    icon: <LayoutTemplate className="w-4 h-4" />,
    fields: [
      { key: 'link_about', label: 'Menü: Hakkımızda', type: 'text', placeholder: 'Hakkımızda' },
      { key: 'link_expertise', label: 'Menü: Uzmanlıklar', type: 'text', placeholder: 'Uzmanlıklar' },
      { key: 'link_mediation', label: 'Menü: Arabuluculuk', type: 'text', placeholder: 'Arabuluculuk' },
      { key: 'link_founder', label: 'Menü: Kurucu', type: 'text', placeholder: 'Kurucu' },
      { key: 'link_blog', label: 'Menü: Blog', type: 'text', placeholder: 'Bilgi Merkezi' },
      { key: 'link_contact', label: 'Menü: İletişim', type: 'text', placeholder: 'İletişim' },
      { key: 'cta_button', label: 'CTA Butonu', type: 'text', placeholder: 'Danışmanlık Al' },
    ],
  },
  {
    id: 'footer',
    label: 'Alt Bilgi (Footer)',
    description: 'Sayfa altındaki bilgiler',
    icon: <AlignLeft className="w-4 h-4" />,
    fields: [
      { key: 'tagline', label: 'Slogan', type: 'text', placeholder: 'Hukuki Güvenlik ve Stratejik Çözüm' },
      { key: 'description', label: 'Açıklama', type: 'textarea', placeholder: 'Stratejik dava yönetimi ve hukuki danışmanlık...' },
      { key: 'copyright', label: 'Telif Hakkı', type: 'text', placeholder: '© 2025 ANKH Legal. Tüm hakları saklıdır.' },
      { key: 'whatsapp_label', label: 'WhatsApp Butonu', type: 'text', placeholder: 'WhatsApp ile İletişim' },
    ],
  },
];

type FieldValues = Record<string, string>;

function FieldIcon({ type }: { type: FieldType }) {
  if (type === 'textarea') return <AlignLeft className="w-3 h-3 text-gray-400" />;
  if (type === 'url' || type === 'image-url') return <Link className="w-3 h-3 text-gray-400" />;
  return <Type className="w-3 h-3 text-gray-400" />;
}

function SectionEditor({
  section,
  values,
  onChange,
  onSave,
  saving,
  saved,
}: {
  section: SectionDef;
  values: FieldValues;
  onChange: (key: string, val: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none hover:bg-gray-50 transition-colors"
        onClick={() => setCollapsed(p => !p)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-gold-400 flex-shrink-0">
            {section.icon}
          </div>
          <div>
            <p className="font-semibold text-navy-800 text-sm">{section.label}</p>
            <p className="text-gray-400 text-xs mt-0.5">{section.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Kaydedildi
            </span>
          )}
          <button
            onClick={e => { e.stopPropagation(); onSave(); }}
            disabled={saving}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-navy-800 hover:bg-navy-700 text-white disabled:opacity-50'
            }`}
          >
            {saving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi' : 'Kaydet'}
          </button>
          {collapsed
            ? <ChevronRight className="w-4 h-4 text-gray-400" />
            : <ChevronDown className="w-4 h-4 text-gray-400" />
          }
        </div>
      </div>

      {!collapsed && (
        <div className="border-t border-gray-100 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.fields.map(field => {
            const val = values[field.key] ?? '';
            const isLong = field.type === 'textarea';
            return (
              <div key={field.key} className={isLong ? 'md:col-span-2' : ''}>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  <FieldIcon type={field.type} />
                  {field.label}
                  {field.hint && (
                    <span className="text-gray-300 font-normal normal-case tracking-normal ml-1">
                      — {field.hint}
                    </span>
                  )}
                </label>
                {field.type === 'image-url' ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={val}
                      onChange={e => onChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-400/20 transition-colors"
                    />
                    {val && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img
                          src={val}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Image className="w-6 h-6 text-gray-300" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : isLong ? (
                  <textarea
                    value={val}
                    onChange={e => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-400/20 transition-colors resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={val}
                    onChange={e => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-400/20 transition-colors"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PageEditorPanel() {
  const [allValues, setAllValues] = useState<Record<string, FieldValues>>({});
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [saveAllState, setSaveAllState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [preview, setPreview] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('page_sections').select('*');
    const map: Record<string, FieldValues> = {};
    SECTIONS.forEach(s => { map[s.id] = {}; });
    (data || []).forEach((row: { section: string; key: string; value: string }) => {
      if (!map[row.section]) map[row.section] = {};
      map[row.section][row.key] = row.value;
    });
    setAllValues(map);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleChange(sectionId: string, key: string, val: string) {
    setAllValues(prev => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] || {}), [key]: val },
    }));
  }

  async function saveSection(sectionId: string) {
    setSavingSection(sectionId);
    const vals = allValues[sectionId] || {};
    const upserts = Object.entries(vals).map(([key, value]) => ({
      section: sectionId,
      key,
      value,
      updated_at: new Date().toISOString(),
    }));
    if (upserts.length > 0) {
      await supabase.from('page_sections').upsert(upserts, { onConflict: 'section,key' });
    }
    setSavingSection(null);
    setSavedSection(sectionId);
    setTimeout(() => setSavedSection(p => (p === sectionId ? null : p)), 2500);
  }

  async function saveAll() {
    setSaveAllState('saving');
    for (const section of SECTIONS) {
      const vals = allValues[section.id] || {};
      const upserts = Object.entries(vals).map(([key, value]) => ({
        section: section.id,
        key,
        value,
        updated_at: new Date().toISOString(),
      }));
      if (upserts.length > 0) {
        await supabase.from('page_sections').upsert(upserts, { onConflict: 'section,key' });
      }
    }
    setSaveAllState('saved');
    setTimeout(() => setSaveAllState('idle'), 3000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin text-navy-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl text-navy-900">Sayfa Editörü</h1>
          <p className="text-gray-400 text-sm mt-1">
            Web sitesinin tüm bölümlerini buradan düzenleyin. Her bölümü ayrı ayrı veya tümünü birden kaydedin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-navy-300 text-gray-600 hover:text-navy-800 rounded-xl text-sm font-medium transition-colors"
            onClick={() => setPreview(p => !p)}
          >
            {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            Siteyi Görüntüle
          </a>
          <button
            onClick={saveAll}
            disabled={saveAllState === 'saving'}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
              saveAllState === 'saved'
                ? 'bg-green-500 text-white'
                : 'bg-navy-800 hover:bg-navy-700 text-white disabled:opacity-50'
            }`}
          >
            {saveAllState === 'saving' ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor...</>
            ) : saveAllState === 'saved' ? (
              <><CheckCircle className="w-4 h-4" /> Tümü Kaydedildi</>
            ) : (
              <><Save className="w-4 h-4" /> Tümünü Kaydet</>
            )}
          </button>
        </div>
      </div>

      <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
        <span className="text-amber-500 text-base mt-0.5">!</span>
        <p className="text-amber-700 text-xs leading-relaxed">
          <strong>Borak bırakılan alanlar</strong> sayfadaki varsayılan metinleri korur. Yalnızca değiştirmek
          istediğiniz alanları doldurun ve kaydedin.
        </p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map(section => (
          <SectionEditor
            key={section.id}
            section={section}
            values={allValues[section.id] || {}}
            onChange={(key, val) => handleChange(section.id, key, val)}
            onSave={() => saveSection(section.id)}
            saving={savingSection === section.id}
            saved={savedSection === section.id}
          />
        ))}
      </div>
    </div>
  );
}
