/**
 * @app-factory/core — public API.
 * Everything an app needs: config, billing, paywall, onboarding, region, analytics.
 */

// config
export { config, assertBillingConfigured } from './config';
export type { AppConfig, Region } from './config';

// billing (single source of premium truth)
export {
  initBilling,
  isBillingInitialized,
  getEntitlement,
  getCurrentOffering,
  getOfferingPackages,
  purchasePackage,
  restorePurchases,
  addEntitlementListener,
} from './billing';
export type { EntitlementStatus, PurchaseResult } from './billing';
export { PremiumProvider, usePremium } from './billing/PremiumProvider';
export type { PremiumProviderProps } from './billing/PremiumProvider';

// analytics
export {
  AnalyticsEvents,
  initAnalytics,
  getAnalytics,
  track,
  identify,
  screen,
  resetAnalytics,
  flushAnalytics,
  trackInstallOnce,
} from './analytics';
export type { AnalyticsEvent } from './analytics';

// region + feature flags (web-purchase stub, OFF by default)
export { detectRegion, getFeatureFlags } from './region';
export type { FeatureFlags } from './region';
export { WebPurchaseButton } from './region/WebPurchaseButton';

// onboarding funnel
export {
  OnboardingFlow,
  hasCompletedOnboarding,
  setOnboardingComplete,
  resetOnboarding,
} from './onboarding';
export type { OnboardingStep, OnboardingFlowProps } from './onboarding';

// paywall
export { Paywall, FallbackPaywall } from './paywall';
export type { PaywallProps, FallbackPaywallProps, PaywallContent } from './paywall';

// remote config / kill switch (placeholder)
export { fetchRemoteConfig, useRemoteConfig } from './remote-config';
export type { RemoteConfig } from './remote-config';
