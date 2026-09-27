/**
 * anim.ts — JS-side constants for the motion system (the CSS twin lives in
 * tokens.css).
 * The `motion` library consumes these; every effect that runs JS loops must
 * additionally gate on lib/prefs (reduced motion / fine pointer).
 */

/** Signal-out — the house easing. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Symmetric ease for wipes and scans. */
export const EASE_INOUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

/** House spring for transform-follow effects. */
export const SPRING = { stiffness: 170, damping: 22, mass: 1 } as const;

export const DUR = {
  micro: 0.12,
  small: 0.2,
  med: 0.38,
  large: 0.62,
  cine: 0.9,
} as const;

export const STAGGER = {
  tight: 0.04,
  base: 0.06,
  loose: 0.09,
} as const;

/** Standard viewport-entrance variant pair (fade + rise). */
export const riseIn = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.large, ease: EASE_OUT },
  },
} as const;

/** Container that staggers its children. */
export const staggerParent = (stagger: number = STAGGER.base, delay: number = 0) =>
  ({
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }) as const;
