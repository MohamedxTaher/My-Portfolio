import { useEffect, useRef } from 'react';
import { prefersFinePointer, prefersReducedMotion } from '../../lib/prefs';

/**
 * SignalField — the living background: sparse drifting signal points with
 * constellation traces, gently reactive to the pointer on fine-pointer
 * devices. Fixed, decorative, aria-hidden. Performance contract: device-
 * pixel-ratio aware, count bounded by area, rAF paused when the tab is
 * hidden, single static frame under reduced motion, full cleanup on unmount.
 */
export function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const fine = prefersFinePointer();

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let particles: P[] = [];
    const pointer = { x: -9999, y: -9999 };

    const spawn = () => {
      const budget = Math.min(120, Math.round((width * height) / (fine ? 16000 : 26000)));
      particles = Array.from({ length: Math.max(24, budget) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 0.6 + Math.random() * 1.1,
        a: 0.16 + Math.random() * 0.3,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
      if (reduced) drawFrame(); // static frame for the reduce contract
    };

    const LINK = 120;

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // constellation traces
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const alpha = (1 - Math.sqrt(d2) / LINK) * 0.09;
            ctx.strokeStyle = `rgba(79, 227, 255, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      // signal points — brightened slightly near the pointer
      for (const p of particles) {
        const dxp = p.x - pointer.x;
        const dyp = p.y - pointer.y;
        const near = dxp * dxp + dyp * dyp < 150 * 150;
        const alpha = Math.min(0.85, p.a + (near ? 0.3 : 0));
        ctx.fillStyle = `rgba(159, 240, 255, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -8) p.x = width + 8;
        if (p.x > width + 8) p.x = -8;
        if (p.y < -8) p.y = height + 8;
        if (p.y > height + 8) p.y = -8;
      }
      drawFrame();
      raf = requestAnimationFrame(step);
    };

    const setRunning = (next: boolean) => {
      if (running === next) return;
      running = next;
      if (next && !reduced) {
        raf = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    const onVisibility = () => setRunning(!document.hidden);
    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    if (fine && !reduced) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }
    if (!reduced) setRunning(true);

    return () => {
      setRunning(false);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="signal-field" aria-hidden="true" />;
}
