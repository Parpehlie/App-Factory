# App Factory

A monorepo for shipping a portfolio of iOS + Android apps on a **1-app-per-week** model:
clone a template, change the concept, ship. The parts that actually move revenue —
the **paywall** and the **onboarding → paywall funnel** — live in a shared `core` package
and are built with care, not stubbed.

**Stack:** pnpm workspaces + Turborepo · TypeScript (strict) · Expo SDK 57 + Expo Router ·
RevenueCat (native IAP) · PostHog (EU cloud) · EAS.

**Payments:** native IAP via RevenueCat only — see [`docs/payment-strategy.md`](docs/payment-strategy.md).
No external/web checkout is wired; it's stubbed behind an OFF-by-default region-gated flag.

---

## (a) What's done

- **Monorepo**: pnpm workspaces (`apps/*`, `packages/*`) + Turborepo, strict TS, hoisted
  node-linker for Expo/RN, documented `.env.example` (publishable keys only — no secrets).
- **`packages/core`** (`@app-factory/core`) — the shared engine:
  - `billing/` — RevenueCat wrapper (init, entitlement, purchase, restore, listener) +
    `PremiumProvider` / `usePremium()`. **Single source of premium truth.**
  - `paywall/` — `Paywall` using **RevenueCatUI** (remote-configurable, RevenueCat
    **Experiments** A/B-ready) with a clean custom **fallback paywall** (value prop,
    pricing, trial detection, CTA, restore, legal links).
  - `onboarding/` — configurable funnel emitting `onboarding_step` / `onboarding_complete`.
  - `region/` — US/EU/OTHER detection + feature flags incl. `enableWebPurchase` (OFF) and
    the web-purchase **stub**.
  - `analytics/` — PostHog wrapper + typed event taxonomy.
  - `config/` — env-driven, no hardcoded secrets, SBP flag.
  - `remote-config/` — fail-open kill-switch placeholder.
- **`apps/_template`** — runnable Expo Router app: `onboarding → paywall → tabs (home +
  settings)`, settings with restore / manage subscription / privacy / terms, rewritable
  `app.config.ts`, monorepo-aware Metro/Babel, `eas.json`, placeholder icon/splash.
- **`scripts/create-app`** — `pnpm create-app <name> <bundleId>` clones the template.
- **`docs/`** — payment strategy, compliance checklist (Apple 4.3 / privacy / payment),
  analytics taxonomy, dashboard schema + CSV.
- **`agents/`** — 4 reusable prompts: ideation, ASO first pass, metadata, compliance check.

**Definition of done — verified:** `pnpm install` ✓ · `pnpm --filter _template start`
boots Metro ✓ · `pnpm typecheck` passes ✓ · `pnpm create-app demo com.me.demo` produces a
typechecking, config-resolving app ✓.

> ⚠️ **Real purchases require an EAS dev build, not Expo Go** — the RevenueCat native
> modules aren't in Expo Go. UI/flow can be previewed in Expo Go; buying cannot.

---

## (b) What you must do by hand

None of this can be scaffolded — it's account/keys work. Do it once per tool, then per app.

### One-time (accounts)
1. **RevenueCat** — create a project. Add an **iOS app** and an **Android app**. Grab the
   two **public SDK keys** (`appl_…`, `goog_…`). Create an **Entitlement** (default id used
   here: `premium`) and an **Offering** with your packages.
2. **PostHog** — create a project on **EU cloud** (`https://eu.i.posthog.com`). Copy the
   **project API key** (`phc_…`).
3. **Apple** — Apple Developer Program membership; enrol in the **Small Business Program**
   (15% commission) if eligible. Create the app in **App Store Connect**.
4. **Google** — Play Console developer account; create the app.
5. **EAS / Expo** — `npm i -g eas-cli` (or use `pnpm dlx eas-cli`), create an Expo account,
   `eas login`.

### Per app
6. Choose a unique **bundle id / package** (`com.you.<app>`) — never reuse one.
7. In **App Store Connect** + **Play Console**: create the subscription **products**, set
   **US + EU prices**, and map them to the RevenueCat Offering/Entitlement.
