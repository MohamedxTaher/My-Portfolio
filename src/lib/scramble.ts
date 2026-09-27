/**
 * scramble.ts — the "signal decode" text effect for channel values and
 * kickers. Characters resolve from the signal charset into the real string
 * over ~500ms. Decorative only: aria labels carry the real value, and the
 * effect never runs under reduced motion or on coarse pointers.
 */

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\|=+#*';
const SETTLE_PER_CHAR = 24; // chars lock in left-to-right

export function scrambleText(el: HTMLElement, finalText: string): () => void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce || !fine) {
    el.textContent = finalText;
    return () => {};
  }

  const original = finalText;
  const len = original.length;
  const start = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    const elapsed = now - start;
    // number of characters that have "locked" to their real value
    const settled = Math.floor(elapsed / SETTLE_PER_CHAR);
    let out = '';
    for (let i = 0; i < len; i += 1) {
      const ch = original[i];
      if (ch === ' ' || i < settled) {
        out += ch;
      } else {
        out += CHARSET[Math.floor(Math.random() * CHARSET.length)];
      }
    }
    el.textContent = out;
    if (settled < len) {
      frame = requestAnimationFrame(tick);
    } else {
      el.textContent = original;
    }
  };

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}
