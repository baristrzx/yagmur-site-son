import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const info = [
  {
    icon: MapPin,
    label: 'Adres',
    value: 'Foça Mah. 983. Sok. No: 18/2\nFethiye / MUĞLA',
  },
  {
    icon: Phone,
    label: 'Telefon',
    value: '+90 505 989 57 59',
    href: 'tel:+905059895759',
  },
  {
    icon: Mail,
    label: 'E-posta',
    value: 'info@ankhlegal.com',
    href: 'mailto:info@ankhlegal.com',
  },
  {
    icon: Clock,
    label: 'Çalışma Saatleri',
    value: 'Pzt – Cum: 09:00 – 18:00',
  },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" className="py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase font-sans">
            İletişim
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-bold text-navy-800 leading-tight">
            Bizimle İletişime Geçin
          </h2>
          <div className="mt-3 w-16 h-1 bg-gold-500 rounded-full mx-auto" />
          <p className="mt-6 text-gray-500 max-w-xl mx-auto font-sans text-[1.03rem] leading-relaxed">
            Hukuki süreçlerinizde size özel stratejik danışmanlık için randevu alın.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            {info.map((item) => (
              <div key={item.label} className="flex gap-5 items-start p-6 rounded-xl border border-gray-100 hover:border-navy-200 hover:shadow-sm transition-all duration-300">
                <div className="w-11 h-11 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
                  <item.icon size={19} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-sans font-medium uppercase tracking-wider mb-1">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-navy-800 font-semibold font-sans hover:text-gold-600 transition-colors whitespace-pre-line"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-navy-800 font-semibold font-sans whitespace-pre-line">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="rounded-2xl overflow-hidden h-full min-h-[420px] bg-navy-900 flex flex-col"
          >
            <a
              href="https://www.google.com/maps/search/?api=1&query=36.659,29.114"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-col items-center justify-center gap-6 px-8 py-12 group relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-navy-700 via-navy-850 to-navy-950" />
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <div className="relative z-10 w-20 h-20 rounded-full bg-navy-800 border border-gold-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-gold-500/60 transition-all duration-400 shadow-xl">
                <MapPin size={32} className="text-gold-400" />
              </div>
              <div className="relative z-10 text-center">
                <p className="text-white font-serif text-xl font-bold">ANKH Legal</p>
                <p className="text-white/60 text-sm font-sans mt-2 leading-relaxed">
                  Foça Mah. 983. Sok. No: 18/2<br />Fethiye / MUĞLA
                </p>
              </div>
              <div className="relative z-10 mt-2 inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 text-sm font-bold font-sans px-6 py-2.5 rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-gold-500/20">
                <MapPin size={14} />
                Google Maps'te Aç
              </div>
            </a>
            <div className="bg-navy-800/80 px-6 py-4 border-t border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
              <p className="text-white/50 text-xs font-sans">Konuma gitmek için haritaya tıklayın</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
