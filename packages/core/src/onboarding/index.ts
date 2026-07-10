import AsyncStorage from '@react-native-async-storage/async-storage';

export { OnboardingFlow } from './OnboardingFlow';
export type { OnboardingStep, OnboardingFlowProps } from './OnboardingFlow';

const ONBOARDING_KEY = '@core/onboarding_complete';

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_KEY)) === '1';
  } catch {
    return false;
  }
}

export async function setOnboardingComplete(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, '1');
  } catch {
    // ignore storage errors
  }
}

/** Dev/settings helper to replay the funnel. */
export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch {
    // ignore storage errors
  }
}
