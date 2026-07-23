import { MouseEvent } from 'react';
import { Github, Linkedin, Instagram, Mail, ArrowUp, Heart, Code2 } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';

export default function Footer() {
  const { personalInfo, logoUrl } = usePortfolio();
  const { name, email, github, linkedin, instagram, roles } = personalInfo;


  const links = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-white dark:bg-neutral-950 text-[#1B2410] dark:text-neutral-100 border-t border-neutral-200/80 dark:border-neutral-800/80 transition-colors duration-300 relative">
      
      {/* Top Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#6C8E12] dark:via-[#BDF869] to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between pb-10 border-b border-neutral-200/80 dark:border-neutral-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-3">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#6C8E12]/30 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center p-0.5 shrink-0">
                <img
                  src={logoUrl}
                  alt={`${name || 'Dhanish S.'} Logo`}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
              <span className="font-sans font-black text-lg uppercase tracking-tight text-[#1B2410] dark:text-white">
                {name}
              </span>
            </div>
            <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
              {roles?.[0] || 'Frontend & MERN Stack Developer'}
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="font-mono text-xs font-extrabold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 hover:text-[#6C8E12] dark:hover:text-[#BDF869] transition-colors duration-200 py-1"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Social Icons & Back to Top */}
          <div className="md:col-span-3 flex items-center justify-center md:justify-end space-x-3">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-[#6C8E12] hover:text-white dark:hover:bg-[#BDF869] dark:hover:text-black hover:border-[#6C8E12] dark:hover:border-[#BDF869] transition-all duration-300 shadow-sm cursor-pointer"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-[#6C8E12] hover:text-white dark:hover:bg-[#BDF869] dark:hover:text-black hover:border-[#6C8E12] dark:hover:border-[#BDF869] transition-all duration-300 shadow-sm cursor-pointer"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-[#6C8E12] hover:text-white dark:hover:bg-[#BDF869] dark:hover:text-black hover:border-[#6C8E12] dark:hover:border-[#BDF869] transition-all duration-300 shadow-sm cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <a
              href={`mailto:${email}`}
              aria-label="Email Address"
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-[#6C8E12] hover:text-white dark:hover:bg-[#BDF869] dark:hover:text-black hover:border-[#6C8E12] dark:hover:border-[#BDF869] transition-all duration-300 shadow-sm cursor-pointer"
            >
              <Mail className="w-4 h-4" />
            </a>

            <button
              onClick={handleScrollToTop}
              aria-label="Scroll to top"
              className="p-2.5 rounded-xl bg-[#6C8E12]/10 dark:bg-[#BDF869]/10 border border-[#6C8E12]/30 dark:border-[#BDF869]/30 text-[#6C8E12] dark:text-[#BDF869] hover:bg-[#6C8E12] hover:text-white dark:hover:bg-[#BDF869] dark:hover:text-black transition-all duration-300 shadow-sm cursor-pointer ml-2 group"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>

        {/* Bottom Copyright & Tech Note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-400 gap-4">
          <p>
            &copy; {new Date().getFullYear()} <span className="font-bold text-[#1B2410] dark:text-white">{name}</span>. All rights reserved.
          </p>

          <div className="flex items-center space-x-1.5 text-[11px]">
          
  <span>Designed, developed and continuously improving.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
