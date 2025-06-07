import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { Link, Tabs, router } from 'expo-router';
import { Pressable, Platform } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuthStore } from '@/lib/stores/auth';
import { AuthGuard } from '@/components/auth/AuthGuard';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuthStore();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated]);

  return (
    <AuthGuard requireAuth={true}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5EA',
            paddingBottom: Platform.OS === 'ios' ? 25 : 10,
            paddingTop: 10,
            height: Platform.OS === 'ios' ? 85 : 70,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 4,
          },
          headerShown: useClientOnlyValue(false, true),
          headerStyle: {
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: '#E5E5EA',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon 
                name={focused ? 'home' : 'home-outline'} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon 
                name={focused ? 'compass' : 'compass-outline'} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: 'Activity',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon 
                name={focused ? 'pulse' : 'pulse-outline'} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon 
                name={focused ? 'person' : 'person-outline'} 
                color={color} 
              />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
