import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  PremiumProvider,
  assertBillingConfigured,
  fetchRemoteConfig,
  initAnalytics,
  trackInstallOnce,
} from '@app-factory/core';
import { AppProvider } from '../src/AppProvider';
import { I18nProvider } from '../src/i18n';
import { colors } from '../src/theme';

export default function RootLayout() {
  useEffect(() => {
    assertBillingConfigured();
    initAnalytics();
    void trackInstallOnce();
    // Kill-switch placeholder: fetch remote config on boot (fails open).
    void fetchRemoteConfig();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PremiumProvider debug={__DEV__}>
          <I18nProvider>
          <AppProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="workout/[id]" options={{ gestureEnabled: false }} />
          </Stack>
          </AppProvider>
          </I18nProvider>
        </PremiumProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
