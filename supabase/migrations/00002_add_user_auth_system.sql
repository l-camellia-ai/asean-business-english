-- 创建用户角色枚举
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- 为user_profiles表添加role列
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'user'::public.user_role;

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
