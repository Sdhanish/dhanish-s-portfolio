import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Code2 } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import defaultLogoAsset from '../assets/images/dhanish-logo-light.png';

interface InitialLoaderProps {
  onComplete?: () => void;
}

export default function InitialLoader({ onComplete }: InitialLoaderProps) {
  let logoUrl = defaultLogoAsset;
  try {
    const portfolio = usePortfolio();
    if (portfolio?.logoUrl) logoUrl = portfolio.logoUrl;
  } catch {
    // Fallback if rendered outside provider context
  }
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasLoaded = sessionStorage.getItem('portfolio-has-loaded');
      return !hasLoaded;
    }
    return false;
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      if (onComplete) onComplete();
      return;
    }

    // Disable body scroll while loader is active
    document.body.style.overflow = 'hidden';

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('portfolio-has-loaded', 'true');
            document.body.style.overflow = '';
            if (onComplete) onComplete();
          }, 350);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20 + 15);
      });
    }, 100);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="initial-loader"
          initial={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0D0D0D] text-white select-none overflow-hidden backdrop-blur-3xl"
        >
          {/* Subtle Radial Atmosphere Glow */}
          <div className="absolute w-[600px] h-[600px] bg-[#BDF869]/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />

          {/* Center Brand Monogram & Identity */}
          <div className="relative z-10 flex flex-col items-center space-y-7 px-6 text-center max-w-md w-full">
            {/* Monogram Badge */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6C8E12] to-[#BDF869] rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
              <div className="relative w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800/80 flex items-center justify-center shadow-2xl overflow-hidden p-2">
                <img
                  src={logoUrl}
                  alt="Dhanish S Logo"
                  className="w-full h-full object-contain"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to text monogram if image fails
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                    }
                  }}
                />
                <span className="font-display font-extrabold text-2xl tracking-tighter text-[#BDF869] hidden">
                  DS
                </span>
              </div>
            </motion.div>

            {/* Pill Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-[#BDF869] text-[11px] font-mono font-semibold tracking-wider uppercase shadow-inner"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#BDF869] animate-spin" style={{ animationDuration: '4s' }} />
              <span>Full Stack Portfolio</span>
            </motion.div>

            {/* Name & Title */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="space-y-1.5"
            >
              <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight uppercase text-white">
                Dhanish S<span className="text-[#BDF869]">.</span>
              </h1>
              <p className="text-xs sm:text-sm font-mono text-neutral-400 tracking-wider uppercase">
                Full Stack Developer & MERN Specialist
              </p>
            </motion.div>

            {/* Premium Micro Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
              className="w-56 sm:w-64 space-y-2.5 pt-2"
            >
              <div className="relative h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-800/80 p-[1px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#6C8E12] via-[#BDF869] to-[#D6FF4F] rounded-full shadow-[0_0_12px_rgba(189,248,105,0.6)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 uppercase font-semibold tracking-wider px-0.5">
                <span className="flex items-center gap-1">
                  <Code2 className="w-3 h-3 text-[#BDF869]" />
                  Initializing Environment
                </span>
                <span className="text-[#BDF869] font-bold">{Math.min(progress, 100)}%</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

