-- JOLTCLICK Database Schema
-- Run this SQL in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_activity table for tracking user engagement
CREATE TABLE public.user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL,
    activity_data JSONB,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Activity RLS Policies
CREATE POLICY "Users can view their own activity" ON public.user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" ON public.user_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, first_name, last_name, display_name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        COALESCE(
            NULLIF(TRIM(CONCAT(NEW.raw_user_meta_data->>'first_name', ' ', NEW.raw_user_meta_data->>'last_name')), ''),
            NEW.email
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on profiles
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX user_activity_user_id_idx ON public.user_activity(user_id);
CREATE INDEX user_activity_created_at_idx ON public.user_activity(created_at DESC);
CREATE INDEX user_activity_type_idx ON public.user_activity(activity_type);

-- Create a function to get user stats
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_points', COALESCE(SUM(points_earned), 0),
        'days_active', COUNT(DISTINCT DATE(created_at)),
        'total_activities', COUNT(*),
        'last_activity', MAX(created_at)
    ) INTO stats
    FROM public.user_activity
    WHERE user_id = user_uuid;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Optional: Create some sample activity types
INSERT INTO public.user_activity (user_id, activity_type, activity_data, points_earned)
VALUES 
    ('00000000-0000-0000-0000-000000000000', 'app_opened', '{"source": "direct"}', 1),
    ('00000000-0000-0000-0000-000000000000', 'profile_completed', '{"fields": ["first_name", "last_name", "bio"]}', 10),
    ('00000000-0000-0000-0000-000000000000', 'feature_used', '{"feature": "dashboard"}', 5)
ON CONFLICT DO NOTHING;

-- DuoLearn Database Schema
-- Minimalist but powerful schema for language learning

-- User statistics table
CREATE TABLE user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_practice_date DATE,
  daily_goal_minutes INTEGER DEFAULT 10,
  total_days_practiced INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Questions table - minimal structure
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('speaking', 'vocabulary', 'listening', 'grammar')),
  question TEXT NOT NULL,
  options JSONB, -- For multiple choice questions
  correct_answer TEXT NOT NULL,
  audio_url TEXT, -- For listening exercises
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User responses for spaced repetition algorithm
CREATE TABLE user_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  response_time_ms INTEGER,
  practice_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Daily progress tracking
CREATE TABLE daily_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_date DATE NOT NULL,
  speaking_accuracy REAL DEFAULT 0,
  vocabulary_accuracy REAL DEFAULT 0,
  listening_accuracy REAL DEFAULT 0,
  grammar_accuracy REAL DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  is_perfect_day BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, practice_date)
);

-- RLS (Row Level Security) policies
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own stats" ON user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own responses" ON user_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own responses" ON user_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON daily_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON daily_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON daily_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Questions are publicly readable
CREATE POLICY "Questions are publicly readable" ON questions FOR SELECT USING (true);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE TRIGGER set_timestamp_user_stats BEFORE UPDATE ON user_stats FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- Sample questions for testing
INSERT INTO questions (type, question, options, correct_answer, difficulty_level) VALUES
('vocabulary', 'The weather is very _____ today.', '["cold", "happy", "fast", "green"]', 'cold', 1),
('vocabulary', 'I like to _____ books in my free time.', '["eat", "read", "swim", "fly"]', 'read', 1),
('vocabulary', 'She _____ to school every morning.', '["walks", "sleeps", "cooks", "dances"]', 'walks', 1),
('vocabulary', 'The cat is _____ on the sofa.', '["flying", "swimming", "sitting", "running"]', 'sitting', 1),
('vocabulary', 'I need to _____ my homework.', '["cook", "finish", "sing", "dance"]', 'finish', 1),
('vocabulary', 'The _____ is shining brightly today.', '["moon", "sun", "star", "cloud"]', 'sun', 1),
('vocabulary', 'Can you _____ me the time?', '["tell", "eat", "sleep", "run"]', 'tell', 1),
('vocabulary', 'I _____ my keys yesterday.', '["found", "cooked", "sang", "flew"]', 'found', 1),
('vocabulary', 'The children are _____ in the park.', '["sleeping", "cooking", "playing", "studying"]', 'playing', 1),
('vocabulary', 'She _____ a beautiful song.', '["cooked", "sang", "ran", "slept"]', 'sang', 1);