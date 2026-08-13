-- ============================================================
-- EnglishAI Pro - Complete Database Schema for Supabase
-- ============================================================
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor
-- Paste this entire script and click "Run"
-- ============================================================

-- 1. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_initials TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
  level TEXT DEFAULT 'A1',
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 1000,
  coins INTEGER DEFAULT 0,
  diamonds INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  words_learned INTEGER DEFAULT 0,
  minutes_studied_today INTEGER DEFAULT 0,
  pronunciation_score INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  certificates INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  requested_role TEXT;
  allowed_emails TEXT[] := ARRAY['degraciawilliams10@gmail.com', 'yoditamvale@gmail.com'];
BEGIN
  requested_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  IF requested_role = 'teacher' AND NOT (LOWER(COALESCE(NEW.email, '')) = ANY(allowed_emails)) THEN
    requested_role := 'student';
  END IF;
  INSERT INTO public.profiles (id, full_name, email, avatar_initials, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    UPPER(SUBSTRING(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, ''), 1, 2)),
    requested_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. DAILY ACTIVITY (XP and minutes per day)
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  xp INTEGER DEFAULT 0,
  minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- 3. SKILL XP (XP per skill category)
-- ============================================================
CREATE TABLE IF NOT EXISTS skill_xp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL CHECK (skill IN ('listening','speaking','reading','writing','grammar','vocabulary')),
  xp INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill)
);

-- 4. COURSE PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  completed_lessons INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 5. VOCABULARY PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS vocabulary_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  word TEXT NOT NULL,
  mastery INTEGER DEFAULT 0 CHECK (mastery >= 0 AND mastery <= 100),
  times_practiced INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

-- 6. GRAMMAR PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS grammar_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  topic_title TEXT,
  score INTEGER DEFAULT 0,
  questions_attempted INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- 7. LISTENING PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS listening_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, audio_id)
);

-- 8. SPEAKING SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS speaking_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT CHECK (mode IN ('sentence', 'conversation')),
  level TEXT,
  target_sentence TEXT,
  transcript TEXT,
  overall_score INTEGER,
  pronunciation_score INTEGER,
  fluency_score INTEGER,
  intonation_score INTEGER,
  grammar_score INTEGER,
  vocabulary_score INTEGER,
  naturalness_score INTEGER,
  feedback TEXT,
  strengths JSONB DEFAULT '[]',
  improvements JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. READING PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  comprehension_score INTEGER,
  vocabulary_reviewed JSONB DEFAULT '[]',
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- 10. WRITING ESSAYS
-- ============================================================
CREATE TABLE IF NOT EXISTS writing_essays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  essay_id TEXT NOT NULL,
  prompt_id TEXT,
  prompt_text TEXT,
  level TEXT,
  genre TEXT,
  text TEXT NOT NULL,
  overall_score INTEGER,
  grammar_score INTEGER,
  vocabulary_score INTEGER,
  coherence_score INTEGER,
  task_response_score INTEGER,
  corrections JSONB DEFAULT '[]',
  feedback TEXT,
  improved_version TEXT,
  vocabulary_suggestions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AI TUTOR CHATS
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_tutor_chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. FLASHCARD DECKS
-- ============================================================
CREATE TABLE IF NOT EXISTS flashcard_decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_id TEXT NOT NULL,
  deck_name TEXT,
  cards_studied INTEGER DEFAULT 0,
  cards_mastered INTEGER DEFAULT 0,
  total_cards INTEGER DEFAULT 0,
  last_studied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, deck_id)
);

-- 13. GAME SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  level TEXT,
  score INTEGER DEFAULT 0,
  rounds_played INTEGER DEFAULT 0,
  rounds_correct INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ACHIEVEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  progress INTEGER DEFAULT 0,
  target INTEGER DEFAULT 1,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 15. CERTIFICATES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certificate_id TEXT NOT NULL,
  title TEXT,
  level TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, certificate_id)
);

-- 16. USER SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system',
  native_language TEXT DEFAULT 'es',
  target_level TEXT DEFAULT 'B1',
  daily_goal_minutes INTEGER DEFAULT 30,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  sound_effects_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 17. CLASSES (teacher-created classrooms)
