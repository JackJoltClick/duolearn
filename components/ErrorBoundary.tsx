import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Button } from './ui/Button';
import { triggerHapticFeedback } from '@/lib/utils/common';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    triggerHapticFeedback('error');
    
    // Log to crash reporting service in production
    // crashlytics().recordError(error);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return (
          <this.props.fallback 
            error={this.state.error!} 
            resetError={this.resetError} 
          />
        );
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const handleGoHome = () => {
    triggerHapticFeedback('light');
    resetError();
    router.replace('/(tabs)');
  };

  const handleReload = () => {
    triggerHapticFeedback('light');
    resetError();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="warning" size={64} color="#FF3B30" />
        </View>
        
        <Text style={styles.title}>Oops! Something went wrong</Text>
        <Text style={styles.subtitle}>
          We're sorry for the inconvenience. Please try again.
        </Text>
        
        {__DEV__ && (
          <View style={styles.errorDetails}>
            <Text style={styles.errorTitle}>Error Details:</Text>
            <Text style={styles.errorMessage}>{error.message}</Text>
            <Text style={styles.errorStack}>{error.stack}</Text>
          </View>
        )}
        
        <View style={styles.actions}>
          <Button
            title="Try Again"
            onPress={handleReload}
            variant="primary"
            fullWidth
            style={styles.button}
          />
          
          <Button
            title="Go to Home"
            onPress={handleGoHome}
            variant="outline"
            fullWidth
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  errorDetails: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
    width: '100%',
    maxHeight: 200,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF3B30',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  errorStack: {
    fontSize: 10,
    color: '#8E8E93',
    fontFamily: 'monospace',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  button: {
    marginBottom: 0,
  },
});