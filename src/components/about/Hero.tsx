import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import type { Variants } from 'motion/react';
import { profile } from '../../data/portfolio';
import { ArrowRightIcon, DownloadIcon } from '../foundation/Icons';
import { DUR, EASE_OUT, STAGGER } from '../../lib/anim';
import { PortraitScope } from './PortraitScope';

/**
 * Hero — the identity statement. Oversized stacked display name (filled /
 * outlined / filled), role kicker, verified intro, two actions, and the
 * forensic scope portrait. Scroll lifts the whole composition out gently
 * (transform + opacity only — native scroll always owns movement).
 */

const lineReveal: Variants = {
  hidden: { y: '112%' },
  show: (i: number) => ({
    y: '0%',
    transition: { duration: DUR.cine, ease: EASE_OUT, delay: 0.08 + i * 0.09 },
  }),
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DUR.large, ease: EASE_OUT, delay: 0.42 + i * STAGGER.loose },
  }),
};

export function Hero({ booted }: { booted: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -64]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  const state = booted ? 'show' : 'hidden';

  return (
    <div className="hero" ref={ref}>
      <motion.div className="container hero-main" style={{ y, opacity }}>
        <div className="hero-id">
          <motion.p className="kicker hero-kicker" variants={fadeUp} custom={0} initial="hidden" animate={state}>
            {profile.title
              .split('|')
              .map((part) => part.trim())
              .join(' // ')}
          </motion.p>

          <h1 className="hero-name">
            {['Mohamed', 'Taher', 'Elrefaey'].map((word, i) => (
              <span className="hero-line" key={word}>
                <motion.span
                  className={i === 1 ? 'text-outline' : undefined}
                  variants={lineReveal}
                  custom={i}
                  initial="hidden"
                  animate={state}
                  style={{ display: 'block' }}
                >
                  {word.toUpperCase()}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="lead hero-intro" variants={fadeUp} custom={1} initial="hidden" animate={state}>
            {profile.intro}
          </motion.p>

          <motion.div className="hero-ctas" variants={fadeUp} custom={2} initial="hidden" animate={state}>
            <a className="btn btn--signal" href="#projects">
              view projects
              <ArrowRightIcon size={14} className="btn-arrow" />
            </a>
            <a className="btn btn--ghost" href={profile.cvPath} target="_blank" rel="noopener noreferrer">
              download cv
              <DownloadIcon size={14} />
            </a>
            <a className="tick-link hero-channel-link" href="#contact">
              contact me
              <ArrowRightIcon size={12} className="tick-link-arrow" />
            </a>
          </motion.div>
        </div>

        <PortraitScope booted={booted} />
      </motion.div>

      <div className="container hero-foot">
        <span className="scroll-hint mono">
          <span className="scroll-hint-tick" aria-hidden="true" />
          scroll // 01 → 06
        </span>
        <span className="mono mono--xs">blue team // soc</span>
      </div>
    </div>
  );
}