-- ============================================================
CREATE TABLE IF NOT EXISTS classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  class_code TEXT NOT NULL UNIQUE,
  description TEXT,
  level TEXT DEFAULT 'B1',
  activities JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. ENROLLMENTS (students joining classes)
-- ============================================================
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_vocabulary_progress_user ON vocabulary_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_speaking_sessions_user ON speaking_sessions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_writing_essays_user ON writing_essays(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user ON game_sessions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_tutor_chats_user ON ai_tutor_chats(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_code ON classes(class_code);
CREATE INDEX IF NOT EXISTS idx_enrollments_class ON enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - Users can only see their own data
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tutor_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies: each user can only CRUD their own rows
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own daily_activity" ON daily_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily_activity" ON daily_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily_activity" ON daily_activity FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own skill_xp" ON skill_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own skill_xp" ON skill_xp FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own skill_xp" ON skill_xp FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own course_progress" ON course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own course_progress" ON course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own course_progress" ON course_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own vocabulary_progress" ON vocabulary_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vocabulary_progress" ON vocabulary_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vocabulary_progress" ON vocabulary_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own grammar_progress" ON grammar_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own grammar_progress" ON grammar_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own grammar_progress" ON grammar_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own listening_progress" ON listening_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own listening_progress" ON listening_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own listening_progress" ON listening_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own speaking_sessions" ON speaking_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own speaking_sessions" ON speaking_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own reading_progress" ON reading_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reading_progress" ON reading_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reading_progress" ON reading_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own writing_essays" ON writing_essays FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own writing_essays" ON writing_essays FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own ai_tutor_chats" ON ai_tutor_chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai_tutor_chats" ON ai_tutor_chats FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own flashcard_decks" ON flashcard_decks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own flashcard_decks" ON flashcard_decks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcard_decks" ON flashcard_decks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own game_sessions" ON game_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own game_sessions" ON game_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own user_achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_achievements" ON user_achievements FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own user_certificates" ON user_certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_certificates" ON user_certificates FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own user_settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Classes: teachers can manage their own classes, students can view classes they're enrolled in
CREATE POLICY "Teachers can view own classes" ON classes FOR SELECT USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can insert own classes" ON classes FOR INSERT WITH CHECK (auth.uid() = teacher_id);
CREATE POLICY "Teachers can update own classes" ON classes FOR UPDATE USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can delete own classes" ON classes FOR DELETE USING (auth.uid() = teacher_id);
CREATE POLICY "Students can view enrolled classes" ON classes FOR SELECT USING (
  EXISTS (SELECT 1 FROM enrollments WHERE enrollments.class_id = classes.id AND enrollments.student_id = auth.uid())
);
CREATE POLICY "Anyone can lookup class by code" ON classes FOR SELECT USING (true);

-- Enrollments: teachers can view enrollments in their classes, students can view their own enrollments
CREATE POLICY "Teachers can view enrollments in own classes" ON enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM classes WHERE classes.id = enrollments.class_id AND classes.teacher_id = auth.uid())
);
CREATE POLICY "Students can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert own enrollments" ON enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Teachers can delete enrollments from own classes" ON enrollments FOR DELETE USING (
  EXISTS (SELECT 1 FROM classes WHERE classes.id = enrollments.class_id AND classes.teacher_id = auth.uid())
);

-- ============================================================
-- HELPER: upsert daily activity (avoids duplicates)
-- ============================================================
CREATE OR REPLACE FUNCTION upsert_daily_activity(
  p_user_id UUID,
  p_xp INTEGER,
  p_minutes INTEGER
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO daily_activity (user_id, activity_date, xp, minutes)
  VALUES (p_user_id, CURRENT_DATE, p_xp, p_minutes)
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET
    xp = daily_activity.xp + EXCLUDED.xp,
    minutes = daily_activity.minutes + EXCLUDED.minutes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Done! 16 tables + RLS + auto-profile trigger + upsert helper
-- ============================================================
