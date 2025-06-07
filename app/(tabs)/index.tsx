import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAuthStore } from '@/lib/stores/auth';
import { Button } from '@/components/ui/Button';
import { triggerHapticFeedback, formatDate } from '@/lib/utils/common';

export default function HomeScreen() {
  const { user, profile, logout } = useAuthStore();

  const handleQuickAction = (action: string) => {
    triggerHapticFeedback('light');
    
    switch (action) {
      case 'settings':
        // Navigate to settings
        break;
      case 'notifications':
        // Navigate to notifications
        break;
      case 'help':
        // Navigate to help
        break;
      case 'feedback':
        // Navigate to feedback
        break;
    }
  };

  const handleLogout = () => {
    triggerHapticFeedback('medium');
    logout();
  };

  const displayName = profile?.display_name || profile?.first_name || user?.email?.split('@')[0] || 'User';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{displayName}!</Text>
          <Text style={styles.date}>{formatDate(new Date())}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color="#007AFF" />
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#FF9500" />
            <Text style={styles.statNumber}>150</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="radio-button-on" size={24} color="#34C759" />
            <Text style={styles.statNumber}>3/5</Text>
            <Text style={styles.statLabel}>Goals</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => handleQuickAction('settings')}
            >
              <Ionicons name="settings" size={24} color="#007AFF" />
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => handleQuickAction('notifications')}
            >
              <Ionicons name="notifications" size={24} color="#007AFF" />
              <Text style={styles.quickActionText}>Notifications</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => handleQuickAction('help')}
            >
              <Ionicons name="help-circle" size={24} color="#007AFF" />
              <Text style={styles.quickActionText}>Help</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => handleQuickAction('feedback')}
            >
              <Ionicons name="chatbubble" size={24} color="#007AFF" />
              <Text style={styles.quickActionText}>Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.activityText}>Profile completed</Text>
              <Text style={styles.activityTime}>2h ago</Text>
            </View>
            
            <View style={styles.activityItem}>
              <Ionicons name="star" size={20} color="#FF9500" />
              <Text style={styles.activityText}>Earned 10 points</Text>
              <Text style={styles.activityTime}>1d ago</Text>
            </View>
            
            <View style={styles.activityItem}>
              <Ionicons name="trophy" size={20} color="#FFD60A" />
              <Text style={styles.activityText}>First login bonus</Text>
              <Text style={styles.activityTime}>2d ago</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  greeting: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
  },
  recentActivityContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  activityText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  logoutContainer: {
    paddingHorizontal: 20,
  },
});
