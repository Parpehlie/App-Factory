import { useRouter } from 'expo-router';
import { OnboardingFlow, setOnboardingComplete, type OnboardingStep } from '@app-factory/core';

// Onboarding is monetization-first: the last step hands straight off to the paywall.
const STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'This is your app template. Replace these three screens with your concept.',
  },
  {
    id: 'value',
    title: 'One clear promise',
    description: 'State the single outcome the user gets. A sharp value prop lifts paywall conversion.',
  },
  {
    id: 'ready',
    title: "You're all set",
    description: 'Start your free trial and unlock everything.',
    cta: 'Continue',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  return (
    <OnboardingFlow
      steps={STEPS}
      onComplete={async () => {
        await setOnboardingComplete();
        router.replace('/paywall');
      }}
    />
  );
}
