import { useState, useEffect, useMemo, memo, MouseEvent } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { scrollToSection } from '../utils/scroll';

import defaultHeroLight from '../assets/images/light-theme.png';
import defaultHeroDark from '../assets/images/dark-theme.png';

interface HeroProps {
  onOpenResume: () => void;
}

// Subcomponent for cinematic, smooth fading & sand/dust dissolve title transitions
const CinematicRoles = memo(function CinematicRoles({
  words,
  align = 'right',
}: {
  words: string[];
  align?: 'left' | 'center' | 'right';
}) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!words || words.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 4500); // 4.5s per title for a relaxed, luxury pace

    return () => clearInterval(interval);
  }, [words]);

  const currentPhrase = words[index % (words.length || 1)] || '';

  // Split phrase into words, then words into letters to ensure natural typography letter-spacing
  const parsedWords = useMemo(() => {
    let globalCharIndex = 0;
    return currentPhrase.split(' ').map((wordStr, wIdx) => {
      const letters = wordStr.split('').map((char) => {
        const i = globalCharIndex++;
        const seed = (char.charCodeAt(0) * (i + 1)) % 100;
        const xOffset = ((seed % 15) - 7) * 1.0; // -7px to +7px soft horizontal drift
        const yOffset = -12 - (seed % 10); // -12px to -22px upward float
        const particleDelay = (i % 8) * 0.03; // Smooth staggered particle dissipation
        return {
          char,
          xOffset,
          yOffset,
          particleDelay,
          index: i,
        };
      });
      return { wordStr, letters, wIdx };
    });
  }, [currentPhrase]);

  if (shouldReduceMotion) {
    return <span className="inline-block font-sans font-black">{currentPhrase}</span>;
  }

  return (
    <span className="relative inline-block w-full font-sans font-black">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`role-${index}-${currentPhrase}`}
          className="inline-flex flex-wrap items-center gap-x-[0.3em] tracking-tight font-sans font-black"
          style={{
            justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
            textAlign: align,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {parsedWords.map(({ wordStr, letters, wIdx }) => (
            <span key={`${wIdx}-${wordStr}`} className="inline-flex items-center whitespace-nowrap font-sans font-black">
              {letters.map((item) => (
                <motion.span
                  key={item.index}
                  className="inline-block font-sans font-black"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                    delay: item.index * 0.015,
                  }}
                >
                  {item.char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

export default function Hero({ onOpenResume }: HeroProps) {
  const { personalInfo } = usePortfolio();
  const { name, github, linkedin, email, roles } = personalInfo;

  // Background image state for deterministic preloading
  const [displayHeroLight, setDisplayHeroLight] = useState<string>(defaultHeroLight);
  const [displayHeroDark, setDisplayHeroDark] = useState<string>(defaultHeroDark);

  // Preload light hero background image
  useEffect(() => {
    let isMounted = true;
    const targetUrl = personalInfo.heroImageLight?.trim();

    if (!targetUrl) {
      setDisplayHeroLight(defaultHeroLight);
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (isMounted) {
        setDisplayHeroLight(targetUrl);
      }
    };
    img.onerror = () => {
      if (isMounted) {
        setDisplayHeroLight(defaultHeroLight);
      }
    };
    img.src = targetUrl;

    if (img.complete && img.naturalWidth > 0) {
      setDisplayHeroLight(targetUrl);
    }

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [personalInfo.heroImageLight]);

  // Preload dark hero background image
  useEffect(() => {
    let isMounted = true;
    const targetUrl = personalInfo.heroImageDark?.trim();

    if (!targetUrl) {
      setDisplayHeroDark(defaultHeroDark);
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (isMounted) {
        setDisplayHeroDark(targetUrl);
      }
    };
    img.onerror = () => {
      if (isMounted) {
        setDisplayHeroDark(defaultHeroDark);
      }
    };
    img.src = targetUrl;

    if (img.complete && img.naturalWidth > 0) {
      setDisplayHeroDark(targetUrl);
    }

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [personalInfo.heroImageDark]);

  // Typing Effect for specialties (memoized to keep stable array reference)
  const typingWords = useMemo(() => {
    return roles && roles.length > 0 
      ? roles.map(r => r.toUpperCase())
      : ["FULL STACK DEVELOPER", "MERN STACK DEVELOPER", "FRONTEND DEVELOPER"];
  }, [roles]);

  const handleScrollToProjects = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollToSection('#projects', 80);
  };

  const handleScrollToContact = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollToSection('#contact', 80);
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] lg:h-screen lg:max-h-screen w-full flex flex-col justify-start overflow-hidden transition-colors duration-300 gpu-layer"
    >
      {/* Light theme hero background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 gpu-layer opacity-100 dark:opacity-0"
        style={{ backgroundImage: `url('${displayHeroLight}')` }}
      />

      {/* Dark theme hero background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 gpu-layer opacity-0 dark:opacity-100"
        style={{ backgroundImage: `url('${displayHeroDark}')` }}
      />

      {/* Readability overlay */}
      <div className="absolute inset-0 bg-black/65 dark:bg-black/75 lg:bg-white/0 lg:dark:bg-black/30 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-6 w-full h-full min-h-[100dvh] lg:min-h-0 flex-1 flex flex-col justify-between pt-16 pb-6 sm:py-12 lg:pt-14 lg:pb-6 overflow-hidden">

        {/* DESKTOP VIEW: Left section = name, buttons & get in touch at bottom; Right section = title at top & About text */}
        <div className="hidden lg:grid grid-cols-12 gap-6 lg:gap-12 w-full flex-1 items-stretch">

          {/* LEFT SECTION: Hello, Name, Buttons, and Get in Touch aligned to bottom */}
          <div className="lg:col-span-6 flex flex-col justify-end text-left space-y-4 pt-10 pb-12 animate-fade-in">

            {/* "Hello," text */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block font-serif scale-y-[1.2] font-extrabold italic text-4xl lg:text-5xl xl:text-6xl tracking-[0.15em] text-neutral-800/80 dark:text-neutral-300/60 select-none">
                Hello,
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl lg:text-[2.6rem] xl:text-[3.2rem] font-sans font-black tracking-tight text-black dark:text-white leading-[1.05] uppercase"
            >
              I'M <br />
              <span className="text-black dark:text-white font-sans font-black">
                {name || 'DHANISH S.'}
              </span>
            </motion.h1>

            {/* Action Buttons - Clean styles with no glowing effects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:max-w-md pt-1"
            >
              <button
                onClick={handleScrollToProjects}
                className="group flex items-center justify-center space-x-2 px-5 py-3 bg-[#BDF869] text-black font-black border-2 border-[#7ecb15] dark:border-[#BDF869] rounded-xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer w-full sm:w-auto shadow-sm hover:bg-[#a6ea43] hover:border-black dark:hover:border-white hover:scale-105 active:scale-95"
              >
                <span>Explore Projects</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>

              <button
                onClick={onOpenResume}
                className="px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-black transition-all duration-300 cursor-pointer w-full sm:w-auto text-center border-2 border-[#BDF869] bg-[#121b0b]/80 backdrop-blur-sm text-[#BDF869] hover:bg-[#BDF869]/25 hover:text-[#BDF869] shadow-sm hover:scale-105 active:scale-95"
              >
                View Resume
              </button>
            </motion.div>

          </div>

          {/* RIGHT SECTION: Specialization titles at top, About text in Monte Carlo font (smaller, right-aligned), Get in touch links at bottom */}
          <div className="lg:col-span-6 flex flex-col justify-between text-right pt-12 lg:pt-16 xl:pt-20 pb-4">

            {/* Specialization Title Animation */}
            <div className="space-y-1 text-right pt-2 lg:pt-3">
              <div className="flex items-start justify-end pb-1">
                <h1 className="text-xl sm:text-2xl lg:text-[2.6rem] xl:text-[3.0rem] font-sans font-black text-black dark:text-white leading-[1.08] uppercase max-w-md w-full tracking-tight">
                  <CinematicRoles words={typingWords} align="right" />
                </h1>
              </div>
            </div>

            {/* Right Side 1-2 sentence About text in Monte Carlo Font - Right Aligned & Compact Spacing */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="my-auto py-0.5 text-right max-w-sm ml-auto space-y-0.5"
            >
              <p className="font-monte-carlo italic text-base lg:text-lg xl:text-xl leading-snug text-black/90 dark:text-neutral-200 drop-shadow-sm select-none">
                "{personalInfo.introduction || "Full Stack Developer specializing in React.js, Node.js, and modern databases — crafting clean user interfaces & scalable web solutions."}"
              </p>
            </motion.div>

            {/* Connect Details & Social icons on Right Side Bottom */}
            <div className="flex flex-col items-end gap-2.5 pt-1">
              <button
                onClick={handleScrollToContact}
                className="flex items-center space-x-2 text-xs lg:text-sm uppercase tracking-widest font-black text-black hover:text-lime-700 dark:text-[#BDF869] dark:hover:text-white transition-colors cursor-pointer group"
              >
                <span>Get in Touch</span>
                <ArrowUpRight className="w-4 h-4 lg:w-4.5 lg:h-4.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <div className="flex items-center space-x-3">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-black/20 bg-white/70 text-black hover:border-black hover:bg-[#BDF869] dark:border-white/20 dark:bg-black/40 dark:text-white dark:hover:border-[#BDF869] dark:hover:text-[#BDF869] dark:hover:bg-transparent transition-all duration-300 shadow-sm hover:scale-105"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4.5 h-4.5 lg:w-5 lg:h-5" />
                </a>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-black/20 bg-white/70 text-black hover:border-black hover:bg-[#BDF869] dark:border-white/20 dark:bg-black/40 dark:text-white dark:hover:border-[#BDF869] dark:hover:text-[#BDF869] dark:hover:bg-transparent transition-all duration-300 shadow-sm hover:scale-105"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4.5 h-4.5 lg:w-5 lg:h-5" />
                </a>
                <a
                  href={`mailto:${email}`}
                  className="p-2.5 rounded-xl border border-black/20 bg-white/70 text-black hover:border-black hover:bg-[#BDF869] dark:border-white/20 dark:bg-black/40 dark:text-white dark:hover:border-[#BDF869] dark:hover:text-[#BDF869] dark:hover:bg-transparent transition-all duration-300 shadow-sm hover:scale-105"
                  aria-label="Email Address"
                >
                  <Mail className="w-4.5 h-4.5 lg:w-5 lg:h-5" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* MOBILE / TABLET VIEW: Content-adaptive height with balanced, elegant spacing */}
        <div className="flex lg:hidden flex-col items-center justify-center text-center w-full h-full min-h-full my-auto py-6 sm:py-10 md:py-12 px-4 sm:px-8 max-w-md sm:max-w-lg md:max-w-xl mx-auto space-y-5 sm:space-y-6 md:space-y-7">

          {/* Text Content Group */}
          <div className="flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-3.5 w-full">
            {/* "Hello," text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block tracking-[0.25em] font-extrabold scale-y-[1.1] font-serif text-base sm:text-lg md:text-xl italic text-neutral-300/90 block select-none">
                Hello,
              </span>
            </motion.div>

            {/* 1. Name */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight text-white leading-tight uppercase px-2"
            >
              I'M <span className="text-white font-sans font-black">{name || 'DHANISH S.'}</span>
            </motion.h1>

            {/* 2. Title / Specialization */}
            <div className="flex items-center justify-center px-2 w-full py-0.5">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-sans font-black tracking-tight text-white leading-tight uppercase w-full">
                <CinematicRoles words={typingWords} align="center" />
              </h1>
            </div>

            {/* About text in Monte Carlo font */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="px-2 max-w-xs sm:max-w-md md:max-w-lg mx-auto text-center pt-0.5"
            >
              <p className="font-monte-carlo italic text-sm sm:text-base md:text-lg text-neutral-200 leading-relaxed drop-shadow-md select-none">
                "{personalInfo.introduction || "Full Stack Developer specializing in React.js, Node.js, and modern databases — crafting clean user interfaces & scalable web solutions."}"
              </p>
            </motion.div>
          </div>

          {/* Action Buttons & Contact links - Grouped with even, balanced spacing */}
          <div className="w-full space-y-4 sm:space-y-5">
            {/* 3. Action Buttons - Clean styling with no glowing effect */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-md mx-auto justify-center"
            >
              <button
                onClick={handleScrollToProjects}
                className="group flex items-center justify-center space-x-2 px-6 py-3 bg-[#BDF869] text-black font-black border-2 border-[#BDF869] rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer w-full sm:w-auto shadow-sm hover:bg-[#a6ea43] hover:scale-105 active:scale-95"
              >
                <span>Explore Projects</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>

              <button
                onClick={onOpenResume}
                className="px-6 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-black transition-all duration-300 cursor-pointer w-full sm:w-auto text-center border-2 border-[#BDF869] bg-[#121b0b]/80 backdrop-blur-sm text-[#BDF869] hover:bg-[#BDF869]/25 hover:text-[#BDF869] shadow-sm hover:scale-105 active:scale-95"
              >
                View Resume
              </button>
            </motion.div>

            {/* 4. Links & Contact */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-sm sm:max-w-md mx-auto pt-0.5">
              <button
                onClick={handleScrollToContact}
                className="flex items-center space-x-1.5 text-xs sm:text-sm uppercase tracking-widest font-black text-[#BDF869] hover:text-white transition-colors cursor-pointer group"
              >
                <span>Get in Touch</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <div className="flex items-center space-x-3">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-white/20 bg-black/40 text-white hover:border-[#BDF869] hover:text-[#BDF869] transition-all duration-300 shadow-sm"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-white/20 bg-black/40 text-white hover:border-[#BDF869] hover:text-[#BDF869] transition-all duration-300 shadow-sm"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${email}`}
                  className="p-2.5 rounded-xl border border-white/20 bg-black/40 text-white hover:border-[#BDF869] hover:text-[#BDF869] transition-all duration-300 shadow-sm"
                  aria-label="Email Address"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}