8. Configure the store products inside **RevenueCat** and design the **remote paywall**.
9. Fill **App Privacy** (Apple) / **Data Safety** (Google) to match PostHog collection.
10. Publish **Privacy Policy** + **Terms/EULA** URLs and point the app at them
    (`apps/<app>/app/paywall.tsx` and `settings.tsx` currently use `example.com` — replace).
11. Replace placeholder **icon/splash** in `apps/<app>/assets/`.
12. `eas init` inside the app to create its EAS **projectId**.

### Environment
Copy `apps/<app>/.env.example` → `apps/<app>/.env` (Expo loads `.env` from the app dir) and
fill it. **Every var is `EXPO_PUBLIC_*` and shipped in the client bundle — publishable keys
only, never a secret.** See the root [`.env.example`](.env.example) for full docs.

| Variable | What |
| --- | --- |
| `EXPO_PUBLIC_RC_IOS_API_KEY` / `EXPO_PUBLIC_RC_ANDROID_API_KEY` | RevenueCat public SDK keys |
| `EXPO_PUBLIC_RC_ENTITLEMENT_ID` | Entitlement granting premium (default `premium`) |
| `EXPO_PUBLIC_POSTHOG_API_KEY` / `EXPO_PUBLIC_POSTHOG_HOST` | PostHog project key + EU host |
| `EXPO_PUBLIC_DEFAULT_REGION` | `auto` \| `US` \| `EU` \| `OTHER` |
| `EXPO_PUBLIC_SMALL_BUSINESS_PROGRAM` | `true` → 15% commission in reporting |
| `EXPO_PUBLIC_ENABLE_WEB_PURCHASE` / `EXPO_PUBLIC_WEB_PURCHASE_URL` | web-checkout stub (keep OFF) |
| `EXPO_PUBLIC_REMOTE_CONFIG_URL` | kill-switch JSON endpoint (optional) |

---

## (c) Create a new app

```bash
pnpm create-app <name> <bundleId>      # e.g. pnpm create-app habit-tracker com.you.habit
pnpm install                           # link the new workspace app
cp apps/<name>/.env.example apps/<name>/.env   # then fill your keys
pnpm --filter <name> start
```

`create-app` clones `apps/_template` and substitutes the package name, display name, slug,
iOS bundle id, Android package and URL scheme. Then wire the store/RevenueCat products for it.

---

## (d) Run a dev build (required for purchases)

Purchases need native modules → build a **development client** with EAS, then run Metro
against it. From the app directory:

```bash
cd apps/<name>
eas login                 # once
eas init                  # once per app — creates the EAS projectId

# iOS (simulator or device) / Android:
eas build --profile development --platform ios
eas build --profile development --platform android

# install the resulting build, then start the dev server:
pnpm --filter <name> start   # or: npx expo start --dev-client
```

Test **purchase, restore, cancellation** in sandbox on both platforms before submitting.
Profiles live in `apps/<name>/eas.json` (`development` / `preview` / `production`).

---

## Everyday commands

```bash
pnpm typecheck                     # turbo: typecheck every package
pnpm --filter _template start      # run the template app (Metro)
pnpm --filter <name> start         # run a specific app
pnpm create-app <name> <bundleId>  # scaffold a new app
```

## Repo layout

```text
.
├─ apps/_template/        # runnable Expo Router app to clone (base template)
├─ packages/core/         # @app-factory/core — billing, paywall, onboarding, region, analytics, config
├─ scripts/create-app/    # clone _template -> new app
├─ docs/                  # payment strategy, compliance, analytics, dashboard
├─ agents/                # 4 reusable AI prompts (ideation, ASO, metadata, compliance)
└─ .env.example           # documented env template (publishable keys only)
```

## Docs & agents

- [`docs/payment-strategy.md`](docs/payment-strategy.md) — why IAP-only, and when to revisit.
- [`docs/compliance-checklist.md`](docs/compliance-checklist.md) — pre-submission gate (Apple 4.3, privacy, payment).
- [`docs/analytics-events.md`](docs/analytics-events.md) — event taxonomy.
- [`docs/dashboard-schema.md`](docs/dashboard-schema.md) + [`docs/portfolio-template.csv`](docs/portfolio-template.csv) — portfolio dashboard.
- [`agents/`](agents/) — ideation · aso-first-pass · metadata · compliance-check.
