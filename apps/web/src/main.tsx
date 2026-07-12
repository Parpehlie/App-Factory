import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const Arrow = () => <span aria-hidden="true">↗</span>;

function Logo() {
  return <a className="logo" href="/" aria-label="Parphélie, accueil"><span className="logo-mark">P</span><span>parphélie</span></a>;
}

function Header() {
  return <header className="site-header"><Logo /><nav aria-label="Navigation principale"><a href="/#projets">Projets</a><a href="/#approche">Approche</a><a href="mailto:bonjour@parphelie.com" className="nav-contact">Nous écrire <Arrow /></a></nav></header>;
}

function Footer() {
  return <footer><div className="footer-main"><Logo /><p>Des applications pensées pour<br />la vraie vie.</p></div><div className="footer-links"><div><span>Explorer</span><a href="/">Accueil</a><a href="/#projets">Projets</a></div><div><span>Légal</span><a href="/privacy">Confidentialité</a><a href="/terms">Mentions légales</a></div><div><span>Contact</span><a href="mailto:bonjour@parphelie.com">bonjour@parphelie.com</a></div></div><div className="footer-bottom"><small>© {new Date().getFullYear()} Parphélie</small><small>Conçu en France, avec attention.</small></div></footer>;
}

function Home() {
  return <><Header /><main>
    <section className="hero"><div className="eyebrow"><span /> Studio d’applications mobiles</div><h1>Des outils numériques<br />qui <em>comptent.</em></h1><div className="hero-foot"><p>Parphélie transforme des besoins concrets en applications mobiles utiles, intuitives et conçues pour durer.</p><a className="round-link" href="#projets" aria-label="Découvrir nos projets">↓</a></div><div className="sun" aria-hidden="true"><span className="orbit orbit-one"/><span className="orbit orbit-two"/><span className="spark s1">✦</span><span className="spark s2">✦</span></div></section>
    <section className="manifesto" id="approche"><p className="section-label">Notre approche</p><h2>La technologie s’efface.<br /><em>L’usage reste.</em></h2><div className="principles"><article><b>01</b><h3>Partir du réel</h3><p>Un besoin précis, une audience claire, une solution sans détour.</p></article><article><b>02</b><h3>Soigner l’essentiel</h3><p>Une expérience lisible et calme, où chaque détail a une raison d’être.</p></article><article><b>03</b><h3>Construire pour durer</h3><p>Des produits respectueux, fiables et capables de grandir avec leurs usages.</p></article></div></section>
    <section className="projects" id="projets"><div className="projects-head"><div><p className="section-label">Nos projets</p><h2>En ce moment,<br />chez Parphélie.</h2></div><p>Une collection d’applications mobiles indépendantes, dans des univers variés, chacune née d’un problème qui mérite une réponse attentive.</p></div><a href="/projects/ironhale" className="project-card"><div className="project-copy"><span className="status">Disponible bientôt</span><div><p className="project-number">Projet — 01</p><h3>IronHale</h3><p>La force, pour longtemps.</p></div><span className="discover">Découvrir le projet <Arrow /></span></div><div className="project-visual"><img src="/ironhale-icon.png" alt="Icône de l’application IronHale" /></div></a>
    <div className="next-project"><span>02</span><p>Le prochain projet<br />prend forme.</p><i>À suivre</i></div></section>
    <section className="closing"><p className="section-label">Une idée, une question ?</p><h2>Parlons de ce qui<br />mérite d’<em>exister.</em></h2><a href="mailto:bonjour@parphelie.com">bonjour@parphelie.com <Arrow /></a></section>
  </main><Footer /></>;
}

function PhoneMockup() {
  return <div className="phone"><div className="phone-screen"><div className="phone-top"><span>9:41</span><span>● ●</span></div><p className="phone-kicker">BONJOUR</p><h4>Prêt à devenir<br />plus fort ?</h4><div className="workout"><div className="workout-head"><span>SÉANCE DU JOUR</span><b>42 min</b></div><h5>Force complète</h5><p>6 exercices · Modéré</p><div className="exercise-lines"><i/><i/><i/></div><button>Démarrer la séance</button></div><div className="streak"><span>Progression</span><b>+ 12%</b></div></div></div>;
}

