import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const templatePath = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(templatePath)) {
  throw new Error(`Missing built index.html at ${templatePath}`);
}

const template = fs.readFileSync(templatePath, 'utf8');

function escapeAttr(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://parphelie.com/#raphael-plassart',
      name: 'Raphaël Plassart',
      jobTitle: 'Développeur web freelance',
      url: 'https://parphelie.com/',
      email: 'mailto:raphael@parphelie.com',
      telephone: '+33769892862',
      image: 'https://parphelie.com/images/raphael-plassart.webp',
      sameAs: [
        'https://atlas.raphael-plassart.com/',
        'https://www.raphael-plassart.com/',
        'https://www.qoredb.com/fr',
        'https://raphplt.github.io/melios-web/',
        'https://leximon.fr/',
        'https://www.raphotos.fr/',
        'https://www.linkedin.com/in/rapha%C3%ABl-plassart/',
        'https://github.com/raphplt',
      ],
    },
    {
      '@type': 'ProfessionalService',
      '@id': 'https://parphelie.com/#service',
      name: 'Parphélie · Atlas — Raphaël Plassart',
      url: 'https://atlas.raphael-plassart.com/',
      telephone: '+33769892862',
      email: 'raphael@parphelie.com',
      areaServed: 'FR',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '18 rue de l’Abreuvoir',
        postalCode: '91370',
        addressLocality: 'Verrières-le-Buisson',
        addressCountry: 'FR',
      },
      founder: { '@id': 'https://parphelie.com/#raphael-plassart' },
    },
  ],
};

const VESTIGES_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Vestiges',
  description:
    'Un survivors-like en pixel art isométrique où tu remontes la nuit qu’une ville a voulu oublier : enchaîne les éliminations sans te faire toucher, pousse la horde dans le vide, et deviens monstrueux.',
  genre: ['Action Roguelite', 'Survivors-like', 'Pixel Art'],
  gamePlatform: ['PC', 'macOS'],
  url: 'https://parphelie.com/vestiges',
  image: 'https://parphelie.com/og-vestiges.png',
  author: {
    '@type': 'Person',
    name: 'Raphaël Plassart',
    url: 'https://parphelie.com/',
  },
};

