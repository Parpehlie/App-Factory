import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { hasCompletedOnboarding } from '@app-factory/core';
import { useApp } from '../src/AppProvider';
import { colors } from '../src/theme';

/** Entry gate: route first-run users into onboarding, everyone else into the app. */
export default function Index() {
  const [done, setDone] = useState<boolean | null>(null);
  const { ready, state } = useApp();

  useEffect(() => {
    void hasCompletedOnboarding().then(setDone);
  }, []);

  if (done === null || !ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.green} />
      </View>
    );
  }

  return <Redirect href={done && state.profile ? '/(tabs)/today' : '/onboarding'} />;
}
