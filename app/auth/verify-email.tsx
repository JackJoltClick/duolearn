import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';

import { useAuthStore } from '@/lib/stores/auth';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { triggerHapticFeedback } from '@/lib/utils/common';

export default function VerifyEmailScreen() {
  const { token, type, email } = useLocalSearchParams<{ 
    token?: string; 
    type?: string; 
    email?: string; 
  }>();
  
  const { handleEmailVerificationCallback, verifyEmail } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    handleVerification();
  }, []);

  const handleVerification = async () => {
    try {
      setIsVerifying(true);

      let result;

      if (token && type) {
        // Direct token verification
        result = await verifyEmail(token, type);
      } else {
        // Try to get the full URL for verification
        const url = await Linking.getInitialURL();
        if (url) {
          result = await handleEmailVerificationCallback(url);
        } else {
          result = { 
            success: false, 
            error: 'No verification data found' 
          };
        }
      }

      setVerificationResult({
        success: result.success,
        message: result.success 
          ? (result.message || 'Email verified successfully!')
          : (result.error || 'Email verification failed')
      });

      if (result.success) {
        triggerHapticFeedback('success');
        // Navigate to success screen after a brief delay
        setTimeout(() => {
          router.replace({
            pathname: '/auth/verification-success',
            params: { message: result.message }
          });
        }, 2000);
      } else {
        triggerHapticFeedback('error');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setVerificationResult({
        success: false,
        message: 'Something went wrong during verification'
      });
      triggerHapticFeedback('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRetry = () => {
    triggerHapticFeedback('light');
    setVerificationResult(null);
    handleVerification();
  };

  const handleBackToLogin = () => {
    triggerHapticFeedback('light');
    router.replace('/auth/login');
  };

  const handleResendEmail = () => {
    triggerHapticFeedback('light');
    if (email) {
      router.replace({
        pathname: '/auth/email-verification',
        params: { email }
      });
    } else {
      router.replace('/auth/login');
    }
  };

  if (isVerifying) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Loading size="large" message="Verifying your email..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Status Icon */}
        <View style={styles.iconContainer}>
          {verificationResult?.success ? (
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </View>
          ) : (
            <View style={styles.errorCircle}>
              <Ionicons name="close" size={48} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Status Message */}
        <Text style={styles.title}>
          {verificationResult?.success ? 'Verification Successful!' : 'Verification Failed'}
        </Text>
        
        <Text style={styles.subtitle}>
          {verificationResult?.message}
        </Text>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {verificationResult?.success ? (
            <Button
              title="Continue to App"
              onPress={() => router.replace('/(tabs)')}
              variant="primary"
              fullWidth
              size="large"
            />
          ) : (
            <>
              <Button
                title="Try Again"
                onPress={handleRetry}
                variant="primary"
                fullWidth
                size="large"
                style={styles.actionButton}
              />
              
              {email && (
                <Button
                  title="Resend Verification Email"
                  onPress={handleResendEmail}
                  variant="outline"
                  fullWidth
                  style={styles.actionButton}
                />
              )}
              
              <Button
                title="Back to Login"
                onPress={handleBackToLogin}
                variant="ghost"
                fullWidth
                style={styles.actionButton}
              />
            </>
          )}
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
  errorCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3B30',
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
  actionsContainer: {
    width: '100%',
  },
  actionButton: {
    marginBottom: 12,
  },
});