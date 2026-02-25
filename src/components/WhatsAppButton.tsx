import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/905059895759"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: 2, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-7 right-7 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bb5a] flex items-center justify-center shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-shadow duration-200"
      aria-label="WhatsApp ile iletişime geçin"
    >
      <MessageCircle size={26} className="text-white fill-white" />
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
    </motion.a>
  );
}