function Ironhale() {
  return <><Header /><main className="ironhale">
    <section className="project-hero"><div className="project-intro"><a className="back" href="/#projets">← Tous les projets</a><p className="section-label">Projet — 01</p><h1>Iron<span>Hale</span></h1><h2>La force,<br /><em>pour longtemps.</em></h2><p>Un programme de musculation adaptatif pensé pour les plus de 50 ans — attentif à votre rythme, vos articulations et vos progrès.</p><div className="store-row"><span className="store-badge"> <small>Bientôt sur<br/><b>l’App Store</b></small></span><span className="store-badge">▶ <small>Bientôt sur<br/><b>Google Play</b></small></span></div></div><div className="phone-stage"><div className="gold-disc"/><PhoneMockup /><span className="float-note note-a">Récupération<br/><b>à votre rythme</b></span><span className="float-note note-b">Programme<br/><b>adaptatif</b></span></div></section>
    <section className="problem"><p className="section-label">Le constat</p><div><h2>Votre corps évolue.<br />Votre entraînement<br /><em>devrait aussi.</em></h2><p>Les applications de musculation classiques appliquent les mêmes règles à tout le monde. IronHale fait autrement : il prend en compte votre récupération et vous propose une alternative quand un mouvement ne vous convient pas.</p></div></section>
    <section className="features"><p className="section-label">Pensé pour vous</p><div className="feature-grid"><article><span>↝</span><h3>Un programme qui s’adapte</h3><p>Votre progression évolue selon vos séances, votre énergie et le temps dont vous disposez.</p></article><article><span>◎</span><h3>Vos articulations écoutées</h3><p>Genou, épaule ou dos sensible ? Chaque exercice dispose d’une alternative équivalente.</p></article><article><span>◴</span><h3>La récupération intégrée</h3><p>Des fenêtres de repos plus réalistes pour progresser sans brûler les étapes.</p></article><article><span>↗</span><h3>Vos progrès, lisiblement</h3><p>Suivez votre régularité et votre force sans tableaux complexes ni métriques inutiles.</p></article></div></section>
    <section className="promise"><div className="quote-mark">“</div><blockquote>Rester fort, ce n’est pas<br />regarder en arrière.<br /><em>C’est investir dans la suite.</em></blockquote></section>
    <section className="project-cta"><img src="/ironhale-icon.png" alt=""/><div><p className="section-label">IronHale arrive bientôt</p><h2>Votre prochaine<br />force commence ici.</h2><a href="mailto:bonjour@parphelie.com?subject=IronHale%20—%20Liste%20d’attente">Être prévenu du lancement <Arrow /></a></div></section>
  </main><Footer /></>;
}

const privacySections = [
  ['Responsable du traitement', 'Parphélie — Raphaël Plassart, entrepreneur individuel — est responsable des traitements décrits sur cette page. Contact : bonjour@parphelie.com.'],
  ['Données que nous traitons', 'Le site parphelie.com ne dépose pas de cookie publicitaire et n’utilise pas d’outil de profilage. Lorsque vous nous écrivez, nous traitons votre adresse e-mail et le contenu de votre message afin de vous répondre.'],
  ['Finalités et base légale', 'Ces informations sont utilisées uniquement pour traiter votre demande, sur la base de notre intérêt légitime à répondre aux messages reçus ou pour exécuter des mesures précontractuelles demandées par vous.'],
  ['Durée de conservation', 'Les échanges sont conservés pendant le temps nécessaire au suivi de la demande, puis au maximum trois ans après notre dernier contact, sauf obligation légale différente.'],
  ['Destinataires et hébergement', 'Les données sont accessibles uniquement à Parphélie et, lorsque nécessaire, à ses prestataires techniques d’hébergement et de messagerie, tenus à des obligations de confidentialité et de sécurité.'],
  ['Vos droits', 'Vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou l’opposition au traitement de vos données. Vous disposez également du droit d’introduire une réclamation auprès de la CNIL.'],
  ['Nous contacter', 'Pour toute question ou pour exercer vos droits : bonjour@parphelie.com. Nous pourrons demander un justificatif d’identité uniquement en cas de doute raisonnable sur votre identité.'],
];

