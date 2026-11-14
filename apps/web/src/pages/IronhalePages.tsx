import { PROFILE } from '../data/projects';
import { navigateTo } from '../lib/router';

const Arrow = () => <span aria-hidden="true">↗</span>;

function IhLogo() {
  return (
    <a className="ih-logo" href="/" onClick={(e) => navigateTo('/', e)} aria-label="Parphélie, accueil">
      <span className="ih-logo-mark">P</span>
      <span>parphélie</span>
    </a>
  );
}

function IhHeader() {
  return (
    <header className="ih-site-header">
      <IhLogo />
      <nav aria-label="Navigation">
        <a href="/" onClick={(e) => navigateTo('/', e)}>
          Tous les projets
        </a>
        <a href="/projects/ironhale" onClick={(e) => navigateTo('/projects/ironhale', e)}>
          IronHale
        </a>
        <a href={PROFILE.emailHref} className="ih-nav-contact">
          Nous écrire <Arrow />
        </a>
      </nav>
    </header>
  );
}

function IhFooter() {
  return (
    <footer className="ih-footer">
      <div className="ih-footer-main">
        <IhLogo />
        <p>
          Des applications pensées pour
          <br />
          la vraie vie.
        </p>
      </div>
      <div className="ih-footer-links">
        <div>
          <span>Explorer</span>
          <a href="/" onClick={(e) => navigateTo('/', e)}>
            Hub Parphélie
          </a>
          <a href="/projects/ironhale" onClick={(e) => navigateTo('/projects/ironhale', e)}>
            IronHale
          </a>
        </div>
        <div>
          <span>Légal</span>
          <a href="/privacy" onClick={(e) => navigateTo('/privacy', e)}>
            Confidentialité
          </a>
          <a href="/terms" onClick={(e) => navigateTo('/terms', e)}>
            Mentions légales
          </a>
        </div>
        <div>
          <span>Contact</span>
          <a href={PROFILE.emailHref}>{PROFILE.email}</a>
          <a href={PROFILE.phoneHref}>{PROFILE.phoneDisplay}</a>
        </div>
      </div>
      <div className="ih-footer-bottom">
        <small>© {new Date().getFullYear()} Parphélie · {PROFILE.name}</small>
        <small>Conçu en France, avec attention.</small>
      </div>
    </footer>
  );
}

function PhoneMockup() {
  return (
    <div className="ih-phone">
      <div className="ih-phone-screen">
        <div className="ih-phone-top">
          <span>9:41</span>
          <span>● ●</span>
        </div>
        <p className="ih-phone-kicker">BONJOUR</p>
        <h4>
          Prêt à devenir
          <br />
          plus fort ?
        </h4>
        <div className="ih-workout">
          <div className="ih-workout-head">
            <span>SÉANCE DU JOUR</span>
            <b>42 min</b>
          </div>
          <h5>Force complète</h5>
          <p>6 exercices · Modéré</p>
          <div className="ih-exercise-lines">
            <i />
            <i />
            <i />
          </div>
          <button type="button">Démarrer la séance</button>
        </div>
        <div className="ih-streak">
          <span>Progression</span>
          <b>+ 12%</b>
        </div>
      </div>
    </div>
  );
}

