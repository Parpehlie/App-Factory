import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useT } from '../../src/i18n';
import { colors } from '../../src/theme';

export default function TabsLayout() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 5);
  const scaledLabelSpace = Math.max(0, fontScale - 1) * 22;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: '#7C8780',
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700', marginTop: 1 },
        tabBarItemStyle: { paddingTop: 4 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: 56 + bottomInset + scaledLabelSpace,
          paddingTop: 4,
          paddingBottom: bottomInset,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: t.tabs.today,
          tabBarIcon: ({ color, size }) => <Ionicons name="barbell-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="progress" options={{title:t.tabs.progress,tabBarIcon:({color,size})=><Ionicons name="trending-up-outline" color={color} size={size}/>}}/>
      <Tabs.Screen
        name="settings"
        options={{
          title: t.tabs.settings,
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
