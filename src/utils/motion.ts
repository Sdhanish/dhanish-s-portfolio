import { Variants } from 'motion/react';

// Premium cubic-bezier easing curve used by Apple, Linear, Stripe & Framer
export const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

// Default viewport trigger config (animates once when 15% visible)
export const VIEWPORT_ONCE = {
  once: true,
  margin: '-10% 0px -10% 0px',
} as const;

// Section Header / Heading Reveal Variant
export const FADE_IN_UP: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: PREMIUM_EASE,
    },
  },
};

// Paragraph / Subtitle Soft Reveal
export const FADE_IN_SOFT: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: PREMIUM_EASE,
    },
  },
};

// Container with Staggered Children
export const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.03,
    },
  },
};

// Faster Stagger Container for Grids
export const FAST_STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.01,
    },
  },
};

// Card Reveal Variant (Services, Skills, Projects, Experience)
export const CARD_REVEAL: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: PREMIUM_EASE,
    },
  },
};

// Image Reveal Variant (Hero, About, Project thumbnails)
export const IMAGE_REVEAL: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.02,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: PREMIUM_EASE,
    },
  },
};

// Button Hover & Tap Micro-Interactions
export const BUTTON_INTERACTION = {
  whileHover: {
    y: -2,
    scale: 1.02,
    transition: { duration: 0.25, ease: PREMIUM_EASE },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.15, ease: PREMIUM_EASE },
  },
};

// Icon / Small Button Hover
export const ICON_BUTTON_INTERACTION = {
  whileHover: {
    y: -2,
    scale: 1.08,
    transition: { duration: 0.2, ease: PREMIUM_EASE },
  },
  whileTap: {
    scale: 0.94,
    transition: { duration: 0.1, ease: PREMIUM_EASE },
  },
};
