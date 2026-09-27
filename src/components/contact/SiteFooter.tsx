import { profile } from '../../data/portfolio';
import { ArrowUpIcon } from '../foundation/Icons';

/**
 * SiteFooter — closing frame: brand mark, attribution, back-to-top control.
 * All values from the verified data file.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-row">
        <div className="site-footer-brand">
          <img src={profile.logoMarkPath} alt={`${profile.name} logo`} loading="lazy" />
          <span className="mono">{profile.title.toLowerCase()}</span>
        </div>

        <div className="site-footer-meta mono mono--xs">
          <span>© 2026 {profile.name}</span>
        </div>

        <a className="to-top" href="#about">
          back to top <ArrowUpIcon size={13} />
        </a>
      </div>
    </footer>
  );
}
