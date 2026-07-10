import type { ConfigContext, ExpoConfig } from 'expo/config';

// ─── App identity — rewritten by `pnpm create-app <name> <bundleId>` ──────────
const APP_NAME = 'App Template';
const APP_SLUG = 'app-template';
const IOS_BUNDLE_ID = 'com.appfactory.template';
const ANDROID_PACKAGE = 'com.appfactory.template';
const SCHEME = 'apptemplate';
// ─── end identity ─────────────────────────────────────────────────────────────

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: APP_SLUG,
  scheme: SCHEME,
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  icon: './assets/icon.png',
  ios: {
    bundleIdentifier: IOS_BUNDLE_ID,
    supportsTablet: true,
  },
  android: {
    package: ANDROID_PACKAGE,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0B0B0F',
    },
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/splash-icon.png',
        imageWidth: 180,
        resizeMode: 'contain',
        backgroundColor: '#0B0B0F',
      },
    ],
  ],
  experiments: {
    typedRoutes: false,
  },
  extra: {
    // Non-secret per-app override read by @app-factory/core config.
    RC_ENTITLEMENT_ID: process.env.EXPO_PUBLIC_RC_ENTITLEMENT_ID ?? 'premium',
    eas: {
      // projectId is populated by `eas init`.
    },
  },
});
