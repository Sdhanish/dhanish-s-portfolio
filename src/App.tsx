import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Education from './components/Education';
import Services from './components/Services';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import InitialLoader from './components/InitialLoader';
import WhatsAppButton from './components/WhatsAppButton';
import ResumeModal from './components/ResumeModal';
import { portfolioData } from './data';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved === 'light' || saved === 'dark') return saved;
      // If html element already has dark class from head script, keep dark
      if (document.documentElement.classList.contains('dark')) return 'dark';
    }
    return 'dark';
  });

  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Synchronize HTML element class when theme updates
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  // Dynamic document title setup
  useEffect(() => {
    document.title = `${portfolioData.personalInfo.name} | Professional Frontend & MERN Developer Portfolio`;
    
    // Set meta description dynamically
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', portfolioData.personalInfo.aboutText);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const handleOpenResume = useCallback(() => {
    setIsResumeOpen(true);
  }, []);

  const handleCloseResume = useCallback(() => {
    setIsResumeOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-portfolio-bg text-portfolio-text-primary selection:bg-neutral-900 selection:text-white dark:selection:bg-brand-accent dark:selection:text-neutral-950 transition-colors duration-300">
      {/* Initial session branding loader */}
      <InitialLoader />

      {/* Background print rules to make the PDF look amazing and hide digital-only layouts */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          /* Hide standard digital components when printing */
          #navbar, #hero, #about, #skills, #education, #services, #projects, #contact, footer, #theme-toggle, .print\\:hidden {
            display: none !important;
          }
          /* Make printable resume area full-width */
          .resume-print-root {
            display: block !important;
            width: 100% !important;
            color: black !important;
          }
        }
      `}</style>

      {/* Main Navigation */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenResume={handleOpenResume}
      />

      {/* Main Structural Layout Sections */}
      <main id="main-content" tabIndex={-1} className="relative outline-none">
        <Hero onOpenResume={handleOpenResume} />
        <About />
        <Skills />
        <Education />
        <Services />
        <Projects />
        <Contact />
      </main>

      {/* Standard Footer */}
      <Footer />

      {/* Floating WhatsApp Quick Contact Button */}
      <WhatsAppButton />

      {/* Animated Printable Resume Modal */}
      <AnimatePresence>
        {isResumeOpen && (
          <ResumeModal
            isOpen={isResumeOpen}
            onClose={handleCloseResume}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
