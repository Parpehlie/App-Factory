# Portfolio dashboard schema

> One row per app. Built by hand in Google Sheets (or Notion) — this file is the column
> spec; `portfolio-template.csv` is the importable header + example row. The goal: at a
> glance, decide **kill / iterate / scale** for each weekly app.

## Columns

| Column | Type | Source | Definition |
| --- | --- | --- | --- |
| `app` | text | you | App name. |
| `bundle_id` | text | you | Reverse-DNS id (`com.you.app`). |
| `concept` | text | you | One-line what/for-whom. |
| `launch_date` | date | you | Public availability date (store live). |
| `status` | enum | you | `building` \| `live` \| `iterating` \| `killed` \| `scaling`. |
| `days_live` | number | derived | Days since `launch_date`. |
| `organic_downloads` | number | App Store Connect / Play Console | Organic (non-paid) installs. |
| `d1_retention` | % | PostHog | Day-1 retention. |
| `d7_retention` | % | PostHog | Day-7 retention. |
| `paywall_views` | number | PostHog | Count of `paywall_view`. |
| `paywall_to_paid` | % | PostHog | `purchase` / `paywall_view`. |
| `install_to_paid` | % | PostHog / stores | `purchase` (unique) / `install`. |
| `trials_started` | number | PostHog / RevenueCat | Count of `trial_start`. |
| `revenue` | currency | RevenueCat / stores | Net revenue to date (after commission). |
| `mrr` | currency | RevenueCat | Current monthly recurring revenue. |
| `commission_assumption` | % | you | `15` if SBP/reduced tier, else `30`. |
| `verdict` | enum | you | `kill` \| `iterate` \| `scale` \| `watch`. |
| `notes` | text | you | Next action / learning. |

## Reading the row (decision heuristics)

- **install → paid** is the headline. Sub-1% at reasonable volume → the concept or paywall
  isn't landing.
- **paywall → paid** isolates the paywall from acquisition. Low here but decent traffic →
  fix pricing / value prop / offer (A/B via RevenueCat Experiments).
- **D1/D7** low → retention/onboarding problem; monetization won't save a leaky bucket.
- **verdict** each app within ~2 weeks of `days_live`: `kill` fast, `scale` the rare winner.

## Suggested pivots by symptom

| Symptom | Likely lever |
| --- | --- |
| Good installs, low `paywall_to_paid` | Paywall copy / price / trial (Experiments). |
| Low `paywall_views` vs installs | Funnel — move/trigger the paywall earlier or add gates. |
| Low `d1_retention` | Onboarding value delivery, first-run activation. |
| High trials, low `purchase` | Trial length / reminder / value during trial. |

Keep it brutal: the portfolio model works by killing losers quickly and pouring time
into the few that show `install_to_paid` and retention worth scaling.
