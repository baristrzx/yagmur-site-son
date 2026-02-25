import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Landmark, Building2, Globe2, Handshake, Briefcase, Heart, Shield, UserCheck, BookOpen } from 'lucide-react';

const goldTriangle = [
  {
    icon: Landmark,
    label: 'A',
    title: 'Kurumsal Hukuk ve Stratejik Danışmanlık',
    desc: 'Şirketler ve girişimler için sadece uyuşmazlık yönetimi değil, uyuşmazlığı doğmadan engelleyen "Önleyici Hukuki Yapılandırma" sunuyoruz. Sözleşme mimarisinden ortaklık yapılarına, ticari alacak yönetiminden kurumsal risk analizine kadar iş dünyasının her aşamasında stratejik kalkanınız oluyoruz.',
  },
  {
    icon: Building2,
    label: 'B',
    title: 'Gayrimenkul, İnşaat ve Mülkiyet Yönetimi',
    desc: 'Taşınmaz ve mülkiyet ilişkileri, hatayı kabul etmeyecek kadar kritiktir. Paylı mülkiyet çözümleri, tapu iptal ve tescil davaları ile yatırım süreçlerinin hukuki analizi konularında, mülkiyet haklarınızı koruyan ve değer katan çözümler üretiyoruz.',
  },
  {
    icon: Globe2,
    label: 'C',
    title: 'Uluslararası Hukuki İşlemler',
    desc: 'Dünya küçülürken hukuk genişliyor. Yabancı unsurlu sözleşmeler, sınır aşan yatırımlar ve uluslararası uyuşmazlıklarda; yerel mevzuat hakimiyetimizi global ağımızla birleştirerek müvekkillerimizi küresel arenada temsil ediyoruz.',
  },
];

const otherAreas = [
  {
    icon: Briefcase,
    title: 'İş ve Sigorta Hukuku',
    desc: 'İş ilişkilerinin yönetiminden (sözleşme ve fesih süreçleri) sigorta uyuşmazlıklarına ve tazminat yönetimini kapsayan süreçlerde dava, arabuluculuk ve önleyici danışmanlık hizmetleri sunuyoruz.',
  },
  {
    icon: Heart,
    title: 'Aile ve Miras Hukuku',
    desc: 'Aile içi ve miras ilişkilerinde, sadece uyuşmazlık çözümü değil; vasiyetname ve miras sözleşmeleri ile "Aile İçi Malvarlığı Planlaması" gibi geleceği koruyan hukuki adımlar atıyoruz.',
  },
  {
    icon: Shield,
    title: 'Ceza Hukuku',
    desc: 'Soruşturma ve kovuşturma aşamalarında, delil ve usul stratejisini en başından kurgulayarak, müvekkillerimiz için yüksek nitelikli ve stratejik bir savunma hattı oluşturuyoruz.',
  },
  {
    icon: UserCheck,
    title: 'İdari ve Düzenleyici Süreçler',
    desc: 'Kamu otoriteleriyle olan ilişkilerde, idari yaptırımlara ve para cezalarına karşı iptal davaları ile ruhsat ve izin süreçlerinin takibinde tam hukuki destek sağlıyoruz.',
  },
];

export default function Expertise() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [arabuluculukOpen, setArabuluculukOpen] = useState(false);

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
            UZMANLIKLAR
          </h2>
          <div className="mt-3 w-16 h-1 bg-gold-500 rounded-full mx-auto" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {goldTriangle.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
              className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/8 hover:border-gold-500/30 transition-all duration-300 group"
            >
              <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 group-hover:bg-gold-500 group-hover:border-gold-500 flex items-center justify-center mb-4 flex-shrink-0 transition-all duration-300">
                <item.icon size={16} className="text-gold-400 group-hover:text-navy-800 transition-colors duration-300" />
              </div>
              <h3 className="font-sans text-sm font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-white/50 text-xs leading-relaxed font-sans">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-14"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="rounded-xl border border-white/10 bg-white/4 p-5 hover:border-gold-500/30 hover:bg-white/8 transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/20 group-hover:bg-gold-500/20 flex items-center justify-center mb-4 transition-all duration-300">
                  <area.icon size={16} className="text-gold-400" />
                </div>
                <h4 className="font-sans text-sm font-bold text-white mb-2">{area.title}</h4>
                <p className="text-white/50 text-xs leading-relaxed font-sans">{area.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setArabuluculukOpen(prev => !prev)}
            className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6 bg-gold-500 hover:bg-gold-400 transition-all duration-300 group hover:shadow-xl hover:shadow-gold-500/20"
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
              <ChevronDown
                size={20}
                className={`text-navy-800 transition-transform duration-300 ${arabuluculukOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </button>

          <AnimatePresence>
            {arabuluculukOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-8 py-6 bg-gold-500/15 border border-gold-500/20 border-t-0 space-y-4">
                  <p className="text-white/75 text-sm leading-relaxed font-sans">
                    Arabuluculuk, yalnızca tarafları uzlaştırma yöntemi değil; uyuşmazlığın ekonomik, hukuki ve ilişkisel boyutlarının birlikte değerlendirildiği yapılandırılmış bir süreçtir.
                  </p>
                  <p className="text-white/75 text-sm leading-relaxed font-sans">
                    ANKH Legal, arabuluculuk faaliyetlerini stratejik risk analizi ve dava perspektifi ile birlikte yürütür. Süreç, olası yargısal senaryolar dikkate alınarak tasarlanır; tarafların hukuki pozisyonu, müzakere gücü ve uzun vadeli etkiler birlikte değerlendirilir.
                  </p>
                  <p className="text-white/75 text-sm leading-relaxed font-sans">
                    Amaç, geçici bir uzlaşma değil; dengeli ve sürdürülebilir bir çözüm üretmektir.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
