import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import PhoneInput from '@/components/PhoneInput';
import { Loader2, Globe, Mail, Phone, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/db/supabase';

type LoginMethod = 'username' | 'phone' | 'email';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('username');
  
  // 登录表单
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPhoneCode, setLoginPhoneCode] = useState('+86');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // 注册表单
  const [registerMethod, setRegisterMethod] = useState<'phone' | 'email'>('phone');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPhoneCode, setRegisterPhoneCode] = useState('+86');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithUsername, signUpWithUsername } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || '/';

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    let identifier = '';
    if (loginMethod === 'username') {
      if (!loginUsername.trim()) {
        toast.error('请输入用户名');
        return;
      }
      identifier = loginUsername;
    } else if (loginMethod === 'phone') {
      if (!loginPhone.trim()) {
        toast.error('请输入手机号');
        return;
      }
      identifier = `${loginPhoneCode}${loginPhone}`;
    } else if (loginMethod === 'email') {
      if (!loginEmail.trim()) {
        toast.error('请输入邮箱');
        return;
      }
      identifier = loginEmail;
    }

    if (!loginPassword) {
      toast.error('请输入密码');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signInWithUsername(identifier, loginPassword);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('用户名或密码错误');
        } else {
          toast.error(error.message || '登录失败，请重试');
        }
        return;
      }

      toast.success('登录成功');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('登录错误:', error);
      toast.error('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证用户名
    if (!registerUsername.trim()) {
      toast.error('请输入用户名');
      return;
    }

    if (registerUsername.length < 3) {
      toast.error('用户名至少需要3个字符');
      return;
    }

    if (registerUsername.length > 20) {
      toast.error('用户名不能超过20个字符');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(registerUsername)) {
      toast.error('用户名只能包含字母、数字和下划线');
      return;
    }

    // 验证手机号或邮箱
    if (registerMethod === 'phone') {
      if (!registerPhone.trim()) {
        toast.error('请输入手机号');
        return;
      }
      if (registerPhoneCode === '+86' && registerPhone.length !== 11) {
        toast.error('请输入正确的手机号');
        return;
      }
    } else {
      if (!registerEmail.trim()) {
        toast.error('请输入邮箱');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail)) {
        toast.error('请输入正确的邮箱地址');
        return;
      }
    }

    // 验证密码
    if (!registerPassword) {
      toast.error('请输入密码');
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('密码至少需要6个字符');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    setIsLoading(true);

    try {
      // 注册用户
      const { error: signUpError } = await signUpWithUsername(registerUsername, registerPassword);

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          toast.error('该用户名已被注册');
        } else {
          toast.error(signUpError.message || '注册失败，请重试');
        }
        return;
      }

      // 登录
      const { error: signInError } = await signInWithUsername(registerUsername, registerPassword);
      if (signInError) {
        toast.error('注册成功，但登录失败，请手动登录');
        setActiveTab('login');
        return;
      }

      // 获取当前用户
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('获取用户信息失败');
        return;
      }

      // 更新用户资料（添加手机号或邮箱）
      if (registerMethod === 'phone') {
        await supabase
          .from('user_profiles')
          // @ts-expect-error - 数据库类型定义未更新
          .update({
            phone_number: registerPhone,
            phone_country_code: registerPhoneCode,
          })
          .eq('id', user.id);
      }

      toast.success('注册成功！');
      // 跳转到引导页
      navigate('/onboarding', { replace: true });
    } catch (error) {
      console.error('注册错误:', error);
      toast.error('注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 游客模式
  const handleGuestMode = () => {
    toast.success('进入游客体验模式');
    navigate('/', { replace: true, state: { guestMode: true } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">智汇南洋</CardTitle>
          <CardDescription>商务英语沉浸式学习平台</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="register">注册</TabsTrigger>
            </TabsList>

            {/* 登录表单 */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* 登录方式选择 */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={loginMethod === 'username' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLoginMethod('username')}
                    className="flex-1"
                  >
                    <User className="mr-1 h-3 w-3" />
                    用户名
                  </Button>
                  <Button
                    type="button"
                    variant={loginMethod === 'phone' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLoginMethod('phone')}
                    className="flex-1"
                  >
                    <Phone className="mr-1 h-3 w-3" />
                    手机号
                  </Button>
                  <Button
                    type="button"
                    variant={loginMethod === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLoginMethod('email')}
                    className="flex-1"
                  >
                    <Mail className="mr-1 h-3 w-3" />
                    邮箱
                  </Button>
                </div>

                {/* 登录输入框 */}
                {loginMethod === 'username' && (
                  <div className="space-y-2">
                    <Label htmlFor="login-username">用户名</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="请输入用户名"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      disabled={isLoading}
                      autoComplete="username"
                    />
                  </div>
                )}

                {loginMethod === 'phone' && (
                  <PhoneInput
                    value={loginPhone}
                    countryCode={loginPhoneCode}
                    onValueChange={setLoginPhone}
                    onCountryCodeChange={setLoginPhoneCode}
                    disabled={isLoading}
                  />
                )}

                {loginMethod === 'email' && (
                  <div className="space-y-2">
                    <Label htmlFor="login-email">邮箱</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="请输入邮箱"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="login-password">密码</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="请输入密码"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      登录中...
                    </>
                  ) : (
                    '登录'
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* 注册表单 */}
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                {/* 注册方式选择 */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={registerMethod === 'phone' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRegisterMethod('phone')}
                    className="flex-1"
                  >
                    <Phone className="mr-1 h-3 w-3" />
                    手机号注册
                  </Button>
                  <Button
                    type="button"
                    variant={registerMethod === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRegisterMethod('email')}
                    className="flex-1"
                  >
                    <Mail className="mr-1 h-3 w-3" />
                    邮箱注册
                  </Button>
                </div>

                {/* 注册输入框 */}
                {registerMethod === 'phone' && (
                  <PhoneInput
                    value={registerPhone}
                    countryCode={registerPhoneCode}
                    onValueChange={setRegisterPhone}
                    onCountryCodeChange={setRegisterPhoneCode}
                    disabled={isLoading}
                  />
                )}

                {registerMethod === 'email' && (
                  <div className="space-y-2">
                    <Label htmlFor="register-email">邮箱</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="请输入邮箱"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="register-username">用户名</Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="3-20个字符，字母数字下划线"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">密码</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? 'text' : 'password'}
                      placeholder="至少6个字符"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">确认密码</Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="再次输入密码"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      注册中...
                    </>
                  ) : (
                    '注册'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* 分隔线 */}
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              或
            </span>
          </div>

          {/* 游客体验按钮 */}
          <Button variant="outline" className="w-full" onClick={handleGuestMode} disabled={isLoading}>
            <User className="mr-2 h-4 w-4" />
            游客体验（免注册试用）
          </Button>

          {/* 第三方登录提示 */}
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>第三方登录功能即将上线</p>
            <p className="mt-1">微信 · Google · GitHub</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

