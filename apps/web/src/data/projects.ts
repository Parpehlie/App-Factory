/**
 * Source unique des informations du hub Parphélie (parphelie.com).
 *
 * COMMENT AJOUTER UN PROJET PLUS TARD :
 * 1. Déposez une image WebP/PNG dans `apps/web/public/images/projects/`.
 * 2. Ajoutez un nouvel objet dans le tableau `PROJECTS` ci-dessous.
 * La carte et les métadonnées se mettent à jour automatiquement.
 */

export const PROFILE = {
  brand: 'parphélie',
  name: 'Raphaël Plassart',
  role: 'Développeur web freelance · Ingénieur produit',
  phoneDisplay: '07 69 89 28 62',
  phoneHref: 'tel:+33769892862',
  email: 'raphael@parphelie.com',
  emailHref: 'mailto:raphael@parphelie.com',
  location: 'Verrières-le-Buisson (91) · Île-de-France & toute la France',
  linkedin: 'https://www.linkedin.com/in/rapha%C3%ABl-plassart/',
  github: 'https://github.com/raphplt',
  legal: {
    status: 'Entrepreneur individuel (Micro-entreprise)',
    siren: '942 906 157',
    siret: '942 906 157 00014',
    ape: '62.01Z – Programmation informatique',
    address: '18 rue de l’Abreuvoir, 91370 Verrières-le-Buisson, France',
    tva: 'TVA non applicable, article 293 B du Code général des impôts',
  },
} as const;

export const ATLAS_HIGHLIGHT = {
  badge: 'Activité principale · Artisans, commerçants & TPE',
  title: 'Atlas — Mettez votre activité sur la carte.',
  lead: 'Des sites rapides, singuliers et bien référencés sur Google pour les artisans, commerçants et indépendants qui veulent être trouvés et choisis dans leur secteur.',
  promise: 'Un seul interlocuteur, du premier croquis à la mise en ligne. Livraison en 5 à 10 jours ouvrés et garantie satisfait ou remboursé 30 jours.',
  speedMetric: '1,1 s',
  speedLabel: 'Temps d’affichage moyen sur mobile 4G',
  siteUrl: 'https://atlas.raphael-plassart.com/',
  offersUrl: 'https://atlas.raphael-plassart.com/offres',
  caseStudyUrl: 'https://atlas.raphael-plassart.com/realisations/permapaysage',
  offers: [
    {
      label: 'Pour être trouvé localement',
      title: 'Votre site',
      text: 'Site vitrine sur-mesure (aucun modèle recyclé), référencement local & fiche Google Business, accès simple pour vos chantiers.',
      chips: ['Design sur-mesure', 'SEO local', 'Fiche Google', 'Suivi 30 jours'],
      href: 'https://atlas.raphael-plassart.com/offres#site',
    },
    {
      label: 'Pour votre activité sur-mesure',
      title: 'Votre produit',
      text: 'Applications web, outils métier (devis, suivi de chantier, espace client) et SaaS pensés avec la même exigence de vitesse.',
      chips: ['Conception produit', 'Outils métier', 'Applications web', 'Mise en production'],
      href: 'https://atlas.raphael-plassart.com/offres#produit',
    },
  ],
  testimonial: {
    client: 'Permapaysage & Le Jardinier du Vignoble',
    role: 'Éco-paysagiste à Vallet (Vignoble nantais)',
    quote: 'Il a su transformer un outil potable en une véritable machine de guerre digitale.',
    author: 'Permapaysage, sur LinkedIn',
    mainShot: '/images/projects/atlas-permapaysage.webp',
    mainAlt: 'Aperçu du site réalisé pour Permapaysage',
    companionShot: '/images/projects/atlas-jardinier.webp',
    companionAlt: 'Aperçu du site Le Jardinier du Vignoble',
  },
} as const;

export type ProjectCategory = 'tech' | 'games' | 'creative';

