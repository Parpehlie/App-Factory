import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { hasCompletedOnboarding } from '@app-factory/core';

/** Entry gate: route first-run users into onboarding, everyone else into the app. */
export default function Index() {
  const [done, setDone] = useState<boolean | null>(null);

  useEffect(() => {
    void hasCompletedOnboarding().then(setDone);
  }, []);

  if (done === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B0B0F', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }

  return <Redirect href={done ? '/(tabs)' : '/onboarding'} />;
}
