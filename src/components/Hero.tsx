import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-800">
      <img
        src="/WhatsApp_Image_2026-02-24_at_15.37.40.jpeg"
        alt=""
        width="1920"
        height="1080"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 via-navy-900/60 to-navy-900/85" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-royal-700/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gold-600/8 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-5 sm:mb-6"
        >
          <span className="inline-block text-gold-400 text-xs font-sans font-semibold tracking-[0.2em] sm:tracking-[0.3em] uppercase border border-gold-500/40 px-3 sm:px-4 py-1.5 rounded-full">
            Hukuk & Danışmanlık
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 sm:mb-8"
        >
          ANKH Legal: Hukuki Güvenlik ve{' '}
          <span className="text-gold-400 italic">Stratejik Çözüm</span>{' '}
          Ortaklığı
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-sans text-white/85 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2 sm:px-0"
        >
          Karmaşık hukuki süreçlerde, bireyler ve şirketler için dava yönetimi,
          hukuki danışmanlık ve stratejik temsil.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        >
          <a
            href="https://wa.me/905059895759"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm tracking-wide rounded transition-all duration-200 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5 text-center focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-navy-800"
          >
            Ön Görüşme Talep Et
          </a>
          <a
            href="#stratejik-yaklasim"
            className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 border border-white/30 hover:border-white/60 text-white text-sm font-medium tracking-wide rounded transition-all duration-200 hover:bg-white/5 text-center focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-navy-800"
          >
            Daha Fazla Bilgi
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2"
      >
        <a
          href="#stratejik-yaklasim"
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors group focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg p-2"
          aria-label="Aşağı kaydır"
        >
          <span className="text-xs font-sans tracking-widest uppercase">Keşfedin</span>
          <ArrowDown size={16} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}

export default memo(Hero);
