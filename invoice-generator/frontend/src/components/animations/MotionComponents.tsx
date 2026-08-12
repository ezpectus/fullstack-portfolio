import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { type ReactNode } from 'react';
import { useToastStore, type Toast } from '../../store/toastStore';

export const PageTransition = ({ children }: { children: ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children }: { children: ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div>{children}</div>;
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className }: { children: ReactNode; className?: string }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
      className={className}
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

export const ScaleIn = ({ children }: { children: ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedModal = ({ children, isOpen }: { children: ReactNode; isOpen: boolean }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: shouldReduceMotion ? 1 : 0.95, opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: shouldReduceMotion ? 1 : 0.95, opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const AnimatedCounter = ({ value, duration = 1 }: { value: number; duration?: number }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) {
    return <span>{value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>;
  }
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value}
    >
      <motion.span
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ duration }}
      >
        {value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 })}
      </motion.span>
    </motion.span>
  );
};

export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-shimmer rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:1000px_100%] dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 ${className}`} />
);

export const ScrollReveal = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

const toastColors: Record<Toast['type'], string> = {
  success: 'bg-primary-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg cursor-pointer ${toastColors[toast.type]}`}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
