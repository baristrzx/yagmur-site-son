import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, BarChart3, ShieldCheck } from 'lucide-react';

const pillars = [
  {
    icon: Globe,
    title: 'Global Perspektif',
    desc: 'Uluslararası hukuk standartları ve küresel ticari dinamikler ışığında stratejik değerlendirme.',
  },
  {
    icon: BarChart3,
    title: 'Analitik Yaklaşım',
    desc: 'Her davayı veri odaklı risk analizi ile ele alarak en güvenli çözüm yollarını belirleriz.',
  },
  {
    icon: ShieldCheck,
    title: 'Uzun Vadeli Güvenlik',
    desc: 'Anlık çözümler yerine, müvekkillerin uzun vadeli hukuki güvenliğini esas alan bir yaklaşım.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="stratejik-yaklasim" className="py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={itemVariants}>
            <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase font-sans">
              Stratejik Yaklaşım
            </span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl font-bold text-navy-800 leading-tight">
              Reaktif Değil,{' '}
              <span className="italic text-navy-600">Öngörülü</span> Hukuk
            </h2>
            <div className="mt-2 w-16 h-1 bg-gold-500 rounded-full" />

            <p className="mt-8 text-gray-600 leading-relaxed text-[1.05rem] font-sans text-justify">
              ANKH Legal, stratejik dava yönetimi ve yüksek nitelikli hukuki danışmanlık sunmak
              amacıyla kurulmuş bir hukuk ofisidir.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed text-[1.05rem] font-sans text-justify">
              Hukuki meseleleri yalnızca yargısal süreçler olarak değil; risk analizi, güç dengesi
              ve uzun vadeli hukuki güvenlik perspektifiyle ele alır. Her dosya, kapsamlı bir ön
              değerlendirmeye tabi tutulur; sürecin başında net bir yol haritası oluşturulur ve
              temsil buna göre yapılandırılır.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed text-[1.05rem] font-sans text-justify">
              Yaklaşımımız reaktif değil, öngörülüdür. Amaç yalnızca bir uyuşmazlığı
              sonuçlandırmak değil; müvekkilin hukuki pozisyonunu güçlendirmektir.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed text-[1.05rem] font-sans text-justify">
              ANKH Legal, bireyler, aile işletmeleri ve şirketler için karmaşık hukuki süreçleri
              sistemli, disiplinli ve sonuç odaklı bir anlayışla yönetir. Türkiye merkezli olmakla
              birlikte uluslararası bağlantılı hukuki işlemler ve yabancı müvekkillerle çalışma
              hedefi doğrultusunda konumlanmıştır. Sınır aşan sözleşmeler, yatırım süreçleri ve
              özel hukuk uyuşmazlıklarında; yerel uzmanlık ile küresel perspektifi birleştiren bir
              temsil anlayışı benimser.
            </p>

            <a
              href="#contact"
              className="inline-flex items-center mt-8 text-navy-700 hover:text-gold-600 font-semibold text-sm tracking-wide transition-colors group"
            >
              Danışmanlık Alın
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </motion.div>

          <motion.div variants={containerVariants} className="flex flex-col gap-6">
            {pillars.map((p) => (
              <motion.div
                key={p.title}
                variants={itemVariants}
                className="flex gap-5 p-6 rounded-xl border border-gray-100 hover:border-navy-200 hover:shadow-md hover:shadow-navy-100/50 transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-navy-800 group-hover:bg-gold-500 flex items-center justify-center transition-colors duration-300">
                  <p.icon size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-navy-800 mb-1">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-sans">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
