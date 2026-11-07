import { useEffect, useRef, useState } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '0px 0px -20px 0px',
  triggerOnce = true,
}: ScrollRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isIntersecting && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) {
            observer.unobserve(el);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, isIntersecting]);

  return { ref, isIntersecting };
}

/**
 * Universal Scroll Reveal Engine:
 * Observes every individual UI block, card, photo frame, and interactive element
 * so the ENTIRE INTERFACE (backgrounds, borders, photos, components) reveals smoothly
 * as the user scrolls down, not just text alone.
 */
export function useGlobalScrollReveal(isReady: boolean = true) {
  useEffect(() => {
    if (typeof window === 'undefined' || !isReady) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-init').forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const selector = [
      'main section:not(#hero) .stationery-card',
      'main section:not(#hero) .section-heading',
      'main section:not(#hero) .gallery-card',
      'main section:not(#hero) .gallery-mobile-slider-container',
      'main section:not(#hero) .wedding-calendar-container',
      'main section:not(#hero) .reveal-init',
      'footer#closing .closing-arch-photo',
      'footer#closing .closing-card',
      'footer#closing .reveal-init',
    ].join(', ');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const observedSet = new WeakSet<Element>();

    const scanAndObserve = () => {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        // Skip elements inside hero or already marked revealed
        if (el.closest('#hero') || el.closest('.envelope-cover-root')) {
          el.classList.add('is-revealed');
          return;
        }

        if (!observedSet.has(el)) {
          observedSet.add(el);
          if (!el.classList.contains('is-revealed')) {
            el.classList.add('reveal-init');
            observer.observe(el);
          }
        }
      });
    };

    scanAndObserve();
    const timer = setTimeout(scanAndObserve, 80);

    const mutationObserver = new MutationObserver(() => {
      scanAndObserve();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [isReady]);
}
