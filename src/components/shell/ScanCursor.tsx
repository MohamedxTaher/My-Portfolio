import { useEffect } from 'react';
import { prefersFinePointer, prefersReducedMotion } from '../../lib/prefs';

/**
 * ScanCursor — precision bracket cursor for fine pointers: a 1:1 signal dot
 * plus a lerped tracking ring that expands over interactive targets.
 * Contract: fine pointer + motion allowed only; native cursor untouched on
 * touch devices; all listeners cleaned up. Rendered imperatively (fixed
 * element outside the React tree) — the component itself renders nothing.
 */
export function ScanCursor() {
  useEffect(() => {
    if (!prefersFinePointer() || prefersReducedMotion()) return;
    document.documentElement.classList.add('fine-pointer');

    const root = document.createElement('div');
    root.className = 'cursor';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = '<span class="cursor-ring"></span><span class="cursor-dot"></span>';
    document.body.appendChild(root);

    const dot = root.querySelector<HTMLElement>('.cursor-dot')!;
    const ring = root.querySelector<HTMLElement>('.cursor-ring')!;
    const target = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;
    let live = false;

    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      dot.style.transform = `translate(${target.x}px, ${target.y}px)`;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!live) {
        live = true;
        root.classList.add('is-live');
        ringPos.x = target.x;
        ringPos.y = target.y;
        raf = requestAnimationFrame(loop);
        document.documentElement.classList.add('cursor-ready');
      }
    };

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor]';
    const onOver = (e: MouseEvent) => {
      root.classList.toggle('is-link', !!(e.target as Element | null)?.closest?.(INTERACTIVE));
    };
    const onLeave = () => root.classList.remove('is-live');
    const onEnter = () => live && root.classList.add('is-live');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.documentElement.addEventListener('pointerenter', onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.removeEventListener('pointerenter', onEnter);
      document.documentElement.classList.remove('fine-pointer', 'cursor-ready');
      root.remove();
    };
  }, []);

  return null;
}
