import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { getOfferingPackages, purchasePackage, restorePurchases } from '../billing';
import { track } from '../analytics';
import { WebPurchaseButton } from '../region/WebPurchaseButton';

export interface PaywallContent {
  title: string;
  subtitle: string;
  benefits: string[];
  footnote: string;
  cta: string;
}

/**
 * Chrome strings around the store-provided price/title. Every field is optional on the
 * prop; the English defaults below keep existing apps unchanged, while a localized app
 * (e.g. IronHale) can pass translated copy.
 */
export interface PaywallLabels {
  restore: string;
  terms: string;
  privacy: string;
  perYear: string;
  perMonth: string;
  yearly: string;
  monthly: string;
  sixMonth: string;
  threeMonth: string;
  twoMonth: string;
  weekly: string;
  lifetime: string;
  freeTrial: string;
  nTrial: (n: number, unit: string) => string;
  startTrial: (label: string) => string;
  noProducts: string;
}

export interface FallbackPaywallProps {
  placement: string;
  onDismiss: () => void;
  onPurchased: () => void;
  content?: Partial<PaywallContent>;
  /** Localized chrome labels (restore/terms/period/plan names…). Falls back to English. */
  labels?: Partial<PaywallLabels>;
  /** Pre-fetched offering (else the current offering is loaded). */
  offering?: PurchasesOffering;
  privacyUrl?: string;
  termsUrl?: string;
  analyticsProperties?: Record<string, string | number | boolean>;
  allowDismiss?: boolean;
}

const DEFAULT_CONTENT: PaywallContent = {
  title: 'Unlock everything',
  subtitle: 'Go Premium and get the full experience.',
  benefits: [
    'All premium features, unlocked',
    'No ads, no limits',
    'Priority support',
    'Cancel anytime',
  ],
  footnote:
    'Subscription auto-renews until cancelled. Manage or cancel in your store account settings.',
  cta: 'Continue',
};

const DEFAULT_LABELS: PaywallLabels = {
  restore: 'Restore',
  terms: 'Terms',
  privacy: 'Privacy',
  perYear: 'year',
  perMonth: 'month',
  yearly: 'Yearly',
  monthly: 'Monthly',
  sixMonth: '6 Months',
  threeMonth: '3 Months',
  twoMonth: '2 Months',
  weekly: 'Weekly',
  lifetime: 'Lifetime',
  freeTrial: 'Free trial',
  nTrial: (n, unit) => `${n}-${unit} free trial`,
  startTrial: (label) => `Start ${label}`,
  noProducts: 'No subscription products available. Configure an Offering in RevenueCat.',
};

/** Detects a free-trial intro phase on a package (iOS introPrice / Android free phase). */
function trialLabel(pkg: PurchasesPackage, labels: PaywallLabels): string | null {
  const intro = pkg.product.introPrice;
  if (!intro || intro.price > 0) return null;
  const unit = intro.periodUnit?.toLowerCase() ?? 'day';
  const n = intro.periodNumberOfUnits ?? 0;
  if (n <= 0) return labels.freeTrial;
  return labels.nTrial(n, unit);
}

function packageTypeLabel(pkg: PurchasesPackage, labels: PaywallLabels): string {
  // e.g. "$ANNUAL" -> "Yearly". Falls back to the raw identifier.
  const map: Record<string, string> = {
    ANNUAL: labels.yearly,
    SIX_MONTH: labels.sixMonth,
    THREE_MONTH: labels.threeMonth,
    TWO_MONTH: labels.twoMonth,
    MONTHLY: labels.monthly,
    WEEKLY: labels.weekly,
    LIFETIME: labels.lifetime,
  };
  return map[pkg.packageType] ?? pkg.product.title ?? pkg.identifier;
}

/**
 * Clean, self-contained custom paywall used as a fallback when the remote
 * RevenueCatUI paywall is unavailable (or intentionally disabled). Fires the same
 * analytics as the remote path: `paywall_view`, `trial_start`, `purchase`, `restore`,
 * `paywall_dismiss`.
 */
