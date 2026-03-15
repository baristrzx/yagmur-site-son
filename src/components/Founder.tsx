import { useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Scale } from 'lucide-react';

const credentials = [
  { icon: Scale, label: 'Dava Yönetimi & Stratejik Çözüm Uzmanı' },
  { icon: BookOpen, label: 'Hukuki Danışmanlık & Risk Analizi' },
];

function Founder() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="founder" className="py-28 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase font-sans">
              Kurucu Avukat & Arabulucu
            </span>
            <h3 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-navy-800 leading-tight">
              Av. Arb. Yağmur Koçak Arat
            </h3>
            <div className="mt-2 w-12 h-1 bg-gold-500 rounded-full" />
          </div>

          <div className="clearfix">
            <div className="float-left mr-8 mb-4 w-56 md:w-72 flex-shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/WhatsApp_Image_2026-02-26_at_14.25.27.jpeg"
                  alt="Av. Arb. Yağmur Koçak Arat"
                  width="288"
                  height="384"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-4 py-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3">
                    <p className="font-serif text-white text-sm font-semibold">Av. Arb. Yağmur Koçak Arat</p>
                    <p className="text-gold-300 text-[10px] font-sans font-medium tracking-wide mt-0.5">
                      Kurucu Avukat | Arabulucu
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed font-sans text-base md:text-[1.03rem] text-justify">
              Av. Arb. Yağmur Koçak Arat, dava yönetimi ve stratejik uyuşmazlık çözümü alanında
              uzmanlaşmış bir hukukçudur.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed font-sans text-base md:text-[1.03rem] text-justify">
              Çalışma modeli; yargısal süreci, müzakere dinamiklerini ve arabuluculuk
              mekanizmalarını birlikte değerlendiren bütüncül bir yaklaşıma dayanır. Her
              uyuşmazlık, dava perspektifi ile analiz edilir; çözüm yolu ise dosyanın niteliğine
              göre belirlenir.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed font-sans text-base md:text-[1.03rem] text-justify">
              Ticari, sigorta ve iş hukuku kaynaklı ihtilaflarda hem temsil hem arabuluculuk
              faaliyetleri yürütmekte; hukuki risk ile ekonomik sonuç arasındaki dengeyi esas
              almaktadır. Dava süreçlerinde disiplinli ve kararlı, müzakerede stratejik ve hesaplı,
              arabuluculukta ise çözüm odaklıdır.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed font-sans text-base md:text-[1.03rem] text-justify">
              ANKH Legal'i, yalnızca uyuşmazlık takip eden değil; uyuşmazlığı yöneten bir hukuk
              anlayışı üzerine kurmuştur.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {credentials.map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
                  <c.icon size={15} className="text-gold-400" />
                </div>
                <span className="text-gray-700 text-sm md:text-base font-sans font-medium">{c.label}</span>
              </div>
            ))}
          </div>

          <a
            href="#contact"
            className="inline-flex items-center mt-8 px-7 py-3.5 bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold tracking-wide rounded transition-all duration-200 hover:shadow-lg hover:shadow-navy-800/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:ring-offset-2"
          >
            Dosya Ön Değerlendirme Talebi
            <span className="ml-2">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(Founder);
