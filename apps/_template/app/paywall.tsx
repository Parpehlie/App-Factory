import { useRouter } from 'expo-router';
import { Paywall } from '@app-factory/core';

// TODO: point these at your published policies before submission.
const PRIVACY_URL = 'https://example.com/privacy';
const TERMS_URL = 'https://example.com/terms';

export default function PaywallScreen() {
  const router = useRouter();
  const done = () => router.replace('/(tabs)');

  return (
    <Paywall
      placement="onboarding"
      onPurchased={done}
      onDismiss={done}
      privacyUrl={PRIVACY_URL}
      termsUrl={TERMS_URL}
      content={{
        title: 'Unlock App Template Pro',
        subtitle: 'Everything you need, nothing in your way.',
      }}
    />
  );
}
