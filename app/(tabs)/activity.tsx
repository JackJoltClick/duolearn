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

import { useAuthStore } from '@/lib/stores/auth';
import { triggerHapticFeedback, formatDate, formatDateTime } from '@/lib/utils/common';

const ACTIVITY_TYPES = {
  login: { icon: 'log-in', color: '#34C759', label: 'Login' },
  profile_update: { icon: 'person', color: '#007AFF', label: 'Profile Update' },
  feature_used: { icon: 'star', color: '#FF9500', label: 'Feature Used' },
  achievement: { icon: 'trophy', color: '#FFD60A', label: 'Achievement' },
  points_earned: { icon: 'diamond', color: '#AF52DE', label: 'Points Earned' },
};

const SAMPLE_ACTIVITIES = [
  {
    id: 1,
    type: 'login',
    title: 'Signed in to JOLTCLICK',
    description: 'Welcome back! You earned 5 daily bonus points.',
    points: 5,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 2,
    type: 'profile_update',
    title: 'Profile completed',
    description: 'You added your profile picture and bio.',
    points: 10,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 3,
    type: 'feature_used',
    title: 'Explored new features',
    description: 'You checked out the Explore tab.',
    points: 5,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 4,
    type: 'achievement',
    title: 'First Steps',
    description: 'Congratulations on joining JOLTCLICK!',
    points: 25,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: 5,
    type: 'points_earned',
    title: 'Daily Streak Bonus',
    description: 'You maintained a 3-day activity streak.',
    points: 15,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
];

const STATS = {
  totalPoints: 150,
  streakDays: 7,
  totalActivities: 23,
  thisWeekPoints: 45,
};

export default function ActivityScreen() {
  const { user } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = React.useState('all');

  const handleFilterPress = (filter: string) => {
    triggerHapticFeedback('light');
    setSelectedFilter(filter);
  };

  const handleActivityPress = (activity: any) => {
    triggerHapticFeedback('light');
    // Navigate to activity detail or perform action
  };

  const filteredActivities = selectedFilter === 'all' 
    ? SAMPLE_ACTIVITIES 
    : SAMPLE_ACTIVITIES.filter(activity => activity.type === selectedFilter);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'points_earned', label: 'Points' },
    { id: 'achievement', label: 'Achievements' },
    { id: 'feature_used', label: 'Features' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{STATS.totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{STATS.streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{STATS.totalActivities}</Text>
              <Text style={styles.statLabel}>Activities</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>+{STATS.thisWeekPoints}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
          </View>
        </View>

        {/* Activity Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.sectionTitle}>Activity Feed</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.id && styles.filterButtonActive
                ]}
                onPress={() => handleFilterPress(filter.id)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Activity List */}
        <View style={styles.activitiesContainer}>
          {filteredActivities.map((activity) => {
            const activityType = ACTIVITY_TYPES[activity.type as keyof typeof ACTIVITY_TYPES];
            
            return (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityItem}
                onPress={() => handleActivityPress(activity)}
              >
                <View style={[styles.activityIcon, { backgroundColor: activityType.color + '20' }]}>
                  <Ionicons 
                    name={activityType.icon as any} 
                    size={20} 
                    color={activityType.color} 
                  />
                </View>
                
                <View style={styles.activityContent}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    {activity.points > 0 && (
                      <View style={styles.pointsBadge}>
                        <Text style={styles.pointsText}>+{activity.points}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <Text style={styles.activityTime}>
                    {formatDateTime(activity.timestamp)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="pulse" size={48} color="#8E8E93" />
            <Text style={styles.emptyTitle}>No activities yet</Text>
            <Text style={styles.emptyDescription}>
              Start using JOLTCLICK to see your activity here
            </Text>
          </View>
        )}

        {/* Load More */}
        {filteredActivities.length > 0 && (
          <TouchableOpacity style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Load More</Text>
            <Ionicons name="chevron-down" size={16} color="#007AFF" />
          </TouchableOpacity>
        )}
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
  statsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  filtersScroll: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 12,
  },
  filterButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  activitiesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  pointsBadge: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activityDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 12,
    color: '#C7C7CC',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});