export function FallbackPaywall({
  placement,
  onDismiss,
  onPurchased,
  content,
  labels,
  offering,
  privacyUrl,
  termsUrl,
  analyticsProperties,
  allowDismiss = true,
}: FallbackPaywallProps) {
  const insets = useSafeAreaInsets();
  const c = useMemo(() => ({ ...DEFAULT_CONTENT, ...content }), [content]);
  const l = useMemo(() => ({ ...DEFAULT_LABELS, ...labels }), [labels]);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const pkgs = offering?.availablePackages ?? (await getOfferingPackages());
        if (!alive) return;
        setPackages(pkgs);
        // Default to the annual plan if present (best value, best LTV), else the first.
        const preferred = pkgs.find((p) => p.packageType === 'ANNUAL') ?? pkgs[0];
        setSelectedId(preferred?.identifier ?? null);
      } catch (e) {
        console.warn('[core/paywall] failed to load packages', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [offering]);

  const selected = packages.find((p) => p.identifier === selectedId) ?? null;
  const selectedTrial = selected ? trialLabel(selected, l) : null;

  const handlePurchase = useCallback(async () => {
    if (!selected || busy) return;
    setBusy(true);
    const trial = trialLabel(selected, l);
    if (trial) {
      track('trial_start', { placement, product: selected.product.identifier });
    }
    const result = await purchasePackage(selected);
    setBusy(false);
    if (result.success) {
      track('purchase', {
        placement,
        product: selected.product.identifier,
        price: selected.product.price,
        currency: selected.product.currencyCode,
        had_trial: trial != null,
        ui: 'fallback',
        ...analyticsProperties,
      });
      onPurchased();
    }
  }, [selected, busy, placement, onPurchased, analyticsProperties, l]);

  const handleRestore = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      const status = await restorePurchases();
      track('restore', { placement, active: status.isActive });
      if (status.isActive) onPurchased();
    } finally {
      setBusy(false);
    }
  }, [busy, placement, onPurchased]);

  const handleDismiss = useCallback(() => {
    track('paywall_dismiss', { placement, ui: 'fallback' });
    if (allowDismiss) onDismiss();
  }, [allowDismiss, placement, onDismiss]);

  const period = selected?.packageType === 'ANNUAL' ? l.perYear : selected?.packageType === 'MONTHLY' ? l.perMonth : null;
  const ctaLabel = selectedTrial
    ? l.startTrial(selectedTrial)
    : selected
      ? `${c.cta}${period ? ` — ${selected.product.priceString}/${period}` : ''}`
      : c.cta;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {allowDismiss ? (
        <TouchableOpacity style={[styles.close, { top: insets.top + 8 }]} onPress={handleDismiss} accessibilityRole="button">
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{c.title}</Text>
        <Text style={styles.subtitle}>{c.subtitle}</Text>

        <View style={styles.benefits}>
          {c.benefits.map((b) => (
            <View key={b} style={styles.benefitRow}>
              <Text style={styles.check}>✓</Text>
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color="#FFFFFF" style={{ marginVertical: 32 }} />
        ) : packages.length === 0 ? (
          <Text style={styles.empty}>{l.noProducts}</Text>
        ) : (
          <View style={styles.plans}>
            {packages.map((pkg) => {
              const active = pkg.identifier === selectedId;
              const trial = trialLabel(pkg, l);
              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[styles.plan, active && styles.planActive]}
                  onPress={() => setSelectedId(pkg.identifier)}
                  accessibilityRole="button"
                >
                  <View style={styles.planLeft}>
                    <View style={[styles.radio, active && styles.radioActive]}>
                      {active ? <View style={styles.radioDot} /> : null}
                    </View>
                    <View>
                      <Text style={styles.planName}>{packageTypeLabel(pkg, l)}</Text>
                      {trial ? <Text style={styles.planTrial}>{trial}</Text> : null}
                    </View>
                  </View>
                  <Text style={styles.planPrice}>{pkg.product.priceString}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.cta, (!selected || busy) && styles.ctaDisabled]}
          onPress={handlePurchase}
          disabled={!selected || busy}
          accessibilityRole="button"
        >
          {busy ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.ctaLabel}>{ctaLabel}</Text>
          )}
        </TouchableOpacity>

        <WebPurchaseButton />

        <View style={styles.legalRow}>
          <TouchableOpacity onPress={handleRestore}>
            <Text style={styles.legalLink}>{l.restore}</Text>
          </TouchableOpacity>
          {termsUrl ? (
            <TouchableOpacity onPress={() => Linking.openURL(termsUrl)}>
              <Text style={styles.legalLink}>{l.terms}</Text>
            </TouchableOpacity>
          ) : null}
          {privacyUrl ? (
            <TouchableOpacity onPress={() => Linking.openURL(privacyUrl)}>
              <Text style={styles.legalLink}>{l.privacy}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={styles.footnote}>{c.footnote}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F' },
  close: { position: 'absolute', top: 8, right: 16, zIndex: 10, padding: 12 },
  closeText: { color: '#6B7280', fontSize: 20, fontWeight: '600' },
  scroll: { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', textAlign: 'center' },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  benefits: { marginTop: 28, gap: 12, alignSelf: 'center' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  check: { color: '#6366F1', fontSize: 16, fontWeight: '800' },
  benefitText: { color: '#E5E7EB', fontSize: 16 },
  empty: { color: '#9CA3AF', textAlign: 'center', marginVertical: 32, paddingHorizontal: 16 },
  plans: { marginTop: 28, gap: 12 },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#26262E',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  planActive: { borderColor: '#6366F1', backgroundColor: '#141420' },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#3F3F46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: '#6366F1' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#6366F1' },
  planName: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  planTrial: { color: '#818CF8', fontSize: 13, marginTop: 2 },
  planPrice: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  footer: { paddingHorizontal: 24, paddingTop: 8 },
  cta: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.5 },
  ctaLabel: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 14,
  },
  legalLink: { color: '#6B7280', fontSize: 13 },
  footnote: {
    color: '#4B5563',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
});
