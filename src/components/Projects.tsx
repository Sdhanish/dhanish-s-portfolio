import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles, FolderGit2 } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';

export default function Projects() {
  const { projects: allProjects } = usePortfolio();
  // Filter published projects only
  const projects = allProjects.filter(p => p.status !== 'draft');


  // Extract unique categories from projects list dynamically
  const categories: string[] = ['All', ...Array.from(new Set(projects.map((p) => p.category || 'Other'))).map(c => String(c))];
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCards, setVisibleCards] = useState(2);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((project) => project.category === activeCategory);

  const isCarousel = filteredProjects.length > 1;
  const totalOriginal = filteredProjects.length;

  // Multiply filtered projects list for seamless infinite looping only when carousel is enabled (> 1 project)
  const loopCount = 4;
  const displayProjects = isCarousel ? Array(loopCount).fill(filteredProjects).flat() : filteredProjects;

  // Responsive visible cards listener (2 on desktop/tablet, 1 on mobile)
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 768) {
        setVisibleCards(2); // 2 cards per row on desktop & tablet
      } else {
        setVisibleCards(1); // 1 card on mobile
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // Reset slide index when category changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setActiveSlide(0);
  };

  const maxSlideIndex = isCarousel ? Math.max(0, displayProjects.length - visibleCards) : 0;

  // Auto-slide ticker interval (3.8s per step) only if carousel mode is active
  useEffect(() => {
    if (!isCarousel || isHovered || maxSlideIndex <= 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
    }, 3800);

    return () => clearInterval(timer);
  }, [isCarousel, isHovered, maxSlideIndex]);

  const nextSlide = () => {
    if (!isCarousel) return;
    setActiveSlide((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (!isCarousel) return;
    setActiveSlide((prev) => (prev <= 0 ? maxSlideIndex : prev - 1));
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (!isCarousel) return;
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  const currentOriginalIndex = totalOriginal > 0 ? activeSlide % totalOriginal : 0;

  return (
    <section id="projects" className="py-20 bg-white dark:bg-neutral-950 text-[#1B2410] dark:text-neutral-100 transition-colors duration-300 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#6C8E12]/5 dark:bg-[#BDF869]/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#6C8E12] dark:text-[#BDF869]">
              05 / Creative Output
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#1B2410] dark:text-white uppercase">
              Featured Projects
            </h2>
            <div className="w-16 h-1 bg-[#6C8E12] dark:bg-[#BDF869] rounded-full mt-2" />
          </div>

          {/* Filtering Tabs + Slide Indicator Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeCategory === category
                      ? 'bg-[#6C8E12] text-white shadow-[0_0_12px_rgba(108,142,18,0.3)] dark:bg-[#BDF869] dark:text-black dark:shadow-[0_0_12px_rgba(189,248,105,0.4)]'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-[#6C8E12] dark:hover:text-[#BDF869]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-bold text-neutral-600 dark:text-neutral-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#6C8E12] dark:text-[#BDF869]" />
              <span>Project 0{currentOriginalIndex + 1} / 0{totalOriginal}</span>
            </div>
          </div>
        </div>

        {/* Slidable Carousel Container with Glassmorphism Arrows */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 dark:text-neutral-400 font-mono text-sm border border-dashed border-neutral-300 dark:border-neutral-800 rounded-3xl">
            No projects available in this category.
          </div>
        ) : (
          <div 
            className="relative px-2 sm:px-6 md:px-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
          {/* Glassmorphism LEFT Arrow Button */}
          {isCarousel && (
            <button
              onClick={prevSlide}
              aria-label="Previous project"
              className="absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/90 dark:border-neutral-700/80 shadow-2xl text-[#1B2410] dark:text-white hover:bg-[#6C8E12] hover:text-white dark:hover:bg-[#BDF869] dark:hover:text-black hover:border-[#6C8E12] dark:hover:border-[#BDF869] transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Glassmorphism RIGHT Arrow Button */}
          {isCarousel && (
            <button
              onClick={nextSlide}
              aria-label="Next project"
              className="absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/90 dark:border-neutral-700/80 shadow-2xl text-[#1B2410] dark:text-white hover:bg-[#6C8E12] hover:text-white dark:hover:bg-[#BDF869] dark:hover:text-black hover:border-[#6C8E12] dark:hover:border-[#BDF869] transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 group"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* SINGLE ROW SLIDING TRACK (2 CARDS PER DESKTOP ROW) */}
          <div className="overflow-hidden rounded-3xl py-3 px-1">
            <motion.div
              drag={isCarousel ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={isCarousel ? handleDragEnd : undefined}
              animate={{ x: isCarousel ? `-${activeSlide * (100 / visibleCards)}%` : '0%' }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className={`flex gpu-layer ${isCarousel ? 'cursor-grab active:cursor-grabbing select-none' : ''}`}
            >
              {displayProjects.map((project, index) => {
                const origIndex = totalOriginal > 0 ? index % totalOriginal : 0;

                return (
                  <div
                    key={`display-proj-${project.id || project.title}-${index}`}
                    className="w-full md:w-1/2 flex-shrink-0 px-2 sm:px-3"
                  >
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="group relative h-full flex flex-col justify-between border border-neutral-200/90 dark:border-neutral-800/90 bg-neutral-50/80 dark:bg-neutral-900/90 rounded-2xl overflow-hidden shadow-[0_8px_25px_-5px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(108,142,18,0.2)] dark:hover:shadow-[0_20px_40px_-10px_rgba(189,248,105,0.2)] hover:border-[#6C8E12]/60 dark:hover:border-[#BDF869]/60 transition-all duration-300"
                    >
                      {/* Compact Project Image Panel with Vivid Color Reveal on Hover */}
                      <div className="relative aspect-[16/7] overflow-hidden border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950">
                        <img
                          src={project.image || 'https://picsum.photos/seed/placeholder/800/600'}
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          width="600"
                          height="350"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale brightness-[0.88] contrast-[1.05] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                        
                        {/* Category Tag Overlay */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-neutral-950/80 text-white dark:bg-[#BDF869] dark:text-black backdrop-blur-md shadow-md border border-white/10 dark:border-black/10">
                            {project.category}
                          </span>
                        </div>

                        {/* Top-Right Direct External Link */}
                        <div className="absolute top-3 right-3 z-10">
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-700/80 text-neutral-800 dark:text-white hover:bg-[#6C8E12] hover:text-white dark:hover:bg-[#BDF869] dark:hover:text-black transition-all duration-300 shadow-md flex items-center justify-center group/btn"
                            aria-label={`Visit live demo for ${project.title}`}
                          >
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </a>
                        </div>

                        {/* Gradient Vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Info Panel */}
                      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base sm:text-lg font-sans font-black tracking-tight text-[#1B2410] dark:text-white uppercase group-hover:text-[#6C8E12] dark:group-hover:text-[#BDF869] transition-colors">
                              {project.title}
                            </h3>

                            <span className="font-mono text-[10px] font-bold text-neutral-400 dark:text-neutral-500">
                              0{origIndex + 1}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal line-clamp-3">
                            {project.description}
                          </p>
                        </div>

                        {/* Tech Stack & Action Links */}
                        <div className="space-y-4 pt-3 border-t border-neutral-200/80 dark:border-neutral-800">
                          
                          {/* Stack Badges */}
                          <div className="flex flex-wrap gap-1">
                            {project.stack.map((tech, techIdx) => (
                              <span
                                key={`${tech}-${techIdx}`}
                                className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Action Buttons: GitHub Source + Live Demo */}
                          <div className="flex items-center justify-between pt-1">
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 hover:border-[#6C8E12] dark:hover:border-[#BDF869] rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-[#6C8E12] dark:hover:text-[#BDF869] bg-white dark:bg-neutral-950 font-mono text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
                            >
                              <Github className="w-3.5 h-3.5" />
                              <span>GitHub Code</span>
                            </a>

                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#6C8E12] text-white dark:bg-[#BDF869] dark:text-black hover:bg-[#58740E] dark:hover:bg-[#a8f33e] rounded-lg font-mono text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Live Application</span>
                            </a>
                          </div>

                        </div>
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
        {isCarousel && (
          <div className="mt-8 flex items-center justify-center space-x-2">
            {filteredProjects.map((project, idx) => {
              const isActive = currentOriginalIndex === idx;
              return (
                <button
                  key={`proj-dot-${project.id || project.title}-${idx}`}
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Go to project slide ${idx + 1}`}
                  className={`transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-7 sm:w-9 h-2.5 rounded-full bg-[#6C8E12] dark:bg-[#BDF869] shadow-[0_0_12px_rgba(108,142,18,0.5)] dark:shadow-[0_0_15px_rgba(189,248,105,0.6)]'
                      : 'w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600'
                  }`}
                />
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