const ROUTES = [
  {
    route: '/',
    title: 'Parphélie · Raphaël Plassart — Sites pour artisans (Atlas) & projets numériques',
    description:
      'Raphaël Plassart, développeur web freelance. Découvrez Atlas (sites rapides et bien référencés pour artisans et commerçants), QoreDB, Vestiges, Melios, Leximon et Raphotos. Contact : 07 69 89 28 62 · raphael@parphelie.com.',
    canonical: 'https://parphelie.com/',
    image: 'https://parphelie.com/og-parphelie.png',
    theme: '#1f3bd9',
    jsonLd: PERSON_JSON_LD,
    noscript: `
      <main>
        <h1>Raphaël Plassart — Parphélie</h1>
        <p>Développeur web freelance (07 69 89 28 62 · raphael@parphelie.com). Activité principale : <a href="https://atlas.raphael-plassart.com/">Atlas — Sites web pour artisans, commerçants et TPE</a>.</p>
        <ul>
          <li><a href="https://atlas.raphael-plassart.com/">Atlas — Sites pour artisans &amp; commerçants</a></li>
          <li><a href="https://www.raphael-plassart.com/">Portfolio Développeur — Full-Stack Product Engineer</a></li>
          <li><a href="https://www.qoredb.com/fr">QoreDB — Client de bases de données open source (Rust, Tauri, 34 moteurs)</a></li>
          <li><a href="/vestiges">Vestiges — Jeu vidéo survivors-like en pixel art (Godot 4 &amp; C#)</a></li>
          <li><a href="https://raphplt.github.io/melios-web/">Melios — Application mobile de développement personnel gamifiée (incubée à l’ESSEC)</a></li>
          <li><a href="https://leximon.fr/">Leximon — Jeu de cartes des mots rares français</a></li>
          <li><a href="https://www.raphotos.fr/">Raphotos — Photographies libres CC BY-NC</a></li>
        </ul>
      </main>
    `,
  },
  {
    route: '/vestiges',
    title: 'Vestiges — Survivors-like en pixel art isométrique · Raphaël Plassart',
    description:
      'Découvrez Vestiges : un survivors-like en pixel art isométrique développé avec Godot 4 et C#. Enchaîne les éliminations, pousse la horde dans le Vide et traverse les 5 terres de Vaulme.',
    canonical: 'https://parphelie.com/vestiges',
    image: 'https://parphelie.com/og-vestiges.png',
    theme: '#141524',
    jsonLd: VESTIGES_JSON_LD,
    noscript: `
      <main>
        <h1>Vestiges</h1>
        <p>Un survivors-like où tu remontes la nuit qu’une ville a voulu oublier : enchaîne les éliminations sans te faire toucher, pousse la horde dans le vide, et deviens monstrueux.</p>
        <p>Godot 4 · C# · Pixel art 480×270 upscalé ×4 · Par Raphaël Plassart (<a href="/">parphelie.com</a>).</p>
      </main>
    `,
  },
  {
    route: '/projects/ironhale',
    title: 'IronHale — La force, pour longtemps · Parphélie',
    description:
      'Application mobile de musculation adaptative pensée pour les plus de 50 ans : exercices alternatifs pour vos articulations et récupération réaliste.',
    canonical: 'https://parphelie.com/projects/ironhale',
    image: 'https://parphelie.com/ironhale-icon.png',
    theme: '#f5f0e7',
    noscript: `<main><h1>IronHale — La force, pour longtemps.</h1><p>Programme de musculation adaptatif sur iOS et Android par Parphélie.</p></main>`,
  },
  {
    route: '/projects/ironhale/privacy',
    title: 'Politique de confidentialité d’IronHale · Parphélie',
    description: 'Politique de confidentialité de l’application mobile IronHale éditée par Parphélie.',
    canonical: 'https://parphelie.com/projects/ironhale/privacy',
    image: 'https://parphelie.com/ironhale-icon.png',
    theme: '#f5f0e7',
    noscript: `<main><h1>Politique de confidentialité d’IronHale</h1><p>Contact : raphael@parphelie.com.</p></main>`,
  },
  {
    route: '/ironhale/privacy',
    title: 'Politique de confidentialité d’IronHale · Parphélie',
    description: 'Politique de confidentialité de l’application mobile IronHale éditée par Parphélie.',
    canonical: 'https://parphelie.com/projects/ironhale/privacy',
    image: 'https://parphelie.com/ironhale-icon.png',
    theme: '#f5f0e7',
    noscript: `<main><h1>Politique de confidentialité d’IronHale</h1><p>Contact : raphael@parphelie.com.</p></main>`,
  },
  {
    route: '/privacy',
    title: 'Politique de confidentialité · Parphélie',
    description: 'Politique de confidentialité et protection des données de parphelie.com.',
    canonical: 'https://parphelie.com/privacy',
    image: 'https://parphelie.com/og-parphelie.png',
    theme: '#f5f0e7',
    noscript: `<main><h1>Politique de confidentialité — Parphélie</h1><p>Contact : raphael@parphelie.com.</p></main>`,
  },
  {
    route: '/terms',
    title: 'Mentions légales · Parphélie',
    description: 'Mentions légales de parphelie.com — Raphaël Plassart (EI, SIREN 942 906 157).',
    canonical: 'https://parphelie.com/terms',
    image: 'https://parphelie.com/og-parphelie.png',
    theme: '#f5f0e7',
    noscript: `<main><h1>Mentions légales — Parphélie</h1><p>Raphaël Plassart, Entrepreneur Individuel — SIREN 942 906 157.</p></main>`,
  },
];

for (const page of ROUTES) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(page.title)}</title>`);
  html = html.replace(
    /<meta\s+name="theme-color"\s+content="[^"]*"\s*\/?>/,
    `<meta name="theme-color" content="${escapeAttr(page.theme)}" />`,
  );
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${escapeAttr(page.description)}" />`,
  );
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttr(page.canonical)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttr(page.title)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${escapeAttr(page.description)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${escapeAttr(page.canonical)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${escapeAttr(page.image)}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeAttr(page.title)}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${escapeAttr(page.description)}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${escapeAttr(page.image)}" />`,
  );

  if (page.jsonLd) {
    html = html.replace(
      '</head>',
      `  <script type="application/ld+json">${JSON.stringify(page.jsonLd)}</script>\n  </head>`,
    );
  }

  if (page.noscript) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"></div>\n    <noscript>${page.noscript.trim()}</noscript>`,
    );
  }

  const outPath =
    page.route === '/'
      ? templatePath
      : path.join(DIST_DIR, page.route.replace(/^\//, ''), 'index.html');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`Generated SEO HTML: ${path.relative(DIST_DIR, outPath)}`);
}
