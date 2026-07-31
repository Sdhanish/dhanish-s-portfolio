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
      className="relative min-h-screen w-full flex flex-col justify-start overflow-hidden transition-colors duration-300 gpu-layer"
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
      <div className="absolute inset-0 bg-black/65 dark:bg-black/75 lg:bg-white/20 lg:dark:bg-black/30 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full flex-1 flex flex-col justify-center lg:justify-between pt-24 pb-16 lg:pt-20 lg:pb-6">

        {/* DESKTOP VIEW: Left section = name, buttons & get in touch at bottom; Right section = title at top & About Me */}
        <div className="hidden lg:grid grid-cols-12 gap-8 lg:gap-16 w-full flex-1 items-stretch">

          {/* LEFT SECTION: Hello, Name, Buttons, and Get in Touch aligned to bottom */}
          <div className="lg:col-span-6 flex flex-col justify-end text-left space-y-6 pb-0 animate-fade-in">

            {/* "Hello," text */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block font-serif scale-y-[1.3] font-extrabold italic text-5xl lg:text-6xl xl:text-7xl tracking-[0.15em] text-neutral-800/80 dark:text-neutral-300/60 select-none">
                Hello,
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-4xl lg:text-[3.1rem] xl:text-[4.0rem] font-sans font-black tracking-tight text-black dark:text-white leading-[1.05] uppercase"
            >
              I'M <br />
              <span className="text-black dark:text-white font-sans font-black">
                {name || 'DHANISH S.'}
              </span>
            </motion.h1>

            {/* Action Buttons - Darker & Highlighted */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3.5 w-full sm:max-w-md pt-2"
            >
              <button
                onClick={handleScrollToProjects}
                className="group flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#BDF869] hover:bg-[#9ee232] text-black font-black border border-[#a2f238] rounded-xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer w-full sm:w-auto shadow-[0_4px_22px_rgba(189,248,105,0.45)] hover:shadow-[0_6px_30px_rgba(189,248,105,0.65)] hover:scale-105 active:scale-95"
              >
                <span>Explore Projects</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>

              <button
                onClick={onOpenResume}
                className="px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider font-black transition-all duration-300 cursor-pointer w-full sm:w-auto text-center border-2 border-black bg-black text-white hover:bg-[#BDF869] hover:text-black hover:border-[#BDF869] dark:border-2 dark:border-[#BDF869] dark:bg-[#BDF869]/25 dark:text-[#BDF869] dark:hover:bg-[#BDF869] dark:hover:text-black shadow-[0_4px_16px_rgba(0,0,0,0.2)] dark:shadow-[0_0_22px_rgba(189,248,105,0.35)] hover:scale-105 active:scale-95"
              >
                View Resume
              </button>
            </motion.div>

          </div>

          {/* RIGHT SECTION: Specialization titles at top, About Me in Monte Carlo font, Get in touch links at bottom */}
          <div className="lg:col-span-6 flex flex-col justify-between text-right pt-10 lg:pt-14 xl:pt-16 pb-0">

            {/* Specialization Title Animation */}
            <div className="space-y-2 text-right">
              <div className="flex items-start justify-end pt-1 pb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-[3.6rem] font-sans font-black text-black dark:text-white leading-[1.08] uppercase max-w-md w-full tracking-tight">
                  <CinematicRoles words={typingWords} align="right" />
                </h1>
              </div>
            </div>

            {/* Right Side 1-2 sentence About Me in Monte Carlo Font */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="my-auto py-4 text-right max-w-lg ml-auto space-y-1"
            >
              <span className="text-[11px] uppercase tracking-[0.25em] font-extrabold text-lime-900 dark:text-[#BDF869] block">
                About Me
              </span>
              <p className="font-monte-carlo italic text-2xl lg:text-3xl xl:text-4xl leading-relaxed text-black/90 dark:text-neutral-100 drop-shadow-sm select-none">
                "{personalInfo.introduction || "Full Stack Developer specializing in React.js, Node.js, and modern databases — crafting clean user interfaces & scalable web solutions."}"
              </p>
            </motion.div>

            {/* Connect Details & Social icons on Right Side Bottom */}
            <div className="flex flex-col items-end gap-3 pt-2">
              <button
                onClick={handleScrollToContact}
                className="flex items-center space-x-1.5 text-xs uppercase tracking-widest font-black text-black hover:text-lime-700 dark:text-[#BDF869] dark:hover:text-white transition-colors cursor-pointer group"
              >
                <span>Get in Touch</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <div className="flex items-center space-x-2.5">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-black/20 bg-white/70 text-black hover:border-black hover:bg-[#BDF869] dark:border-white/20 dark:bg-black/40 dark:text-white dark:hover:border-[#BDF869] dark:hover:text-[#BDF869] dark:hover:bg-transparent transition-all duration-300 shadow-sm hover:scale-105"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-black/20 bg-white/70 text-black hover:border-black hover:bg-[#BDF869] dark:border-white/20 dark:bg-black/40 dark:text-white dark:hover:border-[#BDF869] dark:hover:text-[#BDF869] dark:hover:bg-transparent transition-all duration-300 shadow-sm hover:scale-105"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${email}`}
                  className="p-2.5 rounded-xl border border-black/20 bg-white/70 text-black hover:border-black hover:bg-[#BDF869] dark:border-white/20 dark:bg-black/40 dark:text-white dark:hover:border-[#BDF869] dark:hover:text-[#BDF869] dark:hover:bg-transparent transition-all duration-300 shadow-sm hover:scale-105"
                  aria-label="Email Address"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* MOBILE / TABLET VIEW: Dark background overlay & white text styling */}
        <div className="flex lg:hidden flex-col items-center justify-start text-center space-y-6 w-full pt-16 sm:pt-24 pb-12">

          {/* "Hello," text - white/silver for mobile dark overlay */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block tracking-[0.3em] font-extrabold scale-y-[1.2] font-serif text-xl italic text-neutral-300/90 block select-none">
              Hello,
            </span>
          </motion.div>

          {/* 1. Name - White text for mobile dark overlay */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-sans font-black tracking-tight text-white leading-none uppercase px-4"
          >
            I'M <span className="text-white font-sans font-black">{name || 'DHANISH S.'}</span>
          </motion.h1>

          {/* 2. Title / Specialization - White text */}
          <div className="min-h-[64px] flex items-center justify-center px-4 w-full">
            <h1 className="text-2xl sm:text-3xl font-sans font-black tracking-tight text-white leading-none uppercase w-full">
              <CinematicRoles words={typingWords} align="center" />
            </h1>
          </div>

          {/* About Me short text in Monte Carlo font for mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="px-4 max-w-md mx-auto text-center"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#BDF869] block mb-1">
              About Me
            </span>
            <p className="font-monte-carlo italic text-2xl sm:text-3xl text-neutral-100 leading-snug drop-shadow-md select-none">
              "{personalInfo.introduction || "Full Stack Developer specializing in React.js, Node.js, and modern databases — crafting clean user interfaces & scalable web solutions."}"
            </p>
          </motion.div>

          {/* 3. Action Buttons - High contrast */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3.5 w-full max-w-xs sm:max-w-md mx-auto justify-center px-4"
          >
            <button
              onClick={handleScrollToProjects}
              className="group flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#BDF869] hover:bg-[#9ee232] text-black font-black border border-[#a2f238] rounded-xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer w-full sm:w-auto shadow-[0_4px_22px_rgba(189,248,105,0.45)] hover:shadow-[0_6px_30px_rgba(189,248,105,0.65)] hover:scale-105 active:scale-95"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>

            <button
              onClick={onOpenResume}
              className="px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider font-black transition-all duration-300 cursor-pointer w-full sm:w-auto text-center border-2 border-[#BDF869] bg-[#BDF869]/20 text-[#BDF869] hover:bg-[#BDF869] hover:text-black shadow-[0_0_20px_rgba(189,248,105,0.3)] hover:scale-105 active:scale-95"
            >
              View Resume
            </button>
          </motion.div>

          {/* 4. Links & Contact */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-sm mx-auto px-4 pt-2">
            <button
              onClick={handleScrollToContact}
              className="flex items-center space-x-1.5 text-xs uppercase tracking-widest font-black text-[#BDF869] hover:text-white transition-colors cursor-pointer group"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <div className="flex items-center space-x-3">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-white/20 bg-black/40 text-white hover:border-[#BDF869] hover:text-[#BDF869] transition-all duration-300"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-white/20 bg-black/40 text-white hover:border-[#BDF869] hover:text-[#BDF869] transition-all duration-300"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${email}`}
                className="p-2.5 rounded-xl border border-white/20 bg-black/40 text-white hover:border-[#BDF869] hover:text-[#BDF869] transition-all duration-300"
                aria-label="Email Address"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}