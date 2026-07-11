# IronHale — SPEC

> **Source de vérité unique du build.** Contrat entre la décision et le code.
> Vit dans `apps/ironhale/SPEC.md`, versionné avec l'app.
> Ce qui sert à **décider** (backlog, revue hebdo, journal) reste dans le Google Doc.
> Ce qui sert à **builder** est ici.
>
> **Statut : VERROUILLÉ.** Toute idée nouvelle va en §16 `Post-v1`. Rien n'entre dans le MVP.

---

## 0. Identité

| | |
|---|---|
| Nom store | **IronHale** — disponible sur App Store **et** Play Store (vérifié) |
| Bundle / package | `com.parphelie.ironhale` |
| Slug / workspace | `ironhale` |
| Marchés v1 | US + EU, **anglais uniquement** |
| Compte utilisateur | **aucun** (pas d'email, pas de login) — RevenueCat anonymous ID |
| Réseau au runtime | RevenueCat + PostHog uniquement. **Le produit fonctionne 100 % offline.** |

---

## 1. Produit

**Concept.** Programme de musculation adaptatif pour les 50+ : progression de force réelle, avec substitution automatique des exercices selon les articulations sensibles (genou / épaule / lombaires / hanche / poignet) et fenêtres de récupération calibrées.

**Cible.** 50-70 ans, US/EU, veut *réellement* devenir plus fort — pas faire du tai-chi sur une chaise.

**Wedge (validé en red-team).** Le trou du milieu entre les moteurs génériques athlétiques (Fitbod, Ladder, Caliber — calibrés pour trentenaires) et les cours seniors doux (SilverSneakers, Better5). Le **moteur de substitution articulaire** n'existe nulle part.

**Avantage structurel.** Joint-friendly **par défaut**, pas en option. Et **content-light** : les exercices sont des **données**, pas des vidéos. Les incumbents portent un coût de production de contenu récurrent ; pas nous.

**Non-négociable produit.** Le wedge doit se ressentir dans les **90 premières secondes**. Si l'utilisateur ne voit pas « Back Squat → Box Goblet Squat, parce que tu as coché genou » avant le paywall, l'app a échoué.

---

## 2. Monétisation — VERROUILLÉ

| | |
|---|---|
| Modèle | Freemium, abonnement auto-renouvelable. Pas de pub, pas de consommable, pas de lifetime. |
| Mensuel | **12,99 $ / 12,99 €** — ancrage |
| Annuel | **79,99 $ / 79,99 €** — la cible (= 6,67/mois, **−49 %**) |
| **Essai** | **AUCUN.** Les 6 séances gratuites *sont* l'essai — et c'est un meilleur argument sur un segment anti-abonnement : « 6 séances, sans carte bancaire ». |
| Gratuit | **6 séances**, quel que soit le rythme (2/3/4 j par semaine) |
| Mur | **Séance 7** |
| Paywall onboarding | **Soft** (✕ discret) |

**Économie nette** (Apple SBP 15 % / Google 1er M$ 15 %) :

| | Prix | Net EU (TVA 20 %) | Net /mois |
|---|---|---|---|
| Annuel | 79,99 € | **56,66 €** | 4,72 € |
| Mensuel | 12,99 € | **9,20 €** | 9,20 € |

Mix 70/30 annuel/mensuel → **6,07 € net / abonné actif / mois**.
→ **1 000 €/mois = ~165 abonnés actifs.** À 2,4 % d'install→payant : **~6 900 installs**.

**Pourquoi le gate est en séances et pas en semaines :** à 2 j/sem, « 2 semaines » = 4 séances ; à 4 j/sem = 8. Le mur bougerait selon le rythme. Le gate se déclenche sur **l'engagement réel**.

**Le compteur « Séance 4 / 6 gratuites » est visible dès la séance 1.** Le mur ne doit jamais être une surprise : sur ce segment, la surprise produit un 1★, pas un achat.

---

## 3. Onboarding

`OnboardingFlow` de `@app-factory/core`. Émet `onboarding_step` / `onboarding_complete`.

| # | `step_id` | Contenu |
|---|---|---|
| 1 | `goal` | Get strong again / Stay independent / Rebuild muscle |
| 2 | `age_band` | 50-54 / 55-59 / 60-64 / 65-69 / 70+ |
| 3 | `joints` | **multi-select** : knee · shoulder · lower back · hip · wrist · none |
| 4 | `equipment` | Gym / Dumbbells at home / **Bodyweight only** |
| 5 | `experience` | Never lifted / Lifted years ago / Currently lifting |
| 6 | `days` | 2 / 3 / 4 days per week |
| 7 | `building_plan` | Génération animée, **3-5 s réelles**. Dispositif de conversion (effort perçu), pas de la déco. |
| 8 | `plan_reveal` | « **Your Week 1 — 3 sessions.** Adapted for your knee: Back Squat → Box Goblet Squat. » + promesse : « We add load every week. » |

→ `onboarding_complete` → **Paywall soft** (`placement: onboarding`) → app.

**Disclaimer médical** affiché avant l'étape 1, et permanent en Settings :
> *IronHale is not medical advice. Consult your doctor before starting a new training program.*

---

## 4. Frontière gratuit / premium

**Principe : on ne gate pas la démo, on gate la répétition et l'adaptation.**

### GRATUIT (permanent)
- Bilan articulaire complet (onboarding)
- **Programme généré avec substitutions articulaires initiales appliquées**
- **Les 6 premières séances** : séries, reps, charges cibles, timer de repos, démos
- Historique des séances

### PREMIUM (entitlement `premium`)
1. **Séance 7 et au-delà** — la progression de charge, la périodisation, le deload. *C'est le produit.*
2. **Substitution dynamique + reflow** — « It's bothering me today »
3. **Courbe de force** — le graphe e1RM (hook de rétention long → tire l'annuel)
4. **Replanification** quand une séance est sautée

**Le point critique :** la substitution **statique** (issue du bilan) est **gratuite** — c'est le wedge, c'est ce qui produit les 5★, donc l'ASO. La substitution **dynamique** est payante. *La démo est gratuite, le moteur est payant.*

---

## 5. Paywall

`Paywall` de core (RevenueCatUI primaire, `FallbackPaywall` en secours — **même copy dans les deux**).

```
Title     : Keep getting stronger. Every week.
Subtitle  : Progressive strength training built around your joints — not against them.

Benefits  :
  ✓ A new session every week, heavier than the last
  ✓ Swap any exercise the day your knee or shoulder complains
  ✓ Watch your strength curve climb month after month
  ✓ Recovery windows calibrated for training after 50

CTA       : Unlock IronHale — $79.99/year
Sub-CTA   : Auto-renews yearly. Cancel anytime in the App Store.
Secondary : $12.99/month  ·  Restore purchases
Footer    : Terms · Privacy
```

### Placements

| `placement` | Déclencheur | Type |
|---|---|---|
| `onboarding` | après `plan_reveal` | **Soft** (✕) |
| `session7_gate` | tentative de lancer la séance 7 | **Hard** |
| `substitution_gate` | tap « It's bothering me today » | Hard |
| `progress_gate` | onglet Strength Curve | Hard |
| `settings` | ligne « Go Premium » | — |

*(`placement` est une **propriété** de `paywall_view`, pas un événement. Zéro drift dans core.)*

### Obligations Apple 3.1.2 — à l'écran, non négociables
Titre de l'abonnement · durée · prix · mention « auto-renews unless cancelled » · lien **EULA** · lien **Privacy**.
`FallbackPaywall` expose `privacyUrl` / `termsUrl` → **le footer légal doit aussi être activé sur le template RevenueCatUI côté dashboard.**

### Claims santé — interdits
Jamais : *heal · cure · treat · fix your pain · arthritis relief*.
Toujours : *adapts exercises around your sensitive joints*.

---

## 6. Modèle de données

Tout est **statique, bundlé, offline**. Zéro appel réseau, zéro LLM au runtime.

```ts
type Pattern =
  | 'squat' | 'hinge'
  | 'horizontal_push' | 'vertical_push'
  | 'horizontal_pull' | 'vertical_pull';

type Joint = 'knee' | 'shoulder' | 'lumbar' | 'hip' | 'wrist';
type EquipmentProfile = 'gym' | 'home_dumbbells' | 'bodyweight';

interface Exercise {
  id: string;
  name: string;                       // EN
  pattern: Pattern;
  profiles: EquipmentProfile[];       // dans quels profils il est disponible

  /** 0 = neutre · 1 = faible · 2 = modérée · 3 = forte.
   *  C'EST LE CŒUR DU PRODUIT. Chaque valeur ≥ 2 doit être défendable. */
  jointLoad: Record<Joint, 0 | 1 | 2 | 3>;

  progressionMode: 'load' | 'tier';   // kg vs palier de difficulté
  loadIncrementKg?: 1 | 2.5;          // si 'load' — 1 = haut du corps, 2.5 = bas
  tierChain?: string[];               // si 'tier' — ids ordonnés du plus facile au plus dur
  tierIndex?: number;                 // position dans sa chaîne

  skillTier: 1 | 2 | 3;
  stabilityDemand: 0 | 1 | 2 | 3;
  unilateral: boolean;
  demoId: string;
  cues: [string, string, string];     // 3 consignes max. Pas de paragraphe.
}
```

---

## 7. Bibliothèque v1 — 38 exercices

`jointLoad` en ordre : **knee / shoulder / lumbar / hip / wrist**

### Chargés (24) — profils `gym` et/ou `home_dumbbells`

| Pattern | id | Profils | kn | sh | lu | hi | wr |
|---|---|---|---|---|---|---|---|
| squat | `back_squat` | gym | **3** | 2 | **3** | 2 | 2 |
| squat | `goblet_squat` | gym, home | 2 | 1 | 1 | 2 | 1 |
| squat | `box_goblet_squat` | gym, home | **1** | 1 | 1 | 2 | 1 |
| squat | `leg_press` | gym | **1** | 0 | 1 | 2 | 0 |
| hinge | `deadlift` | gym | 1 | 1 | **3** | 3 | 2 |
| hinge | `trap_bar_deadlift` | gym | 2 | 1 | 2 | 3 | 2 |
| hinge | `db_romanian_deadlift` | gym, home | 1 | 1 | 2 | 3 | 1 |
| hinge | `db_hip_thrust` | gym, home | 1 | 0 | **1** | 3 | 0 |
| horizontal_push | `barbell_bench` | gym | 0 | **3** | 1 | 0 | 2 |
| horizontal_push | `db_bench` | gym, home | 0 | 2 | 1 | 0 | 1 |
| horizontal_push | `db_floor_press_neutral` | gym, home | 0 | **1** | 0 | 0 | 1 |
| horizontal_push | `machine_chest_press` | gym | 0 | **1** | 0 | 0 | 1 |
| vertical_push | `barbell_ohp` | gym | 0 | **3** | 2 | 0 | 2 |
| vertical_push | `seated_db_press` | gym, home | 0 | 2 | 1 | 0 | 1 |
| vertical_push | `landmine_press` | gym | 0 | **1** | 1 | 0 | 1 |
| vertical_push | `db_low_incline_press` | gym, home | 0 | 2 | 1 | 0 | 1 |
| horizontal_pull | `barbell_row` | gym | 1 | 1 | **3** | 1 | 1 |
| horizontal_pull | `chest_supported_db_row` | gym, home | 0 | 1 | **0** | 0 | 1 |
| horizontal_pull | `single_arm_db_row` | gym, home | 0 | 1 | 1 | 0 | 1 |
| horizontal_pull | `seated_cable_row` | gym | 0 | 1 | 1 | 0 | 1 |
| vertical_pull | `pull_up` | gym | 0 | **3** | 1 | 0 | 2 |
| vertical_pull | `lat_pulldown` | gym | 0 | 2 | 1 | 0 | 1 |
| vertical_pull | `db_pullover` | gym, home | 0 | 2 | 1 | 0 | 1 |
| vertical_pull | `half_kneeling_1arm_pulldown` | gym | 0 | **1** | 0 | 0 | 1 |

### Poids du corps (14) — profil `bodyweight`, `progressionMode: 'tier'`

| Pattern | id | tier | kn | sh | lu | hi | wr |
|---|---|---|---|---|---|---|---|
| squat | `chair_sit_to_stand` | 1 | **1** | 0 | 1 | 2 | 0 |
| squat | `box_squat_bw` | 2 | **1** | 0 | 1 | 2 | 0 |
| squat | `bw_squat` | 3 | 2 | 0 | 1 | 2 | 0 |
| squat | `split_squat_bw` | 4 | 2 | 0 | 1 | 2 | 0 |
| hinge | `glute_bridge` | 1 | 0 | 0 | **1** | 2 | 0 |
| hinge | `single_leg_glute_bridge` | 2 | 1 | 0 | **1** | 3 | 0 |
| hinge | `bw_good_morning` | 3 | 0 | 0 | 2 | 3 | 0 |
| hinge | `sl_rdl_bw` | 4 | 1 | 0 | 2 | 3 | 0 |
| horizontal_push | `wall_pushup` | 1 | 0 | **1** | 0 | 0 | 2 |
| horizontal_push | `incline_pushup` | 2 | 0 | 2 | 1 | 0 | **3** |
| horizontal_push | `knee_pushup` | 3 | 0 | 2 | 1 | 0 | **3** |
| horizontal_push | `floor_pushup` | 4 | 0 | 2 | 1 | 0 | **3** |
| horizontal_push | `fist_pushup` | 3* | 0 | 2 | 1 | 0 | **0** | ← *la seule option en cas de poignet sensible* |
| horizontal_pull | `inverted_row_table` | 1 | 0 | 1 | 1 | 0 | 1 |

### ⚠️ Trois trous connus, assumés et documentés

1. **`bodyweight` n'a AUCUN vertical_push ni vertical_pull acceptable.** Pike push-up = épaule 3 + poignet 3 ; traction = épaule 3. Les deux patterns **sont retirés** de la séance. Le programme bodyweight tourne sur **3 patterns**.
2. **`bodyweight` n'a qu'un seul tirage** (`inverted_row_table`). Sans lui, le programme serait posturalement déséquilibré — inacceptable sur un segment 50+ (épaules enroulées, cyphose). Il est donc **obligatoire**, avec un cue de sécurité explicite (*« Use a solid, weighted table. Test it with your full weight before starting. »*). C'est le point le plus fragile du mode bodyweight.
3. **`home_dumbbells` + épaule sensible** → le seul vertical_pull est `db_pullover` (épaule 2) : au-dessus du seuil dur. Le pattern est **retiré**, remplacé par une série supplémentaire de `chest_supported_db_row` (lumbaire 0, épaule 1).

**Nudge d'équipement (fin du bloc 1, mode bodyweight) :** *« You've hit the ceiling of bodyweight progression. A pair of dumbbells unlocks 24 more exercises and real load progression. »* — pas de vente d'équipement, pas d'affiliation. Juste une vérité.

**Décision reportée aux données :** `equipment` est envoyé comme propriété de `purchase`. Si les `bodyweight` convertissent à ~0 % en revue, on coupe le mode. Pas d'arbitrage au ressenti.

---

## 8. Moteur de substitution

Déterministe, offline, ~120 lignes. **Aucun LLM au runtime** : coût nul, latence nulle, reproductible donc débuggable.

```ts
interface Profile {
  equipment: EquipmentProfile;
  flaggedJoints: Joint[];                                  // du bilan, permanent
  temporaryFlags: { joint: Joint; expiresAt: number }[];   // "ça tire", 7 jours
  skillTier: 1 | 2 | 3;
}

const SAFE = 1;        // seuil DUR : un joint flaggé n'est jamais chargé au-dessus de 1
const TOLERATED = 2;   // dégradation contrôlée

function substitute(target: Exercise, p: Profile): Exercise[] {
  const flagged = activeFlags(p);                          // permanents + temporaires non expirés
  const pool = LIBRARY.filter(e =>
    e.pattern === target.pattern &&
    e.id !== target.id &&
    e.profiles.includes(p.equipment)
  );

  let safe = pool.filter(e => flagged.every(j => e.jointLoad[j] <= SAFE));
  if (safe.length === 0) safe = pool.filter(e => flagged.every(j => e.jointLoad[j] <= TOLERATED));
  if (safe.length === 0) return [];                        // → le pattern est RETIRÉ de la séance (§7)

  return safe
    .map(e => ({ e, s: score(e, target, p, flagged) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 2)
    .map(x => x.e);
}

function score(e: Exercise, target: Exercise, p: Profile, flagged: Joint[]): number {
  const jointCost = flagged.reduce((sum, j) => sum + e.jointLoad[j], 0);
  return (
    -10 * jointCost                                          // 1. sécurité articulaire — DOMINE TOUT
    +  4 * (e.progressionMode === 'load' ? 1 : 0)            // 2. progressif en charge = le positionnement
    +  3 * (e.unilateral === target.unilateral ? 1 : 0)      // 3. stimulus équivalent
    +  2 * (e.skillTier <= p.skillTier ? 1 : 0)              // 4. exécutable par lui
    -  1 * Math.abs(e.stabilityDemand - target.stabilityDemand)
  );
}
```

**La règle qui fait le produit :** la sécurité articulaire pèse **10×** plus que tout le reste. On ne « suggère pas une alternative », on **interdit** de charger un joint flaggé. Ça n'existe nulle part.

### Reflow (PREMIUM) — la feature non-clonable

Tap sur **« It's bothering me today »** → choix du joint →

1. L'exercice courant est remplacé (**2 propositions**, l'utilisateur choisit).
2. **Tous les exercices restants de la séance** sont re-filtrés avec le joint temporairement flaggé. Ceux qui le chargent **≥ 2** sont substitués. Ceux à **1** passent en **RIR 3** (intensité réduite).
3. Le joint reste flaggé **7 jours**. À expiration : *« Is your shoulder feeling better? »* → Yes / Still a bit / It's permanent (→ passe dans `flaggedJoints`).

C'est le seul mécanisme qu'un concurrent ne réplique pas en une après-midi.

---

## 9. Moteur de programmation

### Split (depuis `days`)

| j/sem | Split | Récupération |
|---|---|---|
| 2 | Full Body A / B | ≥ 72 h |
| 3 | Full Body A / B / C | ≥ 48 h |
| 4 | Upper A / Lower A / Upper B / Lower B | ≥ 48 h sur le même pattern lourd |

**Séance = 4 exercices** (patterns tournants) + 1 accessoire optionnel. Durée cible **35-45 min**. Au-delà, l'adhérence 50+ s'effondre.

### Progression

**Mode `load`** — double progression, **RIR 2 en permanence, jamais d'échec musculaire.**
- 3 × 8-12 reps
- Les 3 séries atteignent 12 à RIR ≥ 2 → **+2,5 kg** (bas) / **+1 kg** (haut), retour à 8
- 2 séances consécutives sous 8 reps → **−10 %** sur cet exercice

**Mode `tier`** (bodyweight)
- 3 × 8-15 reps
- Les 3 séries atteignent 15 → **passage au tier suivant** de la `tierChain`, retour à 8
- Tier max atteint → nudge équipement (§7)

**RIR 2 / jamais d'échec** est un argument de sécurité *et* de rétention : courbatures maîtrisées = il revient à J3.

### Deload — « fenêtres de récupération calibrées »
**Semaine 5 : 2 séries au lieu de 3, charges −10 %.** Puis reprise à +2,5 kg au-dessus du dernier pic.
C'est ce qui rend crédible « calibrated for training after 50 ».

### Courbe de force (PREMIUM)
e1RM Epley : `charge × (1 + reps / 30)`. Un point par pattern par séance. 6 courbes.
**Mode `bodyweight` : e1RM impossible** → on affiche la progression de **tier** (« Push-ups: wall → incline → knees »). Feature dégradée pour ce segment — c'est un argument de plus pour tracker `equipment` sur `purchase`.

---

## 10. Démos

**Aucune bibliothèque vidéo.** Les exercices sont des **données**.

Deux voies acceptables :

**(a) Set d'animations acheté** — un pack acheté **une fois** ne casse pas l'avantage : ce qu'on fuit, c'est le coût **récurrent** de production. Quatre critères, non négociables :
1. Licence **commerciale + redistribution dans un binaire compilé**. *(La plupart des packs « gratuits » d'animations d'exercices sont scrapés d'autres apps — inutilisables.)*
2. **Lottie (JSON)** en priorité, sinon WebP/APNG. **Jamais de mp4** : poids du bundle, et c'est littéralement la bibliothèque vidéo qu'on refuse.
3. **Couverture des 38 exercices, ou rien.** Un set qui en couvre 25 est *pire* qu'inutile : deux styles graphiques mélangés = perception « app cheap ».
4. **Extensible** : ajouter le 39ᵉ exercice ne doit pas exiger de recommander une prod.

**(b) Rig SVG maison** — silhouette vectorielle articulée (react-native-svg + Reanimated), **3 keyframes par exercice** (départ / mi-course / fin), interpolation, boucle 2,5 s. Les exercices restent des données : le 39ᵉ coûte 10 minutes.

⚠️ **Risque n°1 du MVP :** un rendu médiocre sur une app à 79,99 $/an → remboursements et 1★. **Checkpoint sur le rendu, pas sur le temps passé :** si la démo n'est pas digne du prix, on bascule sur du statique (2 poses + 3 cues) **et l'annuel descend à 59,99 $**. Décision à la vue du rendu, jamais avant.

---

## 11. Écrans (Expo Router) + persistance

| Route | Contenu | Gate |
|---|---|---|
| `/onboarding` | `OnboardingFlow`, 8 steps | — |
| `/paywall` | `Paywall` de core | 5 placements (§5) |
| `/(tabs)/today` | Prochaine séance + CTA. **Compteur « Session 4 / 6 free »**. | — |
| `/workout/[id]` | Exos, séries, saisie charge+reps, timer de repos, démo, **« It's bothering me today »** | bouton = premium |
| `/(tabs)/progress` | Strength Curve (e1RM ou tiers) | **premium** |
| `/(tabs)/settings` | Restore · Manage subscription · Privacy · Terms · **Medical disclaimer** · Reset | — |

**Persistance : AsyncStorage**, un blob JSON **versionné** (`schemaVersion`). < 100 Ko sur 2 ans. Pas de SQLite : dépendance native en plus, migration en plus, gain nul à cette échelle.

**1 notification locale** : rappel de séance (rétention D7). Pas de push serveur.

---

## 12. Analytics

Taxonomie existante (`docs/analytics-events.md`) : `install`, `onboarding_step`, `onboarding_complete`, `paywall_view`, `paywall_dismiss`, `purchase`, `restore`.
*(`trial_start` n'est jamais émis — pas d'essai.)*

### Un seul ajout à `packages/core`

Il n'y a rien entre `onboarding_complete` et `purchase`. Or « % d'installs atteignant la séance 6 » est **le prédicteur avancé de la conversion, lisible avant tout revenu**. Sans lui, tu es aveugle 4 semaines.

```ts
// packages/core/src/analytics/events.ts
core_action   // { action: string, index?: number }
```

Générique, réutilisable par les 11 apps suivantes. Correspond à la ligne « Activation — 1re action clé » du schéma dashboard. **À documenter dans `docs/analytics-events.md`.**

IronHale émet :

| `action` | `index` | Quand |
|---|---|---|
| `plan_generated` | — | fin de `building_plan` |
| `workout_complete` | n° de séance | fin de séance |
| `substitution_used` | — | reflow déclenché |
| `equipment_blocked` | — | *(supprimé — bodyweight est supporté)* |

Propriété ajoutée à `purchase` : **`equipment`** (`gym` / `home_dumbbells` / `bodyweight`).

### Funnel PostHog

```
install
 → onboarding_complete             cible ≥ 70 %
 → paywall_view (onboarding, soft) conversion attendue ~0-1 %
 → core_action workout_complete index=1
 → core_action workout_complete index=6      ← LE prédicteur
 → paywall_view (session7_gate)
 → purchase
```

---

## 13. Objets à créer (strings exactes)

### RevenueCat
| Objet | Identifiant |
|---|---|
| Entitlement | `premium` — **ne pas renommer en `pro`** (= défaut `EXPO_PUBLIC_RC_ENTITLEMENT_ID`) |
| Offering | `default` — doit être **Current** (`getCurrentOffering()` le lit) |
| Package | `$rc_annual` (packageType `ANNUAL` → présélectionné par `FallbackPaywall`) |
| Package | `$rc_monthly` (packageType `MONTHLY`) |
| Flag | **Small Business Program : ON** (sinon le reporting revenu est faux de 15 %) |

### App Store Connect
- Subscription Group : `ironhale_premium` — **un seul groupe** (upgrade/downgrade mensuel↔annuel)
- `com.parphelie.ironhale.premium.annual` — 79,99 $ — **aucune introductory offer**
- `com.parphelie.ironhale.premium.monthly` — 12,99 $ — aucune offre
- ⚠️ Les Product IDs Apple sont uniques sur **tout le compte** → toujours préfixer par le bundle id

### Play Console
- Subscription `premium`
  - Base plan `annual` — 79,99 $ — auto-renewing, **aucune offre**
  - Base plan `monthly` — 12,99 $ — auto-renewing
- Côté RevenueCat : `premium:annual`, `premium:monthly`

### `.env`
```
EXPO_PUBLIC_RC_IOS_API_KEY=appl_…
EXPO_PUBLIC_RC_ANDROID_API_KEY=goog_…
EXPO_PUBLIC_RC_ENTITLEMENT_ID=premium
EXPO_PUBLIC_POSTHOG_API_KEY=phc_…
EXPO_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
EXPO_PUBLIC_DEFAULT_REGION=auto
EXPO_PUBLIC_SMALL_BUSINESS_PROGRAM=true
EXPO_PUBLIC_ENABLE_WEB_PURCHASE=false
```

---

## 14. ASO — le risque n°1 est le vocabulaire, pas le concept

**Données réelles constatées (ne pas les réinventer) :**
- `strength over 50` / `senior strength` → **0 suggestion** en autocomplete. **Vocabulaire mort.**
- `muscle after 50` → **en forte accélération** sur Google Trends. **C'est LE lexique porteur.**
- `workout for seniors` → ramène du chair-workout gratuit. **Segment doux, à éviter.**
- Sur Play, les apps dédiées seniors qui rankent sont **faibles** (une à 1,8★) → terrain à prendre.

→ **L'ASO se construit autour de « muscle after 50 » / « strength training over 50 ». JAMAIS autour de « senior ».**

⚠️ **Ne pas compter sur Apple Search Ads popularity :** la métrique s'est effondrée en octobre 2025 (−77 % des mots-clés US au-dessus du plancher) et l'outil exige une app publiée. **La vérité terrain = les termes de recherche dans App Store Connect, une fois live.**

Le titre et les mots-clés se figent à l'**étape 6**, sur données réelles. **Aucun volume n'est inventé ici.**

---

## 15. Seuils de décision

⚠️ **La fenêtre standard de 14 jours ne fonctionne pas ici.** Le mur est à la séance 7 : à 3 j/sem c'est **~J14**, à 2 j/sem c'est **~J21**. Aucune conversion payante n'existe avant. Juger `install→payant` à J14, c'est juger un zéro d'artefact.

**Amendement à la règle du portefeuille (à répercuter dans `docs/decision-rules.md`) :**

| Revue | Métrique jugée | Verdict possible |
|---|---|---|
| **J14** | DL organiques · D1 · D7 · install→`workout_complete` #1 et #3 | **KILL uniquement** (acquisition morte) |
| **J28** | install→`workout_complete` #6 · `session7_gate`→`purchase` · install→payant | KILL / MAINTAIN / **DOUBLE-DOWN** |

| Métrique | KILL | DOUBLE-DOWN |
|---|---|---|
| DL organiques (14 j) | < 50 | ≥ 300 |
| D1 | < 20 % | ≥ 25 % |
| D7 | < 8 % | ≥ 12 % |
| install → séance 1 | < 20 % | ≥ 35 % |
| install → séance 3 | — | ≥ 18 % |
| install → séance 6 | — | ≥ 10 % |
| `session7_gate` → `purchase` | < 8 % | ≥ 20 % |
| **install → payant (J28)** | **0** | **≥ 2,0 %** |

**Ces verdicts ne se prononcent qu'en revue hebdo. Pas un jour avant.**

---

## 16. Gel de scope

**Ce SPEC est verrouillé.** Toute idée nouvelle va en `Post-v1` ci-dessous et **n'entre pas dans le MVP**. C'est le seul garde-fou contre le risque n°2 — et il ne dépend d'aucune estimation de temps.

### IN
Onboarding 8 étapes · 38 exercices · substitution statique **et** dynamique + reflow · programmation (split, double progression, tiers, deload S5) · exécution de séance + timer · démos · courbe de force · compteur + gate séance 7 · paywall 5 placements · analytics + `core_action` · disclaimer médical · 1 notification locale

### OUT (chaque ligne est une tentation à laquelle on ne cède pas)
Compte / cloud sync · Apple Health / Google Fit · push serveur · **nutrition / protéines / créatine** *(c'est le lexique ASO porteur → c'est une **autre app**, pas une feature)* · social · vidéo · wearables · iPad / Watch · plusieurs objectifs ou blocs · élastiques · langues ≠ EN · **A/B test** · widget

### Post-v1 (file d'attente, ordonnée)
1. Paywall onboarding **soft vs hard** (A/B)
2. **Lifetime à 149 $** en 3ᵉ option — *à déclencher si `session7_gate`→`purchase` < 12 %*
3. Localisation FR / DE / ES
4. Élastiques + progression par tension
5. Apple Health / Google Fit

**Règle A/B :** **aucune Experiment RevenueCat tant qu'un bras n'a pas ~1 000 `paywall_view`.** Détecter 2 % → 3 % demande ~2 300 users/bras. En dessous, on ne produit pas de l'information, on produit du bruit qu'on prendra pour un signal — carburant direct du risque n°2.
L'Offering est distant → une variante s'ajoute **sans build**.

---

## 17. Risques

| Risque | Gravité | Mitigation |
|---|---|---|
| `jointLoad` mal calibré → blessure | **Haute** | RIR 2 · jamais d'échec · disclaimer. **Chaque valeur ≥ 2 doit être justifiable — ne pas la générer à l'IA sans relecture humaine.** |
| Rendu des démos indigne du prix | **Haute** | Checkpoint sur le **rendu**. Si NON → statique + annuel à 59,99 $. |
| Mode `bodyweight` : 3 patterns, 1 seul tirage, courbe de force dégradée | Moyenne | Documenté (§7). Tracké via `equipment` sur `purchase`. **Coupé sur données si conversion ≈ 0.** |
| `inverted_row_table` → table qui bascule | Moyenne | Cue de sécurité explicite. Seule alternative : couper le tirage → posturalement inacceptable. |
| Claims santé → rejet Apple 1.4.1 / Play Health policy | **Bloquante** | Vocabulaire (§5) + disclaimer. Audit à l'étape 7. |
| Fee model Google en cours de déploiement (rate cards 30/09/2026) | Économique | Re-vérifier le taux effectif Play **avant soumission**. 15 % = hypothèse retenue. |
| Dérive de scope | **Haute — risque n°2** | §16. Le gel est la mitigation. |

---

## 18. Reste de la chaîne

3. ✅ Clone du template — `pnpm create-app ironhale com.parphelie.ironhale`
4. RevenueCat + PostHog + produits ASC/Play + **enrôlement Apple SBP**
5. **Dev build EAS + achat sandbox iOS et Android** *(les achats ne marchent pas en Expo Go)*
6. Métadonnées + ASO (lexique « muscle after 50 ») + screenshots
7. Conformité 4.3 + privacy + claims santé
8. Soumission

**Aucune étape n'est sautée. Le but de ce build n'est pas seulement IronHale : c'est de prouver la chaîne de bout en bout pour la première fois.**