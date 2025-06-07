import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '@/lib/stores/auth';
import { useDuoLearnStore } from '@/lib/stores/duolearn';
import Colors from '@/constants/Colors';

const DAILY_GOAL_OPTIONS = [5, 10, 15, 20];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { userStats, setDailyGoal } = useDuoLearnStore();

  const handleDailyGoalChange = (minutes: number) => {
    setDailyGoal(minutes);
  };

  const handleNotificationTime = () => {
    // For now, just show an alert. Later can implement time picker
    Alert.alert(
      'Notification Time',
      'Feature coming soon. You will be able to set when you want to be reminded to practice.',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const displayName = user?.email?.split('@')[0] || 'User';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        {/* User Info */}
        <View style={styles.userContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          {user?.email && (
            <Text style={styles.userEmail}>{user.email}</Text>
          )}
        </View>

        {/* Daily Goal Setting */}
        <View style={styles.settingSection}>
          <Text style={styles.sectionTitle}>Daily Goal</Text>
          <Text style={styles.sectionSubtitle}>
            How many minutes do you want to practice each day?
          </Text>
          
          <View style={styles.goalOptions}>
            {DAILY_GOAL_OPTIONS.map((minutes) => (
              <TouchableOpacity
                key={minutes}
                style={[
                  styles.goalOption,
                  userStats.dailyGoalMinutes === minutes && styles.goalOptionActive
                ]}
                onPress={() => handleDailyGoalChange(minutes)}
              >
                <Text style={[
                  styles.goalOptionText,
                  userStats.dailyGoalMinutes === minutes && styles.goalOptionTextActive
                ]}>
                  {minutes} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notification Time */}
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleNotificationTime}
        >
          <View style={styles.settingContent}>
            <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Notification Time</Text>
              <Text style={styles.settingSubtitle}>
                Set when you want to be reminded
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
        </TouchableOpacity>

        {/* Sign Out */}
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleLogout}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>DuoLearn</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 20,
  },
  userContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  settingSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  goalOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  goalOption: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  goalOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  goalOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  goalOptionTextActive: {
    color: Colors.primary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  signOutButton: {
    backgroundColor: Colors.error,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
});