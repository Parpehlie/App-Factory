# Analytics events

> The full product-analytics taxonomy. This is the contract between the app and the
> portfolio dashboard: these event names are defined once in
> `@app-factory/core` (`analytics/events.ts`) and must not drift. All events go to
> **PostHog (EU cloud)**. Retention (D1/D7) is computed in PostHog, not emitted.

## Conventions

- Event names are **flat snake_case**; one event per funnel milestone.
- Property keys are snake_case. Keep properties small and stable.
- Fire via `track(event, properties)` from core — never a raw string elsewhere.
- User identity: call `identify(distinctId)` once you have a stable id (optional; align
  with the RevenueCat app user id if you set one).

## Events

| Event | When it fires | Key properties |
| --- | --- | --- |
| `install` | Once per device install (first launch), de-duped via AsyncStorage. | — |
| `onboarding_step` | Each onboarding screen viewed. | `step_id`, `step_index`, `step_count`, `variant` |
| `onboarding_complete` | User finishes the last onboarding step. | `step_count`, `variant` |
| `paywall_view` | A paywall is shown. | `placement`, `ui` (`remote`\|`fallback`), `region?` |
| `paywall_dismiss` | Paywall closed without purchasing. | `placement`, `ui` |
| `trial_start` | User starts a purchase on a package that has a free-trial intro. | `placement`, `product` |
| `purchase` | Purchase completes successfully. | `placement`, `product`, `price?`, `currency?`, `had_trial?`, `ui` |
| `restore` | User restores purchases. | `placement`, `active` (bool), `ui?` |

### Property definitions

- **`placement`** — where in the app the paywall was triggered: `onboarding`, `settings`,
  `feature_gate`, etc. Lets you compare conversion by entry point.
- **`ui`** — `remote` (RevenueCatUI, remote-configurable / Experiments) vs `fallback`
  (the custom in-app paywall).
- **`variant`** — onboarding funnel variant label, for A/B testing the funnel.
- **`product`** — the store product identifier purchased / trialed.
- **`step_id` / `step_index` / `step_count`** — onboarding progress.
- **`region`** — `US` / `EU` / `OTHER` from the region gate (attached where relevant).

## Core funnel (build these as a PostHog funnel)

```text
install
  → onboarding_step (first)
  → onboarding_complete
  → paywall_view
  → trial_start        (if trial offered)
  → purchase
```

## Dashboard-relevant conversions

Feed the portfolio dashboard (see dashboard-schema.md):

- **paywall → paid** = `purchase` / `paywall_view`
- **install → paid** = `purchase` (unique users) / `install`
- **onboarding completion** = `onboarding_complete` / `install`
- **D1 / D7 retention** — computed in PostHog from `install` + any active event.

## Adding an event

1. Add the constant to `AnalyticsEvents` in `packages/core/src/analytics/events.ts`.
2. Document it in the table above.
3. If it feeds the dashboard, add a column/definition to dashboard-schema.md.
Keep the list short — every event is a maintenance cost across the whole portfolio.
