-- 用户表（扩展Supabase Auth）
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

-- 企业表
CREATE TABLE IF NOT EXISTS enterprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学习进度表
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  country TEXT NOT NULL, -- 东盟国家
  scenario_type TEXT NOT NULL, -- 情景类型
  completion_rate INTEGER DEFAULT 0,
  score INTEGER,
  last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 能力维度表
CREATE TABLE IF NOT EXISTS ability_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  language_accuracy INTEGER DEFAULT 0, -- 语言准确性
  cultural_adaptation INTEGER DEFAULT 0, -- 文化适配性
  business_strategy INTEGER DEFAULT 0, -- 商务策略
  negotiation_skills INTEGER DEFAULT 0, -- 谈判技巧
  communication_efficiency INTEGER DEFAULT 0, -- 沟通效率
  cross_cultural_awareness INTEGER DEFAULT 0, -- 跨文化意识
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 成就徽章表
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT, -- 'country', 'skill', 'milestone'
  country TEXT, -- 关联的东盟国家
  points INTEGER DEFAULT 0
);

-- 用户成就表
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 每日挑战表
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
  subcategory TEXT, -- 具体国家或行业
  score INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 课程内容表
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'scenario', 'knowledge', 'listening'
  country TEXT, -- 关联的东盟国家
  industry TEXT, -- 行业
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

-- 订阅套餐表
CREATE TABLE IF NOT EXISTS subscription_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  duration_days INTEGER,
  features JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户订阅表
CREATE TABLE IF NOT EXISTS user_subscriptions (
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