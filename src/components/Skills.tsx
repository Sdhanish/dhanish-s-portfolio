import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Layout, Database, Terminal, Wrench, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { SkillItem } from '../types';
import { TechIcon, techDetailsMap } from './TechIcon';

export default function Skills() {
  const { skills } = usePortfolio();


  const categories: { name: SkillItem['category']; icon: ReactNode }[] = [
    { name: 'Frontend', icon: <Layout className="w-4 h-4" /> },
    { name: 'Backend', icon: <Cpu className="w-4 h-4" /> },
    { name: 'Database', icon: <Database className="w-4 h-4" /> },
    { name: 'Languages', icon: <Terminal className="w-4 h-4" /> },
    { name: 'Tools', icon: <Wrench className="w-4 h-4" /> },
  ];

  const [activeCategory, setActiveCategory] = useState<SkillItem['category'] | 'All'>('All');
  const [showAll, setShowAll] = useState(false);

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  // Initial visible count = 12 (represents ~2 rows on desktop grid)
  const INITIAL_ROW_LIMIT = 12;
  const visibleSkills = showAll ? filteredSkills : filteredSkills.slice(0, INITIAL_ROW_LIMIT);
  const hasMore = filteredSkills.length > INITIAL_ROW_LIMIT;

  const handleCategoryChange = (cat: SkillItem['category'] | 'All') => {
    setActiveCategory(cat);
    setShowAll(false); // reset expanded view when changing filters
  };

  return (
    <section id="skills" className="py-24 bg-neutral-50 dark:bg-neutral-950 text-[#1B2410] dark:text-neutral-100 transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#6C8E12]/5 dark:bg-[#BDF869]/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Title */}
        <div className="mb-14 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#6C8E12] dark:text-[#BDF869]">
              02 / Technical Ecosystem
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight text-[#1B2410] dark:text-white uppercase">
            Tech Stack & Skills
          </h2>
          <div className="w-16 h-1 bg-[#6C8E12] dark:bg-[#BDF869] rounded-full mt-2" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          <button
            onClick={() => handleCategoryChange('All')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
              activeCategory === 'All'
                ? 'bg-[#6C8E12] text-white border-[#6C8E12] shadow-[0_0_15px_rgba(108,142,18,0.3)] dark:bg-[#BDF869] dark:text-black dark:border-[#BDF869] dark:shadow-[0_0_15px_rgba(189,248,105,0.4)]'
                : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-[#6C8E12] dark:hover:border-[#BDF869] hover:text-[#6C8E12] dark:hover:text-[#BDF869]'
            }`}
          >
            All Stack ({skills.length})
          </button>

          {categories.map((cat) => {
            const count = skills.filter(s => s.category === cat.name).length;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryChange(cat.name)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? 'bg-[#6C8E12] text-white border-[#6C8E12] shadow-[0_0_15px_rgba(108,142,18,0.3)] dark:bg-[#BDF869] dark:text-black dark:border-[#BDF869] dark:shadow-[0_0_15px_rgba(189,248,105,0.4)]'
                    : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-[#6C8E12] dark:hover:border-[#BDF869] hover:text-[#6C8E12] dark:hover:text-[#BDF869]'
                }`}
              >
                {cat.icon}
                <span>{cat.name} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* 3D Interactive Skills Grid */}
        {filteredSkills.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 dark:text-neutral-400 font-mono text-sm border border-dashed border-neutral-300 dark:border-neutral-800 rounded-3xl">
            No skills listed in this category.
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {visibleSkills.map((skill, index) => {
              const techConfig = techDetailsMap[skill.name];
              const brandColor = techConfig?.color || '#6C8E12';

              return (
                <motion.div
                  key={`${skill.id || skill.name}-${skill.category}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.35, delay: index * 0.02, ease: 'easeOut' }}
                  whileHover={{ y: -7, scale: 1.02 }}
                  className="group relative flex flex-col justify-between p-4 sm:p-5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 transition-all duration-300 cursor-pointer shadow-[0_8px_20px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_35px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_25px_-6px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_22px_40px_-10px_rgba(0,0,0,0.8)] hover:border-[#6C8E12]/60 dark:hover:border-[#BDF869]/60"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Subtle 3D Top-Glow Highlight */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-0"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${brandColor}18, transparent 70%)`
                    }}
                  />

                  {/* Top Bar: Icon + Category Tag */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <TechIcon name={skill.name} />
                    <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 font-extrabold group-hover:border-[#6C8E12]/40 dark:group-hover:border-[#BDF869]/40 transition-colors">
                      {skill.category}
                    </span>
                  </div>

                  {/* Skill Name */}
                  <div className="relative z-10 pt-1">
                    <h3 className="text-sm sm:text-base font-extrabold text-[#1B2410] dark:text-neutral-100 group-hover:text-[#6C8E12] dark:group-hover:text-[#BDF869] transition-colors duration-200">
                      {skill.name}
                    </h3>
                    
                    {/* Color Accent Indicator Line */}
                    <div 
                      className="w-0 group-hover:w-full h-0.5 rounded-full mt-2 transition-all duration-300 opacity-80"
                      style={{ backgroundColor: brandColor }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        )}

        {/* View More / Show Less Toggle Button */}
        {hasMore && (
          <div className="mt-12 flex flex-col items-center justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center space-x-3 px-8 py-4 rounded-2xl bg-white dark:bg-neutral-900 border-2 border-[#6C8E12]/40 dark:border-[#BDF869]/40 text-[#1B2410] dark:text-neutral-100 font-extrabold text-xs uppercase tracking-widest hover:border-[#6C8E12] dark:hover:border-[#BDF869] hover:bg-[#6C8E12]/10 dark:hover:bg-[#BDF869]/10 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(108,142,18,0.25)] dark:hover:shadow-[0_0_25px_rgba(189,248,105,0.3)] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#6C8E12] dark:text-[#BDF869] group-hover:rotate-12 transition-transform duration-300" />
              <span>
                {showAll 
                  ? 'Show Less Skills' 
                  : `View More Skills (${filteredSkills.length - INITIAL_ROW_LIMIT} Remaining)`}
              </span>
              {showAll ? (
                <ChevronUp className="w-4 h-4 text-[#6C8E12] dark:text-[#BDF869] group-hover:-translate-y-1 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#6C8E12] dark:text-[#BDF869] group-hover:translate-y-1 transition-transform" />
              )}
            </button>
            
            <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 mt-3 select-none">
              Showing {visibleSkills.length} of {filteredSkills.length} technologies
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
