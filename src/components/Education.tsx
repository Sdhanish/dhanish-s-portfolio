import { useState, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  Layers,
  BookOpen
} from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { TimelineItem } from '../types';

export default function Education() {
  const { timeline } = usePortfolio();

  const [filter, setFilter] = useState<'All' | 'Experience' | 'Education' | 'Training'>('All');

  // Ref for the timeline container to drive the fluid straw scroll animation
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure scroll progress relative to the timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 30%']
  });

  // Smooth out the progress for fluid motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const filteredItems = filter === 'All' 
    ? timeline 
    : timeline.filter(item => item.type === filter);

  const getTypeBadgeStyle = (type: TimelineItem['type']) => {
    switch (type) {
      case 'Experience':
        return 'bg-[#6C8E12]/15 text-[#58740E] dark:bg-[#BDF869]/20 dark:text-[#BDF869] border-[#6C8E12]/30 dark:border-[#BDF869]/40';
      case 'Education':
        return 'bg-blue-500/15 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300 border-blue-500/30 dark:border-blue-400/40';
      case 'Training':
        return 'bg-purple-500/15 text-purple-700 dark:bg-purple-400/20 dark:text-purple-300 border-purple-500/30 dark:border-purple-400/40';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border-neutral-300';
    }
  };

  const getTypeIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'Experience':
        return <Briefcase className="w-4 h-4 text-[#6C8E12] dark:text-[#BDF869]" />;
      case 'Education':
        return <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'Training':
        return <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <section id="education" className="py-20 bg-white dark:bg-neutral-950 text-[#1B2410] dark:text-neutral-100 transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#6C8E12]/5 dark:bg-[#BDF869]/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-400/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#6C8E12] dark:text-[#BDF869]">
              03 / Career & Learning Path
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#1B2410] dark:text-white uppercase">
            Experience & Education
          </h2>
          <div className="w-16 h-1 bg-[#6C8E12] dark:bg-[#BDF869] rounded-full mt-2" />
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setFilter('All')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
              filter === 'All'
                ? 'bg-[#6C8E12] text-white border-[#6C8E12] shadow-[0_0_15px_rgba(108,142,18,0.3)] dark:bg-[#BDF869] dark:text-black dark:border-[#BDF869] dark:shadow-[0_0_15px_rgba(189,248,105,0.4)]'
                : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-[#6C8E12] dark:hover:border-[#BDF869] hover:text-[#6C8E12] dark:hover:text-[#BDF869]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All ({timeline.length})</span>
          </button>

          <button
            onClick={() => setFilter('Experience')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
              filter === 'Experience'
                ? 'bg-[#6C8E12] text-white border-[#6C8E12] shadow-[0_0_15px_rgba(108,142,18,0.3)] dark:bg-[#BDF869] dark:text-black dark:border-[#BDF869] dark:shadow-[0_0_15px_rgba(189,248,105,0.4)]'
                : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-[#6C8E12] dark:hover:border-[#BDF869]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Experience ({timeline.filter(i => i.type === 'Experience').length})</span>
          </button>

          <button
            onClick={() => setFilter('Education')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
              filter === 'Education'
                ? 'bg-[#6C8E12] text-white border-[#6C8E12] shadow-[0_0_15px_rgba(108,142,18,0.3)] dark:bg-[#BDF869] dark:text-black dark:border-[#BDF869] dark:shadow-[0_0_15px_rgba(189,248,105,0.4)]'
                : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-[#6C8E12] dark:hover:border-[#BDF869]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Education ({timeline.filter(i => i.type === 'Education').length})</span>
          </button>

          <button
            onClick={() => setFilter('Training')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
              filter === 'Training'
                ? 'bg-[#6C8E12] text-white border-[#6C8E12] shadow-[0_0_15px_rgba(108,142,18,0.3)] dark:bg-[#BDF869] dark:text-black dark:border-[#BDF869] dark:shadow-[0_0_15px_rgba(189,248,105,0.4)]'
                : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-[#6C8E12] dark:hover:border-[#BDF869]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Training & Certs ({timeline.filter(i => i.type === 'Training').length})</span>
          </button>
        </div>

        {/* Timeline Container with Fluid "Straw" Filling Effect */}
        <div ref={containerRef} className="relative max-w-3xl mx-auto pl-5 sm:pl-8 md:pl-10">
          
          {/* THE FLUID STRAW VERTICAL LINE */}
          {/* Straw Outer Tube */}
          <div className="absolute left-2 sm:left-3 md:left-4 top-2 bottom-2 w-2 sm:w-2.5 bg-neutral-200/80 dark:bg-neutral-800/80 rounded-full border border-neutral-300/60 dark:border-neutral-700/60 overflow-hidden shadow-inner -translate-x-1/2 z-0">
            
            {/* Liquid Fill Line (fills smoothly down as user scrolls) */}
            <motion.div
              className="w-full origin-top bg-gradient-to-b from-[#6C8E12] via-[#82a919] to-[#BDF869] dark:from-[#BDF869] dark:via-[#95cc42] dark:to-[#6C8E12] shadow-[0_0_15px_rgba(108,142,18,0.6)]"
              style={{
                scaleY: smoothProgress,
                height: '100%'
              }}
            />
          </div>

          {/* Liquid droplet glow effect at top of straw */}
          <div className="absolute left-2 sm:left-3 md:left-4 top-1 w-3.5 h-3.5 -translate-x-1/2 rounded-full bg-[#6C8E12] dark:bg-[#BDF869] blur-[2px] opacity-80 z-0" />

          {/* Timeline Cards Stack */}
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-neutral-500 dark:text-neutral-400 font-mono text-sm border border-dashed border-neutral-300 dark:border-neutral-800 rounded-3xl">
              No entries found in this category.
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={`${item.id || 'item'}-${index}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group"
                >
                  {/* Timeline Node Bullet on Straw */}
                  <div className="absolute -left-[21px] sm:-left-[27px] md:-left-[31px] top-5 -translate-x-1/2 w-7 h-7 rounded-full border-2 border-white dark:border-neutral-950 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 z-20">
                    <div className="w-full h-full rounded-full flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 group-hover:border-[#6C8E12] dark:group-hover:border-[#BDF869] transition-colors">
                      {getTypeIcon(item.type)}
                    </div>
                  </div>

                  {/* Compact 3D Elevated Card */}
                  <div 
                    className="p-5 sm:p-6 rounded-xl bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_6px_20px_-5px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.5)] group-hover:shadow-[0_15px_30px_-8px_rgba(108,142,18,0.15)] dark:group-hover:shadow-[0_15px_30px_-8px_rgba(189,248,105,0.15)] group-hover:border-[#6C8E12]/50 dark:group-hover:border-[#BDF869]/50 transition-all duration-300 group-hover:-translate-y-0.5 space-y-3"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    
                    {/* Header Row: Badge & Period */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 dark:border-neutral-800 pb-3">
                      
                      {/* Type Badge */}
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider border ${getTypeBadgeStyle(item.type)}`}>
                        <Sparkles className="w-3 h-3" />
                        <span>{item.type}</span>
                      </span>

                      {/* Date / Period */}
                      <div className="flex items-center space-x-1.5 font-mono text-[11px] font-bold text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-950 px-2.5 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <Calendar className="w-3 h-3 text-[#6C8E12] dark:text-[#BDF869]" />
                        <span>{item.period}</span>
                      </div>
                    </div>

                    {/* Title & Organization */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-sans font-black tracking-tight text-[#1B2410] dark:text-white uppercase group-hover:text-[#6C8E12] dark:group-hover:text-[#BDF869] transition-colors">
                          {item.title}
                        </h3>

                        {/* CGPA Pill if available */}
                        {item.cgpa && (
                          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-mono font-black shadow-sm">
                            <Award className="w-3 h-3 text-amber-500" />
                            <span>CGPA: {item.cgpa}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center space-x-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                        <span>{item.organization}</span>
                        <span className="text-neutral-400">•</span>
                        <div className="flex items-center space-x-1 text-[11px] font-mono font-medium text-neutral-500 dark:text-neutral-400">
                          <MapPin className="w-3 h-3 text-[#6C8E12] dark:text-[#BDF869]" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bullet Highlights */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="pt-1 space-y-1.5">
                        {item.highlights.map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-start space-x-2 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#6C8E12] dark:text-[#BDF869] mt-0.5 shrink-0" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Certificate Action Button if available */}
                    {item.certificateUrl && (
                      <div className="pt-1.5">
                        <a
                          href={item.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600/10 hover:bg-purple-600 text-purple-700 hover:text-white dark:bg-purple-500/20 dark:hover:bg-purple-500 dark:text-purple-300 dark:hover:text-black border border-purple-500/30 font-mono text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
                        >
                          <Award className="w-3 h-3" />
                          <span>View Verified Certificate</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      </div>
                    )}

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          )}

        </div>

      </div>
    </section>
  );
}
