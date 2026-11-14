import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/hub.css';
import './styles/vestiges.css';
import './styles/ironhale.css';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { isVestigesSubdomain, navigateTo, normalizePath } from './lib/router';
import { HubPage } from './pages/HubPage';
import { IronhalePage, IronhalePrivacyPage, LegalPage } from './pages/IronhalePages';
import { VestigesPage } from './pages/VestigesPage';

const ROUTE_META: Record<string, { title: string; theme: string }> = {
  '/': {
    title: 'Parphélie · Raphaël Plassart — Sites pour artisans (Atlas) & projets numériques',
    theme: '#1f3bd9',
  },
  '/vestiges': {
    title: 'Vestiges — Survivors-like en pixel art isométrique · Raphaël Plassart',
    theme: '#141524',
  },
  '/projects/ironhale': {
    title: 'IronHale — La force, pour longtemps · Parphélie',
    theme: '#f5f0e7',
  },
  '/projects/ironhale/privacy': {
    title: 'Politique de confidentialité d’IronHale · Parphélie',
    theme: '#f5f0e7',
  },
  '/ironhale/privacy': {
    title: 'Politique de confidentialité d’IronHale · Parphélie',
    theme: '#f5f0e7',
  },
  '/privacy': {
    title: 'Politique de confidentialité · Parphélie',
    theme: '#f5f0e7',
  },
  '/terms': {
    title: 'Mentions légales · Parphélie',
    theme: '#f5f0e7',
  },
};

function NotFoundPage() {
  return (
    <div className="hub-shell">
      <SiteHeader onDark={false} />
      <main id="main-content" className="wrap" style={{ paddingBlock: '180px 120px' }}>
        <p className="section-eyebrow">Erreur 404</p>
        <h1 className="section-title" style={{ maxWidth: '16ch' }}>
          Cette page a pris un autre chemin.
        </h1>
        <p className="section-intro" style={{ marginTop: '16px' }}>
          Revenez à l’accueil pour découvrir Atlas (sites pour artisans et commerçants) et tous
          mes projets.
        </p>
        <div style={{ marginTop: '28px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <a href="/" className="btn btn-primary" onClick={(e) => navigateTo('/', e)}>
            Retour à l’accueil →
          </a>
          <a href="/vestiges" className="btn" style={{ borderColor: 'var(--line-strong)' }} onClick={(e) => navigateTo('/vestiges', e)}>
            Voir Vestiges
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const onVestigesHost = isVestigesSubdomain();
  const effectivePath = onVestigesHost && path === '/' ? '/vestiges' : path;

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const meta = ROUTE_META[effectivePath] ?? {
      title: 'Page introuvable · Parphélie',
      theme: '#f3f4f1',
    };
    document.title = meta.title;
    const themeTag = document.querySelector('meta[name="theme-color"]');
    if (themeTag) themeTag.setAttribute('content', meta.theme);
  }, [effectivePath]);

  switch (effectivePath) {
    case '/':
      return <HubPage />;
    case '/vestiges':
      return <VestigesPage />;
    case '/projects/ironhale':
      return <IronhalePage />;
    case '/projects/ironhale/privacy':
    case '/ironhale/privacy':
      return <IronhalePrivacyPage />;
    case '/privacy':
      return <LegalPage />;
    case '/terms':
      return <LegalPage terms />;
    default:
      return <NotFoundPage />;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
