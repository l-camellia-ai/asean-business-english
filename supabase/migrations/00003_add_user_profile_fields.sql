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
COMMENT ON COLUMN user_profiles.identity IS '用户身份：employee(企业员工)/student(学生)/entrepreneur(创业者)/other(其他)';
COMMENT ON COLUMN user_profiles.english_level IS '英语水平：beginner(初级)/intermediate(中级)/advanced(高级)';
COMMENT ON COLUMN user_profiles.learning_goals IS '学习目标数组：["negotiation", "email", "culture", "other"]';
COMMENT ON COLUMN user_profiles.onboarding_completed IS '是否完成新用户引导';
COMMENT ON COLUMN user_profiles.phone_number IS '手机号码';
COMMENT ON COLUMN user_profiles.phone_country_code IS '国家代码，如+86、+66';
COMMENT ON COLUMN user_profiles.is_guest IS '是否为游客模式';
COMMENT ON COLUMN user_profiles.guest_trial_count IS '游客已体验次数';
COMMENT ON COLUMN user_profiles.guest_trial_limit IS '游客体验次数限制';