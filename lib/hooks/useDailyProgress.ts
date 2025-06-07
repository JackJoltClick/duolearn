import { useEffect } from 'react';
import { useDuoLearnStore } from '@/lib/stores/duolearn';
import { useAuthStore } from '@/lib/stores/auth';

export function useDailyProgress() {
  const { user } = useAuthStore();
  const { todayProgress, userStats, addWeeklyProgress } = useDuoLearnStore();
  
  // Sync progress with database when user completes practice
  useEffect(() => {
    if (!user || todayProgress.totalMinutes === 0) return;
    
    const syncProgress = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Add to weekly progress for the graph
      addWeeklyProgress(today, todayProgress.totalMinutes, todayProgress.isPerfectDay);
      
      // Here you would sync with Supabase database
      // For now, we'll just use local storage via Zustand persistence
      console.log('Syncing progress:', {
        date: today,
        progress: todayProgress,
        streak: userStats.currentStreak,
      });
    };
    
    syncProgress();
  }, [todayProgress.totalMinutes, todayProgress.isPerfectDay, user]);
  
  return {
    todayProgress,
    userStats,
  };
} 