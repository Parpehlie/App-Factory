import { useEffect, useState } from 'react';
import { PROFILE } from '../data/projects';
import { VESTIGES_DATA, type VestigesScreenshot } from '../data/vestiges';
import { isVestigesSubdomain, navigateTo } from '../lib/router';

export function VestigesPage() {
  const [filter, setFilter] = useState<'all' | 'terres' | 'interface'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const onSubdomain = isVestigesSubdomain();

  const hubHref = onSubdomain ? 'https://parphelie.com/' : '/';

  const shots =
    filter === 'all'
      ? VESTIGES_DATA.screenshots
      : VESTIGES_DATA.screenshots.filter((shot) => shot.category === filter);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null);
      } else if (event.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % shots.length));
      } else if (event.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + shots.length) % shots.length,
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, shots.length]);

  const activeShot: VestigesScreenshot | null =
    lightboxIndex !== null && shots[lightboxIndex] ? shots[lightboxIndex] : null;

  return (
    <div className="vestiges-shell">
      <header className="v-header">
        <div className="v-wrap v-header-inner">
          <a
            href={hubHref}
            className="v-back"
            onClick={onSubdomain ? undefined : (e) => navigateTo('/', e)}
          >
            ← Parphélie · Tous les projets
          </a>

          <nav className="v-nav" aria-label="Navigation Vestiges">
            <a href="#captures">Captures</a>
            <a href="#mecaniques">Mécaniques</a>
            <a href="#vaulme">Vaulme</a>
            <a href="#personnages">Personnages</a>
            <a href="#technique">Technique</a>
          </nav>

          <a
            href={VESTIGES_DATA.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="v-header-gh"
          >
            GitHub ↗
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* HERO PIXEL ART */}
        <section className="v-hero">
          <div className="v-wrap v-hero-grid">
            <div className="v-hero-copy">
              <div className="v-brand-row">
                <img
                  src="/images/vestiges/icon-256.png"
                  alt="Icône du jeu Vestiges"
                  className="v-icon is-pixelated"
                  width={72}
                  height={72}
                />
                <span className="v-status-badge">{VESTIGES_DATA.status}</span>
              </div>

              <h1 className="v-title">{VESTIGES_DATA.title}</h1>
              <p className="v-subtitle">{VESTIGES_DATA.subtitle}</p>

              <div className="v-hero-actions">
                <a href="#captures" className="v-btn v-btn-gold">
                  Voir les captures en jeu ↓
                </a>
                <a
                  href={VESTIGES_DATA.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-btn v-btn-stone"
                >
                  Dépôt GitHub (privé) ↗
                </a>
              </div>
              <p className="v-repo-note">
                Le code source est actuellement hébergé sur un dépôt privé pendant la phase de
                développement. Accès testeur ou démo sur simple demande à{' '}
                <a href={PROFILE.emailHref}>{PROFILE.email}</a>.
              </p>
            </div>

            <div className="v-hero-frame">
              <button
                type="button"
                className="v-frame-trigger"
                onClick={() => {
                  setFilter('all');
                  setLightboxIndex(0);
                }}
                aria-label="Agrandir la capture du Bas-Port"
              >
                <img
                  src="/images/vestiges/screen-bas-port-cale.webp"
                  alt="Vestiges : la cale du Bas-Port et le Grand Cerf"
                  className="is-pixelated"
                />
                <span className="v-frame-caption">
                  Le Bas-Port · Le Grand Cerf au pied de la cale
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* GALERIE DE SCREENSHOTS */}
        <section id="captures" className="v-section">
          <div className="v-wrap">
            <div className="v-section-head">
              <div>
                <p className="v-kicker">Aperçus en 480×270 (×4)</p>
                <h2 className="v-h2">Captures de la version actuelle</h2>
              </div>

              <div className="v-tabs" role="tablist" aria-label="Filtrer les captures">
                {(
                  [
                    ['all', `Toutes (${VESTIGES_DATA.screenshots.length})`],
                    ['terres', 'Terres & Combats'],
                    ['interface', 'Campement & Menus'],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={filter === key}
                    className={`v-tab ${filter === key ? 'is-active' : ''}`}
                    onClick={() => {
                      setFilter(key);
                      setLightboxIndex(null);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="v-gallery">
              {shots.map((shot, idx) => (
                <figure key={shot.id} className="v-shot-card">
                  <button
                    type="button"
                    className="v-shot-btn"
                    onClick={() => setLightboxIndex(idx)}
                    aria-label={`Agrandir : ${shot.title}`}
                  >
                    <img src={shot.src} alt={shot.alt} loading="lazy" className="is-pixelated" />
                    <span className="v-shot-zoom">Agrandir</span>
                  </button>
                  <figcaption>
                    <h3>{shot.title}</h3>
                    <p>{shot.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* LES 3 PILIERS */}
        <section id="mecaniques" className="v-section v-section-alt">
          <div className="v-wrap">
            <p className="v-kicker">Système de jeu</p>
            <h2 className="v-h2">Trois piliers, aucune mécanique gratuite</h2>

            <div className="v-pillars">
              {VESTIGES_DATA.pillars.map((pillar) => (
                <article key={pillar.title} className="v-stone-card">
                  <span className="v-card-code">{pillar.code}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </article>
              ))}
            </div>

            <div className="v-rarities" aria-label="Échelle de rareté des objets">
              <span>Raretés du jeu :</span>
              <i className="r-common">Commun</i>
              <i className="r-uncommon">Inhabituel</i>
              <i className="r-rare">Rare</i>
              <i className="r-epic">Épique</i>
              <i className="r-legendary">Légendaire</i>
            </div>
          </div>
        </section>

        {/* RUN & TERRES DE VAULME */}
        <section id="vaulme" className="v-section">
          <div className="v-wrap">
            <p className="v-kicker">Architecture d’une partie</p>
            <h2 className="v-h2">De Vaulme jusqu’à l’Indicible</h2>

            <div className="v-run-flow">
              {VESTIGES_DATA.runFlow.map((stage) => (
                <article key={stage.step} className="v-flow-step">
                  <span>{stage.step}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.text}</p>
                </article>
              ))}
            </div>

            <h3 className="v-h3">Les cinq terres de Vaulme</h3>
            <div className="v-lands-grid">
              {VESTIGES_DATA.lands.map((land) => (
                <article key={land.name} className="v-land-card">
                  <h4>{land.name}</h4>
                  <p>{land.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PERSONNAGES & TECHNIQUE */}
        <section id="personnages" className="v-section v-section-alt">
          <div className="v-wrap v-split">
            <div>
              <p className="v-kicker">Casting</p>
              <h2 className="v-h2">Six silhouettes jouables</h2>
              <div className="v-chars-list">
                {VESTIGES_DATA.characters.map((char) => (
                  <div key={char.name} className="v-char-row">
                    <strong>{char.name}</strong>
                    <span>{char.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div id="technique">
              <p className="v-kicker">Sous le capot</p>
              <h2 className="v-h2">Spécifications techniques</h2>
              <dl className="v-specs">
                {VESTIGES_DATA.techSpecs.map((spec) => (
                  <div key={spec.label} className="v-spec-row">
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className="v-footer">
        <div className="v-wrap v-footer-inner">
          <div>
            <strong>VESTIGES</strong> — un jeu développé par{' '}
            <a href={hubHref} onClick={onSubdomain ? undefined : (e) => navigateTo('/', e)}>
              Raphaël Plassart (Parphélie)
            </a>
            .
          </div>
          <div className="v-footer-meta">
            <span>Police Alkhemikal par jeti, CC BY 4.0</span>
            <a href={PROFILE.emailHref}>{PROFILE.email}</a>
            <a href={hubHref} onClick={onSubdomain ? undefined : (e) => navigateTo('/', e)}>
              Retour à parphelie.com →
            </a>
          </div>
        </div>
      </footer>

      {activeShot && (
        <div
          className="v-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activeShot.title}
          onClick={() => setLightboxIndex(null)}
        >
          <div className="v-lightbox-panel" onClick={(e) => e.stopPropagation()}>
            <div className="v-lightbox-top">
              <strong>{activeShot.title}</strong>
              <button
                type="button"
                className="v-lightbox-close"
                onClick={() => setLightboxIndex(null)}
                aria-label="Fermer l’aperçu"
              >
                Fermer (Échap)
              </button>
            </div>
            <img src={activeShot.src} alt={activeShot.alt} className="is-pixelated" />
            <div className="v-lightbox-foot">
              <p>{activeShot.caption}</p>
              <div className="v-lightbox-nav">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev === null ? 0 : (prev - 1 + shots.length) % shots.length,
                    )
                  }
                >
                  ← Précédent
                </button>
                <span>
                  {(lightboxIndex ?? 0) + 1} / {shots.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % shots.length))
                  }
                >
                  Suivant →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
