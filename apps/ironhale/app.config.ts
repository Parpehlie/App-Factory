import type { ConfigContext, ExpoConfig } from 'expo/config';

// ─── App identity — rewritten by `pnpm create-app <name> <bundleId>` ──────────
const APP_NAME = 'IronHale';
const APP_SLUG = 'ironhale';
const IOS_BUNDLE_ID = 'com.parphelie.ironhale';
const ANDROID_PACKAGE = 'com.parphelie.ironhale';
const SCHEME = 'ironhale';
const EAS_OWNER = 'parphelie';
const EAS_PROJECT_ID = '9961c88f-2866-4420-9882-9c745b896153';
// ─── end identity ─────────────────────────────────────────────────────────────

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: APP_SLUG,
  owner: EAS_OWNER,
  scheme: SCHEME,
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  icon: './assets/icon.png',
  ios: {
    bundleIdentifier: IOS_BUNDLE_ID,
    supportsTablet: false,
  },
  android: {
    package: ANDROID_PACKAGE,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#173D28',
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
        backgroundColor: '#173D28',
      },
    ],
    ['expo-notifications', { color: '#1E5B3A' }],
    // Playback only (rest-timer beep) — disable the microphone permission so the
    // App Store review doesn't ask why a strength app needs the mic (§17).
    ['expo-audio', { microphonePermission: false }],
  ],
  experiments: {
    typedRoutes: false,
  },
  extra: {
    // Non-secret per-app override read by @app-factory/core config.
    RC_ENTITLEMENT_ID: process.env.EXPO_PUBLIC_RC_ENTITLEMENT_ID ?? 'premium',
    eas: {
      projectId: EAS_PROJECT_ID,
    },
  },
});