export interface ProjectItem {
  id: string;
  number: string;
  category: ProjectCategory;
  categoryLabel: string;
  title: string;
  kicker: string;
  tagline: string;
  description: string;
  tags: string[];
  href: string;
  ctaLabel: string;
  external: boolean;
  secondaryHref?: string;
  secondaryLabel?: string;
  secondaryExternal?: boolean;
  visualType: 'image' | 'portfolio' | 'raphotos' | 'ironhale';
  image?: string;
  imageAlt?: string;
  theme: {
    bg: string;
    fg: string;
    muted: string;
    accent: string;
    accentText: string;
    border: string;
    badgeBg: string;
  };
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'portfolio',
    number: '01',
    category: 'tech',
    categoryLabel: 'Ingénierie & Tech',
    title: 'Portfolio Développeur',
    kicker: 'Full-Stack Product Engineer · raphael-plassart.com',
    tagline: 'Je construis les outils que je voulais utiliser.',
    description:
      'Trois ans d’expérience startup (TKorp / Pulse, Mes Allocs) et mes produits menés jusqu’en production : architectures Next.js, NestJS, Expo, Tauri et Rust.',
    tags: ['Next.js', 'NestJS', 'Rust & Tauri', 'React Native'],
    href: 'https://www.raphael-plassart.com/',
    ctaLabel: 'Voir mon portfolio',
    external: true,
    visualType: 'portfolio',
    image: '/images/projects/portfolio-home.webp',
    imageAlt: 'Page d’accueil du portfolio de Raphaël Plassart — Full-Stack Product Engineer',
    theme: {
      bg: '#101011',
      fg: '#ffffff',
      muted: '#a1a1aa',
      accent: '#f97316',
      accentText: '#0a0a0a',
      border: 'rgba(255, 255, 255, 0.14)',
      badgeBg: 'rgba(249, 115, 22, 0.14)',
    },
  },
  {
    id: 'qoredb',
    number: '02',
    category: 'tech',
    categoryLabel: 'Ingénierie & Tech',
    title: 'QoreDB',
    kicker: 'Open Source · Rust & Tauri v2 · qoredb.com',
    tagline: '34 bases de données. Une interface unifiée.',
    description:
      'Le client de bases de données moderne, local-first et ultra-rapide : zéro télémétrie cloud, trousseau système natif, diagrammes ER et serveur MCP intégré pour vos assistants IA.',
    tags: ['34 moteurs SQL/NoSQL', 'Rust & React 19', 'Serveur MCP IA', 'Open Source'],
    href: 'https://www.qoredb.com/fr',
    ctaLabel: 'Découvrir QoreDB',
    external: true,
    visualType: 'image',
    image: '/images/projects/qoredb-query.webp',
    imageAlt: 'Éditeur de requêtes SQL et explorateur de schémas dans QoreDB',
    theme: {
      bg: '#0c0d14',
      fg: '#f8fafc',
      muted: '#a5b4fc',
      accent: '#6366f1',
      accentText: '#ffffff',
      border: 'rgba(99, 102, 241, 0.28)',
      badgeBg: 'rgba(99, 102, 241, 0.16)',
    },
  },
  {
    id: 'vestiges',
    number: '03',
    category: 'games',
    categoryLabel: 'Jeux & Culture',
    title: 'Vestiges',
    kicker: 'Jeu vidéo indépendant · Godot 4 & C# · Vitrine & Captures',
    tagline: 'Remonte la nuit qu’une ville a voulu oublier.',
    description:
      'Un survivors-like en pixel art isométrique : enchaîne les éliminations sans te faire toucher pour monter ta Série, pousse la horde dans le Vide et affronte l’Indicible à Vaulme.',
    tags: ['Godot 4 & C#', 'Pixel art 480×270', 'Survivors-like', '5 terres de Vaulme'],
    href: '/vestiges',
    ctaLabel: 'Découvrir Vestiges & les captures',
    external: false,
    secondaryHref: 'https://github.com/raphplt/vestiges',
    secondaryLabel: 'GitHub (dépôt privé)',
    secondaryExternal: true,
    visualType: 'image',
    image: '/images/vestiges/screen-bas-port-cale.webp',
    imageAlt: 'Capture en jeu de Vestiges : la cale du chantier naval du Bas-Port et le Grand Cerf',
    theme: {
      bg: '#1A1A2E',
      fg: '#E8E0D4',
      muted: '#b5ada0',
      accent: '#D4A843',
      accentText: '#1A1A2E',
      border: 'rgba(212, 168, 67, 0.34)',
      badgeBg: 'rgba(212, 168, 67, 0.14)',
    },
  },
  {
    id: 'melios',
    number: '04',
    category: 'creative',
    categoryLabel: 'Mobile & Photo',
    title: 'Melios',
    kicker: 'Application mobile · Incubé à l’ESSEC · Cofondateur',
    tagline: 'Soyez récompensés pour vos bonnes habitudes.',
    description:
      'Application mobile de développement personnel gamifiée : suivi de routines, séries, progression par compétence et communauté Agora. Projet accompagné par l’incubateur de l’ESSEC, testé par plus de 150 bêta-testeurs et publié sur iOS et Android.',
    tags: ['Incubateur ESSEC', 'React Native & Expo', 'iOS & Android', '150+ bêta-testeurs'],
    href: 'https://raphplt.github.io/melios-web/',
    ctaLabel: 'Découvrir Melios',
    external: true,
    secondaryHref: 'https://github.com/raphplt/melios',
    secondaryLabel: 'Code source GitHub',
    secondaryExternal: true,
    visualType: 'image',
    image: '/images/projects/melios.webp',
    imageAlt:
      'Aperçu de l’application mobile Melios : suivi d’habitudes, séries et développement personnel gamifié',
    theme: {
      bg: '#0c1644',
      fg: '#f8fafc',
      muted: '#bfdbfe',
      accent: '#f3c548',
      accentText: '#0c1644',
      border: 'rgba(135, 206, 250, 0.28)',
      badgeBg: 'rgba(243, 197, 72, 0.16)',
    },
  },
  {
    id: 'leximon',
    number: '05',
    category: 'games',
    categoryLabel: 'Jeux & Culture',
    title: 'Leximon',
    kicker: 'Jeu de cartes littéraire · leximon.fr',
    tagline: 'Collectionnez les mots rares de la langue française.',
    description:
      'Ouvrez vos boosters quotidiens, collectionnez des mots oubliés tirés du dictionnaire Littré et illustrés de gravures du XIXe siècle, puis affrontez vos amis en duel lexical.',
    tags: ['Littré & XIXe siècle', 'Boosters quotidiens', 'Duels lexicaux', 'Jeu web gratuit'],
    href: 'https://leximon.fr/',
    ctaLabel: 'Jouer sur Leximon',
    external: true,
    visualType: 'image',
    image: '/images/projects/leximon.webp',
    imageAlt: 'Cartes de mots rares Leximon : bâtonnable, pendardeau et booster Les Fondateurs',
    theme: {
      bg: '#1c2b22',
      fg: '#f7f4ee',
      muted: '#d8ceb9',
      accent: '#d4af37',
      accentText: '#1c1810',
      border: 'rgba(212, 175, 55, 0.34)',
      badgeBg: 'rgba(212, 175, 55, 0.15)',
    },
  },
  {
    id: 'raphotos',
    number: '06',
    category: 'creative',
    categoryLabel: 'Mobile & Photo',
    title: 'Raphotos',
    kicker: 'Photographie & Licence Libre · raphotos.fr',
    tagline: 'La poésie cachée dans les paysages.',
    description:
      'Archive photographique personnelle dédiée aux sommets, alpages embrumés et scènes d’extérieur. Chaque cliché haute définition est librement téléchargeable sous licence CC BY-NC.',
    tags: ['Paysages & montagne', 'Licence CC BY-NC', 'Galerie minimaliste', 'Téléchargement libre'],
    href: 'https://www.raphotos.fr/',
    ctaLabel: 'Explorer la galerie',
    external: true,
    visualType: 'raphotos',
    image: '/images/projects/raphotos.webp',
    imageAlt: 'Aperçu de la galerie photographique Raphotos classée par saisons',
    theme: {
      bg: '#08080a',
      fg: '#f4f4f5',
      muted: '#a1a1aa',
      accent: '#ffffff',
      accentText: '#08080a',
      border: 'rgba(255, 255, 255, 0.16)',
      badgeBg: 'rgba(255, 255, 255, 0.1)',
    },
  },
];