function LegalPage({ terms = false }: { terms?: boolean }) {
  const sections = terms ? [
    ['Éditeur du site', 'Parphélie — Raphaël Plassart, entrepreneur individuel (EI). SIREN : 942 906 157. SIRET : 942 906 157 00014. Siège : 18 rue de l’Abreuvoir, 91370 Verrières-le-Buisson, France. Contact : bonjour@parphelie.com — +33 7 69 89 28 62. TVA non applicable, article 293 B du Code général des impôts.'],
    ['Direction de la publication', 'Le directeur de la publication est Raphaël Plassart.'],
    ['Hébergement', 'Le site est hébergé par Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis. Téléphone : +1 650 319 8930. Namecheap demeure le bureau d’enregistrement du nom de domaine.'],
    ['Propriété intellectuelle', 'Les textes, signes distinctifs, illustrations, interfaces et éléments graphiques présents sur ce site sont protégés. Toute reproduction ou utilisation sans autorisation préalable est interdite.'],
    ['Information fournie', 'Les informations sont présentées à titre général et peuvent évoluer. Parphélie s’efforce d’en assurer l’exactitude, sans garantir qu’elles soient exhaustives ou constamment à jour.'],
    ['Responsabilité', 'Parphélie ne saurait être responsable d’un dommage indirect lié à l’utilisation du site ou à l’impossibilité temporaire d’y accéder. IronHale ne fournit pas de conseil médical.'],
    ['Droit applicable', 'Les présentes conditions sont soumises au droit français. En cas de différend, une solution amiable sera recherchée avant toute action judiciaire.'],
  ] : privacySections;
  return <><Header /><main className="legal"><a className="back" href="/">← Retour à l’accueil</a><p className="section-label">Informations légales</p><h1>{terms ? 'Mentions légales et conditions' : 'Politique de confidentialité'}</h1><p className="legal-lead">{terms ? 'L’identité de l’éditeur et les règles essentielles qui encadrent l’utilisation de ce site.' : 'Parphélie respecte votre vie privée et limite la collecte au strict nécessaire.'}</p><p className="updated">Dernière mise à jour : 12 juillet 2026</p><div className="legal-body">{sections.map(([title, body], i) => <section key={title}><span>{String(i + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{body}</p>{!terms && title === 'Vos droits' && <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">Consulter le site de la CNIL <Arrow /></a>}</div></section>)}</div><aside><b>Concernant IronHale</b><p>L’application disposera de sa propre politique de confidentialité détaillant précisément les données nécessaires à son fonctionnement avant sa publication.</p><a href="/projects/ironhale/privacy">Voir la politique IronHale <Arrow /></a></aside></main><Footer /></>;
}

function IronhalePrivacy() {
  return <><Header /><main className="legal"><a className="back" href="/projects/ironhale">← Retour à IronHale</a><p className="section-label">IronHale · Informations légales</p><h1>Politique de confidentialité d’IronHale</h1><p className="legal-lead">Une information claire sur les données utilisées par l’application.</p><p className="updated">Version préparatoire · 12 juillet 2026</p><div className="legal-body">{[
    ['Responsable du traitement', 'Parphélie est responsable des traitements décrits sur cette page. Pour toute demande : bonjour@parphelie.com.'],
    ['Données du compte et d’entraînement', 'IronHale peut traiter vos réglages, séances, exercices, charges, préférences articulaires et progression afin de fournir et personnaliser votre programme. Ces informations ne constituent pas un dossier médical.'],
    ['Abonnements', 'Les achats et abonnements sont traités par Apple ou Google et gérés techniquement via RevenueCat. Parphélie ne reçoit ni ne conserve vos coordonnées bancaires.'],
    ['Mesure d’usage', 'Des événements techniques et d’usage limités peuvent être collectés via PostHog hébergé dans l’Union européenne afin d’améliorer la stabilité et l’expérience. Ils ne sont pas utilisés pour de la publicité ciblée.'],
    ['Conservation et sécurité', 'Les données sont conservées pendant la durée nécessaire au service et supprimées ou anonymisées lorsqu’elles ne sont plus utiles, sous réserve des obligations légales. Des mesures adaptées protègent leur confidentialité.'],
    ['Vos choix et vos droits', 'Vous pouvez accéder à vos données, les rectifier, demander leur suppression, vous opposer à certains traitements ou demander leur portabilité. Contactez bonjour@parphelie.com ou la CNIL en cas de difficulté.'],
    ['Enfants et santé', 'IronHale s’adresse aux adultes. L’application ne remplace pas un professionnel de santé ; consultez-en un avant de commencer une activité physique en cas de doute ou de condition médicale.'],
  ].map(([title, body], i) => <section key={title}><span>{String(i + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{body}</p></div></section>)}</div><aside><b>Avant publication</b><p>Cette politique devra être alignée avec la configuration finale de l’application, les durées exactes et les coordonnées juridiques de l’éditeur.</p></aside></main><Footer /></>;
}

function NotFound() { return <><Header/><main className="not-found"><p className="section-label">Erreur 404</p><h1>Cette page a pris<br />un autre chemin.</h1><a href="/">Retour à l’accueil →</a></main><Footer/></>; }

const path = window.location.pathname.replace(/\/$/, '') || '/';
const page = path === '/' ? <Home /> : path === '/projects/ironhale' ? <Ironhale /> : path === '/projects/ironhale/privacy' ? <IronhalePrivacy /> : path === '/privacy' ? <LegalPage /> : path === '/terms' ? <LegalPage terms /> : <NotFound />;

createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>);
