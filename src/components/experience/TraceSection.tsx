import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { experience } from '../../data/portfolio';
import { Chapter } from '../shell/Chapter';
import { riseIn, staggerParent } from '../../lib/anim';

/**
 * TraceSection — chapter 02. The single real experience entry rendered as a
 * full editorial checkpoint on a scroll-drawn path. Sticky rail carries the
 * entry metadata; responsibility bullets and method chips are the actual
 * training-program content.
 */
export function TraceSection() {
  const entry = experience[0];
  const pathRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pathRef,
    offset: ['start 78%', 'end 45%'],
  });
  const pathScale = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 });

  return (
    <Chapter
      id="experience"
      index="02"
      kicker="experience"
      title="The Trace"
      meta="01 role // 2026 — present"
      band
    >
      <div className="trace">
        <aside className="trace-rail">
          <div>
            <p className="kicker">trace // active</p>
            <h3 className="trace-rail-title" style={{ marginTop: 'var(--s-4)' }}>
              Current checkpoint
            </h3>
          </div>
          <dl className="trace-rail-stats mono">
            <div>
              <dt className="mono--xs">period</dt>
              <dd>{entry.period}</dd>
            </div>
            <div>
              <dt className="mono--xs">organization</dt>
              <dd>{entry.organization}</dd>
            </div>
            <div>
              <dt className="mono--xs">base</dt>
              <dd>{entry.location ?? '—'}</dd>
            </div>
          </dl>
        </aside>

        <article className="trace-entry" ref={pathRef}>
          <span className="trace-path" aria-hidden="true">
            <motion.span className="trace-path-fill" style={{ scaleY: pathScale }} />
          </span>
          <span className="trace-node" aria-hidden="true" />

          <motion.header
            variants={staggerParent(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          >
            <motion.p className="trace-period" variants={riseIn}>
              <span className="mono mono--signal">{entry.period}</span>
              <span className="mono">{entry.category}</span>
            </motion.p>
            <motion.h3 className="trace-role" variants={riseIn}>
              {entry.role}
            </motion.h3>
            <motion.p className="trace-org" variants={riseIn}>
              {entry.organization} <span>— {entry.location}</span>
            </motion.p>
          </motion.header>

          <motion.p
            className="trace-summary lead"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {entry.summary}
          </motion.p>

          <motion.div
            variants={staggerParent(0.07)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          >
            <motion.div className="trace-sub mono" variants={riseIn}>
              responsibilities
            </motion.div>
            <motion.ol className="evidence">
              {entry.achievements.map((item, i) => (
                <motion.li key={item.slice(0, 24)} variants={riseIn}>
                  <span className="evidence-num">{String(i + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ol>

            <motion.div className="trace-sub mono" variants={riseIn}>
              methods
            </motion.div>
            <motion.ul className="methods">
              {entry.methods.map((method) => (
                <motion.li key={method} variants={riseIn}>
                  <span className="chip">{method}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={riseIn}>
              <span className="status status--signal">training in progress</span>
            </motion.div>

            {entry.additionalTraining && (
              <motion.section className="trace-additional" variants={riseIn} aria-labelledby="fortinet-training-title">
                <div className="trace-sub mono">additional training</div>
                <div className="trace-additional-card">
                  <p className="trace-additional-kicker mono mono--xs">summer program // 120 hours</p>
                  <h4 id="fortinet-training-title" className="trace-additional-title">
                    {entry.additionalTraining.role}
                  </h4>
                  <p className="trace-additional-org">
                    {entry.additionalTraining.organization} <span>— final score: 94%</span>
                  </p>
                  <p className="trace-additional-summary">{entry.additionalTraining.summary}</p>
                  <ul className="trace-additional-topics">
                    {entry.additionalTraining.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </motion.section>
            )}
          </motion.div>
        </article>
      </div>
    </Chapter>
  );
}
