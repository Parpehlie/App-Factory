import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { track } from '../analytics';
import { getFeatureFlags } from './index';

/**
 * STUB — optionality-ready external web checkout entry point.
 *
 * Renders NOTHING unless `enableWebPurchase` is on AND a URL is configured AND the
 * region gate allows it (see region/index.ts). This is intentionally a placeholder:
 * no external payment is wired. When/if US web checkout becomes worthwhile, implement
 * the destination behind `EXPO_PUBLIC_WEB_PURCHASE_URL` — no changes needed here.
 */
export function WebPurchaseButton({ label = 'Subscribe on the web' }: { label?: string }) {
  const flags = getFeatureFlags();
  if (!flags.enableWebPurchase || !flags.webPurchaseUrl) return null;

  return (
    <TouchableOpacity
      style={styles.button}
      accessibilityRole="button"
      onPress={async () => {
        track('paywall_view', { placement: 'web_purchase_cta', region: flags.region });
        await WebBrowser.openBrowserAsync(flags.webPurchaseUrl as string);
      }}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  label: {
    color: '#9CA3AF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
