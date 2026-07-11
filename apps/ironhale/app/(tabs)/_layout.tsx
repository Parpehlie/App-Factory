import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1E5B3A',
        tabBarInactiveTintColor: '#758078',
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#DADDD6', height: 62, paddingTop: 5 },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => <Ionicons name="barbell-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="progress" options={{title:'Progress',tabBarIcon:({color,size})=><Ionicons name="trending-up-outline" color={color} size={size}/>}}/>
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
