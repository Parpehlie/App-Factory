import * as Localization from 'expo-localization';
import { config, type Region } from '../config';

/**
 * Region gate + monetization feature flags.
 *
 * Strategy (see docs/payment-strategy.md): IAP-native via RevenueCat is the only
 * payment path wired today. `enableWebPurchase` is OFF everywhere and additionally
 * region-gated so a future US-only external-web-checkout can be switched on WITHOUT
 * re-architecturing. It never turns on unless BOTH the flag and a URL are provided.
 */

// EU/EEA member states (ISO-3166-1 alpha-2). Used only for region bucketing/reporting.
const EU_COUNTRIES = new Set<string>([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES',
  'SE', 'IS', 'LI', 'NO',
]);

/** Resolve the effective region: explicit config override, else device locale. */
export function detectRegion(): Region {
  if (config.region.default !== 'auto') return config.region.default;
  const country = Localization.getLocales()[0]?.regionCode?.toUpperCase() ?? null;
  if (country === 'US') return 'US';
  if (country != null && EU_COUNTRIES.has(country)) return 'EU';
  return 'OTHER';
}

export interface FeatureFlags {
  /** External "Subscribe on the web" path. OFF by default; stub only. */
  enableWebPurchase: boolean;
  webPurchaseUrl: string | null;
  region: Region;
}

export function getFeatureFlags(region: Region = detectRegion()): FeatureFlags {
  // Future toggle point: today web purchase is only ever considered for US.
  // Flip this predicate (or make it config-driven) when/if the economics change.
  const regionAllowsWebPurchase = region === 'US';
  const enableWebPurchase =
    config.region.enableWebPurchase && regionAllowsWebPurchase && !!config.region.webPurchaseUrl;
  return {
    enableWebPurchase,
    webPurchaseUrl: config.region.webPurchaseUrl,
    region,
  };
}
