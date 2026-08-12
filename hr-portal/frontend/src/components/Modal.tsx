import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const prefersReduced = useReducedMotion();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { scale: 0.95, opacity: 0, y: 20 }}
            animate={prefersReduced ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { scale: 0.95, opacity: 0, y: 20 }}
            transition={prefersReduced ? { duration: 0.2 } : { type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative w-full ${sizes[size]} rounded-2xl shadow-xl`}
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>{title}</h2>
              <button onClick={onClose} className="rounded-lg p-1.5 transition-colors hover:bg-black/5" style={{ color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
