# Pre-submission compliance checklist

> Reusable gate before every App Store / Play Store submission. The biggest rejection
> risk for a "1 app/week" portfolio is **Apple Guideline 4.3 (spam / duplicate apps)** —
> take it seriously or the whole account is at risk.

## 1. Distinctiveness — Apple Guideline 4.3 (highest priority)

Reviewers reject apps that are reskinned clones of each other or of common templates.
Each app must be **genuinely differentiated**, not a color swap.

- [ ] **Unique concept & value prop** — solves a specific problem for a specific audience,
      not "generic tracker #7".
- [ ] **Distinct UI** — not just recolored: different layouts, flows, copy, iconography.
- [ ] **Original app name, icon, screenshots, description** — no near-duplicates across
      your own portfolio.
- [ ] **Real, unique functionality** — features a reviewer can exercise; not an empty shell
      around a paywall.
- [ ] **Own bundle id / package** per app (`com.you.<app>`), never reused.
- [ ] **No "coming soon" / placeholder** screens shipped.
- [ ] Portfolio self-audit: would a reviewer seeing two of your apps side by side call
      them the same app? If yes, fix before submitting.

## 2. Privacy — Apple App Privacy & Google Data Safety

Declarations must **match what the app actually collects** (PostHog analytics counts).

- [ ] **Apple App Privacy "nutrition label"** filled: with PostHog you typically collect
      **Product Interaction / Usage Data** and possibly a **Device/User ID**; declare it.
- [ ] **Google Data Safety form** filled to match (data collected, purpose, encryption in
      transit, deletion path).
- [ ] **Privacy Policy URL** live and reachable (linked from paywall + settings).
- [ ] **Terms of Use (EULA) URL** live (required when you sell subscriptions).
- [ ] PostHog hosted in the **EU (eu.i.posthog.com)**; confirm GDPR posture for EU users.
- [ ] **ATT**: if you ever add tracking that requires it, present the App Tracking
      Transparency prompt. (Default template does not; keep it that way unless needed.)
- [ ] No collection of data you didn't declare (double-check any SDK's default capture).

## 3. Payment / subscription compliance

- [ ] Uses **native IAP only** (StoreKit / Play Billing via RevenueCat). No external
      payment links unless `enableWebPurchase` is intentionally enabled for an allowed
      region (see payment-strategy.md).
- [ ] **Paywall clearly discloses**: price, billing period, free-trial length &
      auto-renewal, and "cancel anytime". (Fallback paywall includes the footnote; verify
      the RevenueCat remote paywall does too.)
- [ ] **Restore purchases** available (present in Settings + paywall).
- [ ] **Manage subscription** link points to the correct store account page.
- [ ] Products/entitlement configured in **RevenueCat + App Store Connect + Play Console**
      and in the *Ready to Submit* state.
- [ ] Prices set for all target storefronts (US + EU).
- [ ] **Small Business Program** enrollment confirmed if you rely on 15% economics.

## 4. Store metadata & assets

- [ ] App name / subtitle within length limits and **keyword-validated** (see ASO agent —
      never ship invented keywords).
- [ ] Description accurate; **no competitor names**, no unverifiable claims, no fake social proof.
- [ ] Screenshots reflect the **actual** current UI (no mockups of unbuilt features).
- [ ] App icon final (replace the placeholder indigo icon in `assets/`).
- [ ] Support URL + marketing URL reachable.
- [ ] Age rating questionnaire completed honestly.
- [ ] Correct primary category and localizations for US + EU.

## 5. Build / technical

- [ ] Purchases tested on a **real EAS dev/production build** (NOT Expo Go — IAP needs
      native modules).
- [ ] Sandbox purchase, restore, and cancellation tested on both platforms.
- [ ] No secrets in the bundle beyond publishable keys (RevenueCat public SDK key,
      PostHog project key). Verify `.env` contains no private keys.
- [ ] Crash-free launch on a clean install; onboarding → paywall → app flow works.
- [ ] Remote kill-switch endpoint reachable (if configured).

---
Run `agents/compliance-check.md` for an AI-assisted audit pass, but a human ticks these boxes.
