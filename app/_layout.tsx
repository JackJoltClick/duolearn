import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import { queryClient } from '@/lib/hooks/useQuery';
import { useAuthStore } from '@/lib/stores/auth';
import { AuthGuard } from '@/components/auth/AuthGuard';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  
  const initialize = useAuthStore((state) => state.initialize);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      initialize();
      SplashScreen.hideAsync();
    }
  }, [loaded, initialize]);

  // Handle deep linking for email verification
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      const parsedUrl = Linking.parse(url);
      
      // Check if this is an email verification link
      if (parsedUrl.path?.includes('verify') || parsedUrl.queryParams?.type === 'email') {
        // Extract verification parameters
        const token = parsedUrl.queryParams?.token as string;
        const type = parsedUrl.queryParams?.type as string;
        const email = parsedUrl.queryParams?.email as string;
        
        // Navigate to verification screen with parameters
        import('expo-router').then(({ router }) => {
          router.push({
            pathname: '/auth/verify-email',
            params: { token, type, email }
          });
        });
      }
    };

    // Handle initial URL when app is opened from deep link
    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    // Handle deep links when app is already open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    getInitialURL();

    return () => subscription?.remove();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootLayoutNav />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
