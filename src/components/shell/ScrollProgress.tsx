import { motion, useScroll, useSpring } from 'motion/react';

/**
 * ScrollProgress — a thin signal bar pinned to the top of the viewport that
 * tracks read progress through the document. Spring-smoothed so it glides
 * rather than snaps; reduced-motion users still get an accurate (un-sprung)
 * indicator via MotionConfig.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}
