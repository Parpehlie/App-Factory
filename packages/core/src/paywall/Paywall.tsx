import React, { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import type { PurchasesOffering } from 'react-native-purchases';
import { track } from '../analytics';
import { usePremium } from '../billing/PremiumProvider';
import { config } from '../config';
import { FallbackPaywall, type FallbackPaywallProps, type PaywallContent, type PaywallLabels } from './FallbackPaywall';

export interface PaywallProps {
  onDismiss: () => void;
  onPurchased: () => void;
  /**
   * Funnel placement label attached to every analytics event
   * (e.g. "onboarding", "settings", "feature_gate").
   */
  placement?: string;
  /**
   * Use the remote-configurable RevenueCat paywall (default). When true, RevenueCat
   * Experiments automatically A/B-tests variants on the CURRENT offering — no code
   * change needed to run a test. Set false to force the custom fallback.
   */
  useRemoteUI?: boolean;
  /** Advanced: force a specific offering (leave undefined to let Experiments choose). */
  offering?: PurchasesOffering;
  /** Content overrides for the fallback paywall. */
  content?: Partial<PaywallContent>;
  /** Localized chrome labels for the fallback paywall (restore/terms/period/plan names…). */
  labels?: Partial<PaywallLabels>;
  privacyUrl?: string;
  termsUrl?: string;
  /** Swap in a fully custom fallback if you outgrow the built-in one. */
  fallback?: React.ComponentType<FallbackPaywallProps>;
  /** Extra stable product properties attached to conversion events. */
  analyticsProperties?: Record<string, string | number | boolean>;
  /** Hard gates cannot be dismissed. Defaults to true for soft paywalls. */
  allowDismiss?: boolean;
}

/**
 * The paywall entry point. Prefers the remote RevenueCat paywall (remote-configurable,
 * Experiments-ready) and falls back to a clean custom paywall when billing isn't
 * configured or `useRemoteUI` is false.
 */
export function Paywall({
  onDismiss,
  onPurchased,
  placement = 'default',
  useRemoteUI = true,
  offering,
  content,
  labels,
  privacyUrl,
  termsUrl,
  fallback: Fallback = FallbackPaywall,
  analyticsProperties,
  allowDismiss = true,
}: PaywallProps) {
  const { refresh } = usePremium();
  const analyticsRef = useRef(analyticsProperties);

  const platformKey =
    Platform.OS === 'ios' ? config.revenueCat.iosApiKey : config.revenueCat.androidApiKey;
  const remoteAvailable = useRemoteUI && platformKey.length > 0;

  useEffect(() => {
    track('paywall_view', { placement, ui: remoteAvailable ? 'remote' : 'fallback', ...analyticsRef.current });
  }, [placement, remoteAvailable]);

  const handlePurchased = useCallback(async () => {
    await refresh();
    onPurchased();
  }, [refresh, onPurchased]);

  const handleDismiss = useCallback(() => {
    track('paywall_dismiss', { placement, ui: 'remote' });
    if (allowDismiss) onDismiss();
  }, [allowDismiss, placement, onDismiss]);

  if (!remoteAvailable) {
    return (
      <Fallback
        placement={placement}
        onDismiss={onDismiss}
        onPurchased={onPurchased}
        content={content}
        labels={labels}
        offering={offering}
        privacyUrl={privacyUrl}
        termsUrl={termsUrl}
        analyticsProperties={analyticsProperties}
        allowDismiss={allowDismiss}
      />
    );
  }

  return (
    <RevenueCatUI.Paywall
      style={{ flex: 1 }}
      options={{
        ...(offering ? { offering } : {}),
        displayCloseButton: allowDismiss,
      }}
      onPurchaseCompleted={({ storeTransaction }) => {
        track('purchase', {
          placement,
          product: storeTransaction?.productIdentifier,
          ui: 'remote',
          ...analyticsProperties,
        });
        void handlePurchased();
      }}
      onRestoreCompleted={() => {
        track('restore', { placement, ui: 'remote' });
        void handlePurchased();
      }}
      onDismiss={handleDismiss}
    />
  );
}
