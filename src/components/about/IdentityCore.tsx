import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'motion/react';
import type { Metric } from '../../data/portfolio';
import { metrics, profile, traits } from '../../data/portfolio';
import { CheckIcon } from '../foundation/Icons';
import { prefersReducedMotion } from '../../lib/prefs';
import { EASE_OUT, riseIn, staggerParent } from '../../lib/anim';

/**
 * IdentityCore — the professional summary beneath the hero: editorial copy
 * with highlighted real terms, the three real counters, trait chips, and the
 * logo mark as a quiet watermark.
 */

/** Real terms present in the source strings — highlighted, nothing added. */
const SIGNAL_TERMS = [
  'Wazuh SIEM environments',
  'Windows Event Logs',
  'Event IDs 4624 and 4625',
  'Wireshark',
  'Python',
  'PowerShell',
  'SOC experience',
];

function highlight(text: string): (string | { term: string })[] {
  const pattern = new RegExp(`(${SIGNAL_TERMS.join('|')})`, 'g');
  return text
    .split(pattern)
    .filter(Boolean)
    .map((chunk) => (SIGNAL_TERMS.includes(chunk) ? { term: chunk } : chunk));
}

function SignalParagraph({ text }: { text: string }) {
  return (
    <p>
      {highlight(text).map((part, i) =>
        typeof part === 'string' ? (
          part
        ) : (
          <em className="signal-em" key={i}>
            {part.term}
          </em>
        ),
      )}
    </p>
  );
}

/** Count-up on first view — instant under reduced motion. */
function Counter({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const [value, setValue] = useState(0);

  const numeric = Number.parseFloat(metric.value.replace(/[^0-9.]/g, ''));
  const suffix = metric.value.replace(/[0-9.]/g, '');

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion() || Number.isNaN(numeric)) {
      setValue(numeric);
      return;
    }
    const controls = animate(0, numeric, {
      duration: 1.3,
      ease: EASE_OUT,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, numeric]);

  return (
    <motion.div className="counter" variants={riseIn} ref={ref}>
      <span className="counter-value" aria-hidden="true">
        {Number.isNaN(numeric) ? metric.value : value}
        {suffix ? <em>{suffix}</em> : null}
      </span>
      {/* static value for assistive tech — the animated figure never churns a live region */}
      <span className="sr-only">{metric.value}</span>
      <span className="counter-label mono">{metric.label}</span>
    </motion.div>
  );
}

export function IdentityCore() {
  return (
    <div className="core">
      <span className="ghost-num" aria-hidden="true">
        01
      </span>

      <motion.div
        className="core-grid"
        variants={staggerParent(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      >
        <motion.div className="core-statement" variants={riseIn}>
          <span className="core-heading-mask">
            <motion.h2
              className="core-heading"
              initial={{ y: '112%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Professional summary
            </motion.h2>
          </span>
          <div className="lead core-copy">
            {profile.deeperIntro.map((para) => (
              <SignalParagraph key={para.slice(0, 24)} text={para} />
            ))}
          </div>

          <ul className="traits">
            {traits.map((trait) => (
              <li className="trait" key={trait}>
                <CheckIcon size={12} />
                {trait}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.aside className="core-aside" variants={riseIn} aria-hidden="true">
          <img src={profile.logoMarkPath} alt="" loading="lazy" />
        </motion.aside>
      </motion.div>

      <motion.div
        className="counters"
        variants={staggerParent(0.09)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      >
        {metrics.map((metric) => (
          <Counter key={metric.label} metric={metric} />
        ))}
      </motion.div>
    </div>
  );
}
