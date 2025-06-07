import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuthStore } from '@/lib/stores/auth';
import { LoginFormData } from '@/lib/types/auth';
import { loginSchema } from '@/lib/validations/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { triggerHapticFeedback } from '@/lib/utils/common';

export default function LoginScreen() {
  const { login, isLoading, resendVerificationEmail } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    triggerHapticFeedback('light');
    
    const result = await login(data);
    
    if (result.success) {
      triggerHapticFeedback('success');
      router.replace('/(tabs)');
    } else {
      triggerHapticFeedback('error');
      
      // Check if the error is related to unverified email
      const errorMessage = result.error || '';
      const isEmailNotVerified = errorMessage.toLowerCase().includes('email not confirmed') ||
                                 errorMessage.toLowerCase().includes('email not verified') ||
                                 errorMessage.toLowerCase().includes('confirm your email');
      
      if (isEmailNotVerified) {
        Alert.alert(
          'Email Not Verified',
          'Please verify your email address before signing in. Would you like us to resend the verification email?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Resend Email',
              onPress: () => handleResendVerification(data.email),
            },
          ]
        );
      } else {
        Alert.alert('Login Failed', errorMessage || 'Please try again');
      }
    }
  };

  const handleResendVerification = async (email: string) => {
    try {
      triggerHapticFeedback('light');
      const result = await resendVerificationEmail(email);
      
      if (result.success) {
        triggerHapticFeedback('success');
        Alert.alert(
          'Email Sent',
          'A new verification email has been sent. Please check your inbox.',
          [
            {
              text: 'OK',
              onPress: () => router.push({
                pathname: '/auth/email-verification',
                params: { email }
              }),
            },
          ]
        );
      } else {
        triggerHapticFeedback('error');
        Alert.alert('Failed to Send Email', result.error || 'Please try again later.');
      }
    } catch (error) {
      triggerHapticFeedback('error');
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your JOLTCLICK account</Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    leftIcon="mail"
                    required
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    secureTextEntry
                    leftIcon="lock-closed"
                    required
                  />
                )}
              />

              <View style={styles.forgotPasswordContainer}>
                <Link href="/auth/reset-password" asChild>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </Link>
              </View>

              <Button
                title="Sign In"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={!isValid}
                fullWidth
                size="large"
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Link href="/auth/register" asChild>
                  <Text style={styles.link}>Sign Up</Text>
                </Link>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
  },
});