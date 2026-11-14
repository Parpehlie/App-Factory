import { useState } from 'react';
import { PROFILE } from '../data/projects';
import { navigateTo } from '../lib/router';

export function ParphelieMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      className="brand-mark"
    >
      <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeOpacity="0.32" strokeWidth="2" />
      <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeOpacity="0.58" strokeWidth="2" />
      <path
        d="M24 44V20h9.2c5.8 0 9.1 3 9.1 7.9 0 5-3.4 8.1-9.3 8.1h-3.8V44H24Zm5.2-12h3.2c2.9 0 4.6-1.2 4.6-3.7 0-2.4-1.7-3.6-4.6-3.6h-3.2V32Z"
        fill="currentColor"
      />
      <circle cx="48" cy="16" r="4.5" fill="var(--beacon, #ffd84d)" />
    </svg>
  );
}

export function SiteHeader({ onDark = true }: { onDark?: boolean }) {
  const [open, setOpen] = useState(false);

  const closeAndGo = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    navigateTo(href, e);
  };

  return (
    <>
      <header className={`hub-header ${onDark ? 'hub-header--on-dark' : 'hub-header--on-light'}`}>
        <div className="wrap hub-header-inner">
          <a href="/" className="hub-brand" onClick={closeAndGo('/')} aria-label="Parphélie, accueil">
            <ParphelieMark size={36} />
            <span>parphélie</span>
          </a>

          <nav className="hub-nav" aria-label="Navigation principale">
            <a href="/#atlas" onClick={closeAndGo('/#atlas')}>
              Sites artisans (Atlas)
            </a>
            <a href="/#projets" onClick={closeAndGo('/#projets')}>
              Projets
            </a>
            <a href="/vestiges" onClick={closeAndGo('/vestiges')}>
              Vestiges
            </a>
            <a href="/#contact" onClick={closeAndGo('/#contact')}>
              Contact
            </a>
          </nav>

          <a href={PROFILE.phoneHref} className="hub-nav-cta">
            {PROFILE.phoneDisplay}
          </a>

          <button
            type="button"
            className="hub-menu-toggle"
            aria-expanded={open}
            aria-controls="hub-mobile-drawer"
            onClick={() => setOpen(true)}
          >
            <span className="hub-menu-lines" aria-hidden="true" />
            <span>Menu</span>
          </button>
        </div>
      </header>

      <div id="hub-mobile-drawer" className="hub-drawer" hidden={!open}>
        <div className="wrap hub-header-inner">
          <a href="/" className="hub-brand" onClick={closeAndGo('/')}>
            <ParphelieMark size={34} />
            <span>parphélie</span>
          </a>
          <button type="button" className="hub-menu-toggle" onClick={() => setOpen(false)}>
            <span>Fermer</span>
          </button>
        </div>
        <div className="wrap hub-drawer-body">
          <nav className="hub-drawer-nav" aria-label="Menu mobile">
            <a href="/#atlas" onClick={closeAndGo('/#atlas')}>
              Sites artisans (Atlas)
            </a>
            <a href="/#projets" onClick={closeAndGo('/#projets')}>
              Tous mes projets
            </a>
            <a href="/vestiges" onClick={closeAndGo('/vestiges')}>
              Vestiges (Jeu vidéo)
            </a>
            <a href="/#approche" onClick={closeAndGo('/#approche')}>
              Approche
            </a>
            <a href="/#contact" onClick={closeAndGo('/#contact')}>
              Me contacter
            </a>
          </nav>
          <div className="hub-drawer-foot">
            <a href={PROFILE.phoneHref} className="btn btn-beacon">
              Appeler le {PROFILE.phoneDisplay}
            </a>
            <a href={PROFILE.emailHref} className="hub-drawer-mail">
              {PROFILE.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
