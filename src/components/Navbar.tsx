import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const expertiseItems = [
  { label: 'Kurumsal Hukuk ve Stratejik Danışmanlık', href: '#expertise' },
  { label: 'Gayrimenkul ve Mülkiyet Yönetimi', href: '#expertise' },
  { label: 'Sınır Ötesi İşlemler', href: '#expertise' },
  { label: 'Diğer (Aile, Ceza, İdare Hukuku)', href: '#expertise', muted: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-navy-800 shadow-lg shadow-navy-900/30 ${
        scrolled ? 'py-2.5' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <a href="/" className="flex items-center group" onClick={() => setMenuOpen(false)}>
          <img
            src="/Ekran_Resmi_2026-02-26_21.00.58.png"
            alt="ANKH Legal"
            className="h-10 sm:h-14 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
          />
        </a>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-white/80 hover:text-gold-400 text-sm font-medium tracking-wide transition-colors duration-200 relative group focus:outline-none focus:ring-2 focus:ring-gold-500/50 rounded px-1 py-0.5"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-label="Uzmanlıklar menüsü"
            >
              Uzmanlıklar
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 group-hover:w-full transition-all duration-300" />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-3 w-72 lg:w-80 bg-navy-800 border border-white/10 rounded-xl shadow-2xl shadow-navy-900/50 overflow-hidden"
                >
                  <div className="py-2">
                    {expertiseItems.map((item, i) => (
                      <a
                        key={i}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className={`block px-5 py-3 text-sm transition-colors duration-150 hover:bg-white/5 ${
                          item.muted
                            ? 'text-white/40 italic text-xs hover:text-white/60'
                            : 'text-white/70 hover:text-gold-400'
                        }`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#arabuluculuk"
            className="text-white/80 hover:text-gold-400 text-sm font-medium tracking-wide transition-colors duration-200 relative group focus:outline-none focus:ring-2 focus:ring-gold-500/50 rounded px-1 py-0.5"
          >
            Arabuluculuk
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 group-hover:w-full transition-all duration-300" />
          </a>

          <a
            href="#knowledge"
            className="text-white/80 hover:text-gold-400 text-sm font-medium tracking-wide transition-colors duration-200 relative group focus:outline-none focus:ring-2 focus:ring-gold-500/50 rounded px-1 py-0.5"
          >
            Bilgi Merkezi
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 group-hover:w-full transition-all duration-300" />
          </a>

          <a
            href="#founder"
            className="text-white/80 hover:text-gold-400 text-sm font-medium tracking-wide transition-colors duration-200 relative group focus:outline-none focus:ring-2 focus:ring-gold-500/50 rounded px-1 py-0.5"
          >
            Kurucu
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 group-hover:w-full transition-all duration-300" />
          </a>

          <a
            href="#contact"
            className="text-white/80 hover:text-gold-400 text-sm font-medium tracking-wide transition-colors duration-200 relative group focus:outline-none focus:ring-2 focus:ring-gold-500/50 rounded px-1 py-0.5"
          >
            İletişim
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 group-hover:w-full transition-all duration-300" />
          </a>

          <a
            href="/client-panel"
            className="text-white/60 hover:text-white/90 text-sm font-medium tracking-wide transition-colors duration-200 border border-white/20 hover:border-white/40 px-4 py-1.5 rounded whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gold-500/50"
          >
            Müvekkil Paneli
          </a>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2 -mr-1 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/50"
          aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-0 bg-black/40 md:hidden z-[-1]"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-navy-800 border-t border-white/10 overflow-hidden max-h-[calc(100vh-60px)] overflow-y-auto"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                <div className="py-2 border-b border-white/5">
                  <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-2 mt-1 px-1">
                    Uzmanlıklar
                  </p>
                  {expertiseItems.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center py-2.5 px-3 rounded-lg text-sm transition-colors ${
                        item.muted
                          ? 'text-white/30 italic text-xs'
                          : 'text-white/65 hover:text-gold-400 hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>

                {[
                  { href: '#arabuluculuk', label: 'Arabuluculuk' },
                  { href: '#knowledge', label: 'Bilgi Merkezi' },
                  { href: '#founder', label: 'Kurucu' },
                  { href: '#contact', label: 'İletişim' },
                ].map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-white/80 hover:text-gold-400 hover:bg-white/5 text-sm font-medium py-3 px-3 rounded-lg transition-colors border-b border-white/5"
                  >
                    {item.label}
                  </a>
                ))}

                <a
                  href="/client-panel"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 px-5 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm font-medium rounded-lg text-center transition-colors"
                >
                  Müvekkil Paneli
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
