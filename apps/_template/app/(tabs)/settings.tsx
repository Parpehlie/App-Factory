import { useRouter } from 'expo-router';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { resetOnboarding, usePremium } from '@app-factory/core';

const PRIVACY_URL = 'https://example.com/privacy';
const TERMS_URL = 'https://example.com/terms';
const MANAGE_URL = Platform.select({
  ios: 'https://apps.apple.com/account/subscriptions',
  android: 'https://play.google.com/store/account/subscriptions',
  default: 'https://apps.apple.com/account/subscriptions',
});

export default function Settings() {
  const router = useRouter();
  const { isPremium, restore } = usePremium();

  const onRestore = async () => {
    try {
      const status = await restore();
      Alert.alert(status.isActive ? 'Purchases restored' : 'Nothing to restore');
    } catch {
      Alert.alert('Restore failed', 'Please try again.');
    }
  };

  const rows: Array<{ label: string; onPress: () => void }> = [
    { label: 'Restore purchases', onPress: () => void onRestore() },
    { label: 'Manage subscription', onPress: () => void Linking.openURL(MANAGE_URL) },
    { label: 'Privacy Policy', onPress: () => void WebBrowser.openBrowserAsync(PRIVACY_URL) },
    { label: 'Terms of Use', onPress: () => void WebBrowser.openBrowserAsync(TERMS_URL) },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Plan</Text>
          <Text style={styles.statusValue}>{isPremium ? 'Premium' : 'Free'}</Text>
        </View>

        <View style={styles.group}>
          {rows.map((r) => (
            <TouchableOpacity key={r.label} style={styles.row} onPress={r.onPress}>
              <Text style={styles.rowText}>{r.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {__DEV__ ? (
          <TouchableOpacity
            style={styles.devRow}
            onPress={async () => {
              await resetOnboarding();
              router.replace('/');
            }}
          >
            <Text style={styles.devText}>Reset onboarding (dev)</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F' },
  scroll: { padding: 24, gap: 8 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginBottom: 16 },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#141420',
    borderRadius: 14,
    marginBottom: 20,
  },
  statusLabel: { color: '#9CA3AF', fontSize: 15 },
  statusValue: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  group: {
    backgroundColor: '#141420',
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#26262E',
  },
  rowText: { color: '#E5E7EB', fontSize: 16 },
  chevron: { color: '#4B5563', fontSize: 22 },
  devRow: { marginTop: 24, alignItems: 'center', paddingVertical: 12 },
  devText: { color: '#6B7280', fontSize: 13 },
});
