import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
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
}

export interface OnboardingFlowProps {
  steps: OnboardingStep[];
  /** Called after the last step. Typically navigates to the paywall. */
  onComplete: () => void;
  primaryColor?: string;
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
  variant = 'default',
}: OnboardingFlowProps) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
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
  }, [index, step, steps.length, variant]);

  const next = useCallback(() => {
    if (isLast) {
      track('onboarding_complete', { step_count: steps.length, variant });
      onComplete();
      return;
    }
    setIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [isLast, onComplete, steps.length, variant]);

  if (!step) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
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

      <View style={styles.body}>
        {step.image ? <Image source={step.image} style={styles.image} resizeMode="contain" /> : null}
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        style={[styles.cta, { backgroundColor: primaryColor }]}
        onPress={next}
      >
        <Text style={styles.ctaLabel}>{step.cta ?? (isLast ? 'Get Started' : 'Continue')}</Text>
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
    flex: 1,
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
});
