'use client';

import { useState, useEffect, useRef } from 'react';

interface AnimatedCounterOptions {
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
}

export function useAnimatedCounter(
  target: number,
  options: AnimatedCounterOptions = {}
): string {
  const { duration = 1200, delay = 0, prefix = '', suffix = '', locale = 'en-IN' } = options;
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (target === 0) {
      setDisplay(0);
      return;
    }

    const timeout = setTimeout(() => {
      startedRef.current = true;
      startTimeRef.current = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        setDisplay(current);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, delay]);

  const formatted = display.toLocaleString(locale);
  return `${prefix}${formatted}${suffix}`;
}
