import { PROFILE, PROJECTS } from '../data/projects';
import { navigateTo } from '../lib/router';
import { ParphelieMark } from './SiteHeader';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="hub-footer">
      <div className="wrap">
        <div className="hub-footer-top">
          <div className="hub-footer-brand">
            <a href="/" className="hub-brand" onClick={(e) => navigateTo('/', e)}>
              <ParphelieMark size={34} />
              <span>parphélie</span>
            </a>
            <p className="hub-footer-tag">
              L’atelier numérique de <strong>Raphaël Plassart</strong> : sites rapides pour artisans &amp;
              commerçants (Atlas), logiciels ouverts et jeux vidéo.
            </p>
            <div className="hub-footer-direct">
              <a href={PROFILE.phoneHref} className="hub-footer-phone">
                {PROFILE.phoneDisplay}
              </a>
              <a href={PROFILE.emailHref} className="hub-footer-mail">
                {PROFILE.email}
              </a>
            </div>
          </div>

          <div className="hub-footer-cols">
            <div>
              <span>Activité &amp; Projets</span>
              <a href="https://atlas.raphael-plassart.com/" target="_blank" rel="noopener noreferrer">
                Atlas (Sites artisans) ↗
              </a>
              {PROJECTS.map((project) => (
                <a
                  key={project.id}
                  href={project.href}
                  target={project.external ? '_blank' : undefined}
                  rel={project.external ? 'noopener noreferrer' : undefined}
                  onClick={project.external ? undefined : (e) => navigateTo(project.href, e)}
                >
                  {project.title}
                  {project.external ? ' ↗' : ''}
                </a>
              ))}
            </div>

            <div>
              <span>Réseaux &amp; Code</span>
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
              <a href="/#contact" onClick={(e) => navigateTo('/#contact', e)}>
                Formulaire de contact
              </a>
            </div>

            <div>
              <span>Informations légales</span>
              <a href="/terms" onClick={(e) => navigateTo('/terms', e)}>
                Mentions légales
              </a>
              <a href="/privacy" onClick={(e) => navigateTo('/privacy', e)}>
                Confidentialité
              </a>
            </div>
          </div>
        </div>

        <div className="hub-footer-bottom">
          <span>
            © {year} Parphélie · {PROFILE.name} (EI · SIREN {PROFILE.legal.siren})
          </span>
          <span>{PROFILE.location}</span>
        </div>
      </div>
    </footer>
  );
}
