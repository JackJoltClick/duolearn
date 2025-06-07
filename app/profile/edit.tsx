import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';

import { useAuthStore } from '@/lib/stores/auth';
import { UpdateProfileFormData } from '@/lib/types/auth';
import { updateProfileSchema } from '@/lib/validations/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { triggerHapticFeedback, getInitials } from '@/lib/utils/common';
import { supabase } from '@/lib/supabase/client';

export default function EditProfileScreen() {
  const { user, profile, loadProfile } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [avatarUri, setAvatarUri] = React.useState<string | null>(profile?.avatar_url || null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: yupResolver(updateProfileSchema) as any,
    mode: 'onChange',
    defaultValues: {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      displayName: profile?.display_name || '',
      bio: profile?.bio || '',
      phone: profile?.phone || '',
      website: profile?.website || '',
    },
  });

  const pickImage = async () => {
    triggerHapticFeedback('light');
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const uploadAvatar = async (uri: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const fileExt = uri.split('.').pop();
      const fileName = `${user?.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Avatar upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      return null;
    }
  };

  const onSubmit = async (data: UpdateProfileFormData) => {
    if (!user) return;

    try {
      setIsLoading(true);
      triggerHapticFeedback('light');

      let avatarUrl = profile?.avatar_url;

      // Upload new avatar if changed
      if (avatarUri && avatarUri !== profile?.avatar_url) {
        const uploadedUrl = await uploadAvatar(avatarUri);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      // Update profile in database
      const updateData = {
        first_name: data.firstName || null,
        last_name: data.lastName || null,
        display_name: data.displayName || null,
        bio: data.bio || null,
        phone: data.phone || null,
        website: data.website || null,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Reload profile data
      await loadProfile();
      
      triggerHapticFeedback('success');
      Alert.alert(
        'Profile Updated',
        'Your profile has been successfully updated.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Profile update error:', error);
      triggerHapticFeedback('error');
      Alert.alert(
        'Update Failed',
        error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const initials = getInitials(profile?.first_name, profile?.last_name) || 
                   user?.email?.charAt(0).toUpperCase() || 
                   'U';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
              <View style={styles.editBadge}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarLabel}>Tap to change photo</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.nameRow}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="First Name"
                    placeholder="Enter first name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.firstName?.message}
                    containerStyle={styles.nameInput}
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Last Name"
                    placeholder="Enter last name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.lastName?.message}
                    containerStyle={styles.nameInput}
                  />
                )}
              />
            </View>

            <Controller
              control={control}
              name="displayName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Display Name"
                  placeholder="How others see your name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.displayName?.message}
                  helperText="This is how your name appears to others"
                />
              )}
            />

            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Bio"
                  placeholder="Tell us about yourself"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.bio?.message}
                  multiline
                  numberOfLines={3}
                  helperText="Share a bit about yourself (optional)"
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Phone"
                  placeholder="Enter phone number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
                  leftIcon="call"
                />
              )}
            />

            <Controller
              control={control}
              name="website"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Website"
                  placeholder="https://yourwebsite.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.website?.message}
                  keyboardType="url"
                  autoCapitalize="none"
                  leftIcon="globe"
                />
              )}
            />
          </View>

          {/* Save Button */}
          <View style={styles.saveContainer}>
            <Button
              title="Save Changes"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={!isDirty || !isValid}
              fullWidth
              size="large"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarLabel: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: 20,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  nameInput: {
    flex: 1,
  },
  saveContainer: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
});