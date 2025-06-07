import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDuoLearnStore } from '@/lib/stores/duolearn';
import Colors from '@/constants/Colors';

export default function ProgressScreen() {
  const { userStats, weeklyProgress } = useDuoLearnStore();

  // Generate last 7 days for graph
  const generateLastSevenDays = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const existingData = weeklyProgress.find(p => p.date === dateString);
      days.push({
        date: dateString,
        dayName: date.toLocaleDateString('en', { weekday: 'short' }),
        minutes: existingData?.minutes || 0,
        isPerfect: existingData?.isPerfect || false,
      });
    }
    return days;
  };

  const weekData = generateLastSevenDays();
  const maxMinutes = Math.max(...weekData.map(d => d.minutes), userStats.dailyGoalMinutes);

  const StatCard = ({ 
    title, 
    value, 
    subtitle 
  }: { 
    title: string; 
    value: string | number; 
    subtitle?: string;
  }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Progress</Text>

        {/* Weekly Graph */}
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>Last 7 Days</Text>
          
          <View style={styles.graph}>
            {weekData.map((day, index) => {
              const height = maxMinutes > 0 ? (day.minutes / maxMinutes) * 120 : 0;
              
              return (
                <View key={day.date} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View 
                      style={[
                        styles.bar,
                        { 
                          height: Math.max(height, 2),
                          backgroundColor: day.isPerfect ? Colors.primary : Colors.progressBackground,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.dayLabel}>{day.dayName}</Text>
                </View>
              );
            })}
          </View>
          
          <View style={styles.graphLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.legendText}>Perfect day</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.progressBackground }]} />
              <Text style={styles.legendText}>Practice day</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <StatCard 
            title="Current Streak" 
            value={userStats.currentStreak}
            subtitle="days"
          />
          
          <StatCard 
            title="Best Streak" 
            value={userStats.bestStreak}
            subtitle="days"
          />
          
          <StatCard 
            title="Total Days" 
            value={userStats.totalDaysPracticed}
            subtitle="practiced"
          />
          
          <StatCard 
            title="Daily Goal" 
            value={userStats.dailyGoalMinutes}
            subtitle="minutes"
          />
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 20,
  },
  graphContainer: {
    backgroundColor: Colors.surface,
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  graph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    marginBottom: 10,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 2,
  },
  dayLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  graphLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    flex: 1,
    minWidth: '47%',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});