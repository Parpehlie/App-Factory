import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePremium } from '@app-factory/core';

export default function Home() {
  const router = useRouter();
  const { isPremium, ready } = usePremium();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Replace this screen with your app.</Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {!ready ? 'Checking…' : isPremium ? '★ Premium' : 'Free plan'}
        </Text>
      </View>

      {ready && !isPremium ? (
        <TouchableOpacity style={styles.cta} onPress={() => router.push('/paywall')}>
          <Text style={styles.ctaText}>Go Premium</Text>
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#9CA3AF', fontSize: 15, textAlign: 'center' },
  badge: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#141420',
    borderWidth: 1,
    borderColor: '#26262E',
  },
  badgeText: { color: '#E5E7EB', fontSize: 14, fontWeight: '600' },
  cta: {
    marginTop: 16,
    backgroundColor: '#6366F1',
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  ctaText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
