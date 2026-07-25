import { useState, useEffect, MouseEvent } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ThemeToggle from './ThemeToggle';
import { usePortfolio } from '../contexts/PortfolioContext';
import { scrollToSection } from '../utils/scroll';


interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onOpenResume: () => void;
}

export default function Navbar({ theme, toggleTheme, onOpenResume }: NavbarProps) {
  const { personalInfo, logoUrl } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const [activeSection, setActiveSection] = useState('about');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const isDarkLook = isOverHero || theme === 'dark';

  const nameParts = (personalInfo.name || 'DHANISH S.').trim().split(' ');
  const firstName = nameParts[0] || 'DHANISH';
  const lastName = nameParts.slice(1).join(' ') || 'S.';

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));

          const heroEl = document.getElementById('hero');
          const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
          const overHero = window.scrollY < (heroHeight - 80);
          setIsOverHero(overHero);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver for asynchronous, zero-reflow active section detection
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const sectionElements: Element[] = [];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) {
        observer.observe(el);
        sectionElements.push(el);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    scrollToSection(href, 100);
  };

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl rounded-full transition-all duration-300 border gpu-layer ${
          isDarkLook
            ? isScrolled
              ? 'bg-neutral-950/85 backdrop-blur-md border-white/15 py-2.5 shadow-lg shadow-black/20'
              : 'bg-neutral-950/50 backdrop-blur-md border-white/10 py-3.5'
            : isScrolled
              ? 'bg-white/70 backdrop-blur-md border-[#6C8E12]/25 py-2.5 shadow-lg shadow-black/5'
              : 'bg-white/40 backdrop-blur-sm border-[#6C8E12]/20 py-3.5'
        }`}
      >
        <div className="px-6 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(document.body, 0);
              setActiveSection('about');
            }}
            className="flex items-center space-x-3 text-neutral-900 dark:text-neutral-50 group"
          >
            <div className={`w-8 h-8 rounded-full overflow-hidden border flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
              isDarkLook ? 'border-white/20 bg-black/40' : 'border-[#6C8E12]/30 bg-white'
            }`}>
              <img 
                src={logoUrl} 
                alt={`${personalInfo.name || 'Dhanish S.'} Logo`} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-display text-xs sm:text-sm tracking-widest font-black uppercase drop-shadow-sm flex items-center">
              <span className={isDarkLook ? "text-[#BDF869]" : "text-[#6C8E12]"}>{firstName}</span>
              <span className={`ml-1 ${isDarkLook ? "text-white" : "text-[#1B2410]"}`}>{lastName}</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className={`hidden lg:flex items-center px-1.5 py-1.5 rounded-full border relative transition-colors duration-300 ${
            isDarkLook ? 'bg-black/40 border-white/15' : 'bg-neutral-200/30 border-neutral-300/30'
          }`}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`text-[11px] font-extrabold uppercase tracking-wider px-4 py-2 rounded-full relative transition-colors duration-300 cursor-pointer ${
                    isActive 
                      ? isDarkLook ? 'text-[#BDF869]' : 'text-[#6C8E12]'
                      : isDarkLook ? 'text-white/80 hover:text-[#BDF869]' : 'text-neutral-700 hover:text-[#6C8E12]'
                  }`}
                >
                  {/* Hover background indicator */}
                  {hoveredLink === link.name && (
                    <motion.div
                      layoutId="navHover"
                      className={`absolute inset-0 rounded-full -z-10 ${
                        isDarkLook ? 'bg-white/10' : 'bg-neutral-200/70'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {/* Active background indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="navActive"
                      className={`absolute inset-0 shadow-sm rounded-full -z-10 border ${
                        isDarkLook
                          ? 'bg-neutral-900 border-[#BDF869]/40'
                          : 'bg-white border-[#6C8E12]/30'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} isOverHero={isOverHero} />
            <button
              id="resume-btn"
              onClick={onOpenResume}
              className={`group flex items-center space-x-1.5 px-4 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-wider cursor-pointer border transition-all duration-300 ${
                isDarkLook
                  ? 'border-[#BDF869] text-[#BDF869] bg-transparent hover:bg-[#BDF869] hover:text-black hover:border-[#BDF869] hover:shadow-[0_0_18px_rgba(189,248,105,0.4)]'
                  : 'border-[#6C8E12] text-[#1B2410] bg-transparent hover:bg-[#6C8E12] hover:text-white hover:shadow-[0_0_15px_rgba(108,142,18,0.3)]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
              <span>Resume</span>
            </button>
          </div>

          {/* Mobile/Tablet Actions and Hamburger */}
          <div className="flex lg:hidden items-center space-x-3">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} isOverHero={isOverHero} />
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full border focus:outline-none cursor-pointer transition-colors ${
                isDarkLook
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-[#6C8E12]/30 text-[#1B2410] hover:bg-[#6C8E12]/10'
              }`}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Floating Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: -10, x: '-50%' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-20 left-1/2 z-40 w-[92%] max-w-lg backdrop-blur-md rounded-3xl border p-6 shadow-2xl flex flex-col justify-between lg:hidden ${
              isDarkLook
                ? 'bg-neutral-950/95 border-white/15'
                : 'bg-white/95 border-[#6C8E12]/30'
            }`}
          >
            <div className="flex flex-col space-y-4 my-2">
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <motion.a
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`text-lg font-black tracking-wide py-1 transition-colors ${
                      isActive 
                        ? isDarkLook
                          ? 'text-[#BDF869] pl-2 border-l-2 border-[#BDF869]'
                          : 'text-[#6C8E12] pl-2 border-l-2 border-[#6C8E12]'
                        : isDarkLook
                          ? 'text-white hover:text-[#BDF869]'
                          : 'text-neutral-700 hover:text-[#6C8E12]'
                    }`}
                  >
                    {link.name}
                  </motion.a>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col space-y-4">
              <button
                id="mobile-resume-btn"
                onClick={() => {
                  setIsOpen(false);
                  onOpenResume();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider cursor-pointer border transition-all duration-300 border-[#6C8E12] bg-[#6C8E12] hover:bg-[#5D7B0F] text-white shadow-md dark:border-[#BDF869] dark:bg-[#BDF869] dark:hover:bg-[#a6e054] dark:text-neutral-950"
              >
                <FileText className="w-4 h-4" />
                <span>View & Print Resume</span>
              </button>

              <div className="text-center font-mono text-[10px] text-neutral-500 dark:text-neutral-500">
                {personalInfo.email}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
