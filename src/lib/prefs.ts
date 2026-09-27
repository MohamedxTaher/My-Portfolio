/**
 * prefs.ts — reduced-motion + fine-pointer contract for JS-driven effects
 * (SignalField canvas, scan cursor, scramble, counters, entry sequence).
 * CSS handles its own downgrade via the global reduce block in base.css;
 * JS effects must ask through these helpers instead of ad-hoc matchMedia.
 */
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';
const FINE_QUERY = '(hover: hover) and (pointer: fine)';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(REDUCE_QUERY).matches;
}

export function prefersFinePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(FINE_QUERY).matches;
}
