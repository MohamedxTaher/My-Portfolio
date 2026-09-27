import { profile } from '../../data/portfolio';
import { Hero } from './Hero';
import { IdentityCore } from './IdentityCore';

/**
 * AboutSection — chapter 01. The hero carries the identity (name, title,
 * portrait); the identity core beneath carries the verified statement,
 * evidence counters and traits. No second name block, no duplicated hero.
 */
export function AboutSection({ booted }: { booted: boolean }) {
  return (
    <section id="about" className="section" aria-label={`About — ${profile.name}`}>
      <Hero booted={booted} />
      <div className="container">
        <IdentityCore />
      </div>
    </section>
  );
}