export function IronhalePage() {
  return (
    <div className="ih-shell">
      <IhHeader />
      <main className="ih-ironhale">
        <section className="ih-project-hero">
          <div className="ih-project-intro">
            <a className="ih-back" href="/#projets" onClick={(e) => navigateTo('/#projets', e)}>
              ← Retour au hub Parphélie
            </a>
            <p className="ih-section-label">Application Mobile · Studio Parphélie</p>
            <h1>
              Iron<span>Hale</span>
            </h1>
            <h2>
              La force,
              <br />
              <em>pour longtemps.</em>
            </h2>
            <p>
              Un programme de musculation adaptatif pensé pour les plus de 50 ans — attentif à
              votre rythme, vos articulations et vos progrès.
            </p>
            <div className="ih-store-row">
              <span className="ih-store-badge">
                {' '}
                <small>
                  Bientôt sur
                  <br />
                  <b>l’App Store</b>
                </small>
              </span>
              <span className="ih-store-badge">
                ▶{' '}
                <small>
                  Bientôt sur
                  <br />
                  <b>Google Play</b>
                </small>
              </span>
            </div>
          </div>
          <div className="ih-phone-stage">
            <div className="ih-gold-disc" />
            <PhoneMockup />
            <span className="ih-float-note ih-note-a">
              Récupération
              <br />
              <b>à votre rythme</b>
            </span>
            <span className="ih-float-note ih-note-b">
              Programme
              <br />
              <b>adaptatif</b>
            </span>
          </div>
        </section>

        <section className="ih-problem">
          <p className="ih-section-label">Le constat</p>
          <div>
            <h2>
              Votre corps évolue.
              <br />
              Votre entraînement
              <br />
              <em>devrait aussi.</em>
            </h2>
            <p>
              Les applications de musculation classiques appliquent les mêmes règles à tout le
              monde. IronHale fait autrement : il prend en compte votre récupération et vous propose
              une alternative quand un mouvement ne vous convient pas.
            </p>
          </div>
        </section>

        <section className="ih-features">
          <p className="ih-section-label">Pensé pour vous</p>
          <div className="ih-feature-grid">
            <article>
              <span>↝</span>
              <h3>Un programme qui s’adapte</h3>
              <p>Votre progression évolue selon vos séances, votre énergie et le temps dont vous disposez.</p>
            </article>
            <article>
              <span>◎</span>
              <h3>Vos articulations écoutées</h3>
              <p>Genou, épaule ou dos sensible ? Chaque exercice dispose d’une alternative équivalente.</p>
            </article>
            <article>
              <span>◴</span>
              <h3>La récupération intégrée</h3>
              <p>Des fenêtres de repos plus réalistes pour progresser sans brûler les étapes.</p>
            </article>
            <article>
              <span>↗</span>
              <h3>Vos progrès, lisiblement</h3>
              <p>Suivez votre régularité et votre force sans tableaux complexes ni métriques inutiles.</p>
            </article>
          </div>
        </section>

        <section className="ih-promise">
          <div className="ih-quote-mark">“</div>
          <blockquote>
            Rester fort, ce n’est pas
            <br />
            regarder en arrière.
            <br />
            <em>C’est investir dans la suite.</em>
          </blockquote>
        </section>

        <section className="ih-project-cta">
          <img src="/ironhale-icon.png" alt="" />
          <div>
            <p className="ih-section-label">IronHale arrive bientôt</p>
            <h2>
              Votre prochaine
              <br />
              force commence ici.
            </h2>
            <a
              href={`mailto:${PROFILE.email}?subject=${encodeURIComponent('IronHale — Liste d’attente')}`}
            >
              Être prévenu du lancement <Arrow />
            </a>
          </div>
        </section>
      </main>
      <IhFooter />
    </div>
  );
}

const privacySections = [
  [
    'Responsable du traitement',
    `Parphélie — ${PROFILE.name}, entrepreneur individuel — est responsable des traitements décrits sur cette page. Contact : ${PROFILE.email} — ${PROFILE.phoneDisplay}.`,
  ],
  [
    'Données que nous traitons',
    'Le site parphelie.com ne dépose pas de cookie publicitaire et n’utilise pas d’outil de profilage. Lorsque vous nous écrivez via le formulaire ou par e-mail, nous traitons votre nom, votre adresse e-mail et le contenu de votre message afin de vous répondre.',
  ],
  [
    'Finalités et base légale',
    'Ces informations sont utilisées uniquement pour traiter votre demande, sur la base de notre intérêt légitime à répondre aux messages reçus ou pour exécuter des mesures précontractuelles demandées par vous.',
  ],
  [
    'Durée de conservation',
    'Les échanges sont conservés pendant le temps nécessaire au suivi de la demande, puis au maximum trois ans après notre dernier contact, sauf obligation légale différente.',
  ],
  [
    'Destinataires et hébergement',
    'Les données sont accessibles uniquement à Raphaël Plassart (Parphélie) et, lorsque nécessaire, à ses prestataires techniques d’hébergement (Cloudflare) et de messagerie, tenus à des obligations de confidentialité et de sécurité.',
  ],
  [
    'Vos droits',
    'Vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou l’opposition au traitement de vos données. Vous disposez également du droit d’introduire une réclamation auprès de la CNIL.',
  ],
  [
    'Nous contacter',
    `Pour toute question ou pour exercer vos droits : ${PROFILE.email}. Nous pourrons demander un justificatif d’identité uniquement en cas de doute raisonnable sur votre identité.`,
  ],
];

