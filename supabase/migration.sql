CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  user_type TEXT DEFAULT 'individual' CHECK (user_type IN ('individual', 'enterprise_admin', 'enterprise_member')),
  enterprise_id UUID,
  experience_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  scenario_type TEXT NOT NULL,
  completion_rate INTEGER DEFAULT 0,
  score INTEGER,
  last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ability_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  language_accuracy INTEGER DEFAULT 0,
  cultural_adaptation INTEGER DEFAULT 0,
  business_strategy INTEGER DEFAULT 0,
  negotiation_skills INTEGER DEFAULT 0,
  communication_efficiency INTEGER DEFAULT 0,
  cross_cultural_awareness INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  country TEXT,
  points INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL,
  country TEXT,
  points INTEGER DEFAULT 100,
  active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  subcategory TEXT,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  country TEXT,
  industry TEXT,
  difficulty TEXT DEFAULT 'beginner',
  duration INTEGER,
  thumbnail_url TEXT,
  content_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS digital_humans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  industry TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  description TEXT,
  typical_needs TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS digital_human_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  digital_human_id UUID REFERENCES digital_humans(id),
  conversation_data JSONB,
  cultural_score INTEGER,
  language_score INTEGER,
  strategy_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscription_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  duration_days INTEGER,
  features JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES subscription_packages(id),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  remaining_credits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_category ON leaderboard(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category, country);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user ON user_course_progress(user_id);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ability_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_human_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own progress" ON learning_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON learning_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON learning_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own abilities" ON ability_dimensions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own abilities" ON ability_dimensions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own challenge completions" ON user_challenge_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own challenge completions" ON user_challenge_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own course progress" ON user_course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own course progress" ON user_course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own course progress" ON user_course_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own conversations" ON digital_human_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON digital_human_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can view daily challenges" ON daily_challenges FOR SELECT USING (true);
CREATE POLICY "Anyone can view leaderboard" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Anyone can view digital humans" ON digital_humans FOR SELECT USING (true);
CREATE POLICY "Anyone can view subscription packages" ON subscription_packages FOR SELECT USING (true);
CREATE POLICY "Anyone can view enterprises" ON enterprises FOR SELECT USING (true);

CREATE TYPE public.user_role AS ENUM ('user', 'admin');
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'user'::public.user_role;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  IF EXISTS (SELECT 1 FROM user_profiles WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO user_count FROM user_profiles;

  INSERT INTO public.user_profiles (id, username, role, created_at)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END,
    NOW()
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON user_profiles;

CREATE POLICY "Admins have full access to profiles" ON user_profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM user_profiles WHERE id = auth.uid()));

CREATE OR REPLACE VIEW public_profiles AS
  SELECT id, username, role, created_at FROM user_profiles;

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS identity TEXT CHECK (identity IN ('employee', 'student', 'entrepreneur', 'other')),
ADD COLUMN IF NOT EXISTS english_level TEXT CHECK (english_level IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS learning_goals JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS phone_country_code TEXT DEFAULT '+86',
ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS guest_trial_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS guest_trial_limit INTEGER DEFAULT 2;

CREATE INDEX IF NOT EXISTS idx_user_profiles_is_guest ON user_profiles(is_guest);
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON user_profiles(onboarding_completed);

CREATE OR REPLACE FUNCTION become_admin_if_single_user(in_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  total_users int;
  user_role_val public.user_role;
BEGIN
  SELECT COUNT(*) INTO total_users FROM user_profiles;
  SELECT role INTO user_role_val FROM user_profiles WHERE id = in_user_id;

  IF user_role_val IS NULL THEN
    INSERT INTO user_profiles (id, role, created_at)
    VALUES (in_user_id, 'user', NOW());
    user_role_val := 'user';
  END IF;

  IF user_role_val = 'admin' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Already admin', 'role', 'admin');
  END IF;

  IF total_users <= 1 THEN
    UPDATE user_profiles SET role = 'admin' WHERE id = in_user_id;
    RETURN jsonb_build_object('success', true, 'message', 'Promoted to admin', 'role', 'admin');
  END IF;

  RETURN jsonb_build_object('success', false, 'message', 'Multiple users exist, cannot auto-promote', 'role', user_role_val);
END;
$$;

CREATE OR REPLACE FUNCTION ensure_user_profile(in_user_id uuid, in_username text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  assigned_role public.user_role;
BEGIN
  IF EXISTS (SELECT 1 FROM user_profiles WHERE id = in_user_id) THEN
    RETURN jsonb_build_object('success', true, 'message', 'Profile exists', 'created', false);
  END IF;

  SELECT COUNT(*) INTO user_count FROM user_profiles;
  assigned_role := CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END;

  INSERT INTO public.user_profiles (id, username, role, created_at)
  VALUES (in_user_id, COALESCE(in_username, SPLIT_PART((SELECT email FROM auth.users WHERE id = in_user_id), '@', 1)), assigned_role, NOW());

  RETURN jsonb_build_object('success', true, 'message', 'Profile created', 'created', true, 'role', assigned_role);
END;
$$;
