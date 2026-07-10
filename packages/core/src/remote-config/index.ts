import { useEffect, useState } from 'react';
import { config } from '../config';

/**
 * Remote config / kill-switch — PLACEHOLDER.
 *
 * Fetches a small JSON document from `EXPO_PUBLIC_REMOTE_CONFIG_URL`. If unset or
 * unreachable it fails OPEN (never bricks the app). Wire a real endpoint (Sanity,
 * a gist, an edge function, etc.) later to remotely disable an app or force upgrade.
 */

export interface RemoteConfig {
  killSwitch: boolean;
  message?: string;
  minSupportedVersion?: string;
}

const DEFAULT: RemoteConfig = { killSwitch: false };

export async function fetchRemoteConfig(): Promise<RemoteConfig> {
  const url = config.remoteConfig.url;
  if (!url) return DEFAULT;
  try {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) return DEFAULT;
    const data = (await res.json()) as Partial<RemoteConfig>;
    return {
      killSwitch: data.killSwitch === true,
      message: data.message,
      minSupportedVersion: data.minSupportedVersion,
    };
  } catch {
    return DEFAULT; // fail open
  }
}

export function useRemoteConfig(): { config: RemoteConfig; loading: boolean } {
  const [state, setState] = useState<RemoteConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    fetchRemoteConfig()
      .then((c) => {
        if (alive) setState(c);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  return { config: state, loading };
}
