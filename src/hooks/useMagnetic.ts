import { useRef, useEffect } from 'react';

export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(strength: number = 0.22) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Disable on touch devices or reduced motion
    const isTouch = window.matchMedia('(hover: none)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      // Limit magnetic attraction radius
      const maxDistance = 75;
      const dist = Math.hypot(distX, distY);

      if (dist < maxDistance) {
        const moveX = distX * strength;
        const moveY = distY * strength;
        el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }
    };

    const handleMouseLeave = () => {
      el.style.transform = 'translate3d(0px, 0px, 0)';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref;
}
