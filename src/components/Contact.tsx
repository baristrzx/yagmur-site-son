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
            className="rounded-2xl overflow-hidden h-full min-h-[420px] bg-gray-100 relative"
          >
            <iframe
              title="ANKH Legal Konum"
              src="https://www.openstreetmap.org/export/embed.html?bbox=29.0990%2C36.6490%2C29.1290%2C36.6690&layer=mapnik&marker=36.6590%2C29.1140"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '420px' }}
              allowFullScreen
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-navy-800/95 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/10">
                <p className="text-white font-serif font-semibold text-sm">ANKH Legal</p>
                <p className="text-white/60 text-xs font-sans mt-0.5">
                  Foça Mah. 983. Sok. No: 18/2, Fethiye / MUĞLA
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
