import React, { useEffect, useRef } from 'react';

interface Particle3D {
  x: number;
  y: number;
  z: number; // 3D depth layer: 0.1 (far background) to 1.2 (extreme foreground)
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  angleSpeed: number;
  pitch: number;      // 3D rotation around X axis
  pitchSpeed: number;
  yaw: number;        // 3D rotation around Y axis
  yawSpeed: number;
  roll: number;       // 3D rotation around Z axis
  rollSpeed: number;
  opacity: number;
  baseOpacity: number;
  colorFront: string;
  colorBack: string;
  type: 'petal' | 'stardust' | 'bokeh';
  flutterFreq: number;
  flutterAmp: number;
  phase: number;
  blur: number;       // Depth of field optical blur
}

export const AmbientPetals: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Track scroll velocity for realistic 3D scroll-parallax effect
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = (currentScrollY - lastScrollY) * 0.15;
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track pointer position for gentle interactive breeze
    let pointerX = -9999;
    let pointerY = -9999;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length > 0) {
        pointerX = e.touches[0].clientX;
        pointerY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        pointerX = e.clientX;
        pointerY = e.clientY;
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Luxury Romantic Wedding Color Palettes
    // Front and back of petals catch lighting differently as they tumble in 3D
    const petalPalettes = [
      {
        front: 'rgba(255, 255, 255, 0.92)',   // Pure White Orchid
        back: 'rgba(250, 247, 240, 0.85)',    // Ivory Silk Underbelly
      },
      {
        front: 'rgba(253, 248, 242, 0.90)',   // Warm Ivory Gardenia
        back: 'rgba(244, 235, 224, 0.82)',    // Soft Champagne Tint
      },
      {
        front: 'rgba(238, 196, 196, 0.85)',   // Soft Dusty Rose Petal
        back: 'rgba(215, 168, 168, 0.78)',    // Deeper Rose Blush
      },
      {
        front: 'rgba(247, 232, 206, 0.88)',   // Champagne Gold Petal
        back: 'rgba(224, 202, 168, 0.80)',    // Warm Antique Gilt
      },
    ];

    const goldStardustPalettes = [
      'rgba(245, 218, 145, 0.95)', // Brilliant 24k Gold Foil Shimmer
      'rgba(212, 175, 55, 0.90)',  // Royal Champagne Gold
      'rgba(255, 242, 205, 0.85)', // Stardust Sparkle
    ];

    // Adaptive particle count for silky 60fps across all devices
    const particleCount = prefersReducedMotion ? 8 : (isMobile ? 20 : 38);
    const particles: Particle3D[] = [];

    for (let i = 0; i < particleCount; i++) {
      const rand = Math.random();
      // Generate 3D depth layer (z):
      // z = 0.15 .. 0.45: Background (slow, tiny, gold bokeh/stardust)
      // z = 0.45 .. 0.85: Midground (crisp petals, tumbling)
      // z = 0.85 .. 1.25: Foreground (large, fast, soft depth-of-field bokeh blur)
      let z = Math.random() * 1.1 + 0.15;
      let type: 'petal' | 'stardust' | 'bokeh' = 'petal';
      let size = 10;
      let colorFront = petalPalettes[0].front;
      let colorBack = petalPalettes[0].back;
      let blur = 0;

      if (rand > 0.82) {
        // Soft Champagne Gold Ambient Bokeh Orb in Background or Far Foreground
        type = 'bokeh';
        z = rand > 0.92 ? 1.2 : 0.25; // Either very close or far away
        size = (Math.random() * 18 + 14) * z;
        blur = z > 1.0 ? 3 : 1;
      } else if (rand > 0.65) {
        // Glimmering 3D Golden Stardust Sparkle
        type = 'stardust';
        z = Math.random() * 0.7 + 0.2;
        size = (Math.random() * 2.8 + 1.2) * z;
        colorFront = goldStardustPalettes[Math.floor(Math.random() * goldStardustPalettes.length)];
      } else {
        // 3D Tumbling Botanical Petal
        type = 'petal';
        const pal = petalPalettes[Math.floor(Math.random() * petalPalettes.length)];
        colorFront = pal.front;
        colorBack = pal.back;
        size = (Math.random() * 8 + 8) * z;
        // Large foreground petals receive cinematic depth-of-field blur
        if (z > 1.0) {
          blur = (z - 1.0) * 4;
        }
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        size,
        speedY: (type === 'bokeh' ? 0.25 : (type === 'stardust' ? 0.45 : 0.75)) * z,
        speedX: (Math.random() * 0.4 - 0.2) * z,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.015,
        pitch: Math.random() * Math.PI * 2,
        pitchSpeed: (Math.random() * 0.03 + 0.015) * (Math.random() > 0.5 ? 1 : -1),
        yaw: Math.random() * Math.PI * 2,
        yawSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        roll: Math.random() * Math.PI * 2,
        rollSpeed: (Math.random() * 0.025 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        opacity: Math.random() * 0.35 + 0.6,
        baseOpacity: Math.random() * 0.35 + 0.6,
        colorFront,
        colorBack,
        type,
        flutterFreq: Math.random() * 0.03 + 0.015,
        flutterAmp: (Math.random() * 0.8 + 0.4) * z,
        phase: Math.random() * Math.PI * 2,
        blur,
      });
    }

    // Sort initially by Z-index (back-to-front painter's algorithm for accurate depth rendering)
    particles.sort((a, b) => a.z - b.z);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      // Dampen scroll velocity smoothly
      scrollVelocity *= 0.92;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 3D Motion Integration:
        // Downward fall speed proportional to depth layer (Z-axis perspective)
        p.y += p.speedY + scrollVelocity * p.z;

        // Natural horizontal wind drift with sine wave oscillation
        const wind = Math.sin(time * 0.8 + p.phase) * p.flutterAmp + Math.cos(p.y * 0.004) * 0.35;
        p.x += p.speedX + wind;

        // Interactive Gentle Breeze:
        // When pointer/finger is near a particle, gently nudge it away in 3D
        if (pointerX > -1000) {
          const dx = p.x - pointerX;
          const dy = p.y - pointerY;
          const distSq = dx * dx + dy * dy;
          const maxDist = 120 * p.z;
          if (distSq < maxDist * maxDist && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / maxDist) * 1.8 * p.z;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force * 0.5;
            p.pitchSpeed += 0.01;
            p.yawSpeed += 0.01;
          }
        }

        // 3D Angles Progression
        p.angle += p.angleSpeed;
        p.pitch += p.pitchSpeed;
        p.yaw += p.yawSpeed;
        p.roll += p.rollSpeed;

        // Stardust Twinkle Pulse
        if (p.type === 'stardust') {
          p.opacity = p.baseOpacity * (0.6 + 0.4 * Math.sin(time * 4 + p.phase));
        }

        // Screen boundary wrap-around with padding
        const pad = p.size * 2 + 40;
        if (p.y > height + pad) {
          p.y = -pad;
          p.x = Math.random() * width;
        } else if (p.y < -pad) {
          p.y = height + pad;
          p.x = Math.random() * width;
        }

        if (p.x > width + pad) p.x = -pad;
        if (p.x < -pad) p.x = width + pad;

        // -------------------------------------------------------------
        // RENDER PASS WITH 3D MATRIX PROJECTION
        // -------------------------------------------------------------
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        // Apply Depth of Field Blur on Foreground if supported
        if (p.blur > 0 && ctx.filter !== undefined) {
          ctx.filter = `blur(${p.blur}px)`;
        }

        if (p.type === 'bokeh') {
          // -----------------------------------------------------------
          // 1. SOFT 3D GOLDEN BOKEH ORB (Deep Ambient Light Atmosphere)
          // -----------------------------------------------------------
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          const alphaBase = p.z > 1.0 ? 0.14 : 0.09;
          grad.addColorStop(0, `rgba(247, 230, 200, ${alphaBase * 1.5})`);
          grad.addColorStop(0.5, `rgba(212, 175, 55, ${alphaBase})`);
          grad.addColorStop(0.85, `rgba(198, 164, 106, ${alphaBase * 0.3})`);
          grad.addColorStop(1, 'rgba(198, 164, 106, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'stardust') {
          // -----------------------------------------------------------
          // 2. 3D GOLDEN STARDUST & METALLIC FOIL SPARKLE
          // -----------------------------------------------------------
          ctx.globalAlpha = p.opacity;

          // Outer glowing halo
          const haloGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.2);
          haloGrad.addColorStop(0, 'rgba(255, 245, 215, 0.85)');
          haloGrad.addColorStop(0.4, 'rgba(245, 218, 145, 0.45)');
          haloGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.2, 0, Math.PI * 2);
          ctx.fill();

          // 4-point diamond star sparkle core
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          const r = p.size;
          ctx.moveTo(0, -r * 1.4);
          ctx.quadraticCurveTo(0, 0, r * 1.4, 0);
          ctx.quadraticCurveTo(0, 0, 0, r * 1.4);
          ctx.quadraticCurveTo(0, 0, -r * 1.4, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r * 1.4);
          ctx.fill();
        } else {
          // -----------------------------------------------------------
          // 3. 3D TUMBLING BOTANICAL ROSE PETAL (True 3D Z-Perspective)
          // -----------------------------------------------------------
          ctx.globalAlpha = p.opacity;

          // Compute 3D projection factors using Euler pitch & yaw
          const scaleX = Math.cos(p.yaw);
          const scaleY = Math.cos(p.pitch);
          const isFrontFace = scaleX * scaleY >= 0;

          // Apply 3D perspective distortion matrix
          ctx.scale(Math.abs(scaleX) > 0.08 ? scaleX : 0.08, Math.abs(scaleY) > 0.08 ? scaleY : 0.08);

          // Dynamic 3D lighting gradient:
          // Front face reflects light brightly; back face is slightly deeper/shaded
          const grad = ctx.createLinearGradient(-p.size, -p.size, p.size, p.size);
          if (isFrontFace) {
            grad.addColorStop(0, p.colorFront);
            grad.addColorStop(0.65, p.colorFront);
            grad.addColorStop(1, 'rgba(235, 215, 195, 0.7)');
          } else {
            grad.addColorStop(0, p.colorBack);
            grad.addColorStop(0.7, p.colorBack);
            grad.addColorStop(1, 'rgba(195, 155, 155, 0.65)');
          }

          ctx.fillStyle = grad;

          // Exquisite organic double-curved rose petal silhouette
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.15);
          ctx.bezierCurveTo(
            p.size * 0.95,
            -p.size * 0.75,
            p.size * 1.05,
            p.size * 0.55,
            0,
            p.size * 1.15
          );
          ctx.bezierCurveTo(
            -p.size * 1.05,
            p.size * 0.55,
            -p.size * 0.95,
            -p.size * 0.75,
            0,
            -p.size * 1.15
          );
          ctx.closePath();
          ctx.fill();

          // Subtle organic central vein with golden shimmer highlight
          ctx.strokeStyle = isFrontFace ? 'rgba(255, 255, 255, 0.45)' : 'rgba(240, 220, 190, 0.35)';
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.85);
          ctx.quadraticCurveTo(p.size * 0.12 * Math.sin(p.roll), 0, 0, p.size * 0.75);
          ctx.stroke();

          // Delicate specular rim light on petal margin
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
          ctx.lineWidth = 0.5;
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
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
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
        zIndex: 12,
        opacity: 0.95,
      }}
      aria-hidden="true"
    />
  );
};
