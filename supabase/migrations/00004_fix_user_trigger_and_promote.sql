-- ============================================================
-- 修复用户注册触发器：新增 INSERT 触发器，确保用户注册时立即创建 profile
-- 并创建自动提权函数，允许第一个用户成为管理员
-- ============================================================

-- 1. 修改 handle_new_user 函数，同时兼容 INSERT 和 UPDATE
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

-- 2. 创建 INSERT 触发器（修复核心问题：关闭邮箱验证时也会触发）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 3. 保留原有的 UPDATE 触发器（兼容邮箱验证开启的场景）
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- 4. 创建 RPC 函数：如果是系统中唯一用户则自动提权为管理员
CREATE OR REPLACE FUNCTION become_admin_if_single_user(in_user_id uuid)
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

  -- 如果用户不存在，先创建 profile
  IF current_role IS NULL THEN
    INSERT INTO user_profiles (id, role, created_at)
    VALUES (in_user_id, 'user', NOW());
    current_role := 'user';
  END IF;

  -- 已经是管理员则跳过
  IF current_role = 'admin' THEN
    RETURN jsonb_build_object('success', true, 'message', '已经是管理员', 'role', 'admin');
  END IF;

  -- 只有系统仅有一个用户时才能提权
  IF total_users <= 1 THEN
    UPDATE user_profiles SET role = 'admin' WHERE id = in_user_id;
    RETURN jsonb_build_object('success', true, 'message', '已提升为管理员', 'role', 'admin');
  END IF;

  RETURN jsonb_build_object('success', false, 'message', '系统中已有多个用户，无法自动提权。请联系现有管理员。', 'role', current_role);
END;
$$;

-- 5. 新增 RPC 函数：创建或修复用户 profile（用于 AuthContext 兜底）
CREATE OR REPLACE FUNCTION ensure_user_profile(in_user_id uuid, in_username text DEFAULT NULL)
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
    RETURN jsonb_build_object('success', true, 'message', 'profile 已存在', 'created', false);
  END IF;

  SELECT COUNT(*) INTO user_count FROM user_profiles;
  assigned_role := CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END;

  INSERT INTO public.user_profiles (id, username, role, created_at)
  VALUES (in_user_id, COALESCE(in_username, SPLIT_PART((SELECT email FROM auth.users WHERE id = in_user_id), '@', 1)), assigned_role, NOW());

  RETURN jsonb_build_object('success', true, 'message', 'profile 已创建', 'created', true, 'role', assigned_role);
END;
$$;
