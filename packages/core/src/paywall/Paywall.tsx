import React, { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import type { PurchasesOffering } from 'react-native-purchases';
import { track } from '../analytics';
import { usePremium } from '../billing/PremiumProvider';
import { config } from '../config';
import { FallbackPaywall, type FallbackPaywallProps, type PaywallContent } from './FallbackPaywall';

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
  privacyUrl?: string;
  termsUrl?: string;
  /** Swap in a fully custom fallback if you outgrow the built-in one. */
  fallback?: React.ComponentType<FallbackPaywallProps>;
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
  privacyUrl,
  termsUrl,
  fallback: Fallback = FallbackPaywall,
}: PaywallProps) {
  const { refresh } = usePremium();

  const platformKey =
    Platform.OS === 'ios' ? config.revenueCat.iosApiKey : config.revenueCat.androidApiKey;
  const remoteAvailable = useRemoteUI && platformKey.length > 0;

  useEffect(() => {
    track('paywall_view', { placement, ui: remoteAvailable ? 'remote' : 'fallback' });
  }, [placement, remoteAvailable]);

  const handlePurchased = useCallback(async () => {
    await refresh();
    onPurchased();
  }, [refresh, onPurchased]);

  const handleDismiss = useCallback(() => {
    track('paywall_dismiss', { placement, ui: 'remote' });
    onDismiss();
  }, [placement, onDismiss]);

  if (!remoteAvailable) {
    return (
      <Fallback
        placement={placement}
        onDismiss={onDismiss}
        onPurchased={onPurchased}
        content={content}
        offering={offering}
        privacyUrl={privacyUrl}
        termsUrl={termsUrl}
      />
    );
  }

  return (
    <RevenueCatUI.Paywall
      style={{ flex: 1 }}
      options={{
        ...(offering ? { offering } : {}),
        displayCloseButton: true,
      }}
      onPurchaseCompleted={({ storeTransaction }) => {
        track('purchase', {
          placement,
          product: storeTransaction?.productIdentifier,
          ui: 'remote',
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
