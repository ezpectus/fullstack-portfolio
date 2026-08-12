import { motion, AnimatePresence, useReducedMotion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerList({ children, className }: { children: ReactNode; className?: string }) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
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
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ModalAnimation({ children, isOpen }: { children: ReactNode; isOpen: boolean }) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <>{isOpen && children}</>;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ToastContainer({ toasts, onRemove }: { toasts: { id: string; type: string; message: string }[]; onRemove: (id: string) => void }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={() => onRemove(toast.id)}
            className={`cursor-pointer rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-500 text-white'
                : toast.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function ScrollReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (v) => Math.round(v).toString());
  const [, setRender] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    if (prefersReduced) {
      if (ref.current) ref.current.textContent = value.toString();
      return;
    }
    const unsub = display.on('change', (v) => {
      if (ref.current) ref.current.textContent = v;
      setRender((r) => r + 1);
    });
    return () => unsub();
  }, [display, prefersReduced, value]);

  return <span ref={ref}>{prefersReduced ? value : '0'}</span>;
}

export function MotionButton({ children, onClick, className, disabled, type = 'button' }: { children: ReactNode; onClick?: () => void; className?: string; disabled?: boolean; type?: 'button' | 'submit' }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      whileHover={prefersReduced ? undefined : { scale: 1.02 }}
      whileTap={prefersReduced ? undefined : { scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

export function SkeletonShimmer({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <div className={`bg-muted ${className}`} />;
  return (
    <motion.div
      className={`bg-muted ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}
