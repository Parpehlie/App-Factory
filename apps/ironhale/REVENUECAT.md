# IronHale — RevenueCat de bout en bout

> Runbook d'exécution. Valeurs exactes, ordre de dépendance, pièges.
> État au départ : projet RevenueCat `IronHale` créé (0/6 étapes), **rien** côté App Store
> Connect ni Play Console. Code déjà branché (`@app-factory/core` → `react-native-purchases` 10.x).

---

## 0. Chemin critique (lis ça d'abord)

Deux étapes ont une **latence subie** que tu ne peux pas compresser. Lance-les **aujourd'hui**,
en premier, avant tout le reste :

| Blocker | Latence | Conséquence si tu le fais en dernier |
|---|---|---|
| **Google — service account credentials** | **jusqu'à 36 h** de propagation | Tu ne peux pas tester un achat Android. Bloque toute la phase 6. |
| **Apple — contrat Paid Apps** (Business → Agreements, + fiscal + bancaire) | heures à ~1 jour | **Tu ne peux pas créer d'abonnement dans ASC.** Bloque tout iOS. |

Ordre optimal :

```
J0 matin  : Apple contrat Paid Apps  +  Google service account  (les 2 en parallèle)
J0 après  : ASC (bundle id, app, produits)  +  Play (app, AAB internal, produits)
J0 soir   : RevenueCat (apps, credentials, entitlement, offering, paywall) + .env
J1        : EAS dev build + test sandbox iOS
J1/J2     : test sandbox Android (dès que les credentials Google sont validés)
```

---

## 1. Valeurs verrouillées (à utiliser telles quelles partout)

Issues de `SPECS.md` §0 et §2. Ne pas improviser : ces identifiants doivent être **identiques**
sur les deux stores, sinon la config RevenueCat devient un fromage.

| | Valeur |
|---|---|
| Bundle ID iOS / package Android | `com.parphelie.ironhale` |
| Entitlement RevenueCat | `premium` *(doit matcher `EXPO_PUBLIC_RC_ENTITLEMENT_ID`)* |
| Offering RevenueCat | `default` — **marqué "Current"** |
| Package mensuel | `$rc_monthly` |
| Package annuel | `$rc_annual` |
| Product ID mensuel (iOS **et** Android) | `ironhale_premium_monthly` |
| Product ID annuel (iOS **et** Android) | `ironhale_premium_annual` |
| Subscription group (Apple) | `IronHale Premium` |
| Base plan Android mensuel | `monthly-autorenewing` |
| Base plan Android annuel | `annual-autorenewing` |
| Prix mensuel | **12,99 $ / 12,99 €** |
| Prix annuel | **79,99 $ / 79,99 €** |
| Essai gratuit | **AUCUN** — pas d'intro offer, pas de free trial. Les 6 séances *sont* l'essai. |

> ⚠️ Le code (`FallbackPaywall`) trie sur `packageType === 'ANNUAL' | 'MONTHLY'`. Si tu crées
> des packages custom au lieu de `$rc_annual` / `$rc_monthly`, l'annuel ne sera plus
> pré-sélectionné et les libellés « /year » « /month » tombent en fallback. Utilise les
> identifiants standard.

---

## 2. Apple — App Store Connect

### 2.1 Contrat Paid Apps (**bloquant, à faire en premier**)
`App Store Connect → Business` (ex-« Agreements, Tax, and Banking ») :
1. Accepter le contrat **Paid Applications**.
2. Renseigner **coordonnées bancaires** (IBAN) + **formulaires fiscaux** (US W-8BEN si tu es en
   France, + fiscalité FR).
3. Attendre le statut **Active**. Tant qu'il est en attente, la section **Subscriptions** de
   l'app refuse la création de produits.
4. Vérifier l'inscription au **Small Business Program** (15 % au lieu de 30 %) — c'est
   l'hypothèse chiffrée de `SPECS.md` §2 et du flag `EXPO_PUBLIC_SMALL_BUSINESS_PROGRAM=true`.

### 2.2 Bundle ID
`developer.apple.com → Certificates, IDs & Profiles → Identifiers → +`
- Type : **App IDs → App**
- Description : `IronHale`
- Bundle ID : **Explicit** → `com.parphelie.ironhale`
- Capabilities : rien à cocher de spécial (In-App Purchase est actif par défaut).

### 2.3 Créer l'app
`App Store Connect → Apps → +` :
- Platform : **iOS**
- Name : `IronHale`
- Primary language : **English (U.S.)** (marchés v1 = US + EU, anglais uniquement)
- Bundle ID : `com.parphelie.ironhale`
- SKU : `ironhale`

