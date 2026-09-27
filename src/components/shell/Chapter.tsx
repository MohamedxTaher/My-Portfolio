import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { DUR, EASE_OUT, riseIn, staggerParent } from '../../lib/anim';

/**
 * Chapter — the shared section frame: ghost chapter number, kicker
 * (`01 // ABOUT`), display title, right-aligned metadata, ticked rule.
 * Every chapter then diverges into its own composition inside `children`.
 */

const ruleGrow = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: DUR.cine, ease: EASE_OUT } },
} as const;

/** Chapter title wipes up from a clipped mask — a weightier reveal than a plain rise. */
const titleReveal = {
  hidden: { opacity: 0, y: '35%', clipPath: 'inset(0 0 100% 0)' },
  show: {
    opacity: 1,
    y: '0%',
    clipPath: 'inset(0 0 -12% 0)',
    transition: { duration: DUR.cine, ease: EASE_OUT },
  },
} as const;

type ChapterProps = {
  id: string;
  index: string;
  kicker: string;
  title: ReactNode;
  meta?: string;
  band?: boolean;
  className?: string;
  children: ReactNode;
};

export function Chapter({ id, index, kicker, title, meta, band, className, children }: ChapterProps) {
  return (
    <section id={id} className={`section${band ? ' section--band' : ''}${className ? ` ${className}` : ''}`}>
      <div className="container">
        <span className="ghost-num" aria-hidden="true">
          {index}
        </span>
        <motion.header
          className="chapter-head"
          variants={staggerParent()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        >
          <motion.p className="kicker" variants={riseIn}>
            {index} // {kicker}
          </motion.p>
          <div className="chapter-row">
            <motion.h2 className="chapter-title" variants={titleReveal}>
              {title}
            </motion.h2>
            {meta ? (
              <motion.p className="mono chapter-meta" variants={riseIn}>
                {meta}
              </motion.p>
            ) : null}
          </div>
          <motion.div className="rule" variants={ruleGrow} />
        </motion.header>
        {children}
      </div>
    </section>
  );
}
