-- 用户表（扩展Supabase Auth�?CREATE TABLE IF NOT EXISTS user_profiles (
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

-- 企业�?CREATE TABLE IF NOT EXISTS enterprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学习进度�?CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  country TEXT NOT NULL, -- 东盟国家
  scenario_type TEXT NOT NULL, -- 情景类型
  completion_rate INTEGER DEFAULT 0,
  score INTEGER,
  last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 能力维度�?CREATE TABLE IF NOT EXISTS ability_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  language_accuracy INTEGER DEFAULT 0, -- 语言准确�?  cultural_adaptation INTEGER DEFAULT 0, -- 文化适配�?  business_strategy INTEGER DEFAULT 0, -- 商务策略
  negotiation_skills INTEGER DEFAULT 0, -- 谈判技�?  communication_efficiency INTEGER DEFAULT 0, -- 沟通效�?  cross_cultural_awareness INTEGER DEFAULT 0, -- 跨文化意�?  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 成就徽章�?CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT, -- 'country', 'skill', 'milestone'
  country TEXT, -- 关联的东盟国�?  points INTEGER DEFAULT 0
);

-- 用户成就�?CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 每日挑战�?CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL,
  country TEXT,
  points INTEGER DEFAULT 100,
  active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户挑战完成记录
CREATE TABLE IF NOT EXISTS user_challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- 排行榜表
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'overall', 'country', 'industry'
  subcategory TEXT, -- 具体国家或行�?  score INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 课程内容�?CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'scenario', 'knowledge', 'listening'
  country TEXT, -- 关联的东盟国�?  industry TEXT, -- 行业
  difficulty TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  duration INTEGER, -- 分钟
  thumbnail_url TEXT,
  content_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户课程进度
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  progress INTEGER DEFAULT 0, -- 0-100
  completed BOOLEAN DEFAULT FALSE,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 数字人角色表
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

-- 用户与数字人对话记录
CREATE TABLE IF NOT EXISTS digital_human_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  digital_human_id UUID REFERENCES digital_humans(id),
  conversation_data JSONB, -- 对话内容
  cultural_score INTEGER,
  language_score INTEGER,
  strategy_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订阅套餐�?CREATE TABLE IF NOT EXISTS subscription_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  duration_days INTEGER,
  features JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户订阅�?CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES subscription_packages(id),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'cancelled'
  remaining_credits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_category ON leaderboard(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category, country);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user ON user_course_progress(user_id);

-- 启用RLS
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

-- RLS策略：用户只能访问自己的数据
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

-- 公开读取策略
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can view daily challenges" ON daily_challenges FOR SELECT USING (true);
CREATE POLICY "Anyone can view leaderboard" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Anyone can view digital humans" ON digital_humans FOR SELECT USING (true);
CREATE POLICY "Anyone can view subscription packages" ON subscription_packages FOR SELECT USING (true);
CREATE POLICY "Anyone can view enterprises" ON enterprises FOR SELECT USING (true);
-- 创建用户角色枚举
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- 为user_profiles表添加role�?ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'user'::public.user_role;

-- 创建处理新用户的函数
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM user_profiles;
  
  -- 插入用户配置文件
  INSERT INTO public.user_profiles (id, username, role, created_at)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1), -- 从email中提取用户名
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END,
    NOW()
  );
  
  RETURN NEW;
END;
$$;

-- 创建触发器（仅在confirmed_at从NULL变为NOT NULL时触发）
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- 创建is_admin辅助函数
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- 删除旧的RLS策略
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON user_profiles;

-- 创建新的RLS策略
CREATE POLICY "Admins have full access to profiles" ON user_profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM user_profiles WHERE id = auth.uid()));

-- 创建公开视图
CREATE OR REPLACE VIEW public_profiles AS
  SELECT id, username, role, created_at FROM user_profiles;
-- 添加用户画像相关字段
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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_guest ON user_profiles(is_guest);
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON user_profiles(onboarding_completed);

