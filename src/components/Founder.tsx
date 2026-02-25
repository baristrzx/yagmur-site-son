import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, BookOpen, Scale } from 'lucide-react';

const credentials = [
  { icon: Scale, label: 'Dava Yönetimi & Stratejik Çözüm Uzmanı' },
  { icon: BookOpen, label: 'Hukuki Danışmanlık & Risk Analizi' },
  { icon: Award, label: 'Arabuluculuk Sicil No: TR-AR-2024' },
];

export default function Founder() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="founder" className="py-28 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] max-w-md mx-auto">
              <img
                src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Av. Yağmur Koçak Arat"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4">
                  <p className="font-serif text-white text-xl font-semibold">Av. Yağmur Koçak Arat</p>
                  <p className="text-gold-300 text-xs font-sans font-medium tracking-wide mt-1">
                    Kurucu Avukat | Arabulucu
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -left-6 w-48 h-48 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full bg-navy-600/15 blur-3xl pointer-events-none" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase font-sans">
              Kurucu Avukat & Arabulucu
            </span>
            <h3 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-navy-800 leading-tight">
              Av. Yağmur Koçak Arat
            </h3>
            <div className="mt-2 w-12 h-1 bg-gold-500 rounded-full" />

            <p className="mt-6 text-gray-600 leading-relaxed font-sans text-[1.03rem]">
              Av. Yağmur Koçak Arat, dava yönetimi ve stratejik uyuşmazlık çözümü alanında
              uzmanlaşmış bir hukukçudur.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed font-sans text-[1.03rem]">
              Çalışma modeli; yargısal süreci, müzakere dinamiklerini ve arabuluculuk
              mekanizmalarını birlikte değerlendiren bütüncül bir yaklaşıma dayanır. Her
              uyuşmazlık, dava perspektifi ile analiz edilir; çözüm yolu ise dosyanın niteliğine
              göre belirlenir.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed font-sans text-[1.03rem]">
              Ticari, sigorta ve iş hukuku kaynaklı ihtilaflarda hem temsil hem arabuluculuk
              faaliyetleri yürütmekte; hukuki risk ile ekonomik sonuç arasındaki dengeyi esas
              almaktadır.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed font-sans text-[1.03rem] italic border-l-2 border-gold-400 pl-4">
              Dava süreçlerinde disiplinli ve kararlı, müzakerede stratejik ve hesaplı,
              arabuluculukta ise çözüm odaklıdır.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed font-sans text-[1.03rem]">
              ANKH Legal'i, yalnızca uyuşmazlık takip eden değil; uyuşmazlığı yöneten bir hukuk
              anlayışı üzerine kurmuştur.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              {credentials.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
                    <c.icon size={15} className="text-gold-400" />
                  </div>
                  <span className="text-gray-700 text-sm font-sans font-medium">{c.label}</span>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="inline-flex items-center mt-8 px-7 py-3.5 bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold tracking-wide rounded transition-all duration-200 hover:shadow-lg hover:shadow-navy-800/30 hover:-translate-y-0.5"
            >
              Dosya Ön Değerlendirme Talebi
              <span className="ml-2">→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
