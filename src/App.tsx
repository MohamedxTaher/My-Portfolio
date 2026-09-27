import { useCallback, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Atmosphere } from './components/foundation/Atmosphere';
import { SignalField } from './components/foundation/SignalField';
import { EntrySequence } from './components/shell/EntrySequence';
import { CommandNav } from './components/shell/CommandNav';
import { ScanCursor } from './components/shell/ScanCursor';
import { ScrollProgress } from './components/shell/ScrollProgress';
import { AboutSection } from './components/about/AboutSection';
import { TraceSection } from './components/experience/TraceSection';
import { ArchiveSection } from './components/certifications/ArchiveSection';
import { CapabilitySection } from './components/skills/CapabilitySection';
import { CaseFilesSection } from './components/projects/CaseFilesSection';
import { ChannelSection } from './components/contact/ChannelSection';
import { SiteFooter } from './components/contact/SiteFooter';

/**
 * AppShell — fixed atmosphere + canvas signal field + command navigation +
 * the six chapters (01 About → 06 Contact) + scan cursor. The entry sequence
 * gates the hero reveal only (content is never behind an animation gate for
 * reduced-motion or repeat sessions).
 */
export default function App() {
  const [booted, setBooted] = useState(false);
  const handleBooted = useCallback(() => setBooted(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <SignalField />
      <Atmosphere />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <EntrySequence onDone={handleBooted} />
      <ScrollProgress />
      <CommandNav />

      <main id="main">
        <AboutSection booted={booted} />
        <TraceSection />
        <ArchiveSection />
        <CapabilitySection />
        <CaseFilesSection />
        <ChannelSection />
      </main>

      <SiteFooter />
      <ScanCursor />
    </MotionConfig>
  );
}
