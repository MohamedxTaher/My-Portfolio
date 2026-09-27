/**
 * scrollLock.ts — reference-counted body scroll lock. The entry sequence and
 * the project dialog can coexist (dialog opened via keyboard before the
 * entry finishes), so locking must nest rather than clobber.
 */

let locks = 0;

export function lockScroll() {
  locks += 1;
  document.body.classList.add('is-locked');
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) document.body.classList.remove('is-locked');
}
