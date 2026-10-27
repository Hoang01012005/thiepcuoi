import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  angleSpeed: number;
  tilt: number;
  tiltSpeed: number;
  opacity: number;
  color: string;
  type: 'petal' | 'dust' | 'bokeh';
}

export const AmbientPetals: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Cinematic Burgundy Luxury color palette: White Orchid, Ivory Rose, Champagne Gold, subtle Burgundy accent
    const petalPalettes = [
      'rgba(255, 255, 255, 0.88)', // pristine white orchid
      'rgba(253, 249, 245, 0.82)', // ivory white rose
      'rgba(248, 238, 225, 0.76)', // champagne silk petal
      'rgba(126, 22, 43, 0.38)',   // translucent velvety burgundy accent petal
    ];

    const goldPalettes = [
      'rgba(212, 175, 55, 0.85)',  // champagne gold
      'rgba(247, 220, 140, 0.90)', // brilliant gold foil shimmer
      'rgba(255, 240, 190, 0.80)', // delicate stardust
    ];

    // Adaptive particle count: fewer on mobile & reduced-motion for optimal battery & 60fps
    const particleCount = prefersReducedMotion ? 6 : (isMobile ? 12 : 24);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const rand = Math.random();
      let type: 'petal' | 'dust' | 'bokeh' = 'petal';
      let size = Math.random() * 8 + 6;
      let color = petalPalettes[Math.floor(Math.random() * petalPalettes.length)];

      if (rand > 0.8) {
        type = 'bokeh';
        size = Math.random() * 16 + 10;
        color = 'rgba(213, 181, 140, 0.12)';
      } else if (rand > 0.6) {
        type = 'dust';
        size = Math.random() * 2.5 + 1.2;
        color = goldPalettes[Math.floor(Math.random() * goldPalettes.length)];
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speedY: type === 'bokeh' ? Math.random() * 0.2 + 0.1 : Math.random() * 0.7 + 0.35,
        speedX: Math.random() * 0.5 - 0.25,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.02,
        tilt: Math.random() * Math.PI,
        tiltSpeed: Math.random() * 0.03 + 0.01,
        opacity: Math.random() * 0.5 + 0.35,
        color,
        type,
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.012;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time + i) * 0.4;
        p.angle += p.angleSpeed;
        p.tilt += p.tiltSpeed;

        // Wrap around borders
        if (p.y > height + 30) {
          p.y = -30;
          p.x = Math.random() * width;
        }
        if (p.x > width + 30) p.x = -30;
        if (p.x < -30) p.x = width + 30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        if (p.type === 'bokeh') {
          // Soft radial bokeh orb
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          grad.addColorStop(0, 'rgba(238, 219, 197, 0.16)');
          grad.addColorStop(0.7, 'rgba(213, 181, 140, 0.06)');
          grad.addColorStop(1, 'rgba(213, 181, 140, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'dust') {
          // Glimmering gold dust particle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Tiny shimmer halo
          ctx.fillStyle = 'rgba(255, 245, 230, 0.3)';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 3D Tumbling Botanical Rose Petal
          const xStretch = Math.cos(p.tilt);
          ctx.scale(xStretch, 1);
          ctx.fillStyle = p.color;

          // Elegant organic petal curve
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.9, p.size * 0.4, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.4, -p.size * 0.8, -p.size * 0.6, 0, -p.size);
          ctx.fill();

          // Subtle delicate central petal vein
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.7);
          ctx.lineTo(0, p.size * 0.6);
          ctx.stroke();
        }

        ctx.restore();
      }

      if (!document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        opacity: 0.9,
      }}
      aria-hidden="true"
    />
  );
};
