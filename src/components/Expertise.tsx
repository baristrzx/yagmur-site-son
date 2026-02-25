import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Landmark, Building2, Globe2, ChevronDown, Handshake, Briefcase, Heart, BookOpen, Shield, UserCheck } from 'lucide-react';

const services = [
  {
    icon: Landmark,
    title: 'Kurumsal Hukuk ve Stratejik Danışmanlık',
    desc: 'Şirket kuruluşu, sözleşme mimarisi ve önleyici hukuk mekanizmaları.',
  },
  {
    icon: Building2,
    title: 'Gayrimenkul, İnşaat ve Mülkiyet Yönetimi',
    desc: 'Yüksek ölçekli yatırımlar ve mülkiyet uyuşmazlıklarında tam kapsamlı koruma.',
  },
  {
    icon: Globe2,
    title: 'Uluslararası Hukuki İşlemler',
    desc: 'Uluslararası sözleşmeler ve sınır aşan yatırım süreçlerinde yerel uzmanlık, küresel ağ.',
  },
];

const otherServices = [
  { icon: Briefcase, label: 'İş ve Sigorta Hukuku' },
  { icon: Heart, label: 'Aile Hukuku' },
  { icon: BookOpen, label: 'Miras Hukuku' },
  { icon: Shield, label: 'Ceza Hukuku' },
  { icon: UserCheck, label: 'İdare Hukuku' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

export default function Expertise() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [otherOpen, setOtherOpen] = useState(false);

  return (
    <section id="expertise" className="py-28 bg-navy-800 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-navy-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gold-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-gold-400 text-xs font-semibold tracking-[0.25em] uppercase font-sans">
            Uzmanlık Alanlarımız
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
            Hukuki Çözüm Ortaklığı
          </h2>
          <div className="mt-3 w-16 h-1 bg-gold-500 rounded-full mx-auto" />
          <p className="mt-6 text-white/60 max-w-2xl mx-auto text-[1.05rem] leading-relaxed font-sans">
            ANKH Legal, uyuşmazlıkları dava, müzakere ve arabuluculuk mekanizmalarını entegre
            biçimde değerlendirerek yönetir. Stratejik yaklaşım; sürecin hangi yöntemle
            yürütüleceğine değil, en doğru sonucun hangi yöntemle elde edileceğine odaklanır.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={cardVariants}
              className="relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-gold-500/40 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-gold-500/10 group-hover:bg-gold-500 border border-gold-500/30 group-hover:border-gold-500 flex items-center justify-center mb-6 transition-all duration-300">
                <s.icon size={26} className="text-gold-400 group-hover:text-navy-800 transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-white mb-3">{s.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed font-sans">{s.desc}</p>
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10"
        >
          <a
            href="#contact"
            className="flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6 rounded-2xl bg-gold-500 hover:bg-gold-400 transition-all duration-300 group hover:shadow-xl hover:shadow-gold-500/20 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy-800/20 flex items-center justify-center flex-shrink-0">
                <Handshake size={24} className="text-navy-800" />
              </div>
              <div className="text-left">
                <p className="font-serif text-navy-800 text-xl font-bold leading-tight">
                  Arabuluculuk Merkezi
                </p>
                <p className="text-navy-800/70 text-sm font-sans mt-0.5">
                  Uyuşmazlıklarda Mahkeme Öncesi Stratejik Çözüm: ANKH Arabuluculuk.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 flex-shrink-0">
              {['Hız', 'Gizlilik', 'Uzlaşı'].map((tag) => (
                <span key={tag} className="text-navy-800/80 text-xs font-semibold tracking-widest uppercase">
                  {tag}
                </span>
              ))}
              <span className="text-navy-800 font-bold text-lg group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-4"
        >
          <button
            onClick={() => setOtherOpen(!otherOpen)}
            className="w-full flex items-center justify-between px-8 py-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all duration-300 group"
          >
            <span className="text-white/70 text-sm font-semibold tracking-wide font-sans group-hover:text-white/90 transition-colors">
              Diğer Uzmanlık Alanlarımız
            </span>
            <ChevronDown
              size={18}
              className={`text-white/40 group-hover:text-gold-400 transition-all duration-300 ${otherOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {otherOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-3">
                  {otherServices.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center gap-3 px-5 py-4 rounded-xl border border-white/8 bg-white/3 hover:border-gold-500/30 hover:bg-white/8 transition-all duration-200 group cursor-default"
                    >
                      <s.icon size={16} className="text-gold-400/60 group-hover:text-gold-400 transition-colors flex-shrink-0" />
                      <span className="text-white/50 group-hover:text-white/80 text-sm font-sans transition-colors">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
