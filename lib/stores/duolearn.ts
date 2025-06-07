import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserStats {
  currentStreak: number;
  bestStreak: number;
  lastPracticeDate: string | null;
  dailyGoalMinutes: number;
  totalDaysPracticed: number;
}

export interface TodayProgress {
  speaking: number; // 0-100%
  vocabulary: number;
  listening: number;
  grammar: number;
  totalMinutes: number;
  isComplete: boolean;
  isPerfectDay: boolean; // all 4 categories completed
}

export interface ActiveSession {
  type: 'speaking' | 'vocabulary' | 'listening' | 'grammar' | null;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  startTime: number;
}

interface DuoLearnState {
  // User stats
  userStats: UserStats;
  todayProgress: TodayProgress;
  activeSession: ActiveSession | null;
  
  // Weekly progress for graph
  weeklyProgress: Array<{
    date: string;
    minutes: number;
    isPerfect: boolean;
  }>;

  // Actions
  updateStreak: () => void;
  updateProgress: (type: keyof Omit<TodayProgress, 'totalMinutes' | 'isComplete' | 'isPerfectDay'>, accuracy: number) => void;
  startSession: (type: 'speaking' | 'vocabulary' | 'listening' | 'grammar') => void;
  endSession: (finalScore: number) => void;
  setDailyGoal: (minutes: number) => void;
  addWeeklyProgress: (date: string, minutes: number, isPerfect: boolean) => void;
}

export const useDuoLearnStore = create<DuoLearnState>()(
  persist(
    (set, get) => ({
      userStats: {
        currentStreak: 0,
        bestStreak: 0,
        lastPracticeDate: null,
        dailyGoalMinutes: 10,
        totalDaysPracticed: 0,
      },
      
      todayProgress: {
        speaking: 0,
        vocabulary: 0,
        listening: 0,
        grammar: 0,
        totalMinutes: 0,
        isComplete: false,
        isPerfectDay: false,
      },
      
      activeSession: null,
      
      weeklyProgress: [],

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        const lastPractice = state.userStats.lastPracticeDate;
        
        let currentStreak = state.userStats.currentStreak;
        
        if (!lastPractice) {
          // First time practicing
          currentStreak = 1;
        } else {
          const lastDate = new Date(lastPractice);
          const todayDate = new Date(today);
          const diffTime = todayDate.getTime() - lastDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            // Consecutive day
            currentStreak += 1;
          } else if (diffDays > 1) {
            // Broke the streak
            currentStreak = 1;
          }
          // If diffDays === 0, it's the same day, keep streak
        }

        set((state) => ({
          userStats: {
            ...state.userStats,
            currentStreak,
            bestStreak: Math.max(currentStreak, state.userStats.bestStreak),
            lastPracticeDate: today,
            totalDaysPracticed: lastPractice !== today ? 
              state.userStats.totalDaysPracticed + 1 : 
              state.userStats.totalDaysPracticed,
          }
        }));
      },

      updateProgress: (type, accuracy) => {
        set((state) => {
          const newProgress = {
            ...state.todayProgress,
            [type]: accuracy,
            totalMinutes: state.todayProgress.totalMinutes + 2, // Each session is 2 minutes
          };
          
          // Check if day is complete (reached daily goal)
          newProgress.isComplete = newProgress.totalMinutes >= state.userStats.dailyGoalMinutes;
          
          // Check if it's a perfect day (all 4 categories > 0)
          newProgress.isPerfectDay = 
            newProgress.speaking > 0 && 
            newProgress.vocabulary > 0 && 
            newProgress.listening > 0 && 
            newProgress.grammar > 0;

          return {
            todayProgress: newProgress
          };
        });
        
        // Update streak if daily goal is reached
        if (get().todayProgress.isComplete) {
          get().updateStreak();
        }
      },

      startSession: (type) => {
        set({
          activeSession: {
            type,
            questionIndex: 0,
            totalQuestions: 10, // Fixed session length
            score: 0,
            startTime: Date.now(),
          }
        });
      },

      endSession: (finalScore) => {
        const session = get().activeSession;
        if (!session) return;
        
        // Update progress with final accuracy
        get().updateProgress(session.type!, finalScore);
        
        set({ activeSession: null });
      },

      setDailyGoal: (minutes) => {
        set((state) => ({
          userStats: {
            ...state.userStats,
            dailyGoalMinutes: minutes,
          }
        }));
      },

      addWeeklyProgress: (date, minutes, isPerfect) => {
        set((state) => {
          const existing = state.weeklyProgress.findIndex(p => p.date === date);
          let newWeeklyProgress = [...state.weeklyProgress];
          
          if (existing >= 0) {
            newWeeklyProgress[existing] = { date, minutes, isPerfect };
          } else {
            newWeeklyProgress.push({ date, minutes, isPerfect });
          }
          
          // Keep only last 7 days
          newWeeklyProgress = newWeeklyProgress
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-7);
          
          return { weeklyProgress: newWeeklyProgress };
        });
      },
    }),
    {
      name: 'duolearn-storage',
    }
  )
); 