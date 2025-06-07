# DuoLearn

A minimalist but addictive English learning app inspired by the simplicity of Wordle and the effectiveness of Duolingo.

## Design Philosophy

Ultra-clean, focused, and addictive through simplicity. Every interaction is pristine and satisfying. The addiction comes from streaks, perfect days, and the satisfaction of a clean, fast interface - not from points or rewards.

## Key Features

### 🎯 Core Experience
- **Today's Focus**: Large circular progress ring showing daily goal completion
- **Streak Tracking**: Prominent streak counter that drives daily engagement
- **Four Practice Types**: Speaking, Vocabulary, Listening, Grammar
- **Perfect Days**: Completing all 4 practice types marks the day as perfect

### 🎨 Visual Design
- Pure white background with single accent color: #5B5FDE (electric blue)
- System font, generous whitespace, subtle shadows only
- Smooth, minimal animations (fade, scale)
- No badges, coins, or visual clutter

### 📱 Screens

#### Today (Home)
- Single large circular progress ring (0-100% daily goal)
- Current streak number in center
- One button: "Continue" or "Start"
- Nothing else on screen

#### Practice (Explore)
- Four clean cards: Speaking, Vocabulary, Listening, Grammar
- Each shows simple accuracy percentage
- Tap to start 2-minute practice session

#### Progress (Activity)
- Minimal line graph of last 7 days
- Current streak, best streak, total days practiced
- Perfect days highlighted in blue

#### Profile
- Daily goal setter (5, 10, 15, 20 mins)
- Notification time setting
- Sign out

### 🧠 Addictive Mechanics (Subtle but Powerful)

1. **Streak Anxiety**: Red dot on app icon if not practiced today
2. **Perfect Days**: Blue circles for completing all 4 practice types
3. **Cognitive Load Optimization**: Questions adapt to maintain 80% success rate
4. **Micro-Sessions**: Each practice type takes exactly 2 minutes
5. **No Escape Routes**: No skip button, must answer to continue

### 🎮 Lesson Experience

Clean question flow:
- One question per screen
- No progress bars or hearts
- Just the question and input method
- Green flash for correct, red for incorrect
- Auto-advance after 1 second

#### Question Types
1. **Speaking**: Show phrase, tap mic, real-time waveform, transcription result
2. **Fill-in-blank**: Sentence with gap, 4 word choices, tap to fill
3. **Listening**: Play button, type what you heard
4. **Vocabulary**: Multiple choice questions with immediate feedback

## Technical Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Zustand** for state management
- **Supabase** for backend and authentication
- **React Query** for data fetching
- **React Native SVG** for progress rings
- **Expo AV** for audio functionality

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase (see `supabase-setup.sql`)
4. Configure environment variables
5. Run the app: `npm start`

## Architecture

### State Management (Zustand)
- Single store: `useDuoLearnStore`
- Tracks: currentStreak, todayProgress, activeSession
- Persisted to AsyncStorage

### Database Schema (Minimal)
- `user_stats`: streak, last_practice, daily_goal_minutes
- `questions`: type, question, options, correct_answer
- `user_responses`: for spaced repetition algorithm
- `daily_progress`: simple tracking, no complex gamification

### Key Features
- Buttery smooth transitions
- Instant feedback (no loading states)
- Offline-first with background sync
- No decorative animations, only functional ones
- Haptic feedback on correct answers

## Contributing

This app prioritizes simplicity and user focus. When adding features:
1. Does it reduce cognitive load?
2. Does it increase daily engagement?
3. Does it maintain the clean aesthetic?
4. Does it feel satisfying to use?

## License

MIT License - see LICENSE file for details.