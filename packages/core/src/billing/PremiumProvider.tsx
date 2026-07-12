import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addEntitlementListener,
  getEntitlement,
  initBilling,
  restorePurchases,
  logInBillingUser,
  type EntitlementStatus,
} from './index';
import { config } from '../config';

interface PremiumContextValue {
  /** True once billing is initialized and the first entitlement fetch has resolved. */
  ready: boolean;
  status: EntitlementStatus | null;
  isPremium: boolean;
  refresh: () => Promise<void>;
  restore: () => Promise<EntitlementStatus>;
  activateReviewerAccess: (code: string) => Promise<boolean>;
}

const PremiumContext = createContext<PremiumContextValue | null>(null);

export interface PremiumProviderProps {
  children: React.ReactNode;
  /** Optional stable user id to align RevenueCat + PostHog identities. */
  appUserId?: string;
  debug?: boolean;
}

/**
 * App-wide premium state. Wrap the app once; read entitlement anywhere via `usePremium()`.
 * This is the reactive front for billing/ — the single source of premium truth.
 */
export function PremiumProvider({ children, appUserId, debug }: PremiumProviderProps) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<EntitlementStatus | null>(null);

  const refresh = useCallback(async () => {
    try {
      setStatus(await getEntitlement());
    } catch (e) {
      console.warn('[core/billing] entitlement refresh failed', e);
    }
  }, []);

  useEffect(() => {
    let unsub = () => {};
    let cancelled = false;
    (async () => {
      await initBilling({ appUserId, debug });
      if (cancelled) return;
      unsub = addEntitlementListener(setStatus);
      await refresh();
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
      unsub();
    };
  }, [appUserId, debug, refresh]);

  const restore = useCallback(async () => {
    const s = await restorePurchases();
    setStatus(s);
    return s;
  }, []);

  const activateReviewerAccess = useCallback(async (code: string) => {
    if (!config.storeReview.code || code.trim() !== config.storeReview.code) return false;
    try {
      const next = await logInBillingUser('ironhale-store-review');
      setStatus(next);
      return next.isActive;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo<PremiumContextValue>(
    () => ({
      ready,
      status,
      isPremium: status?.isActive ?? false,
      refresh,
      restore,
      activateReviewerAccess,
    }),
    [ready, status, refresh, restore, activateReviewerAccess],
  );

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
}

export function usePremium(): PremiumContextValue {
  const ctx = useContext(PremiumContext);
  if (!ctx) {
    throw new Error('usePremium must be used within a <PremiumProvider>.');
  }
  return ctx;
}
