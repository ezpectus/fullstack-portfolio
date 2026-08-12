import { motion, type Variants, useReducedMotion } from 'framer-motion';
import { type ReactNode } from 'react';

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const modalScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const PageTransition = ({ children }: { children: ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div>{children}</div>;
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, className }: { children: ReactNode; className?: string }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      variants={listContainer}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className }: { children: ReactNode; className?: string }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div variants={listItem} className={className}>
      {children}
    </motion.div>
  );
};

export const ScaleIn = ({ children }: { children: ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div
      variants={modalScale}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export const FadeIn = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
};

export const NumberCounter = ({ value, duration = 1 }: { value: number; duration?: number }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <span>{value.toLocaleString()}</span>;
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration, type: 'spring' }}
      >
        {value.toLocaleString()}
      </motion.span>
    </motion.span>
  );
};

export const SkeletonShimmer = ({ className = '' }: { className?: string }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) {
    return <div className={`bg-cream-200 dark:bg-gray-700 rounded-lg ${className}`} />;
  }
  return (
    <motion.div
      className={`bg-gradient-to-r from-cream-200 via-cream-300 to-cream-200 bg-[length:200%_100%] rounded-lg dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 ${className}`}
      animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  );
};
