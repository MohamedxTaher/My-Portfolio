import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { SkillGroup, SkillLevel } from '../../data/portfolio';
import { skills, skillLevels } from '../../data/portfolio';
import { Chapter } from '../shell/Chapter';
import { PlusIcon } from '../foundation/Icons';
import { EASE_INOUT, riseIn, staggerParent } from '../../lib/anim';

/**
 * CapabilitySection — chapter 04. Six domain clusters of signal nodes with a
 * 3-dot self-assessed scale. Domains are a compact accordion (all collapsed
 * by default to keep the section tight); expanding a domain reveals its nodes
 * with a controlled stagger.
 */

const LEVELS: SkillLevel[] = [3, 2, 1];

function Dots({ level }: { level: SkillLevel }) {
  return (
    <span className="cap-dots" aria-hidden="true">
      {[1, 2, 3].map((dot) => (
        <i key={dot} className={dot <= level ? 'on' : undefined} />
      ))}
    </span>
  );
}

function Cluster({
  group,
  index,
  open,
  onToggle,
}: {
  group: SkillGroup;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const listId = `domain-list-${group.index}`;

  return (
    <motion.section className="cap-cluster panel" variants={riseIn}>
      <button
        type="button"
        className="cap-cluster-head"
        aria-expanded={open}
        aria-controls={listId}
        onClick={onToggle}
      >
        <span className="cap-cluster-idx">{String(index + 1).padStart(2, '0')}</span>
        <span className="cap-cluster-titles">
          <span className="cap-cluster-name">{group.name}</span>
        </span>
        <span className="cap-cluster-count mono mono--xs">{String(group.items.length).padStart(2, '0')}</span>
        <span className="cap-cluster-toggle" aria-hidden="true">
          <PlusIcon size={13} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            id={listId}
            className="cap-list"
            key="list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: EASE_INOUT }}
          >
            {group.items.map((item, i) => (
              <motion.li
                className="cap-node"
                key={item.name}
                tabIndex={0}
                aria-label={`${item.name} — self-assessed level: ${skillLevels[item.level]}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.03, duration: 0.3, ease: EASE_INOUT }}
              >
                <span className="cap-node-name">{item.name}</span>
                <Dots level={item.level} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export function CapabilitySection() {
  const [openDomains, setOpenDomains] = useState<string[]>([]);
  const nodeCount = skills.reduce((sum, group) => sum + group.items.length, 0);

  const toggle = (index: string) =>
    setOpenDomains((current) =>
      current.includes(index) ? current.filter((id) => id !== index) : [...current, index],
    );

  return (
    <Chapter
      id="skills"
      index="04"
      kicker="skills"
      title="Capability Map"
      meta={`${String(skills.length).padStart(2, '0')} domains // ${String(nodeCount).padStart(2, '0')} skills // self-assessed`}
      band
    >
      <div className="cap-head">
        <span className="cap-legend mono">
          self-assessed level:
          {LEVELS.map((level) => (
            <span className="legend-signal" key={level}>
              <span className="legend-dots" aria-hidden="true">
                {[1, 2, 3].map((dot) => (
                  <i key={dot} className={dot <= level ? 'on' : undefined} />
                ))}
              </span>
              {skillLevels[level]}
            </span>
          ))}
        </span>
      </div>

      <motion.div
        className="cap-grid"
        variants={staggerParent(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      >
        {skills.map((group, gi) => (
          <Cluster
            key={group.index}
            group={group}
            index={gi}
            open={openDomains.includes(group.index)}
            onToggle={() => toggle(group.index)}
          />
        ))}
      </motion.div>
    </Chapter>
  );
}
