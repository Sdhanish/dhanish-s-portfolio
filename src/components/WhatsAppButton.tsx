import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../contexts/PortfolioContext';

export default function WhatsAppButton() {
  const { personalInfo } = usePortfolio();
  const [isHovered, setIsHovered] = useState(false);

  const rawPhone = personalInfo?.phone || '+917909122902';
  // Extract numerical digits only
  const cleanedPhone = rawPhone.replace(/[^0-9]/g, '') || '917909122902';
  
  const defaultMessage = "Hi Dhanish, I came across your portfolio and would like to connect!";
  const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8 print:hidden flex items-center">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mr-3 hidden sm:flex items-center px-3.5 py-1.5 rounded-xl bg-neutral-900/90 dark:bg-neutral-900/95 border border-neutral-800 text-white text-xs font-mono font-medium tracking-wide shadow-xl backdrop-blur-md whitespace-nowrap pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] mr-2 animate-pulse" />
            Chat with Dhanish
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Dhanish S on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.65)] transition-shadow duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
      >
        {/* Subtle background radar ripple / pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none opacity-75" style={{ animationDuration: '3s' }} />

        {/* Official WhatsApp Icon */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.808 0-3.58-.485-5.132-1.403l-.368-.218-3.815 1.001 1.018-3.719-.24-.382c-1.01-1.607-1.544-3.468-1.544-5.38 0-5.513 4.487-10 10-10 2.67 0 5.18 1.04 7.067 2.927 1.887 1.887 2.927 4.397 2.927 7.067 0 5.513-4.487 10-10 10m0-21.8c-6.507 0-11.8 5.293-11.8 11.8 0 2.08.544 4.113 1.577 5.901l-1.677 6.124 6.267-1.644c1.725.94 3.673 1.438 5.633 1.438 6.507 0 11.8-5.293 11.8-11.8 0-3.153-1.228-6.118-3.456-8.347-2.229-2.228-5.193-3.456-8.347-3.456z" />
        </svg>
      </motion.a>
    </div>
  );
}
