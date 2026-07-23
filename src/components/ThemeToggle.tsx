import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeToggle = React.memo(function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  return (
    <motion.button
      id="theme-toggle"
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="relative p-2 rounded-full border transition-all duration-300 focus:outline-none cursor-pointer border-neutral-300 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-md text-[#1B2410] dark:text-neutral-200 hover:border-[#6C8E12] hover:bg-[#6C8E12]/10 hover:text-[#5D7E05] hover:shadow-[0_0_12px_rgba(108,142,18,0.25)] dark:hover:border-[#BDF869] dark:hover:bg-[#BDF869]/10 dark:hover:text-[#BDF869] dark:hover:shadow-[0_0_14px_rgba(189,248,105,0.3)]"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-5 h-5 flex items-center justify-center"
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <Sun className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        )}
      </motion.div>
    </motion.button>
  );
});

export default ThemeToggle;

