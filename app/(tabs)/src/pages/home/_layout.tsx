import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs initialRouteName="home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#091d34',
          position:"absolute",
          borderRadius:8,
        },
        tabBarActiveTintColor: '#f99d30',
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={'#f99d30'} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: 'add',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" size={size} color={'#f99d30'} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={'#f99d30'} />
          ),
        }}
      />
    </Tabs>
  );
}