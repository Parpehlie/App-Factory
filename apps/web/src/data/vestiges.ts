export interface VestigesScreenshot {
  id: string;
  title: string;
  caption: string;
  category: 'terres' | 'interface';
  src: string;
  alt: string;
}

export const VESTIGES_DATA = {
  title: 'VESTIGES',
  subtitle:
    'Un survivors-like où tu remontes la nuit qu’une ville a voulu oublier : enchaîne les éliminations sans te faire toucher, pousse la horde dans le vide, et deviens monstrueux.',
  status: 'En développement actif · Godot 4 & C# · PC / macOS',
  githubUrl: 'https://github.com/raphplt/vestiges',
  screenshots: [
    {
      id: 'bas-port-cale',
      title: 'Le Bas-Port — La cale du chantier naval',
      caption: 'Le chalutier étayé au cœur du port, et le Grand Cerf qui veille devant la coque.',
      category: 'terres',
      src: '/images/vestiges/screen-bas-port-cale.webp',
      alt: 'Vestiges : cale du chantier naval du Bas-Port et le gardien Grand Cerf',
    },
    {
      id: 'bas-port-quais',
      title: 'Le Bas-Port — Les quais face au Vide',
      caption: 'La bordure des quais longe le Vide qui ronge la mer oubliée, sous la grue rouillée.',
      category: 'terres',
      src: '/images/vestiges/screen-bas-port-quais.webp',
      alt: 'Vestiges : quais du Bas-Port au bord du Vide blanc',
    },
    {
      id: 'haute-ville',
      title: 'La Haute-Ville — Parvis de Saint-Aubin',
      caption: 'Les ruines urbaines autour de l’église Saint-Aubin et des avenues pavées de Vaulme.',
      category: 'terres',
      src: '/images/vestiges/screen-haute-ville.webp',
      alt: 'Vestiges : parvis de l’église Saint-Aubin dans la Haute-Ville de Vaulme',
    },
    {
      id: 'bois-belvedere',
      title: 'Les Bois — Le belvédère au bord du Vide',
      caption: 'Clairières forestières où le terrain tombe net dans l’effacement.',
      category: 'terres',
      src: '/images/vestiges/screen-bois-belvedere.webp',
      alt: 'Vestiges : belvédère des bois donnant sur le Vide',
    },
    {
      id: 'horde-combat',
      title: 'Les Champs — La horde & l’Épouvantail',
      caption: 'Combat dense au milieu des granges avec builds d’armes automatiques et minimap tactique.',
      category: 'terres',
      src: '/images/vestiges/screen-horde-combat.webp',
      alt: 'Vestiges : combat contre la horde dans les Champs près d’une grange rouge',
    },
    {
      id: 'horde-serie',
      title: 'La Série ×34 en rafale',
      caption: 'Enchaîner les éliminations sans se faire toucher fait grimper dégâts, vitesse et Chance.',
      category: 'terres',
      src: '/images/vestiges/screen-horde-serie.webp',
      alt: 'Vestiges : compteur de Série x34 en rafale au cœur des Bois',
    },
    {
      id: 'personnages',
      title: 'Le Casting — Choisir un personnage',
      caption: 'Le Traqueur, Le Vagabond, La Forgeuse, Le Facteur, L’Éveillée et La Scaphandrière.',
      category: 'interface',
      src: '/images/vestiges/screen-personnages.webp',
      alt: 'Vestiges : écran de sélection des personnages jouables dont Le Traqueur',
    },
    {
      id: 'campement',
      title: 'Le Campement — Progression permanente',
      caption: 'Investis tes gains entre deux runs (Râtelier, Poches, Jeu de cartes, Boîte d’allumettes).',
      category: 'interface',
      src: '/images/vestiges/screen-campement.webp',
      alt: 'Vestiges : menu du Campement pour améliorer ses capacités permanentes',
    },
    {
      id: 'levelup',
      title: 'Fragment de Mémoire — Montée de niveau',
      caption: 'Cartes à rareté, paliers d’évolution et feuille complète de statistiques en pause.',
      category: 'interface',
      src: '/images/vestiges/screen-levelup.webp',
      alt: 'Vestiges : écran de montée de niveau Fragment de mémoire et inventaire',
    },
    {
      id: 'faille',
      title: 'La Faille — Pactes risqués',
      caption: 'L’Effacement rend ce qu’il a pris, mais augmente ton Péril permanent.',
      category: 'interface',
      src: '/images/vestiges/screen-faille.webp',
      alt: 'Vestiges : menu de la Faille proposant des améliorations épiques contre du Péril',
    },
  ] satisfies VestigesScreenshot[],
  pillars: [
    {
      code: '01 · SIGNATURE',
      title: 'La Série',
      text: 'Chaque élimination fait monter ta Série ; un coup reçu la coupe en deux et une jauge vide l’encaisse en Essence. Ses rangs décuplent tes dégâts, ta vitesse et ta Chance.',
    },
    {
      code: '02 · SIGNATURE',
      title: 'Le Vide',
      text: 'Des pans entiers de Vaulme s’effacent autour des falaises et des quais. Pousse la horde dedans par percussion ou saute par-dessus les brèches pour retourner la mêlée.',
    },
    {
      code: '03 · PUISSANCE & GAMBLING',
      title: 'Coffres, Failles & Builds',
      text: 'Cinq raretés du Commun gris au Légendaire or, des pactes épiques aux Failles contre du Péril supplémentaire, jusqu’aux builds qui finissent par casser le jeu.',
    },
  ],
  runFlow: [
    {
      step: 'Terres 01 → 03',
      title: 'Trois lieux de Vaulme tirés au sort',
      text: 'Réveille les Mémoriaux pour localiser le repaire du gardien de chaque terre (le Grand Cerf, l’Épouvantail…) avant que la rage ne referme l’arène.',
    },
    {
      step: 'Étape fixe',
      title: 'La Montée',
      text: 'Une dernière ascension linéaire qui raconte la barrière autour de la ville et prépare ton build pour le dénouement.',
    },
    {
      step: 'Finale & Sans Fin',
      title: 'L’Indicible',
      text: 'Vaincre l’Indicible remporte la run, livre un fragment de lore et ouvre le mode sans fin pour pousser ton build encore plus loin.',
    },
  ],
  lands: [
    { name: 'Les Bois', detail: 'Clairières, sous-bois, maison engloutie, viaduc effondré et belvédère sur le Vide.' },
    { name: 'Le Bas-Port', detail: 'Chenaux, marais salants, digue rompue, maisons du port et cale du chantier naval.' },
    { name: 'La Haute-Ville', detail: 'Grille urbaine fracturée, parvis de Saint-Aubin, squares et boulevards en ruine.' },
    { name: 'La Carrière', detail: 'Fosses effondrées, rails industriels, roches sombres et cristaux souterrains.' },
    { name: 'Les Champs', detail: 'Granges rouges, silos, haies bocagères et étendues ouvertes gardées par l’Épouvantail.' },
  ],
  characters: [
    { name: 'Le Traqueur', role: 'Agile · Distance · Arc du gymnase' },
    { name: 'Le Vagabond', role: 'Polyvalent · Survie et mobilité' },
    { name: 'La Forgeuse', role: 'Corps-à-corps lourd · Percussion' },
    { name: 'Le Facteur', role: 'Vitesse · Projectiles en chaîne' },
    { name: 'L’Éveillée', role: 'Essence & zones d’effacement' },
    { name: 'La Scaphandrière', role: 'Arme harpon · Contrôle et saut' },
  ],
  techSpecs: [
    { label: 'Moteur & Langage', value: 'Godot 4 · C# (.NET)' },
    { label: 'Affichage Pixel-Perfect', value: 'Canvas natif 480×270 upscalé ×4 (nearest-neighbor)' },
    { label: 'Foules & Performance', value: 'TickRoster C# mutualisé (sans rappel par nœud) + index spatial pour ~10 000 décors' },
    { label: 'Pipeline Artistique', value: 'Génération de sprites & icônes SDF en Python + étalonnage par biome' },
    { label: 'Typographies du jeu', value: 'Alkhemikal (titres) & Pixel Operator (HUD et corps)' },
  ],
} as const;
