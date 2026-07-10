# Payment strategy

> The monetization decisions for the App Factory, and the triggers that would make
> us revisit them. These were settled from 2026 research — treat them as the default,
> not an open question, until a trigger below fires.

## The decision

**Baseline = native IAP via RevenueCat on both stores.** This is the *only* payment
path wired at launch. `react-native-purchases` + `react-native-purchases-ui` handle
purchases, entitlements, restores and remote-configurable paywalls (incl. A/B via
RevenueCat Experiments). Premium access has a single source of truth: the RevenueCat
entitlement, surfaced through `@app-factory/core` `usePremium()`.

**No external / web / Stripe checkout is implemented.** Not now.

### Why no external payment (yet)

At our scale the net gain is ~zero and the risk/complexity is real:

- **Store fees are already low for us.** Apple **Small Business Program** = **15%**
  under \$1M/yr. Google = **15%** on the first \$1M/yr. So the "save 30%" pitch is
  really "save ~15% *minus* new costs".
- **External processing isn't free.** Stripe (~2.9% + 30¢) + **EU VAT / US sales-tax
  handling** + refunds/chargebacks + a checkout you must build and maintain. After
  those, the residual saving is small.
- **Conversion loss.** Sending users to a browser to type a card converts far worse
  than a native one-tap Apple/Google purchase. Lost conversion usually dwarfs the fee
  delta at low volume.
- **US legal uncertainty.** The "0% commission / anti-steering" situation is in flux —
  the Supreme Court has been asked to weigh in, with a decision expected **~2027**.
  Building on a rule that may change is premature.

### But: stay optionality-ready

The template is built so external web purchase can be switched on **for one region
(e.g. US) without re-architecting**:

- A **region gate** (`region/`) resolves `US` / `EU` / `OTHER`.
- A feature flag **`enableWebPurchase` (OFF by default)**, plus `EXPO_PUBLIC_WEB_PURCHASE_URL`.
- A **stub** `WebPurchaseButton` that renders nothing unless the flag + URL + region
  gate all allow it. Implementing the destination later is a config change, not a rebuild.
- A **Small Business Program flag** (`EXPO_PUBLIC_SMALL_BUSINESS_PROGRAM`, default on)
  so reporting assumes the correct 15% commission.

## Re-evaluation triggers

Revisit external payment (and only then) when **any** of these is true:

| Trigger | Why it changes the math |
| --- | --- |
| A single app clears **~\$5–10k/month** | Fee savings become material enough to justify building + maintaining a web checkout for that app. |
| **US Supreme Court** rules on anti-steering (**~2027**) | A durable "0% / free steering" rule in the US flips the conversion-vs-fee trade-off. |
| An app **approaches \$1M/yr** | Apple SBP / Google reduced-rate tiers stop applying above \$1M — commission jumps toward 30% and external routes gain value. |
| **RevenueCat MTR > \$2,500/month** | RevenueCat's free tier covers up to \$2.5k Monthly Tracked Revenue; beyond it you pay a fee — factor it into unit economics (still cheap, but no longer free). |

When a trigger fires, scope external checkout **for the winning app + region only**,
flip `enableWebPurchase` on for that region, implement the URL destination, and A/B it
against native IAP before rolling wider.

## What NOT to do

- Don't wire Stripe/web checkout "just in case" — it's dead code and an audit surface.
- Don't split premium truth across two systems — RevenueCat entitlement stays canonical.
- Don't assume 30% in reporting while enrolled in SBP — use the SBP flag (15%).