export function LegalPage({ terms = false }: { terms?: boolean }) {
  const sections = terms
    ? [
        [
          'Éditeur du site',
          `Parphélie — ${PROFILE.name}, ${PROFILE.legal.status}. SIREN : ${PROFILE.legal.siren}. SIRET : ${PROFILE.legal.siret}. Code APE : ${PROFILE.legal.ape}. Siège : ${PROFILE.legal.address}. Contact : ${PROFILE.email} — ${PROFILE.phoneDisplay}. ${PROFILE.legal.tva}.`,
        ],
        ['Direction de la publication', `Le directeur de la publication est ${PROFILE.name}.`],
        [
          'Hébergement',
          'Le site est hébergé par Cloudflare, Inc. (Cloudflare Pages), 101 Townsend Street, San Francisco, CA 94107, États-Unis. Téléphone : +1 650 319 8930.',
        ],
        [
          'Propriété intellectuelle',
          'Les textes, signes distinctifs, illustrations, captures, interfaces et éléments graphiques présents sur ce site sont protégés. Toute reproduction ou utilisation sans autorisation préalable est interdite.',
        ],
        [
          'Information fournie',
          'Les informations sont présentées à titre général et peuvent évoluer. Parphélie s’efforce d’en assurer l’exactitude, sans garantir qu’elles soient exhaustives ou constamment à jour.',
        ],
        [
          'Responsabilité',
          'Parphélie ne saurait être responsable d’un dommage indirect lié à l’utilisation du site ou à l’impossibilité temporaire d’y accéder. IronHale ne fournit pas de conseil médical.',
        ],
        [
          'Droit applicable',
          'Les présentes conditions sont soumises au droit français. En cas de différend, une solution amiable sera recherchée avant toute action judiciaire.',
        ],
      ]
    : privacySections;

  return (
    <div className="ih-shell">
      <IhHeader />
      <main className="ih-legal">
        <a className="ih-back" href="/" onClick={(e) => navigateTo('/', e)}>
          ← Retour à l’accueil
        </a>
        <p className="ih-section-label">Informations légales</p>
        <h1>{terms ? 'Mentions légales et conditions' : 'Politique de confidentialité'}</h1>
        <p className="ih-legal-lead">
          {terms
            ? 'L’identité de l’éditeur et les règles essentielles qui encadrent l’utilisation de ce site.'
            : 'Parphélie respecte votre vie privée et limite la collecte au strict nécessaire.'}
        </p>
        <p className="ih-updated">Dernière mise à jour : 14 novembre 2026</p>
        <div className="ih-legal-body">
          {sections.map(([title, body], i) => (
            <section key={title}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2>{title}</h2>
                <p>{body}</p>
                {!terms && title === 'Vos droits' && (
                  <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
                    Consulter le site de la CNIL <Arrow />
                  </a>
                )}
              </div>
            </section>
          ))}
        </div>
        <aside>
          <b>Concernant IronHale</b>
          <p>
            L’application mobile dispose de sa propre politique de confidentialité détaillant les
            données nécessaires à son fonctionnement.
          </p>
          <a
            href="/projects/ironhale/privacy"
            onClick={(e) => navigateTo('/projects/ironhale/privacy', e)}
          >
            Voir la politique IronHale <Arrow />
          </a>
        </aside>
      </main>
      <IhFooter />
    </div>
  );
}

export function IronhalePrivacyPage() {
  const items = [
    [
      'Responsable du traitement',
      `Parphélie (${PROFILE.name}) est responsable des traitements décrits sur cette page. Pour toute demande : ${PROFILE.email}.`,
    ],
    [
      'Données du compte et d’entraînement',
      'IronHale peut traiter vos réglages, séances, exercices, charges, préférences articulaires et progression afin de fournir et personnaliser votre programme. Ces informations ne constituent pas un dossier médical.',
    ],
    [
      'Abonnements',
      'Les achats et abonnements sont traités par Apple ou Google et gérés techniquement via RevenueCat. Parphélie ne reçoit ni ne conserve vos coordonnées bancaires.',
    ],
    [
      'Mesure d’usage',
      'Des événements techniques et d’usage limités peuvent être collectés via PostHog hébergé dans l’Union européenne afin d’améliorer la stabilité et l’expérience. Ils ne sont pas utilisés pour de la publicité ciblée.',
    ],
    [
      'Conservation et sécurité',
      'Les données sont conservées pendant la durée nécessaire au service et supprimées ou anonymisées lorsqu’elles ne sont plus utiles, sous réserve des obligations légales. Des mesures adaptées protègent leur confidentialité.',
    ],
    [
      'Vos choix et vos droits',
      `Vous pouvez accéder à vos données, les rectifier, demander leur suppression, vous opposer à certains traitements ou demander leur portabilité. Contactez ${PROFILE.email} ou la CNIL en cas de difficulté.`,
    ],
    [
      'Enfants et santé',
      'IronHale s’adresse aux adultes. L’application ne remplace pas un professionnel de santé ; consultez-en un avant de commencer une activité physique en cas de doute ou de condition médicale.',
    ],
  ];

  return (
    <div className="ih-shell">
      <IhHeader />
      <main className="ih-legal">
        <a
          className="ih-back"
          href="/projects/ironhale"
          onClick={(e) => navigateTo('/projects/ironhale', e)}
        >
          ← Retour à IronHale
        </a>
        <p className="ih-section-label">IronHale · Informations légales</p>
        <h1>Politique de confidentialité d’IronHale</h1>
        <p className="ih-legal-lead">Une information claire sur les données utilisées par l’application.</p>
        <p className="ih-updated">Dernière mise à jour : 14 novembre 2026</p>
        <div className="ih-legal-body">
          {items.map(([title, body], i) => (
            <section key={title}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2>{title}</h2>
                <p>{body}</p>
              </div>
            </section>
          ))}
        </div>
        <aside>
          <b>Contact développeur</b>
          <p>
            Pour toute demande relative à vos données personnelles dans IronHale :{' '}
            <a href={PROFILE.emailHref}>{PROFILE.email}</a> · {PROFILE.phoneDisplay}.
          </p>
        </aside>
      </main>
      <IhFooter />
    </div>
  );
}