-- 添加注释
COMMENT ON COLUMN user_profiles.identity IS '用户身份：employee(企业员工)/student(学生)/entrepreneur(创业�?/other(其他)';
COMMENT ON COLUMN user_profiles.english_level IS '英语水平：beginner(初级)/intermediate(中级)/advanced(高级)';
COMMENT ON COLUMN user_profiles.learning_goals IS '学习目标数组：["negotiation", "email", "culture", "other"]';
COMMENT ON COLUMN user_profiles.onboarding_completed IS '是否完成新用户引�?;
COMMENT ON COLUMN user_profiles.phone_number IS '手机号码';
COMMENT ON COLUMN user_profiles.phone_country_code IS '国家代码，如+86�?66';
COMMENT ON COLUMN user_profiles.is_guest IS '是否为游客模�?;
COMMENT ON COLUMN user_profiles.guest_trial_count IS '游客已体验次�?;
COMMENT ON COLUMN user_profiles.guest_trial_limit IS '游客体验次数限制';
-- ============================================================
-- 修复用户注册触发器：新增 INSERT 触发器，确保用户注册时立即创�?profile
-- 并创建自动提权函数，允许第一个用户成为管理员
-- ============================================================

-- 1. 修改 handle_new_user 函数，同时兼�?INSERT �?UPDATE
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  -- 如果 profile 已存在则跳过
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

-- 2. 创建 INSERT 触发器（修复核心问题：关闭邮箱验证时也会触发�?DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 3. 保留原有�?UPDATE 触发器（兼容邮箱验证开启的场景�?DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- 4. 创建 RPC 函数：如果是系统中唯一用户则自动提权为管理�?CREATE OR REPLACE FUNCTION become_admin_if_single_user(in_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  total_users int;
  current_role public.user_role;
BEGIN
  SELECT COUNT(*) INTO total_users FROM user_profiles;
  SELECT role INTO current_role FROM user_profiles WHERE id = in_user_id;

  -- 如果用户不存在，先创�?profile
  IF current_role IS NULL THEN
    INSERT INTO user_profiles (id, role, created_at)
    VALUES (in_user_id, 'user', NOW());
    current_role := 'user';
  END IF;

  -- 已经是管理员则跳�?  IF current_role = 'admin' THEN
    RETURN jsonb_build_object('success', true, 'message', '已经是管理员', 'role', 'admin');
  END IF;

  -- 只有系统仅有一个用户时才能提权
  IF total_users <= 1 THEN
    UPDATE user_profiles SET role = 'admin' WHERE id = in_user_id;
    RETURN jsonb_build_object('success', true, 'message', '已提升为管理�?, 'role', 'admin');
  END IF;

  RETURN jsonb_build_object('success', false, 'message', '系统中已有多个用户，无法自动提权。请联系现有管理员�?, 'role', current_role);
END;
$$;

-- 5. 新增 RPC 函数：创建或修复用户 profile（用�?AuthContext 兜底�?CREATE OR REPLACE FUNCTION ensure_user_profile(in_user_id uuid, in_username text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  assigned_role public.user_role;
BEGIN
  -- 如果 profile 已存在则返回
  IF EXISTS (SELECT 1 FROM user_profiles WHERE id = in_user_id) THEN
    RETURN jsonb_build_object('success', true, 'message', 'profile 已存�?, 'created', false);
  END IF;

  SELECT COUNT(*) INTO user_count FROM user_profiles;
  assigned_role := CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END;

  INSERT INTO public.user_profiles (id, username, role, created_at)
  VALUES (in_user_id, COALESCE(in_username, SPLIT_PART((SELECT email FROM auth.users WHERE id = in_user_id), '@', 1)), assigned_role, NOW());

  RETURN jsonb_build_object('success', true, 'message', 'profile 已创�?, 'created', true, 'role', assigned_role);
END;
$$;
