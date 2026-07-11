/**
 * Product analytics taxonomy. One flat, snake_case event per funnel milestone.
 * Keep this list small and stable — every event here is documented in
 * docs/analytics-events.md and drives the portfolio dashboard.
 */
export const AnalyticsEvents = {
  Install: 'install',
  OnboardingStep: 'onboarding_step',
  OnboardingComplete: 'onboarding_complete',
  PaywallView: 'paywall_view',
  PaywallDismiss: 'paywall_dismiss',
  TrialStart: 'trial_start',
  Purchase: 'purchase',
  Restore: 'restore',
  CoreAction: 'core_action',
} as const;

export type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
