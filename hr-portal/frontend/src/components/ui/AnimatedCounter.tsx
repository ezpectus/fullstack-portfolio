import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}

export function AnimatedCounter({ value, duration = 1, format }: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const n = Math.round(latest);
    return format ? format(n) : n.toLocaleString();
  });

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: 'easeOut' });
    return controls.stop;
  }, [count, value, duration]);

  return <motion.span>{rounded}</motion.span>;
}
