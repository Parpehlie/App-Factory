import { useEffect, useState } from 'react';
import { ContactForm } from '../components/ContactForm';
import { ContourField } from '../components/ContourField';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import {
  ATLAS_HIGHLIGHT,
  PROFILE,
  PROJECTS,
  type ProjectCategory,
  type ProjectItem,
} from '../data/projects';
import { navigateTo } from '../lib/router';

function usePageSpeedSeconds(): string {
  const [label, setLabel] = useState('0,4 s');
  useEffect(() => {
    const t = window.setTimeout(() => {
      const nav = performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined;
      const ms = nav?.domContentLoadedEventEnd || performance.now();
      const clamped = Math.max(120, Math.min(ms, 2400));
      setLabel(`${(clamped / 1000).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s`);
    }, 500);
    return () => window.clearTimeout(t);
  }, []);
  return label;
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const isExternal = project.external;

  return (
    <article
      className={`project-tile project-tile--${project.id}`}
      style={
        {
          '--tile-bg': project.theme.bg,
          '--tile-fg': project.theme.fg,
          '--tile-muted': project.theme.muted,
          '--tile-accent': project.theme.accent,
          '--tile-accent-text': project.theme.accentText,
          '--tile-border': project.theme.border,
          '--tile-badge-bg': project.theme.badgeBg,
        } as React.CSSProperties
      }
    >
      <a
        href={project.href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        onClick={isExternal ? undefined : (e) => navigateTo(project.href, e)}
        className="project-tile-media"
        aria-label={`${project.title} — ${project.ctaLabel}`}
      >
        {project.visualType === 'ironhale' ? (
          <div className="project-visual-ironhale">
            <div className="ironhale-ring" aria-hidden="true" />
            <img src={project.image} alt={project.imageAlt ?? project.title} loading="lazy" />
          </div>
        ) : (
          <img
            src={project.image}
            alt={project.imageAlt ?? project.title}
            loading="lazy"
            className={project.id === 'vestiges' ? 'is-pixelated' : undefined}
          />
        )}
        <span className="project-tile-number">{project.number}</span>
        {project.id === 'portfolio' && (
          <span className="project-live-dot">
            <i aria-hidden="true" /> FULL-STACK
          </span>
        )}
        {project.id === 'raphotos' && <span className="project-cc-pill">CC BY-NC</span>}
      </a>

      <div className="project-tile-body">
        <p className="project-tile-kicker">{project.kicker}</p>
        <h3 className={`project-tile-title ${project.id === 'vestiges' ? 'is-alkhemikal' : ''} ${project.id === 'raphotos' ? 'is-serif-italic' : ''}`}>
          {project.title}
        </h3>
        <p className="project-tile-tagline">{project.tagline}</p>
        <p className="project-tile-desc">{project.description}</p>

        <ul className="project-tile-tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <div className="project-tile-actions">
          <a
            href={project.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            onClick={isExternal ? undefined : (e) => navigateTo(project.href, e)}
            className="project-tile-btn"
          >
            {project.ctaLabel} {isExternal ? '↗' : '→'}
          </a>
          {project.secondaryHref && project.secondaryLabel && (
            <a
              href={project.secondaryHref}
              target={project.secondaryExternal ? '_blank' : undefined}
              rel={project.secondaryExternal ? 'noopener noreferrer' : undefined}
              className="project-tile-secondary"
            >
              {project.secondaryLabel} {project.secondaryExternal ? '↗' : '→'}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function HubPage() {
  const [filter, setFilter] = useState<'all' | ProjectCategory>('all');
  const speed = usePageSpeedSeconds();

  const visibleProjects =
    filter === 'all' ? PROJECTS : PROJECTS.filter((project) => project.category === filter);

  return (
    <div className="hub-shell">
      <SiteHeader onDark />

      <main id="main-content">
        {/* HERO — Cobalt Relief avec courbes topographiques et accès direct */}
        <section className="band hero-band">
          <ContourField className="band-field" />
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="hero-eyebrow">
                <span className="beacon-dot" aria-hidden="true" />
                Raphaël Plassart · Développeur web freelance
              </p>

              <h1 className="hero-title">
                Des sites qui font travailler les artisans, et des produits qui vont au bout.
              </h1>

              <p className="hero-lead">
                Vous avez reçu un message de <strong>{PROFILE.email}</strong> ? Bienvenue chez{' '}
                <strong>Parphélie</strong>. J’accompagne les artisans, commerçants et TPE avec{' '}
                <strong>Atlas</strong>, tout en développant des logiciels, jeux et créations ouverts.
              </p>

              <div className="hero-actions">
                <a
                  href={ATLAS_HIGHLIGHT.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-beacon"
                >
                  <span>Découvrir Atlas — Sites pour artisans</span>
                  <svg
                    className="btn-icon btn-icon--ne"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4.5 11.5L11.5 4.5M11.5 4.5H5.75M11.5 4.5V10.25"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a href="#projets" className="btn btn-light-outline">
                  <span>Voir tous mes projets</span>
                  <svg
                    className="btn-icon btn-icon--down"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 3.25V12.75M8 12.75L4.25 9M8 12.75L11.75 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              <div className="hero-quick-contact">
                <a href={PROFILE.phoneHref} className="quick-chip">
                  <span className="quick-chip-label">Téléphone direct</span>
                  <strong>{PROFILE.phoneDisplay}</strong>
                </a>
                <a href={PROFILE.emailHref} className="quick-chip">
                  <span className="quick-chip-label">E-mail</span>
                  <strong>{PROFILE.email}</strong>
                </a>
              </div>
            </div>

            <aside className="hero-portrait-card" aria-label="Présentation de Raphaël Plassart">
              <div className="portrait-frame">
                <img
                  src="/images/raphael-plassart.webp"
                  alt="Portrait de Raphaël Plassart, développeur web freelance"
                  width={640}
                  height={960}
                />
                <span className="portrait-badge">Un seul interlocuteur</span>
              </div>
              <div className="portrait-caption">
                <div>
                  <strong>{PROFILE.name}</strong>
                  <p>{PROFILE.location}</p>
                </div>
                <a href="#contact" className="portrait-contact-link">
                  Écrire →
                </a>
              </div>
            </aside>
          </div>

          <div className="wrap">
            <p className="hero-speed" aria-live="polite">
              Cette page s’est affichée en <strong>{speed}</strong>. Vos clients méritent la même réactivité sur mobile.
            </p>
          </div>
        </section>

        {/* SECTION 1 — PRIORITÉ N°1 : ATLAS (ARTISANS & COMMERÇANTS) */}
        <section id="atlas" className="section atlas-section" aria-labelledby="atlas-title">
          <div className="wrap">
            <div className="atlas-spotlight">
              <ContourField
                className="atlas-spotlight-field"
                color="31,59,217"
                levels={9}
                cell={18}
                scale={0.0038}
                interactive={false}
              />

              <div className="atlas-head">
                <div>
                  <span className="atlas-pill">{ATLAS_HIGHLIGHT.badge}</span>
                  <h2 id="atlas-title" className="atlas-title">
                    {ATLAS_HIGHLIGHT.title}
                  </h2>
                  <p className="atlas-lead">{ATLAS_HIGHLIGHT.lead}</p>
                  <p className="atlas-promise">{ATLAS_HIGHLIGHT.promise}</p>
                </div>

                <div className="atlas-kpi-box">
                  <span className="atlas-kpi-value">{ATLAS_HIGHLIGHT.speedMetric}</span>
                  <span className="atlas-kpi-label">{ATLAS_HIGHLIGHT.speedLabel}</span>
                </div>
              </div>

              <div className="atlas-doors">
                {ATLAS_HIGHLIGHT.offers.map((offer) => (
                  <a
                    key={offer.title}
                    href={offer.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="atlas-door"
                  >
                    <p className="atlas-door-label">{offer.label}</p>
                    <h3>{offer.title}</h3>
                    <p className="atlas-door-text">{offer.text}</p>
                    <ul className="atlas-chips">
                      {offer.chips.map((chip) => (
                        <li key={chip}>{chip}</li>
                      ))}
                    </ul>
                    <span className="atlas-door-link">Voir l’offre sur Atlas ↗</span>
                  </a>
                ))}
              </div>

              <div className="atlas-case">
                <div className="atlas-case-visuals">
                  <div className="atlas-case-main">
                    <img
                      src={ATLAS_HIGHLIGHT.testimonial.mainShot}
                      alt={ATLAS_HIGHLIGHT.testimonial.mainAlt}
                      loading="lazy"
                    />
                  </div>
                  <div className="atlas-case-companion">
                    <img
                      src={ATLAS_HIGHLIGHT.testimonial.companionShot}
                      alt={ATLAS_HIGHLIGHT.testimonial.companionAlt}
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="atlas-case-copy">
                  <span className="atlas-case-kicker">Réalisation client</span>
                  <h3>{ATLAS_HIGHLIGHT.testimonial.client}</h3>
                  <p className="atlas-case-role">{ATLAS_HIGHLIGHT.testimonial.role}</p>
                  <blockquote>« {ATLAS_HIGHLIGHT.testimonial.quote} »</blockquote>
                  <p className="atlas-case-author">— {ATLAS_HIGHLIGHT.testimonial.author}</p>

                  <div className="atlas-cta-row">
                    <a
                      href={ATLAS_HIGHLIGHT.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Visiter atlas.raphael-plassart.com ↗
                    </a>
                    <a
                      href={ATLAS_HIGHLIGHT.caseStudyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-inline"
                    >
                      Lire l’étude de cas ↗
                    </a>
                    <a href={PROFILE.phoneHref} className="link-inline">
                      Appeler le {PROFILE.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — PROJETS & PRODUITS */}
        <section id="projets" className="section projects-section" aria-labelledby="projects-title">
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="section-eyebrow">Écosystème · Code, jeux &amp; image</p>
                <h2 id="projects-title" className="section-title">
                  Tous mes projets et activités.
                </h2>
              </div>
              <p className="section-intro">
                En parallèle d’Atlas, je conçois des outils développeur, des jeux indépendants et des
                espaces personnels. Chaque carte renvoie directement vers son univers.
              </p>
            </div>

            <div className="filter-bar" role="tablist" aria-label="Filtrer les projets">
              {(
                [
                  ['all', `Tous (${PROJECTS.length})`],
                  ['tech', 'Ingénierie & Tech'],
                  ['games', 'Jeux & Culture'],
                  ['creative', 'Mobile & Photo'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={filter === key}
                  className={`filter-pill ${filter === key ? 'is-active' : ''}`}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="projects-grid">
              {visibleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — MANIÈRE DE TRAVAILLER */}
        <section id="approche" className="section approach-section" aria-labelledby="approach-title">
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="section-eyebrow">Méthode</p>
                <h2 id="approach-title" className="section-title">
                  Un chemin clair, sans jargon d’agence.
                </h2>
              </div>
              <p className="section-intro">
                Que ce soit pour le site vitrine d’un artisan ou l’architecture d’un produit logiciel,
                le fonctionnement reste simple et direct.
              </p>
            </div>

            <ol className="approach-grid">
              <li>
                <span className="approach-num">01</span>
                <h3>Un seul interlocuteur</h3>
                <p>
                  La personne qui décroche au {PROFILE.phoneDisplay} est celle qui écoute votre métier,
                  dessine l’interface et écrit le code jusqu’à la mise en ligne.
                </p>
              </li>
              <li>
                <span className="approach-num">02</span>
                <h3>La vitesse par politesse</h3>
                <p>
                  Pas de thème lourd ni d’usine à gaz : des pages pensées pour s’ouvrir instantanément
                  sur téléphone en 4G, avec un référencement local soigné.
                </p>
              </li>
              <li>
                <span className="approach-num">03</span>
                <h3>Montrer plutôt que promettre</h3>
                <p>
                  Des réalisations vérifiables en ligne, des projets open source utilisés pour de vrai
                  et un accompagnement durable après la livraison.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* SECTION 4 — BANDEAU DE CONTACT FINAL */}
        <section id="contact" className="band band-ink contact-band" aria-labelledby="contact-title">
          <ContourField className="band-field" levels={11} />
          <div className="wrap contact-grid">
            <div className="contact-copy">
              <p className="contact-eyebrow">Discutons de votre projet</p>
              <h2 id="contact-title" className="contact-title">
                Un site à créer ?<br />
                Une question ?
              </h2>
              <p className="contact-lead">
                Artisan, commerçant, indépendant ou porteur de projet : appelez-moi directement ou
                laissez-moi un mot ici. Réponse personnelle sous 24 à 48 h.
              </p>

              <div className="contact-direct-links">
                <a href={PROFILE.phoneHref} className="contact-big-link">
                  <span className="contact-big-label">Par téléphone (appel ou SMS)</span>
                  <strong>{PROFILE.phoneDisplay}</strong>
                </a>
                <a href={PROFILE.emailHref} className="contact-big-link">
                  <span className="contact-big-label">Par e-mail</span>
                  <strong>{PROFILE.email}</strong>
                </a>
              </div>
            </div>

            <div className="contact-form-wrap">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
