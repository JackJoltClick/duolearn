import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useDuoLearnStore } from '@/lib/stores/duolearn';
import Colors from '@/constants/Colors';

interface PracticeCard {
  type: 'speaking' | 'vocabulary' | 'listening' | 'grammar';
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  accuracy: number;
}

export default function PracticeScreen() {
  const { todayProgress, startSession } = useDuoLearnStore();

  const practiceCards: PracticeCard[] = [
    {
      type: 'speaking',
      title: 'Speaking',
      icon: 'mic',
      accuracy: todayProgress.speaking,
    },
    {
      type: 'vocabulary',
      title: 'Vocabulary',
      icon: 'book',
      accuracy: todayProgress.vocabulary,
    },
    {
      type: 'listening',
      title: 'Listening',
      icon: 'headset',
      accuracy: todayProgress.listening,
    },
    {
      type: 'grammar',
      title: 'Grammar',
      icon: 'text',
      accuracy: todayProgress.grammar,
    },
  ];

  const handlePracticePress = (type: PracticeCard['type']) => {
    startSession(type);
    router.push('/practice');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Practice</Text>
        
        <View style={styles.cardsContainer}>
          {practiceCards.map((card) => (
            <TouchableOpacity
              key={card.type}
              style={styles.practiceCard}
              onPress={() => handlePracticePress(card.type)}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons 
                    name={card.icon} 
                    size={32} 
                    color={Colors.primary} 
                  />
                </View>
                
                <Text style={styles.cardTitle}>{card.title}</Text>
                
                <View style={styles.accuracyContainer}>
                  {card.accuracy > 0 ? (
                    <Text style={styles.accuracyText}>
                      {Math.round(card.accuracy)}% accuracy
                    </Text>
                  ) : (
                    <Text style={styles.notStartedText}>
                      Not started
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    gap: 20,
  },
  practiceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
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
  cardContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${Colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  accuracyContainer: {
    height: 20,
  },
  accuracyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  notStartedText: {
    fontSize: 16,
    color: Colors.textTertiary,
  },
});