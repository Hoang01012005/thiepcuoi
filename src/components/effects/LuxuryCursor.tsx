import React, { useEffect, useRef, useCallback } from 'react';

interface TrailDot {
  x: number;
  y: number;
  id: number;
  timestamp: number;
}

export const LuxuryCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const trailsRef = useRef<TrailDot[]>([]);
  const idRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(false);

  const isTouchOnly = useCallback(() => {
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  }, []);

  useEffect(() => {
    if (isTouchOnly()) return;

    const cursor = cursorRef.current;
    const trailContainer = trailContainerRef.current;
    if (!cursor || !trailContainer) return;

    // Hide default OS cursor site-wide
    document.documentElement.style.cursor = 'none';

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        cursor.style.opacity = '1';
      }

      // Spawn a new trail dot
      const id = ++idRef.current;
      const dot: TrailDot = { x: e.clientX, y: e.clientY, id, timestamp: Date.now() };
      trailsRef.current.push(dot);

      // Create DOM node for trail
      const el = document.createElement('div');
      el.id = `trail-${id}`;
      el.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 99997;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(1);
        background: radial-gradient(circle, #FFF4D0 0%, #D4AF37 60%, transparent 100%);
        opacity: 0.9;
        transition: transform 0.4s ease, opacity 0.4s ease;
        will-change: transform, opacity;
      `;
      trailContainer.appendChild(el);

      // Fade & shrink after a short moment
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.transform = 'translate(-50%, -50%) scale(0)';
          el.style.opacity = '0';
        }, 60);
        setTimeout(() => {
          if (el.parentNode) el.parentNode.removeChild(el);
          trailsRef.current = trailsRef.current.filter(d => d.id !== id);
        }, 500);
      });
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      if (cursor) cursor.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisibleRef.current = true;
      if (cursor) cursor.style.opacity = '1';
    };

    // Smooth cursor follow via RAF
    const animate = () => {
      if (cursor) {
        cursor.style.left = `${posRef.current.x}px`;
        cursor.style.top = `${posRef.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Restore pointer on interactive elements
    const styleEl = document.createElement('style');
    styleEl.id = 'luxury-cursor-overrides';
    styleEl.textContent = `
      a, button, [role="button"], input, textarea, select, label, [tabindex] {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.documentElement.style.cursor = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafRef.current);
      document.getElementById('luxury-cursor-overrides')?.remove();
    };
  }, [isTouchOnly]);

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Custom Cursor: Golden Heart */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 99999,
          left: '-100px',
          top: '-100px',
          width: '28px',
          height: '28px',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          willChange: 'left, top',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 2px 6px rgba(212,175,55,0.7))' }}
        >
          <defs>
            <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4D0" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8B1E34" />
            </linearGradient>
          </defs>
          <path
            d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
            fill="url(#heartGrad)"
          />
        </svg>
      </div>

      {/* Trail dust container */}
      <div
        ref={trailContainerRef}
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99997 }}
      />
    </>
  );
};
