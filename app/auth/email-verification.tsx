import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { useAuthStore } from '@/lib/stores/auth';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { triggerHapticFeedback } from '@/lib/utils/common';

export default function EmailVerificationScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { resendVerificationEmail } = useAuthStore();
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (!email || resendCooldown > 0) return;

    try {
      setIsResending(true);
      triggerHapticFeedback('light');

      const result = await resendVerificationEmail(email);

      if (result.success) {
        triggerHapticFeedback('success');
        setResendCooldown(60); // 60 second cooldown
        Alert.alert(
          'Email Sent',
          'A new verification email has been sent to your inbox.'
        );
      } else {
        triggerHapticFeedback('error');
        Alert.alert(
          'Failed to Send Email',
          result.error || 'Please try again later.'
        );
      }
    } catch (error) {
      triggerHapticFeedback('error');
      Alert.alert(
        'Error',
        'Something went wrong. Please try again.'
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    triggerHapticFeedback('light');
    router.replace('/auth/login');
  };

  const handleOpenEmailApp = () => {
    triggerHapticFeedback('light');
    // This will try to open the default email app
    // You could also implement platform-specific deep links to Gmail, Outlook, etc.
    Alert.alert(
      'Open Email App',
      'Please check your email inbox and spam folder for the verification link.',
      [
        { text: 'OK', style: 'default' }
      ]
    );
  };

  return (
    <AuthGuard requireAuth={false}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail" size={64} color="#007AFF" />
            </View>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a verification link to:
            </Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>1</Text>
              </View>
              <Text style={styles.instructionText}>
                Open the email in your inbox
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Click the verification link
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                You'll be automatically signed in
              </Text>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Can't find the email?</Text>
            <Text style={styles.tipText}>• Check your spam or junk folder</Text>
            <Text style={styles.tipText}>• Make sure you entered the correct email</Text>
            <Text style={styles.tipText}>• Wait a few minutes and check again</Text>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <Button
              title="Open Email App"
              onPress={handleOpenEmailApp}
              variant="primary"
              fullWidth
              style={styles.actionButton}
            />

            <Button
              title={
                resendCooldown > 0
                  ? `Resend Email (${resendCooldown}s)`
                  : 'Resend Verification Email'
              }
              onPress={handleResendEmail}
              variant="outline"
              fullWidth
              disabled={!email || resendCooldown > 0}
              loading={isResending}
              style={styles.actionButton}
            />

            <Button
              title="Back to Login"
              onPress={handleBackToLogin}
              variant="ghost"
              fullWidth
              style={styles.actionButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Having trouble? Contact support for help with email verification.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 24,
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
    marginBottom: 8,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  instructionsContainer: {
    marginBottom: 32,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  instructionText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  tipsContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 4,
  },
  actionsContainer: {
    marginBottom: 32,
  },
  actionButton: {
    marginBottom: 12,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});