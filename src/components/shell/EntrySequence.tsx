import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { profile } from '../../data/portfolio';
import { lockScroll, unlockScroll } from '../../lib/scrollLock';
import { prefersReducedMotion } from '../../lib/prefs';
import { EASE_INOUT } from '../../lib/anim';

/**
 * Intro — Secure Session Boot (upgrade brief §1): five honest system lines,
 * ≤1.5s on a normal device, prominent focusable "Skip intro" control, then a
 * clean mask wipe into the hero. Illustrative only — it verifies nothing real.
 * `onDone` fires the moment the wipe starts so the hero reveal plays beneath
 * it; reduced-motion and repeat sessions land on content instantly.
 */

const SESSION_KEY = 'signal.entry.played';

type Line = { label: string; result: 'OK' | 'GRANTED'; at: number };

const LINES: Line[] = [
  { label: 'initiating analyst profile', result: 'OK', at: 140 },
  { label: 'establishing secure session', result: 'OK', at: 380 },
  { label: 'loading evidence archive', result: 'OK', at: 620 },
  { label: 'validating project signatures', result: 'OK', at: 860 },
  { label: 'public access', result: 'GRANTED', at: 1100 },
];
const EXIT_AT = 1400;
const EXIT_S = 0.6;

export function EntrySequence({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(0);
  const [exiting, setExiting] = useState(false);
  const timers = useRef<number[]>([]);
  const locked = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const beginExit = useCallback(() => {
    if (timers.current.length) {
      for (const t of timers.current) window.clearTimeout(t);
      timers.current = [];
    }
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* storage unavailable — the sequence simply replays next visit */
    }
    setShown(LINES.length);
    setExiting(true);
    onDoneRef.current();
  }, []);

  const completeExit = useCallback(() => {
    if (locked.current) {
      locked.current = false;
      unlockScroll();
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    // Reduced motion or repeat session: the portfolio is immediately usable.
    if (prefersReducedMotion()) {
      onDoneRef.current();
      setVisible(false);
      return;
    }
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        onDoneRef.current();
        setVisible(false);
        return;
      }
    } catch {
      /* storage unavailable — play the sequence */
    }

    lockScroll();
    locked.current = true;
    for (const line of LINES) {
      timers.current.push(window.setTimeout(() => setShown((s) => s + 1), line.at));
    }
    timers.current.push(window.setTimeout(() => beginExit(), EXIT_AT));

    return () => {
      for (const t of timers.current) window.clearTimeout(t);
      timers.current = [];
      if (locked.current) {
        locked.current = false;
        unlockScroll();
      }
    };
  }, [beginExit]);

  if (!visible) return null;

  return (
    <motion.div
      className="entry"
      role="status"
      aria-label="Loading portfolio — illustrative boot sequence"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={{ clipPath: exiting ? 'inset(0% 0% 100% 0%)' : 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: EXIT_S, ease: EASE_INOUT }}
      onAnimationComplete={() => {
        if (exiting) completeExit();
      }}
    >
      <button type="button" className="entry-skip" onClick={beginExit}>
        skip intro
      </button>

      <div className="entry-inner">
        <motion.img
          className="entry-mark"
          src={profile.logoMarkPath}
          alt=""
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE_INOUT }}
        />
        <div className="entry-lines">
          {LINES.map((line, i) => (
            <motion.p
              key={line.label}
              className={`entry-line${line.result === 'GRANTED' ? ' entry-line--granted' : ''}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: shown > i ? 1 : 0, x: shown > i ? 0 : -6 }}
              transition={{ duration: 0.18, ease: 'linear' }}
              aria-hidden={shown <= i}
            >
              <span className="entry-line-label">{`> ${line.label}`}</span>
              <span className="entry-line-dots" aria-hidden="true" />
              <span className={`entry-line-result${line.result === 'GRANTED' ? ' is-granted' : ''}`}>
                {line.result}
              </span>
            </motion.p>
          ))}
        </div>
        <div className="entry-track">
          <motion.div
            className="entry-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: exiting ? 1 : shown / LINES.length }}
            transition={{ duration: exiting ? 0.25 : 0.22, ease: 'linear' }}
          />
        </div>
        <p className="entry-note mono mono--xs">{profile.title.toLowerCase()}</p>
      </div>
    </motion.div>
  );
}
