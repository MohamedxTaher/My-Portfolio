import { motion } from 'motion/react';
import { EASE_OUT } from '../../lib/anim';

/**
 * PipelineDiagram — the processing pipeline shown inside a project dialog.
 * Stage labels are always visible text (the accessible equivalent); the
 * connector sweep and node pulses are lightweight decorative CSS. Stages come
 * from each project's own description — nothing invented.
 */
export function PipelineDiagram({ stages }: { stages: string[] }) {
  return (
    <div className="pipe-block">
      <p className="kicker">processing pipeline</p>
      <motion.ol
        className="pipe"
        aria-label={`Illustrative processing pipeline: ${stages.join(' to ')}`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -5% 0px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        {stages.map((stage, i) => (
          <li className="pipe-item" key={stage}>
            <motion.span
              className="pipe-stage"
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
              }}
            >
              <span className="pipe-node" aria-hidden="true" />
              <span className="pipe-stage-num mono mono--xs" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="pipe-label">{stage}</span>
            </motion.span>
            {i < stages.length - 1 && <span className="pipe-link" aria-hidden="true" />}
          </li>
        ))}
      </motion.ol>
    </div>
  );
}
