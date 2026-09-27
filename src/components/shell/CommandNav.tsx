import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { profile, navigation, navigationIds } from '../../data/portfolio';
import { useActiveSection } from '../../lib/activeSection';
import { lockScroll, unlockScroll } from '../../lib/scrollLock';
import { EASE_INOUT } from '../../lib/anim';
import { MenuIcon, CloseIcon } from '../foundation/Icons';

/**
 * CommandNav — the fixed chapter control. Desktop: left command rail (logo
 * command point, 01–06 index with active state, scroll-progress spine).
 * Mobile: compact top bar + full-screen chapter sheet.
 */

export function CommandNav() {
  const active = useActiveSection(navigationIds);
  const { scrollYProgress } = useScroll();
  const spine = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  const [sheetOpen, setSheetOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const activeItem = navigation.find((item) => item.id === active) ?? navigation[0];

  // sheet lifecycle: scroll lock + Esc + focus handoff
  useEffect(() => {
    if (!sheetOpen) return;
    const menuBtn = menuBtnRef.current;
    lockScroll();
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheetOpen(false);
      if (e.key === 'Tab') {
        // minimal trap: the sheet links + brand are the whole focusable set
        const focusables = document.querySelectorAll<HTMLElement>('.sheet a, .sheet button');
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
      menuBtn?.focus();
    };
  }, [sheetOpen]);

  return (
    <>
      {/* -- desktop command rail -- */}
      <div className="rail">
        <a className="rail-command" href="#about" aria-label="Mohamed Taher Elrefaey — back to top">
          <img src={profile.logoMarkPath} alt="" />
        </a>

        <nav className="rail-index" aria-label="Chapters">
          <span className="rail-spine" aria-hidden="true">
            <motion.span className="rail-spine-fill" style={{ scaleY: spine }} />
          </span>
          {navigation.map((item) => (
            <a
              key={item.id}
              className="rail-item"
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
            >
              <span className="rail-num">{item.index}</span>
              <span className="rail-label" aria-hidden="true">
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        <span className="rail-foot" aria-hidden="true">
          01 — 06
        </span>
      </div>

      {/* -- mobile top bar -- */}
      <header className="topbar">
        <a className="topbar-brand" href="#about" aria-label="Mohamed Taher Elrefaey — back to top">
          <img src={profile.logoMarkPath} alt="" />
        </a>
        <span className="topbar-current">
          <strong>{activeItem.index}</strong> // {activeItem.label}
        </span>
        <button
          ref={menuBtnRef}
          type="button"
          className="topbar-menu"
          aria-expanded={sheetOpen}
          aria-controls="chapter-sheet"
          onClick={() => setSheetOpen(true)}
        >
          <MenuIcon size={22} />
          <span className="sr-only">Open chapter index</span>
        </button>
      </header>

      {/* -- chapter sheet (mobile) -- */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            id="chapter-sheet"
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Chapters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE_INOUT }}
          >
            <nav className="sheet-list">
              {navigation.map((item, i) => (
                <motion.a
                  key={item.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  className="sheet-item"
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                  onClick={() => setSheetOpen(false)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.045, duration: 0.35, ease: EASE_INOUT }}
                >
                  <span className="mono">{item.index}</span>
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <div className="sheet-foot">
              <button type="button" className="to-top" onClick={() => setSheetOpen(false)}>
                <CloseIcon size={14} />
                close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
