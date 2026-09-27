import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Certification } from '../../data/portfolio';
import { certifications } from '../../data/portfolio';
import { Chapter } from '../shell/Chapter';
import { CheckIcon, CloseIcon } from '../foundation/Icons';
import { EASE_OUT, staggerParent } from '../../lib/anim';
import { lockScroll, unlockScroll } from '../../lib/scrollLock';
import { useTilt } from '../../lib/useTilt';

/**
 * ArchiveSection — chapter 03. Each real credential is shown as its actual
 * certificate image in a large card gallery; selecting a card opens an
 * accessible full-screen lightbox with the certificate at full resolution.
 */

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
} as const;

function CertCard({
  cert,
  hidden,
  onOpen,
}: {
  cert: Certification;
  hidden: boolean;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  const tilt = useTilt({ max: 6, glowReach: 60, glowAlpha: 0.18 });

  return (
    <motion.article
      ref={tilt.ref}
      className="cert-card"
      variants={cardVariants}
      style={tilt.style}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <button
        type="button"
        className="cert-card-btn"
        aria-haspopup="dialog"
        aria-label={`View certificate: ${cert.title} — ${cert.issuer}`}
        onClick={(e) => onOpen(e.currentTarget)}
      >
        <motion.span className="cert-glow" aria-hidden="true" style={{ background: tilt.spotlight }} />
        <div className="cert-shot">
          {!hidden && (
            <motion.img
              layoutId={`cert-img-${cert.index}`}
              src={cert.imagePath}
              alt={`${cert.title} certificate issued by ${cert.issuer}`}
              loading="lazy"
            />
          )}
          <span className="cert-shot-scan" aria-hidden="true" />
          <span className="cert-zoom mono mono--xs" aria-hidden="true">
            view full
          </span>
        </div>
        <div className="cert-meta">
          <span className="cert-idx mono mono--xs">{cert.index}</span>
          <span className="cert-cat mono mono--xs">{cert.category.toLowerCase()}</span>
          <h3 className="cert-name">{cert.title}</h3>
          <div className="cert-foot">
            <span className="cert-issuer">{cert.issuer}</span>
            <span className="cert-year mono mono--xs">{cert.year ?? '—'}</span>
          </div>
          <span className="cert-verified" aria-hidden="true">
            <CheckIcon size={12} /> verified
          </span>
        </div>
      </button>
    </motion.article>
  );
}

function CertLightbox({ cert, onClose }: { cert: Certification; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lockScroll();
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      unlockScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="cert-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate — ${cert.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.26 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button ref={closeRef} type="button" className="cert-close" onClick={onClose}>
        <CloseIcon size={18} />
        <span className="sr-only">Close certificate</span>
      </button>

      <motion.figure
        className="cert-figure"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.img
          layoutId={`cert-img-${cert.index}`}
          src={cert.imagePath}
          alt={`${cert.title} certificate issued by ${cert.issuer}`}
        />
        <figcaption className="cert-caption">
          <span className="cert-caption-title">{cert.title}</span>
          <span className="cert-caption-sub mono mono--xs">
            {cert.issuer} // {cert.year ?? '—'}
          </span>
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}

export function ArchiveSection() {
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const active = certifications.find((cert) => cert.index === activeIndex) ?? null;

  const close = useCallback(() => {
    setActiveIndex(null);
    triggerRef.current?.focus();
  }, []);

  return (
    <Chapter
      id="certifications"
      index="03"
      kicker="certifications"
      title="Certifications"
      meta={`${String(certifications.length).padStart(2, '0')} credentials // verified`}
    >
      <motion.div
        className="cert-grid"
        variants={staggerParent(0.09)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      >
        {certifications.map((cert) => (
          <CertCard
            key={cert.index}
            cert={cert}
            hidden={activeIndex === cert.index}
            onOpen={(trigger) => {
              triggerRef.current = trigger;
              setActiveIndex(cert.index);
            }}
          />
        ))}
      </motion.div>

      <AnimatePresence>{active && <CertLightbox cert={active} onClose={close} />}</AnimatePresence>
    </Chapter>
  );
}
