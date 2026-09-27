import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { profile } from '../../data/portfolio';
import { prefersFinePointer, prefersReducedMotion } from '../../lib/prefs';
import { EASE_INOUT } from '../../lib/anim';

/**
 * PortraitScope — the forensic treatment of the real portrait: bracket frame,
 * coordinate rulers, scanline sweep (entrance + hover), caption with a
 * verified status. Static under reduced motion / coarse pointers — the image
 * simply renders, never gated behind an effect.
 */

const sweepSupported = () => !prefersReducedMotion() && prefersFinePointer();

export function PortraitScope({ booted }: { booted: boolean }) {
  const [scanRun, setScanRun] = useState(0);
  const initialScan = useRef(false);

  // one entrance sweep after the frame wipes in (fine pointers + motion only)
  useEffect(() => {
    if (!booted || initialScan.current || !sweepSupported()) return;
    initialScan.current = true;
    const t = window.setTimeout(() => setScanRun((n) => n + 1), 500);
    return () => window.clearTimeout(t);
  }, [booted]);

  return (
    <motion.figure
      className="scope"
      initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={booted ? { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' } : {}}
      transition={{ duration: 0.9, ease: EASE_INOUT, delay: 0.25 }}
    >
      <div className="scope ticks ticks--signal">
        <div className="scope-frame">
          <img src={profile.portraitPath} alt="Portrait of Mohamed Taher Elrefaey" width={800} height={1000} fetchPriority="high" />
          {sweepSupported() && <span key={scanRun} className="scan-sweep is-running" aria-hidden="true" />}
          {/* evidence target markers — decorative, appear after the scan */}
          {sweepSupported() && (
            <>
              <span className="scope-marker scope-marker--a" aria-hidden="true" />
              <span className="scope-marker scope-marker--b" aria-hidden="true" />
            </>
          )}
        </div>

        <span className="scope-ruler scope-ruler--left" aria-hidden="true">
          <span>SCAN FIELD</span>
          <i />
          <i />
          <span>4 : 5</span>
        </span>
        <span className="scope-ruler scope-ruler--right" aria-hidden="true">
          <span>FOCUS LOCK</span>
          <i />
          <i />
          <span>IMG // 01</span>
        </span>
      </div>

      <dl className="scope-meta mono" aria-label="Scanner metadata (portfolio information)">
        <div>
          <dt>role</dt>
          <dd>soc analyst — incident response</dd>
        </div>
        <div>
          <dt>focus</dt>
          <dd>siem · dfir · log analysis</dd>
        </div>
        <div>
          <dt>status</dt>
          <dd className="scope-meta-status">training in progress</dd>
        </div>
      </dl>
    </motion.figure>
  );
}
