import { useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Landmark, Building2, Globe as Globe2, Briefcase, Heart, Shield, UserCheck, Handshake, Scale, ListChecks, Target } from 'lucide-react';

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

const arabuluculukSections = [
  {
    icon: Scale,
    title: 'Yapılandırılmış ve Dengeli Çözüm Süreçleri',
    content: [
      'Arabuluculuk, yalnızca tarafları uzlaştırma yöntemi değil; uyuşmazlığın ekonomik, hukuki ve ilişkisel boyutlarının birlikte değerlendirildiği yapılandırılmış bir süreçtir.',
      'ANKH Legal, arabuluculuk faaliyetlerini stratejik risk analizi ve dava perspektifi ile birlikte yürütür. Süreç, olası yargısal senaryolar dikkate alınarak tasarlanır; tarafların hukuki pozisyonu, müzakere gücü ve uzun vadeli etkiler birlikte değerlendirilir.',
      'Amaç, geçici bir uzlaşma değil; dengeli ve sürdürülebilir bir çözüm üretmektir.',
    ],
    bullets: null,
  },
  {
    icon: ListChecks,
    title: 'Arabuluculuk Faaliyet Alanları',
    content: ['Arabuluculuk faaliyetleri özellikle aşağıdaki alanlarda yürütülmektedir.'],
    bullets: [
      'Ticari Uyuşmazlıklar',
      'İş hukuku kaynaklı ihtilaflar',
      'Sigorta uyuşmazlıkları',
      'Tazminat ve sözleşme kaynaklı anlaşmazlıklar',
    ],
  },
  {
    icon: Target,
    title: 'Yaklaşım',
    content: ['Arabuluculuk sürecinde;'],
    bullets: [
      'Tarafların hukuki riskleri açık biçimde analiz edilir',
      'Müzakere zemini kontrollü şekilde oluşturulur',
      'Çözüm alternatifleri objektif kriterlerle değerlendirilir',
      'Süreç, gizlilik ve tarafsızlık ilkesi çerçevesinde yürütülür',
    ],
    footer: 'ANKH Legal, arabuluculuğu dava sürecine alternatif değil; uyuşmazlık çözüm stratejisinin ayrılmaz bir parçası olarak ele alır.',
  },
];

function Expertise() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const refAra = useRef(null);
  const inViewAra = useInView(refAra, { once: true, margin: '-80px' });

  return (
    <>
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
            <h2 className="mt-4 font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
              ÇALIŞMA ALANLARIMIZ
            </h2>
            <div className="mt-3 w-16 h-1 bg-gold-500 rounded-full mx-auto" />
          </motion.div>

          <div className="flex flex-col gap-3 mb-3">
            {goldTriangle.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 hover:bg-white/8 hover:border-gold-500/30 transition-all duration-300 group flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 group-hover:bg-gold-500 group-hover:border-gold-500 flex items-center justify-center flex-shrink-0 transition-all duration-300 mt-0.5">
                  <item.icon size={16} className="text-gold-400 group-hover:text-navy-800 transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-sans text-sm font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {otherAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 * (i + goldTriangle.length) }}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 hover:bg-white/8 hover:border-gold-500/30 transition-all duration-300 group flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 group-hover:bg-gold-500 group-hover:border-gold-500 flex items-center justify-center flex-shrink-0 transition-all duration-300 mt-0.5">
                  <area.icon size={16} className="text-gold-400 group-hover:text-navy-800 transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-sans text-sm font-bold text-white mb-1">
                    {area.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed font-sans">
                    {area.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="arabuluculuk" className="py-28 bg-navy-900 relative overflow-hidden" ref={refAra}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-navy-800/40 to-transparent" />
          <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-gold-600/5 blur-3xl -translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inViewAra ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="text-gold-400 text-xs font-semibold tracking-[0.25em] uppercase font-sans">
              Uzmanlık Alanlarımız
            </span>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
                <Handshake size={20} className="text-gold-400" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
                ARABULUCULUK
              </h2>
            </div>
            <div className="mt-3 w-16 h-1 bg-gold-500 rounded-full mx-auto" />
            <p className="mt-6 text-white/50 text-sm font-sans max-w-xl mx-auto leading-relaxed">
              Uyuşmazlıklarda mahkeme öncesi stratejik çözüm — dengeli, gizli ve sürdürülebilir.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {arabuluculukSections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inViewAra ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * i }}
                className="rounded-2xl border border-white/10 bg-white/4 p-7 hover:border-gold-500/30 hover:bg-white/6 transition-all duration-300 group flex flex-col gap-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/25 group-hover:bg-gold-500/20 flex items-center justify-center flex-shrink-0 transition-all duration-300">
                    <section.icon size={18} className="text-gold-400" />
                  </div>
                  <h3 className="font-sans text-sm font-bold text-white leading-snug pt-1">
                    {section.title}
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {section.content.map((para, j) => (
                    <p key={j} className="text-white/55 text-xs leading-relaxed font-sans">
                      {para}
                    </p>
                  ))}

                  {section.bullets && (
                    <ul className="flex flex-col gap-2 mt-1">
                      {section.bullets.map((bullet, k) => (
                        <li key={k} className="flex items-start gap-2.5">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                          <span className="text-white/55 text-xs leading-relaxed font-sans">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.footer && (
                    <p className="mt-2 text-gold-400/80 text-xs leading-relaxed font-sans italic border-t border-white/5 pt-4">
                      {section.footer}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inViewAra ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-8"
          >
            {['Hız', 'Gizlilik', 'Tarafsızlık', 'Uzlaşı'].map((tag) => (
              <div key={tag} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                <span className="text-white/40 text-xs font-semibold tracking-widest uppercase font-sans">{tag}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default memo(Expertise);
