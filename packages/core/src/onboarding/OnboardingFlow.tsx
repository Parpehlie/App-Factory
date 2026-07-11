import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { track } from '../analytics';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image?: ImageSourcePropType;
  /** Overrides the primary button label for this step. */
  cta?: string;
  /** Optional app-specific interactive content rendered below the description. */
  content?: React.ReactNode;
  /** Disable the primary action until this step is valid or finished. */
  canContinue?: boolean;
  /** Runs before advancing; useful for persisting a selection. */
  onContinue?: () => void | Promise<void>;
}

export interface OnboardingFlowProps {
  steps: OnboardingStep[];
  /** Called after the last step. Typically navigates to the paywall. */
  onComplete: () => void;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  mutedColor?: string;
  /** Analytics label distinguishing multiple funnels (e.g. A/B variant). */
  variant?: string;
}

/**
 * Configurable onboarding funnel. Emits `onboarding_step` for each screen viewed and
 * `onboarding_complete` at the end, then calls `onComplete` (→ paywall). Deliberately
 * dependency-light (no pager lib) so it drops into any app and stays legible.
 */
export function OnboardingFlow({
  steps,
  onComplete,
  primaryColor = '#6366F1',
  backgroundColor = '#0B0B0F',
  textColor = '#FFFFFF',
  mutedColor = '#9CA3AF',
  variant = 'default',
}: OnboardingFlowProps) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  useEffect(() => {
    if (!step) return;
    track('onboarding_step', {
      step_id: step.id,
      step_index: index,
      step_count: steps.length,
      variant,
    });
  }, [index, step?.id, steps.length, variant]);

  const next = useCallback(async () => {
    if (step?.canContinue === false) return;
    setBusy(true);
    await step?.onContinue?.();
    if (isLast) {
      track('onboarding_complete', { step_count: steps.length, variant });
      onComplete();
      setBusy(false);
      return;
    }
    setIndex((i) => Math.min(i + 1, steps.length - 1));
    setBusy(false);
  }, [isLast, onComplete, step, steps.length, variant]);

  if (!step) return null;

  return (
    <View style={[styles.container, { backgroundColor, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.dots}>
        {steps.map((s, i) => (
          <View
            key={s.id}
            style={[
              styles.dot,
              { backgroundColor: i <= index ? primaryColor : '#2A2A31' },
            ]}
          />
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {step.image ? <Image source={step.image} style={styles.image} resizeMode="contain" /> : null}
        <Text style={[styles.title, { color: textColor }]}>{step.title}</Text>
        <Text style={[styles.description, { color: mutedColor }]}>{step.description}</Text>
        {step.content}
      </ScrollView>

      <TouchableOpacity
        accessibilityRole="button"
        style={[styles.cta, { backgroundColor: primaryColor }, (step.canContinue === false || busy) && styles.ctaDisabled]}
        onPress={() => void next()}
        disabled={step.canContinue === false || busy}
      >
        <Text style={styles.ctaLabel}>{busy ? 'Building your plan…' : step.cta ?? (isLast ? 'Get Started' : 'Continue')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
    paddingHorizontal: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 24,
    height: 4,
    borderRadius: 2,
  },
  body: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  image: {
    width: '80%',
    height: 220,
    marginBottom: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    color: '#9CA3AF',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  cta: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  ctaDisabled: { opacity: 0.45 },
});
