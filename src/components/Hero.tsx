import { useState, useEffect, useMemo, MouseEvent } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { usePortfolio } from '../contexts/PortfolioContext';

import defaultHeroLight from '../assets/images/dhanish-light-theme.png';
import defaultHeroDark from '../assets/images/dhanish-light-theme.png';

interface HeroProps {
  onOpenResume: () => void;
}

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
      : ["FULL STACK DEVELOPER", "MERN STACK EXPERT", "SOFTWARE ENGINEER", "NEXT.JS ARCHITECT"];
  }, [roles]);

  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!typingWords || typingWords.length === 0) return;

    const safeIndex = wordIndex % typingWords.length;
    const currentWord = typingWords[safeIndex] || "";

    let timer: NodeJS.Timeout;

    if (isDeleting) {
      if (displayedText === "") {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % typingWords.length);
        }, 300);
      } else {
        timer = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, 40);
      }
    } else {
      if (displayedText === currentWord) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      } else {
        timer = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        }, 75);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, wordIndex, typingWords]);

  const handleScrollToProjects = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const projectsSection = document.querySelector('#projects');
    if (projectsSection) {
      const offset = 80;
      const position = projectsSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
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

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-start overflow-hidden transition-colors duration-300"
    >
      {/* Background image (slightly blurred, scaled up to hide blur edges) */}
      {/* Background image for light mode */}
      <div
        className="absolute inset-0 scale-[1.08] lg:scale-100 bg-cover bg-center bg-no-repeat blur-[2px] lg:blur-none block dark:hidden transition-all duration-300"
        style={{ backgroundImage: `url('${displayHeroLight}')` }}
      />

      {/* Background image for dark mode */}
      <div
        className="absolute inset-0 scale-[1.08] lg:scale-100 bg-cover bg-center bg-no-repeat blur-[2px] lg:blur-none hidden dark:block transition-all duration-300"
        style={{ backgroundImage: `url('${displayHeroDark}')` }}
      />

      {/* Readability overlay - centered radial black gradient on desktop with identical opacity for light & dark themes */}
      <div className="absolute inset-0 bg-black/60 dark:bg-black/75 lg:bg-white/0  lg:dark:bg-black/30 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full flex-1 flex flex-col justify-center pt-24 pb-16">

        {/* DESKTOP VIEW: Left section = name & buttons; Right section = title, description, links */}
        <div className="hidden lg:grid grid-cols-12 gap-8 lg:gap-16 w-full items-stretch">

          {/* LEFT SECTION: Name and Buttons */}
          <div className="lg:col-span-6 flex flex-col justify-between text-left mt-8 lg:mt-16 animate-fade-in">

            {/* "Hey there" text in dark olive in light theme / light gray in dark theme */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block font-cormorant scale-y-[1.3] font-extrabold italic text-5xl lg:text-6xl xl:text-7xl tracking-[0.15em] text-[#1B2410]/30 dark:text-neutral-300/10 select-none">
                Hey,
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-4xl lg:text-[3.1rem] xl:text-[4.0rem] font-sans font-black tracking-tighter text-[#1B2410] dark:text-white leading-[1.05] uppercase"
            >
              I'M <br />
              <span className="text-[#1B2410] dark:text-white font-black">
                {name || 'DHANISH S.'}
              </span>
            </motion.h2>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3.5 w-full sm:max-w-md pt-2"
            >
              <button
                onClick={handleScrollToProjects}
                className="group flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#6C8E12] hover:bg-[#58740E] text-white dark:bg-[#BDF869] dark:hover:bg-[#a6e054] dark:text-black border border-transparent rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all duration-300 cursor-pointer w-full sm:w-auto shadow-md hover:shadow-[0_0_20px_rgba(108,142,18,0.4)] dark:hover:shadow-[0_0_20px_rgba(189,248,105,0.4)]"
              >
                <span>Explore Projects</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>

              <button
                onClick={onOpenResume}
                className="px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all duration-300 cursor-pointer w-full sm:w-auto text-center border border-[#6C8E12]/60 bg-[#6C8E12]/25 backdrop-blur-md text-white hover:bg-[#6C8E12] hover:text-white dark:border-[#BDF869]/70 dark:bg-[#BDF869]/20 dark:text-[#BDF869] dark:hover:bg-[#BDF869] dark:hover:text-black dark:hover:border-[#BDF869] shadow-[0_0_15px_rgba(108,142,18,0.2)] dark:shadow-[0_0_18px_rgba(189,248,105,0.25)] hover:scale-105 active:scale-95 font-black"
              >
                View Resume
              </button>
            </motion.div>

          </div>

          {/* RIGHT SECTION: Specialization titles & Links */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8 text-right mt-8 lg:mt-16">

            {/* Specialization Typing Animation */}
            <div className="space-y-2 text-right">
              <div className="min-h-[120px] lg:min-h-[220px] flex items-center justify-end py-4">
                <h3 className="text-2xl sm:text-3xl lg:text-[3.5rem] xl:text-[4rem] font-sans font-extrabold tracking-tighter text-[#1B2410] dark:text-white leading-[1.1] uppercase max-w-md">
                  {displayedText}
                  <span className="animate-[pulse_1s_infinite] ml-1 text-[#6C8E12] dark:text-[#BDF869]">|</span>
                </h3>
              </div>
            </div>

            {/* Connect Details & Social icons */}
            <div className="flex flex-col items-end justify-start gap-4 pt-2">
              <button
                onClick={handleScrollToContact}
                className="flex items-center space-x-1.5 text-xs uppercase tracking-widest font-black text-[#6C8E12] hover:text-[#1B2410] dark:text-[#BDF869] dark:hover:text-white transition-colors cursor-pointer group"
              >
                <span>Get in Touch</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <div className="flex items-center space-x-3">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-[#1B2410]/20 bg-white/70 text-[#1B2410] hover:border-[#6C8E12] hover:text-[#6C8E12] dark:border-white/20 dark:bg-black/40 dark:text-white dark:hover:border-[#BDF869] dark:hover:text-[#BDF869] transition-all duration-300 shadow-sm hover:scale-105"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-[#1B2410]/20 bg-white/70 text-[#1B2410] hover:border-[#6C8E12] hover:text-[#6C8E12] dark:border-white/20 dark:bg-black/40 dark:text-white dark:hover:border-[#BDF869] dark:hover:text-[#BDF869] transition-all duration-300 shadow-sm hover:scale-105"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${email}`}
                  className="p-2.5 rounded-xl border border-[#1B2410]/20 bg-white/70 text-[#1B2410] hover:border-[#6C8E12] hover:text-[#6C8E12] dark:border-white/20 dark:bg-black/40 dark:text-white dark:hover:border-[#BDF869] dark:hover:text-[#BDF869] transition-all duration-300 shadow-sm hover:scale-105"
                  aria-label="Email Address"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* MOBILE / TABLET VIEW: Name -> Title -> Buttons -> Links (white text for readability) */}
        <div className="flex lg:hidden flex-col items-center justify-start text-center space-y-6 w-full pt-16 sm:pt-24 pb-12">

          {/* "Hey there" text in silver / light gray */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block scale-y-[1.2] font-extrabold font-cormorant text-xl italic tracking-[0.3em] text-neutral-300/80 font-bold block select-none">
              Hey,
            </span>
          </motion.div>

          {/* 1. Name - WHITE TEXT IN MOBILE / TABLET */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-sans font-black tracking-tighter text-white leading-none uppercase px-4"
          >
            I'M <span className="text-white font-black">{name || 'DHANISH S.'}</span>
          </motion.h2>

          {/* 2. Title / Specialization - WHITE TEXT IN MOBILE / TABLET */}
          <div className="h-16 flex items-center justify-center px-4">
            <h3 className="text-2xl sm:text-3xl font-sans font-black tracking-tighter text-white leading-none uppercase">
              {displayedText}
              <span className="animate-[pulse_1s_infinite] ml-1 text-[#BDF869]">|</span>
            </h3>
          </div>

          {/* 3. Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3.5 w-full max-w-xs sm:max-w-md mx-auto justify-center px-4"
          >
            <button
              onClick={handleScrollToProjects}
              className="group flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#6C8E12] hover:bg-[#58740E] text-white dark:bg-[#BDF869] dark:hover:bg-[#a6e054] dark:text-black border border-transparent rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all duration-300 cursor-pointer w-full sm:w-auto shadow-md"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>

            <button
              onClick={onOpenResume}
              className="px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all duration-300 cursor-pointer w-full sm:w-auto text-center border border-[#6C8E12]/60 bg-[#6C8E12]/25 backdrop-blur-md text-white hover:bg-[#6C8E12] hover:text-white dark:border-[#BDF869]/70 dark:bg-[#BDF869]/20 dark:text-[#BDF869] dark:hover:bg-[#BDF869] dark:hover:text-black dark:hover:border-[#BDF869]"
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