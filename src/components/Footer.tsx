import { useEffect, useState } from 'react';
import { supabase, type LegalPage } from '../lib/supabase';

const quickLinks = [
  { label: 'Stratejik Yaklaşım', href: '#stratejik-yaklasim' },
  { label: 'Uzmanlık Alanları', href: '#expertise' },
  { label: 'Kurucu', href: '#founder' },
  { label: 'İletişim', href: '#contact' },
];

export default function Footer() {
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);

  useEffect(() => {
    supabase
      .from('legal_pages')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        setLegalPages(data || []);
      });
  }, []);

  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <a href="#" className="flex items-start mb-5">
              <img
                src="/image.png"
                alt="ANKH Legal"
                className="h-20 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-200"
              />
            </a>
            <p className="text-white/50 text-sm font-sans leading-relaxed max-w-xs">
              Stratejik dava yönetimi ve yüksek nitelikli hukuki danışmanlık. Risk analizi ve uzun
              vadeli güvenlik perspektifiyle hukuki çözümler.
            </p>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-sm tracking-widest uppercase text-white/60 mb-5">
              Hızlı Bağlantılar
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-gold-400 text-sm font-sans transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-gold-500/40 group-hover:w-5 group-hover:bg-gold-400 transition-all duration-200" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-sm tracking-widest uppercase text-white/60 mb-5">
              Yasal
            </h4>
            <ul className="flex flex-col gap-3">
              {legalPages.map((page) => (
                <li key={page.id}>
                  <a
                    href={`/yasal/${page.slug}`}
                    className="text-white/60 hover:text-gold-400 text-sm font-sans transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-gold-500/40 group-hover:w-5 group-hover:bg-gold-400 transition-all duration-200" />
                    {page.title_tr}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-sm tracking-widest uppercase text-white/60 mb-5">
              İletişim
            </h4>
            <div className="flex flex-col gap-3 text-white/60 text-sm font-sans">
              <p className="leading-relaxed">
                Foça Mah. 983. Sok. No: 18/2<br />
                Fethiye / MUĞLA
              </p>
              <a href="tel:+905059895759" className="hover:text-gold-400 transition-colors">
                +90 505 989 57 59
              </a>
              <a href="mailto:info@ankhlegal.com" className="hover:text-gold-400 transition-colors">
                info@ankhlegal.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs font-sans">
            © {new Date().getFullYear()} ANKH Legal. Tüm hakları saklıdır.
          </p>
          <p className="text-white/30 text-xs font-sans">
            Av. Arb. Yağmur Koçak | Baro Sicil No: —
          </p>
        </div>
      </div>
    </footer>
  );
}
