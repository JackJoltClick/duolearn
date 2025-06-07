import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { triggerHapticFeedback } from '@/lib/utils/common';

export default function VerificationSuccessScreen() {
  const { message } = useLocalSearchParams<{ message?: string }>();

  useEffect(() => {
    // Trigger success haptic feedback when screen loads
    triggerHapticFeedback('success');
  }, []);

  const handleContinue = () => {
    triggerHapticFeedback('light');
    router.replace('/(tabs)');
  };

  return (
    <AuthGuard requireAuth={true}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </View>
          </View>

          {/* Success Message */}
          <Text style={styles.title}>Email Verified!</Text>
          <Text style={styles.subtitle}>
            {message || 'Your email has been successfully verified. Welcome to JOLTCLICK!'}
          </Text>

          {/* Success Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={24} color="#34C759" />
              <Text style={styles.featureText}>Account Secured</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="notifications" size={24} color="#34C759" />
              <Text style={styles.featureText}>Notifications Enabled</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="person-add" size={24} color="#34C759" />
              <Text style={styles.featureText}>Profile Created</Text>
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.actionContainer}>
            <Button
              title="Continue to App"
              onPress={handleContinue}
              variant="primary"
              fullWidth
              size="large"
            />
          </View>
        </View>
      </SafeAreaView>
    </AuthGuard>
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
    marginBottom: 32,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
  },
  actionContainer: {
    width: '100%',
  },
});