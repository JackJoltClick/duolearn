import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useDuoLearnStore } from '@/lib/stores/duolearn';
import Colors from '@/constants/Colors';

interface Question {
  id: string;
  type: 'speaking' | 'vocabulary' | 'listening' | 'grammar';
  question: string;
  options?: string[];
  correctAnswer: string;
  audioUrl?: string;
}

// Sample questions for demo
const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    type: 'vocabulary',
    question: 'The weather is very _____ today.',
    options: ['cold', 'happy', 'fast', 'green'],
    correctAnswer: 'cold',
  },
  {
    id: '2',
    type: 'vocabulary',
    question: 'I like to _____ books in my free time.',
    options: ['eat', 'read', 'swim', 'fly'],
    correctAnswer: 'read',
  },
  {
    id: '3',
    type: 'vocabulary',
    question: 'She _____ to school every morning.',
    options: ['walks', 'sleeps', 'cooks', 'dances'],
    correctAnswer: 'walks',
  },
];

export default function PracticeSession() {
  const { activeSession, endSession } = useDuoLearnStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [feedbackAnimation] = useState(new Animated.Value(0));

  const currentQuestion = SAMPLE_QUESTIONS[currentQuestionIndex];
  const totalQuestions = SAMPLE_QUESTIONS.length;

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Show feedback animation
    Animated.sequence([
      Animated.timing(feedbackAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(feedbackAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Auto-advance after 1 second
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        // Next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        // Session complete
        const finalScore = Math.round((score + (isCorrect ? 1 : 0)) / totalQuestions * 100);
        endSession(finalScore);
        router.back();
      }
    }, 1000);
  };

  const isCorrectAnswer = selectedAnswer === currentQuestion.correctAnswer;

  if (!activeSession) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No active session</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Feedback Overlay */}
      <Animated.View 
        style={[
          styles.feedbackOverlay,
          {
            opacity: feedbackAnimation,
            backgroundColor: isAnswered ? 
              (isCorrectAnswer ? Colors.success : Colors.error) + '20' : 'transparent'
          }
        ]}
        pointerEvents="none"
      />
      
      <View style={styles.content}>
        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* Options */}
        {currentQuestion.type === 'vocabulary' && currentQuestion.options && (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = isAnswered && selectedAnswer === option;
              const isCorrectOption = option === currentQuestion.correctAnswer;
              const showAsCorrect = isAnswered && isCorrectOption;
              const showAsIncorrect = isSelected && !isCorrectOption;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    showAsCorrect && styles.optionCorrect,
                    showAsIncorrect && styles.optionIncorrect,
                  ]}
                  onPress={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.optionText,
                    showAsCorrect && styles.optionTextCorrect,
                    showAsIncorrect && styles.optionTextIncorrect,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  feedbackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  questionContainer: {
    marginBottom: 60,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  option: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionCorrect: {
    borderColor: Colors.success,
    backgroundColor: `${Colors.success}10`,
  },
  optionIncorrect: {
    borderColor: Colors.error,
    backgroundColor: `${Colors.error}10`,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  optionTextCorrect: {
    color: Colors.success,
  },
  optionTextIncorrect: {
    color: Colors.error,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  backButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
}); 