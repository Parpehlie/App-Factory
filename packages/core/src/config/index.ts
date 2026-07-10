import Constants from 'expo-constants';

/**
 * Env-driven configuration. Single source of truth for all runtime keys/flags.
 *
 * NOTE ON METRO INLINING: Expo only inlines `process.env.EXPO_PUBLIC_*` when it is
 * accessed as a *static literal member* (e.g. `process.env.EXPO_PUBLIC_FOO`).
 * Dynamic access (`process.env[key]`) is NOT inlined, so every variable below is
 * read literally, then optionally overridden by `app.config.ts` -> `extra`.
 */

export type Region = 'US' | 'EU' | 'OTHER';

const RAW = {
  RC_IOS_API_KEY: process.env.EXPO_PUBLIC_RC_IOS_API_KEY,
  RC_ANDROID_API_KEY: process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY,
  RC_ENTITLEMENT_ID: process.env.EXPO_PUBLIC_RC_ENTITLEMENT_ID,
  POSTHOG_API_KEY: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
  POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  DEFAULT_REGION: process.env.EXPO_PUBLIC_DEFAULT_REGION,
  SMALL_BUSINESS_PROGRAM: process.env.EXPO_PUBLIC_SMALL_BUSINESS_PROGRAM,
  ENABLE_WEB_PURCHASE: process.env.EXPO_PUBLIC_ENABLE_WEB_PURCHASE,
  WEB_PURCHASE_URL: process.env.EXPO_PUBLIC_WEB_PURCHASE_URL,
  REMOTE_CONFIG_URL: process.env.EXPO_PUBLIC_REMOTE_CONFIG_URL,
} as const;

/** Per-app override surfaced through app.config.ts `extra`. Never a secret. */
function extra(key: keyof typeof RAW): string | undefined {
  const bag = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
  const val = bag[key];
  return typeof val === 'string' && val.length > 0 ? val : undefined;
}

function str(key: keyof typeof RAW, fallback = ''): string {
  const fromEnv = RAW[key];
  if (typeof fromEnv === 'string' && fromEnv.length > 0) return fromEnv;
  return extra(key) ?? fallback;
}

function bool(key: keyof typeof RAW, fallback: boolean): boolean {
  const v = str(key, fallback ? 'true' : 'false');
  return v === 'true' || v === '1';
}

export interface AppConfig {
  revenueCat: {
    iosApiKey: string;
    androidApiKey: string;
    entitlementId: string;
  };
  posthog: {
    apiKey: string;
    host: string;
  };
  region: {
    default: Region | 'auto';
    enableWebPurchase: boolean;
    webPurchaseUrl: string | null;
  };
  billing: {
    /** Enrolled in Apple Small Business Program / Google reduced tier -> 15% commission. */
    smallBusinessProgram: boolean;
  };
  remoteConfig: {
    url: string | null;
  };
}

const rawRegion = str('DEFAULT_REGION', 'auto');
const region: Region | 'auto' =
  rawRegion === 'US' || rawRegion === 'EU' || rawRegion === 'OTHER' ? rawRegion : 'auto';

export const config: AppConfig = {
  revenueCat: {
    iosApiKey: str('RC_IOS_API_KEY'),
    androidApiKey: str('RC_ANDROID_API_KEY'),
    entitlementId: str('RC_ENTITLEMENT_ID', 'premium'),
  },
  posthog: {
    apiKey: str('POSTHOG_API_KEY'),
    host: str('POSTHOG_HOST', 'https://eu.i.posthog.com'),
  },
  region: {
    default: region,
    enableWebPurchase: bool('ENABLE_WEB_PURCHASE', false),
    webPurchaseUrl: str('WEB_PURCHASE_URL') || null,
  },
  billing: {
    smallBusinessProgram: bool('SMALL_BUSINESS_PROGRAM', true),
  },
  remoteConfig: {
    url: str('REMOTE_CONFIG_URL') || null,
  },
};

/** Dev helper: warns loudly if billing keys are missing so the paywall isn't a silent no-op. */
export function assertBillingConfigured(): void {
  if (!config.revenueCat.iosApiKey && !config.revenueCat.androidApiKey) {
    console.warn(
      '[core/config] No RevenueCat API keys found. Purchases will not work. ' +
        'Set EXPO_PUBLIC_RC_IOS_API_KEY / EXPO_PUBLIC_RC_ANDROID_API_KEY (see .env.example).',
    );
  }
}
