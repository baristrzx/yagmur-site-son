import { useRef, memo } from 'react';
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
    value: 'info@ankhlegal.com.tr',
    href: 'mailto:info@ankhlegal.com.tr',
  },
  {
    icon: Clock,
    label: 'Çalışma Saatleri',
    value: 'Pzt – Cum: 09:00 – 18:00',
  },
];

function Contact() {
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
          <p className="mt-6 text-gray-500 max-w-xl mx-auto font-sans text-base md:text-[1.03rem] leading-relaxed">
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
                  <p className="text-xs text-gray-500 font-sans font-medium uppercase tracking-wider mb-1">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-navy-800 font-semibold font-sans hover:text-gold-600 transition-colors whitespace-pre-line focus:outline-none focus:ring-2 focus:ring-gold-500/50 rounded"
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
            className="rounded-2xl overflow-hidden h-full min-h-[420px] flex flex-col shadow-md border border-gray-100"
          >
            <div className="flex-1 relative min-h-[360px] group cursor-pointer overflow-hidden">
              <a
                href="https://maps.app.goo.gl/Cp77Y56HyycVvpJWA"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-inset"
                aria-label="Google Maps'te ANKH Legal ofis konumunu görüntüle"
              >
                <img
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=36.6553,29.1228&zoom=16&size=800x400&maptype=roadmap&markers=color:red%7C36.6553,29.1228&style=feature:all|element:labels.text.fill|color:0x4a5568&style=feature:road|element:geometry|color:0xffffff&style=feature:water|element:geometry|color:0xc8d7e8&style=feature:landscape|element:geometry|color:0xf5f5f0`}
                  alt="ANKH Legal Ofis Konumu"
                  width="800"
                  height="400"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement?.parentElement;
                    if (parent) {
                      parent.style.background = 'linear-gradient(135deg, #1a2744 0%, #243058 50%, #1a2744 100%)';
                    }
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <MapPin size={40} className="text-gold-400 mb-3" />
                  <p className="text-white font-semibold font-sans text-base">Haritada Görüntüle</p>
                  <p className="text-white/60 font-sans text-sm mt-1">Google Maps'te aç</p>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, #1a2744 0%, #243058 40%, #1e3a5f 100%)' }}
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-gold-500/30 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-gold-500/50 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center">
                          <MapPin size={16} className="text-navy-900" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold-400 animate-ping" />
                  </div>
                  <p className="text-white font-semibold font-sans text-base mt-5">Foça Mah. 983. Sok. No: 18/2</p>
                  <p className="text-white/60 font-sans text-sm mt-1">Fethiye / MUĞLA</p>
                  <div className="mt-4 px-4 py-2 border border-gold-500/50 rounded-lg">
                    <p className="text-gold-400 text-xs font-sans font-medium">Google Maps'te Görüntüle</p>
                  </div>
                </div>
              </a>
            </div>
            <div className="bg-navy-800 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                <p className="text-white/70 text-xs font-sans">Foça Mah. 983. Sok. No: 18/2, Fethiye</p>
              </div>
              <a
                href="https://maps.app.goo.gl/Cp77Y56HyycVvpJWA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-xs font-semibold font-sans transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/50 rounded px-1 py-0.5"
                aria-label="Google Maps'te büyük haritayı aç"
              >
                <MapPin size={12} />
                Büyük Harita
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default memo(Contact);
