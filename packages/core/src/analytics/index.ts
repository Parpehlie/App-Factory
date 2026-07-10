import AsyncStorage from '@react-native-async-storage/async-storage';
import PostHog from 'posthog-react-native';
import { config } from '../config';
import { type AnalyticsEvent } from './events';

export { AnalyticsEvents, type AnalyticsEvent } from './events';

let client: PostHog | null = null;

/** Initialize PostHog once. Safe no-op if no key is configured. */
export function initAnalytics(): PostHog | null {
  if (client) return client;
  if (!config.posthog.apiKey) {
    console.warn('[core/analytics] No PostHog API key set. Analytics disabled.');
    return null;
  }
  client = new PostHog(config.posthog.apiKey, { host: config.posthog.host });
  return client;
}

export function getAnalytics(): PostHog | null {
  return client;
}

// PostHog only accepts JSON-serializable property values; our public API stays
// permissive (Record<string, unknown>) and narrows at the boundary.
type EventProperties = Record<string, unknown>;
function toJson(properties?: EventProperties): Record<string, any> | undefined {
  return properties as Record<string, any> | undefined;
}

/** Capture a typed funnel event. No-op until analytics is initialized. */
export function track(event: AnalyticsEvent, properties?: EventProperties): void {
  client?.capture(event, toJson(properties));
}

export function identify(distinctId: string, properties?: EventProperties): void {
  client?.identify(distinctId, toJson(properties));
}

export function screen(name: string, properties?: EventProperties): void {
  client?.screen(name, toJson(properties));
}

export function resetAnalytics(): void {
  client?.reset();
}

export async function flushAnalytics(): Promise<void> {
  try {
    await client?.flush();
  } catch {
    // flushing is best-effort
  }
}

const INSTALL_KEY = '@core/install_tracked';

/** Fire `install` exactly once per device install. */
export async function trackInstallOnce(): Promise<void> {
  try {
    const seen = await AsyncStorage.getItem(INSTALL_KEY);
    if (seen) return;
    track('install');
    await AsyncStorage.setItem(INSTALL_KEY, '1');
  } catch {
    // storage failures should never crash startup
  }
}
