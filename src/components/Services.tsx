import { useState, useEffect, ReactNode, MouseEvent } from 'react';
import { 
  Layout, 
  Smartphone, 
  Database, 
  Cpu, 
  Layers, 
  Globe, 
  ArrowUpRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../contexts/PortfolioContext';

// Custom rich icon configuration map

const iconConfigMap: Record<string, { icon: ReactNode; bgLight: string; bgDark: string; color: string }> = {
  Layout: {
    icon: <Layout className="w-6 h-6 text-[#6C8E12] dark:text-[#BDF869]" />,
    bgLight: 'bg-[#6C8E12]/10',
    bgDark: 'dark:bg-[#BDF869]/15',
    color: '#6C8E12'
  },
  Smartphone: {
    icon: <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    bgLight: 'bg-blue-500/10',
    bgDark: 'dark:bg-blue-400/15',
    color: '#3B82F6'
  },
  Database: {
    icon: <Database className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    bgLight: 'bg-emerald-500/10',
    bgDark: 'dark:bg-emerald-400/15',
    color: '#10B981'
  },
  Cpu: {
    icon: <Cpu className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
    bgLight: 'bg-purple-500/10',
    bgDark: 'dark:bg-purple-400/15',
    color: '#8B5CF6'
  },
  Layers: {
    icon: <Layers className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
    bgLight: 'bg-amber-500/10',
    bgDark: 'dark:bg-amber-400/15',
    color: '#F59E0B'
  },
  Globe: {
    icon: <Globe className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
    bgLight: 'bg-cyan-500/10',
    bgDark: 'dark:bg-cyan-400/15',
    color: '#06B6D4'
  },
};

export default function Services() {
  const { services } = usePortfolio();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);

  // Multiply services list for seamless infinite looping
  const loopCount = 4;
  const displayServices = Array(loopCount).fill(services).flat();
  const totalOriginal = services.length;

  // Responsive visible cards listener
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3); // 3 cards on desktop
      } else if (window.innerWidth >= 640) {
        setVisibleCards(2); // 2 cards on tablet
      } else {
        setVisibleCards(1); // 1 card on mobile
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  const maxSlideIndex = Math.max(0, displayServices.length - visibleCards);

  // Auto-slide ticker interval (3.5 seconds per step, slowly & infinitely)
  useEffect(() => {
    if (isHovered || maxSlideIndex <= 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => {
        if (prev >= maxSlideIndex) {
          return 0;
        }
        return prev + 1;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [isHovered, maxSlideIndex]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev <= 0 ? maxSlideIndex : prev - 1));
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  const handleScrollToContact = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      const offset = 80;
      const position = contactSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  };

  const currentOriginalIndex = totalOriginal > 0 ? activeSlide % totalOriginal : 0;

  return (
    <section id="services" className="py-24 bg-neutral-50 dark:bg-neutral-950 text-[#1B2410] dark:text-neutral-100 transition-colors duration-300 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#6C8E12]/5 dark:bg-[#BDF869]/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-14 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#6C8E12] dark:text-[#BDF869]">
              04 / Core Capabilities
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight text-[#1B2410] dark:text-white uppercase">
                Services & Solutions
              </h2>
              <div className="w-16 h-1 bg-[#6C8E12] dark:bg-[#BDF869] rounded-full mt-2" />
            </div>

            {/* Slide counter badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-xs font-mono font-extrabold text-neutral-600 dark:text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-[#6C8E12] dark:text-[#BDF869]" />
              <span>Solution 0{currentOriginalIndex + 1} / 0{totalOriginal}</span>
            </div>
          </div>
        </div>

        {/* Slidable Carousel Container with Glassmorphism Arrows */}
        {services.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 dark:text-neutral-400 font-mono text-sm border border-dashed border-neutral-300 dark:border-neutral-800 rounded-3xl">
            No services listed yet.
          </div>
        ) : (
          <div 
            className="relative px-2 sm:px-6 md:px-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
          {/* Glassmorphism LEFT Arrow Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous service"
            className="absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/90 dark:border-neutral-700/80 shadow-2xl text-[#1B2410] dark:text-white hover:bg-[#6C8E12] hover:text-white dark:hover:bg-[#BDF869] dark:hover:text-black hover:border-[#6C8E12] dark:hover:border-[#BDF869] transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Glassmorphism RIGHT Arrow Button */}
          <button
            onClick={nextSlide}
            aria-label="Next service"
            className="absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/90 dark:border-neutral-700/80 shadow-2xl text-[#1B2410] dark:text-white hover:bg-[#6C8E12] hover:text-white dark:hover:bg-[#BDF869] dark:hover:text-black hover:border-[#6C8E12] dark:hover:border-[#BDF869] transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 group"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* SINGLE ROW SLIDING TRACK */}
          <div className="overflow-hidden rounded-3xl py-4 px-1">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              animate={{ x: `-${activeSlide * (100 / visibleCards)}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex cursor-grab active:cursor-grabbing select-none"
            >
              {displayServices.map((service, index) => {
                const config = iconConfigMap[service.iconName] || iconConfigMap['Layout'];
                const origIndex = index % totalOriginal;

                return (
                  <div
                    key={`display-service-${service.id || service.title}-${index}`}
                    className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-3"
                  >
                    <motion.div
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ duration: 0.3 }}
                      className="group relative h-full flex flex-col justify-between p-6 sm:p-7 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_40px_-10px_rgba(108,142,18,0.2)] dark:hover:shadow-[0_20px_40px_-10px_rgba(189,248,105,0.2)] hover:border-[#6C8E12]/60 dark:hover:border-[#BDF869]/60 transition-all duration-300"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Top Bar: Service Icon + Index Badge */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`w-11 h-11 rounded-xl ${config.bgLight} ${config.bgDark} flex items-center justify-center border border-neutral-200/50 dark:border-neutral-800 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                            {config.icon}
                          </div>

                          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            0{origIndex + 1} / 0{totalOriginal}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-sans font-black tracking-tight text-[#1B2410] dark:text-white uppercase group-hover:text-[#6C8E12] dark:group-hover:text-[#BDF869] transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal line-clamp-3">
                            {service.description}
                          </p>
                        </div>

                        {/* Technology / Feature Tags */}
                        {service.tags && (
                          <div className="pt-1 flex flex-wrap gap-1.5">
                            {service.tags.map((tag, tagIndex) => (
                              <span
                                key={`serv-${index}-tag-${tag}-${tagIndex}`}
                                className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 text-[10px] font-mono font-bold border border-neutral-200 dark:border-neutral-700/80 group-hover:border-[#6C8E12]/30 dark:group-hover:border-[#BDF869]/30 transition-colors"
                              >
                                <CheckCircle className="w-2.5 h-2.5 text-[#6C8E12] dark:text-[#BDF869]" />
                                <span>{tag}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Action */}
                      <div className="pt-5 mt-5 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
                        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 group-hover:text-[#6C8E12] dark:group-hover:text-[#BDF869] transition-colors">
                          Solution
                        </span>

                        <button
                          onClick={handleScrollToContact}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[#1B2410] dark:text-neutral-100 group-hover:bg-[#6C8E12] group-hover:text-white dark:group-hover:bg-[#BDF869] dark:group-hover:text-black font-mono text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm"
                          aria-label={`Inquire about ${service.title}`}
                        >
                          <span>Inquire</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>

                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>

        </div>
        )}

        {/* PAGINATION DOTS (BOTTOM) */}
        <div className="mt-8 flex items-center justify-center space-x-2">
          {services.map((service, idx) => {
            const isActive = currentOriginalIndex === idx;
            return (
              <button
                key={`service-dot-${service.id || service.title}-${idx}`}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-7 sm:w-9 h-2.5 rounded-full bg-[#6C8E12] dark:bg-[#BDF869] shadow-[0_0_12px_rgba(108,142,18,0.5)] dark:shadow-[0_0_15px_rgba(189,248,105,0.6)]'
                    : 'w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600'
                }`}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