### 2.4 Créer le subscription group + les 2 abonnements
`Ton app → Monetization → Subscriptions → Create` :

**Subscription Group** : Reference Name `IronHale Premium`.
Localisation du groupe (en-US) : Display Name `IronHale Premium`.
*(Le groupe unique est ce qui permet à l'utilisateur de passer mensuel ↔ annuel sans double
facturation — ne crée PAS deux groupes.)*

Puis, **dans ce groupe**, deux abonnements :

| | Mensuel | Annuel |
|---|---|---|
| Reference Name | `IronHale Premium Monthly` | `IronHale Premium Annual` |
| Product ID | `ironhale_premium_monthly` | `ironhale_premium_annual` |
| Duration | 1 Month | 1 Year |
| Prix US | 12,99 $ | 79,99 $ |
| Prix EU | 12,99 € (vérifier la grille FR/DE/ES) | 79,99 € |
| Introductory Offer | **aucun** | **aucun** |
| Rank dans le groupe | 1 | 2 *(le rank sert aux upgrades — l'annuel doit être ≥ mensuel)* |

Pour chaque produit, remplis la **localisation en-US** (Display Name + Description) et
l'**App Store promotion / review screenshot** — sans ça le produit reste en *Missing Metadata*
et Apple ne le renverra pas au SDK.

État visé : **Ready to Submit** (suffisant pour le sandbox ; le passage en *Approved* se fait
avec la première soumission de l'app).

### 2.5 Clés pour RevenueCat
`App Store Connect → Users and Access → Integrations` :

1. Onglet **In-App Purchase** → *Generate In-App Purchase Key* → nom `RevenueCat` →
   **télécharger le .p8** (une seule chance).
   → **Obligatoire** : on est sur `react-native-purchases` 10.x = StoreKit 2. Sans cette clé,
   les transactions ne sont **pas enregistrées** par RevenueCat et l'entitlement n'est jamais
   accordé. C'est le piège n°1 de ce setup.
2. Note l'**Issuer ID** affiché en haut de la page. S'il n'apparaît pas : crée une
   **App Store Connect API Key** quelconque, l'Issuer ID apparaîtra (il est commun aux deux).

### 2.6 Sandbox tester
`Users and Access → Sandbox → Testers → +` : email valide que tu contrôles (alias `+sandbox`
sur Gmail suffit), **App Store Country = United States** pour un premier test, puis un 2e
compte **France** pour valider les prix EU.

---

## 3. Google — Play Console + Google Cloud

### 3.1 Service account (**bloquant, jusqu'à 36 h — à lancer en premier**)
Google Cloud Console, projet dédié (`ironhale`) :
1. Activer les APIs : **Google Play Android Developer** (`androidpublisher`), **Google Play
   Developer Reporting**, **Cloud Pub/Sub**.
2. `IAM & Admin → Service Accounts → Create` : nom `revenuecat-service-account`.
3. Rôles : **Pub/Sub Editor** (ou *Pub/Sub Admin* si erreur de permission) + **Monitoring Viewer**.
4. `Manage Keys → Add Key → JSON` → télécharger `revenuecat-key.json`.
5. Play Console → **Users and permissions → Invite user** → email du service account
   (`revenuecat-service-account@<project>.iam.gserviceaccount.com`). Permissions **obligatoires** :
   - View app information and download bulk reports (read-only)
   - View financial data, orders, and cancellation survey responses
   - Manage orders and subscriptions

> RevenueCat propose un script `credentials.sh` à coller dans Google Cloud Shell qui fait les
> points 1→4 automatiquement. Plus rapide et moins d'erreurs :
> https://www.revenuecat.com/docs/service-credentials/creating-play-service-credentials

### 3.2 Créer l'app + un build sur la piste interne
Play Console → **Create app** : nom `IronHale`, anglais (US), **App**, **Paid/Free : Free**
(les abonnements ne comptent pas comme "paid app").

Puis **uploader un AAB signé sur Internal testing**. C'est un prérequis dur :
- sans bundle uploadé, la section **Monetize** ne laisse pas créer de produits achetables,
- et un achat sandbox exige que le package name soit connu de Play.

```bash
cd apps/ironhale
eas build --profile preview --platform android   # produit un .aab signé
# puis upload manuel sur Play Console → Testing → Internal testing → Create release
```

Ajoute ton compte Google en **License tester** (`Play Console → Setup → License testing`) —
sinon tes achats sandbox sont facturés pour de vrai.

### 3.3 Les 2 abonnements
`Monetize → Products → Subscriptions → Create subscription` :

| | Mensuel | Annuel |
|---|---|---|
| Product ID | `ironhale_premium_monthly` | `ironhale_premium_annual` |
| Name | `IronHale Premium Monthly` | `IronHale Premium Annual` |
| Base plan ID | `monthly-autorenewing` | `annual-autorenewing` |
| Type | Auto-renewing | Auto-renewing |
| Billing period | 1 month | 1 year |
| Prix | 12,99 $ / 12,99 € | 79,99 $ / 79,99 € |
| Free trial / offer | **aucun** | **aucun** |
| Statut | **Active** | **Active** |

⚠️ Sur Android, un produit sans **base plan activé** n'est jamais renvoyé par le SDK. Le produit
*et* le base plan doivent être **Active**.

---

## 4. RevenueCat — dashboard

Projet **IronHale** → `Project settings → Apps`.

### 4.1 App Store
- *+ New app* → **App Store**
- App name : `IronHale iOS`
- **Bundle ID** : `com.parphelie.ironhale`
- **In-app purchase key** : upload du `.p8` (§2.5)
- **Issuer ID** : celui de §2.5
- Save → attendre le badge **Valid credentials** (toutes les permissions cochées).
- **App Store Server Notifications** : RevenueCat affiche une URL → la coller dans
  `App Store Connect → ton app → App Information → App Store Server Notifications`
  (**Production URL** *et* **Sandbox URL**, version **V2**).

### 4.2 Play Store
- *+ New app* → **Play Store**
- Package name : `com.parphelie.ironhale`
- Upload du `revenuecat-key.json`
- Save → le badge reste rouge jusqu'à validation (**≤ 36 h**). Astuce d'accélération : modifier
  puis re-sauver la description d'un produit dans Play Console, ça force souvent la validation
  immédiate.
- **Real-time developer notifications** : RevenueCat génère un **Topic ID** Pub/Sub →
  le coller dans `Play Console → Monetize → Monetization setup → Real-time developer notifications`.

### 4.3 Produits
`Product catalog → Products → + New` (ou **Import products** une fois les credentials valides) :

| Store | Identifier |
|---|---|
| App Store | `ironhale_premium_monthly` |
| App Store | `ironhale_premium_annual` |
| Play Store | `ironhale_premium_monthly:monthly-autorenewing` |
| Play Store | `ironhale_premium_annual:annual-autorenewing` |

*(Sur Play, RevenueCat référence un produit par `productId:basePlanId`.)*

### 4.4 Entitlement
`Product catalog → Entitlements → + New`
- Identifier : **`premium`** (exactement — c'est la clé lue par `usePremium()`)
- Description : `Full access — unlimited adaptive program`
- **Attach** les **4** produits ci-dessus.

> Si l'identifier diffère de `premium`, il faut aligner `EXPO_PUBLIC_RC_ENTITLEMENT_ID`.
> Ne le fais pas : garde `premium`, c'est la convention de tout le portfolio.

### 4.5 Offering
`Product catalog → Offerings → + New`
- Identifier : `default` · Description : `Standard IronHale paywall`
- **Make current** ✅ (sinon `getOfferings().current` est `null` et le paywall est vide)
- Packages :
  - `$rc_annual` → `ironhale_premium_annual` (iOS) + `ironhale_premium_annual:annual-autorenewing` (Android)
  - `$rc_monthly` → `ironhale_premium_monthly` (iOS) + `ironhale_premium_monthly:monthly-autorenewing` (Android)
- Ordre d'affichage : **annuel en premier** (c'est la cible : mix 70/30 visé, `SPECS.md` §2).

### 4.6 Paywall
`Paywalls → New paywall` sur l'offering `default`.

Le code appelle `RevenueCatUI.Paywall` (`packages/core/src/paywall/Paywall.tsx`). **Si aucun
paywall n'est publié sur l'offering courant, l'écran est vide** — c'est le piège n°2.

Contenu (repris de l'i18n `en` de l'app, garde la cohérence) :
- Titre / sous-titre / bénéfices : mêmes strings que `src/i18n/strings/en.ts → paywall`
- **Pas de mention d'essai gratuit** (aucun trial configuré) — un CTA « Start free trial » sur un
  produit sans intro offer = rejet Apple 3.1.2 et 1★ garantis sur ce segment.
- Boutons légaux obligatoires : **Restore purchases**, **Terms (EULA)**, **Privacy**.

### 4.7 Clés SDK
`Project settings → API keys → Public app-specific keys` → copier :
- `appl_…` → `EXPO_PUBLIC_RC_IOS_API_KEY`
- `goog_…` → `EXPO_PUBLIC_RC_ANDROID_API_KEY`

---

## 5. Code — `apps/ironhale/.env`

```bash
cd apps/ironhale && cp .env.example .env
```

Puis remplir (le fichier est git-ignoré ; **toutes** les valeurs sont publiables) :

```
EXPO_PUBLIC_RC_IOS_API_KEY=appl_...
EXPO_PUBLIC_RC_ANDROID_API_KEY=goog_...
EXPO_PUBLIC_RC_ENTITLEMENT_ID=premium
EXPO_PUBLIC_POSTHOG_API_KEY=phc_...
EXPO_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
EXPO_PUBLIC_DEFAULT_REGION=auto
EXPO_PUBLIC_SMALL_BUSINESS_PROGRAM=true
EXPO_PUBLIC_ENABLE_WEB_PURCHASE=false
```

**À corriger avant soumission** (`app/paywall.tsx`) : `PRIVACY_URL` pointe sur
`https://parphelie.com/ironhale/privacy` — la page doit **exister** (Apple la fetch en review) ;
`TERMS_URL` utilise l'EULA standard Apple, ce qui est accepté.

Rien d'autre à toucher dans le code : `initBilling` / `PremiumProvider` / `usePremium` sont déjà
câblés, et le gate séance 7 (`app/(tabs)/today.tsx:36`) lit directement l'entitlement.

---

## 6. Test sandbox

```bash
cd apps/ironhale
eas login && eas init                                   # une fois
eas build --profile development --platform ios          # dev-client, PAS Expo Go
eas build --profile development --platform android
npx expo start --dev-client
```

> **Expo Go ne peut pas acheter.** Les modules natifs RevenueCat n'y sont pas : `getOfferings()`
> renvoie `null`, le paywall tombe en fallback vide et `isPremium` reste `false`. Toute
> « vérification » du paywall dans Expo Go est un faux négatif.

Checklist de validation — les 8 cas, sur **les deux** plateformes :

- [ ] Le paywall affiche **2 packages**, prix corrects, **annuel pré-sélectionné**
- [ ] Achat **annuel** → `isPremium` passe à `true` → séance 7 débloquée
- [ ] Achat **mensuel** → idem
- [ ] **Restore** sur une réinstall (app supprimée/réinstallée) → premium revient
- [ ] **Annulation** (sandbox) → à l'expiration, `isPremium` repasse à `false` et le gate revient
- [ ] La transaction apparaît dans RevenueCat **avec le toggle *Sandbox data* activé**
- [ ] `paywall_view` / `purchase` remontent dans PostHog avec le bon `placement`
      (`onboarding`, `session7_gate`, `substitution_gate`, `progress_gate`, `settings`)
- [ ] Gate **hard** (`session7_gate`) non dismissible / gate **soft** (onboarding) dismissible

Notes sandbox :
- iOS : 1 an → renouvellement toutes les **1 h** en sandbox, **24 h** en TestFlight. Les prix
  sandbox sont souvent faux — ne debug pas là-dessus, seul le **flux** compte.
- Android : achats gratuits uniquement si ton compte est **License tester**.

---

## 7. Pièges qui coûtent une journée

1. **In-App Purchase Key manquante** → StoreKit 2 achète, mais RevenueCat n'enregistre rien →
   l'utilisateur paie et reste bloqué. Silencieux. C'est le bug le plus cher du setup.
2. **Offering pas marqué "Current"** → paywall vide, aucune erreur.
3. **Aucun paywall publié** sur l'offering → `RevenueCatUI.Paywall` rend un écran vide.
4. **Credentials Google pas encore validés** (< 36 h) → `InvalidCredentialsError`, tu vas croire
   à un bug de code.
5. **Base plan Android non activé** → produit invisible côté SDK.
6. **Contrat Paid Apps non actif** → impossible de créer les abonnements, et les produits déjà
   créés disparaissent du SDK.
7. **Product IDs différents entre stores** → deux entitlements à maintenir, offering en vrac.
8. **Test dans Expo Go** → faux négatifs sur tout.

---

## 8. Après le premier achat sandbox

- Vérifier dans `Customers` que l'entitlement `premium` est actif, avec le bon `productIdentifier`
  et `store`.
- Brancher l'**intégration PostHog** de RevenueCat (`Integrations → PostHog`) pour que les events
  de revenu (renouvellements, churn) rejoignent le funnel produit — sinon le taux
  install→payant de `SPECS.md` §2 (2,4 % visé) n'est pas mesurable.
- Activer **Experiments** plus tard, une fois du trafic réel : A/B sur l'offering, pas sur le code.
