import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  LayoutAnimation,
  Platform,
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
  /** Localized labels for the small navigation affordances. */
  backLabel?: string;
  busyLabel?: string;
  continueLabel?: string;
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
  backLabel = 'Back',
  busyLabel = 'Building your plan…',
  continueLabel = 'Continue',
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
    if (Platform.OS !== 'web') LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIndex((i) => Math.min(i + 1, steps.length - 1));
    setBusy(false);
  }, [isLast, onComplete, step, steps.length, variant]);

  const previous = useCallback(() => {
    if (index === 0 || busy) return;
    // A small native transition makes a correction feel intentional rather than
    // like the user has fallen out of the funnel. It is a no-op where unsupported.
    if (Platform.OS !== 'web') LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIndex((i) => Math.max(0, i - 1));
  }, [busy, index]);

  if (!step) return null;

  return (
    <View style={[styles.container, { backgroundColor, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.progressHeader}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Return to the previous onboarding question"
          disabled={index === 0 || busy}
          onPress={previous}
          hitSlop={10}
          style={[styles.backButton, (index === 0 || busy) && styles.backButtonHidden]}
        >
          <Text style={[styles.backLabel, { color: textColor }]}>‹</Text>
          <Text style={[styles.backText, { color: mutedColor }]}>{backLabel}</Text>
        </TouchableOpacity>
        <View accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: steps.length, now: index + 1 }} style={styles.dots}>
          {steps.map((s, i) => (
            <View
              key={s.id}
              style={[
                styles.dot,
                i === index && styles.dotActive,
                { backgroundColor: i <= index ? primaryColor : '#D9DDD7' },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.stepCount, { color: mutedColor }]}>{index + 1}/{steps.length}</Text>
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
        {busy ? <ActivityIndicator color="#FFFFFF" /> : null}
        <Text style={[styles.ctaLabel, busy && styles.ctaLabelBusy]}>{busy ? busyLabel : step.cta ?? (isLast ? 'Get Started' : continueLabel)}</Text>
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
  progressHeader: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 64,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonHidden: { opacity: 0, pointerEvents: 'none' },
  backLabel: { fontSize: 29, lineHeight: 29, fontWeight: '400', marginTop: -3 },
  backText: { fontSize: 14, fontWeight: '700', marginLeft: 1 },
  stepCount: { width: 64, textAlign: 'right', fontSize: 13, fontWeight: '700' },
  dots: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 5,
    borderRadius: 3,
  },
  dotActive: { width: 25 },
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
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    color: '#9CA3AF',
    fontSize: 17,
    lineHeight: 25,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  cta: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  ctaLabelBusy: { marginLeft: 10 },
  ctaDisabled: { opacity: 0.45 },
});
