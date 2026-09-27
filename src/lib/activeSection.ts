/**
 * activeSection.ts — controlled active-section state for the numbered nav.
 *
 * A rAF-throttled passive scroll measure (rather than IntersectionObserver):
 * deterministic for short last sections (Contact) where IO band thresholds
 * get flaky, and anchor jumps / back-forward navigation resolve on the very
 * next scroll event. Keeps browser back/forward and deep links reasonable.
 * Listener + frame are cleaned up on unmount.
 */
import { useEffect, useState } from 'react';

/** Reading line: a section is "current" once its top passes this viewport line. */
const MARKER_RATIO = 0.28;

export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    if (ids.length === 0) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const marker = window.innerHeight * MARKER_RATIO;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) current = id;
      }
      // Pin the final section once the page bottom is reached.
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        current = ids[ids.length - 1];
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const requestMeasure = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', requestMeasure, { passive: true });
    window.addEventListener('resize', requestMeasure, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestMeasure);
      window.removeEventListener('resize', requestMeasure);
    };
  }, [ids]);

  return active;
}
