import { MouseEvent } from 'react';
import { MapPin, GraduationCap, Calendar, Mail, Linkedin, Github, Instagram, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { usePortfolio } from '../contexts/PortfolioContext';

import lightImg from '../assets/images/dhanish-side.jpeg';
import darkImg from '../assets/images/dhanish-side.jpeg';

export default function About() {
  const { personalInfo } = usePortfolio();
  const { aboutText, location, email, linkedin, github, instagram, avatar } = personalInfo;


  const quickFacts = [
    {
      icon: <MapPin className="w-4 h-4 text-[#6C8E12] dark:text-[#BDF869]" />,
      label: 'Location',
      value: location,
    },
    {
      icon: <GraduationCap className="w-4 h-4 text-[#6C8E12] dark:text-[#BDF869]" />,
      label: 'Education',
      value: 'Master of Computer Applications (MCA)',
    },
    {
      icon: <Calendar className="w-4 h-4 text-[#6C8E12] dark:text-[#BDF869]" />,
      label: 'Availability',
      value: 'Open to Full-Time & High-Impact Roles',
    },
    {
      icon: <Mail className="w-4 h-4 text-[#6C8E12] dark:text-[#BDF869]" />,
      label: 'Email',
      value: email,
    },
  ];

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
    <section id="about" className="py-24 bg-white dark:bg-neutral-950 text-[#1B2410] dark:text-neutral-100 transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient subtle glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#6C8E12]/5 dark:bg-[#BDF869]/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#6C8E12] dark:text-[#BDF869]">
              01 / Professional Journey
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight text-[#1B2410] dark:text-white uppercase">
            About Me
          </h2>
          {/* Accent bar */}
          <div className="w-16 h-1 bg-[#6C8E12] dark:bg-[#BDF869] rounded-full mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT SIDE: Image Frame with Premium Half Border Effect & Social Icons */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-8">
            
            {/* Image Frame Container */}
            <div className="relative w-full max-w-md mx-auto lg:mx-0 group">
              
              {/* Premium Half Border Accent Effect (Top-Left) */}
              <div className="absolute -top-3.5 -left-3.5 w-28 h-28 border-t-2 border-l-2 border-[#6C8E12] dark:border-[#BDF869] rounded-tl-2xl z-20 pointer-events-none transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />

              {/* Premium Half Border Accent Effect (Bottom-Right) */}
              <div className="absolute -bottom-3.5 -right-3.5 w-28 h-28 border-b-2 border-r-2 border-[#6C8E12] dark:border-[#BDF869] rounded-br-2xl z-20 pointer-events-none transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1" />

              {/* Backing offset shadow card */}
              <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 bg-[#6C8E12]/10 dark:bg-[#BDF869]/10 rounded-2xl border border-[#6C8E12]/20 dark:border-[#BDF869]/20 -z-10 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />

              {/* Main Image Frame */}
              <div
                className="relative z-10 aspect-[4/5] rounded-2xl overflow-hidden border border-neutral-300/80 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 bg-cover bg-center shadow-xl transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(108,142,18,0.2)] dark:group-hover:shadow-[0_0_30px_rgba(189,248,105,0.2)]"
                style={{ backgroundImage: `url('${lightImg}')` }}
              >
                
                {/* Light Theme Image */}
                <img
                  src={(avatar && avatar.trim()) || lightImg}
                  alt="Dhanish S. Portfolio"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="500"
                  onError={(e) => {
                    e.currentTarget.src = lightImg;
                  }}
                  className="w-full h-full object-cover object-center dark:hidden transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Theme Image */}
                <img
                  src={(avatar && avatar.trim()) || darkImg}
                  alt="Dhanish S. Portfolio Dark"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="500"
                  onError={(e) => {
                    e.currentTarget.src = darkImg;
                  }}
                  className="w-full h-full object-cover object-center hidden dark:block transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* Floating status pill on frame */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between px-3.5 py-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C8E12] dark:bg-[#BDF869] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6C8E12] dark:bg-[#BDF869]"></span>
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1B2410] dark:text-neutral-100">
                      Dhanish S.
                    </span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-[#6C8E12] dark:text-[#BDF869]" />
                </div>
              </div>
            </div>

            {/* Social Icons & Quick Connect on Left Side */}
            <div className="w-full max-w-md space-y-3 pt-2">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#6C8E12] dark:text-[#BDF869] flex items-center space-x-2">
                <span>Connect with me</span>
                <div className="h-[1px] flex-1 bg-neutral-200 dark:bg-neutral-800" />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl border border-[#6C8E12]/30 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-[#1B2410] dark:text-neutral-200 font-extrabold text-xs uppercase tracking-wider hover:border-[#6C8E12] hover:bg-[#6C8E12] hover:text-white dark:hover:border-[#BDF869] dark:hover:bg-[#BDF869] dark:hover:text-black transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(108,142,18,0.3)] dark:hover:shadow-[0_0_18px_rgba(189,248,105,0.4)]"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>

                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl border border-[#6C8E12]/30 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-[#1B2410] dark:text-neutral-200 font-extrabold text-xs uppercase tracking-wider hover:border-[#6C8E12] hover:bg-[#6C8E12] hover:text-white dark:hover:border-[#BDF869] dark:hover:bg-[#BDF869] dark:hover:text-black transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(108,142,18,0.3)] dark:hover:shadow-[0_0_18px_rgba(189,248,105,0.4)]"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-[#6C8E12]/30 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-[#1B2410] dark:text-neutral-200 hover:border-[#6C8E12] hover:bg-[#6C8E12] hover:text-white dark:hover:border-[#BDF869] dark:hover:bg-[#BDF869] dark:hover:text-black transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(108,142,18,0.3)] dark:hover:shadow-[0_0_18px_rgba(189,248,105,0.4)]"
                  aria-label="Instagram Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href={`mailto:${email}`}
                  className="p-3 rounded-xl border border-[#6C8E12]/30 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-[#1B2410] dark:text-neutral-200 hover:border-[#6C8E12] hover:bg-[#6C8E12] hover:text-white dark:hover:border-[#BDF869] dark:hover:bg-[#BDF869] dark:hover:text-black transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(108,142,18,0.3)] dark:hover:shadow-[0_0_18px_rgba(189,248,105,0.4)]"
                  aria-label="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Description & Quick Facts */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-sans font-black text-[#1B2410] dark:text-white tracking-tight leading-snug uppercase">
                Specialized MERN Stack & Frontend Developer based in India.
              </h3>
              
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-base sm:text-lg font-normal">
                {aboutText}
              </p>
            
            </div>

            {/* Quick Facts Card Grid */}
            <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/50 backdrop-blur-sm space-y-6 shadow-sm hover:border-[#6C8E12]/40 dark:hover:border-[#BDF869]/40 transition-colors">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <h4 className="font-mono text-xs uppercase tracking-widest text-[#6C8E12] dark:text-[#BDF869] font-extrabold">
                  Quick Specifications
                </h4>
                <span className="text-[10px] font-mono text-neutral-400 uppercase">
                  Verified Profile
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {quickFacts.map((fact, index) => (
                  <div key={index} className="flex items-start space-x-3.5 group">
                    <div className="mt-0.5 p-2 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 text-[#6C8E12] dark:text-[#BDF869] shadow-sm group-hover:border-[#6C8E12] dark:group-hover:border-[#BDF869] transition-colors">
                      {fact.icon}
                    </div>
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        {fact.label}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-[#1B2410] dark:text-neutral-100 mt-0.5">
                        {fact.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center">
              <button
                onClick={handleScrollToContact}
                className="group w-full sm:w-auto flex items-center justify-center space-x-2.5 px-7 py-3.5 bg-[#6C8E12] hover:bg-[#58740E] text-white dark:bg-[#BDF869] dark:hover:bg-[#a6e054] dark:text-black border border-transparent rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(108,142,18,0.4)] dark:hover:shadow-[0_0_20px_rgba(189,248,105,0.4)]"
              >
                <span>Work With Me</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 border rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all duration-300 cursor-pointer border-[#6C8E12] text-[#1B2410] bg-transparent hover:bg-[#6C8E12] hover:text-white hover:border-[#6C8E12] hover:shadow-[0_0_18px_rgba(108,142,18,0.35)] dark:border-[#BDF869] dark:text-[#BDF869] dark:bg-transparent dark:hover:bg-[#BDF869] dark:hover:text-black dark:hover:border-[#BDF869] dark:hover:shadow-[0_0_20px_rgba(189,248,105,0.4)]"
              >
                <span>Connect on LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
