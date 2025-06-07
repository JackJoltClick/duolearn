import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

import { useDuoLearnStore } from '@/lib/stores/duolearn';
import Colors from '@/constants/Colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function HomeScreen() {
  const { userStats, todayProgress, startSession } = useDuoLearnStore();
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    (todayProgress.totalMinutes / userStats.dailyGoalMinutes) * 100,
    100
  );
  
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progressPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

  const handleContinue = () => {
    // Navigate to practice tab (explore)
    router.push('/(tabs)/explore');
  };

  const isComplete = todayProgress.isComplete;
  const buttonText = todayProgress.totalMinutes === 0 ? 'Start' : 
                    isComplete ? 'Continue' : 'Continue';

  // Circle calculations
  const radius = 80;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Ring */}
        <View style={styles.progressContainer}>
          <Svg width={200} height={200} style={styles.progressRing}>
            {/* Background circle */}
            <Circle
              cx={100}
              cy={100}
              r={radius}
              stroke={Colors.progressBackground}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            
            {/* Progress circle */}
            <AnimatedCircle
              cx={100}
              cy={100}
              r={radius}
              stroke={Colors.primary}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={animatedValue.interpolate({
                inputRange: [0, 100],
                outputRange: [circumference, 0],
              })}
              transform={`rotate(-90 100 100)`}
            />
          </Svg>
          
          {/* Center content */}
          <View style={styles.centerContent}>
            <Text style={styles.streakNumber}>{userStats.currentStreak}</Text>
            <Text style={styles.streakLabel}>day streak</Text>
          </View>
        </View>

        {/* Progress text */}
        <Text style={styles.progressText}>
          {todayProgress.totalMinutes} / {userStats.dailyGoalMinutes} minutes
        </Text>

        {/* Action button */}
        <TouchableOpacity 
          style={[
            styles.actionButton,
            isComplete && styles.actionButtonComplete
          ]} 
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.actionButtonText,
            isComplete && styles.actionButtonTextComplete
          ]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  progressContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  progressRing: {
    transform: [{ rotate: '0deg' }],
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 48,
  },
  streakLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  progressText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 60,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 30,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonComplete: {
    backgroundColor: Colors.success,
  },
  actionButtonText: {
    color: Colors.background,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionButtonTextComplete: {
    color: Colors.background,
  },
});
