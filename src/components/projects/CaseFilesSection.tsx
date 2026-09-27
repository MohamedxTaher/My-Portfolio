import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Project } from '../../data/portfolio';
import { projects } from '../../data/portfolio';
import { Chapter } from '../shell/Chapter';
import { ArrowRightIcon, ArrowUpRightIcon, CloseIcon } from '../foundation/Icons';
import { lockScroll, unlockScroll } from '../../lib/scrollLock';
import { EASE_OUT } from '../../lib/anim';
import { useTilt } from '../../lib/useTilt';
import { PipelineDiagram } from './PipelineDiagram';
import { IncidentReplay } from './IncidentReplay';

/**
 * CaseFilesSection — chapter 05. The three real projects as interactive
 * rows (index, category, technologies, preview, open project, view source)
 * that open an accessible full-screen dialog — context, implementation
 * highlights, a processing pipeline drawn strictly from each project's own
 * description, and (for SentinelPulse-SOC) an explicitly sample-data
 * incident replay. All copy is the projects' own content; VanguardSOC has
 * no highlight list in its source, so its file shows none (never invented).
 */

/** Pipelines — stage-for-stage traceable to each project's own description. */
const PIPELINES: Record<string, string[]> = {
  'SentinelPulse-SOC': ['raw logs', 'parser', 'detection engine', 'mitre mapping', 'triage', 'response'],
  VanguardSOC: ['raw events', 'regex parser', 'correlation rules', 'real-time alerts'],
  'Vigilant-IOC': ['raw iocs', 'enrichment', 'risk categorization', 'triage support'],
};

function CaseRow({
  project,
  hidden,
  onOpen,
}: {
  project: Project;
  hidden: boolean;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  const tilt = useTilt({ max: 0, glowReach: 45, glowAlpha: 0.1 });

  return (
    <motion.article
      ref={tilt.ref}
      className="case-row"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <motion.span className="case-glow" aria-hidden="true" style={{ background: tilt.spotlight }} />
      <span className="case-idx" aria-hidden="true">
        {project.index}
      </span>

      <div className="case-body">
        <span className="mono mono--xs">
          project {project.index} // {project.category.toLowerCase()}
        </span>
        <h3 className="case-title">{project.title}</h3>
        <p className="case-desc">{project.description}</p>
        <ul className="case-tags" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li className="chip" key={tag}>
              {tag}
            </li>
          ))}
        </ul>
        <div className="case-row-actions">
          <span className="case-cta" aria-hidden="true">
            open project <ArrowRightIcon size={14} className="case-cta-arrow" />
          </span>
          <a
            className="case-source tick-link"
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            view source <ArrowUpRightIcon size={12} className="tick-link-arrow" />
          </a>
        </div>
      </div>

      <div className="case-thumb">
        {!hidden && (
          <motion.img
            layoutId={`case-img-${project.index}`}
            src={project.previewPath}
            alt={`${project.title} preview screenshot`}
            loading="lazy"
          />
        )}
      </div>

      <button
        type="button"
        className="case-open"
        aria-haspopup="dialog"
        onClick={(e) => onOpen(e.currentTarget)}
      >
        <span className="sr-only">Open project: {project.title}</span>
      </button>
    </motion.article>
  );
}

function CaseFileOverlay({ project, onClose }: { project: Project; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lockScroll();
    if (overlayRef.current) overlayRef.current.scrollTop = 0;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && overlayRef.current) {
        const focusables = overlayRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      unlockScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const pipeline = PIPELINES[project.title];

  return (
    <motion.div
      className="case-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Project — ${project.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="case-sheet"
        initial={{ y: 44, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 28, opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
      >
        <div className="case-sheet-head">
          <p className="mono">
            project {project.index} // {project.category.toLowerCase()}
          </p>
          <button ref={closeRef} type="button" className="case-close" onClick={onClose}>
            <CloseIcon size={16} />
            <span className="sr-only">Close project</span>
          </button>
        </div>

        <div className="case-sheet-hero">
          <motion.img
            layoutId={`case-img-${project.index}`}
            src={project.previewPath}
            alt={`${project.title} preview screenshot`}
          />
          <span className="case-thumb-tag mono mono--xs" aria-hidden="true">
            project preview
          </span>
        </div>

        <div className="case-sheet-body">
          <div className="case-context">
            <p className="kicker">context</p>
            <p style={{ marginTop: 'var(--s-4)' }}>{project.description}</p>
            <ul className="case-tech" aria-label="Technologies">
              {project.tags.map((tag) => (
                <li className="chip" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div>
            {project.highlights.length > 0 && (
              <>
                <p className="kicker">implementation highlights</p>
                <ol className="case-evidence">
                  {project.highlights.map((highlight, i) => (
                    <li key={highlight.name}>
                      <span className="evidence-num">{String(i + 1).padStart(2, '0')}</span>
                      <span>
                        <strong style={{ color: 'var(--ink-0)' }}>{highlight.name}.</strong> {highlight.detail}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}
            <div className="case-actions">
              <a className="btn btn--signal" href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                view source <ArrowUpRightIcon size={14} className="btn-arrow" />
              </a>
              {project.liveUrl && (
                <a className="btn btn--ghost" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  live demo <ArrowUpRightIcon size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        {pipeline && (
          <div className="case-pipeline">
            <PipelineDiagram stages={pipeline} />
          </div>
        )}

        {project.title === 'SentinelPulse-SOC' && (
          <div className="case-replay">
            <IncidentReplay />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function CaseFilesSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const active = projects.find((project) => project.index === activeId) ?? null;

  return (
    <Chapter
      id="projects"
      index="05"
      kicker="projects"
      title="Projects"
      meta={`${String(projects.length).padStart(2, '0')} projects // source available`}
    >
      <div className="case-list">
        {projects.map((project) => (
          <CaseRow
            key={project.index}
            project={project}
            hidden={activeId === project.index}
            onOpen={(trigger) => {
              triggerRef.current = trigger;
              setActiveId(project.index);
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <CaseFileOverlay
            project={active}
            onClose={() => {
              setActiveId(null);
              triggerRef.current?.focus();
            }}
          />
        )}
      </AnimatePresence>
    </Chapter>
  );
}
