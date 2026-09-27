/**
 * useTilt.ts — pointer-tracked 3D tilt + spotlight for premium surfaces.
 *
 * Returns a ref + pointer handlers to attach to a `motion` element, a `style`
 * object carrying spring-driven rotateX/rotateY (with perspective), and a
 * `spotlight` motion template for a radial highlight that follows the cursor.
 * Everything is gated on a fine pointer and honors reduced-motion, so touch
 * devices and reduced-motion users get a completely static surface.
 */
import { useCallback, useRef } from 'react';
import { useMotionTemplate, useMotionValue, useSpring } from 'motion/react';
import { prefersFinePointer, prefersReducedMotion } from './prefs';

type TiltOptions = {
  /** Max rotation in degrees on each axis. 0 disables tilt but keeps the spotlight. */
  max?: number;
  /** Radial spotlight reach as a percentage of the surface. */
  glowReach?: number;
  /** Spotlight alpha (cyan signal). */
  glowAlpha?: number;
};

export function useTilt({ max = 7, glowReach = 55, glowAlpha = 0.16 }: TiltOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);

  const springCfg = { stiffness: 220, damping: 18, mass: 0.4 } as const;
  const sRotateX = useSpring(rotateX, springCfg);
  const sRotateY = useSpring(rotateY, springCfg);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion() || !prefersFinePointer()) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      rotateY.set((x - 0.5) * max * 2);
      rotateX.set(-(y - 0.5) * max * 2);
      mx.set(x * 100);
      my.set(y * 100);
    },
    [max, rotateX, rotateY, mx, my],
  );

  const onPointerLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    mx.set(50);
    my.set(50);
  }, [rotateX, rotateY, mx, my]);

  const spotlight = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, rgba(79, 227, 255, ${glowAlpha}), transparent ${glowReach}%)`;

  const style = {
    rotateX: sRotateX,
    rotateY: sRotateY,
    transformPerspective: 1000,
  };

  return { ref, onPointerMove, onPointerLeave, style, spotlight };
}
