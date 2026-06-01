import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Zap, 
  BookOpen, 
  Users, 
  Building2,
  Menu,
  LogOut,
  User,
  LogIn,
  Mail,
  Shield,
  ArrowUp
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  requiresEnterprise?: boolean;
}

const navItems: NavItem[] = [
  {
    name: '情景实战',
    path: '/scenario-training',
    icon: <Zap className="h-5 w-5" />
  },
  {
    name: '商务知识库',
    path: '/knowledge-base',
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    name: '学习社区',
    path: '/community',
    icon: <Users className="h-5 w-5" />
  },
  {
    name: '企业服务',
    path: '/enterprise-service',
    icon: <Building2 className="h-5 w-5" />,
    requiresEnterprise: true
  }
];

interface NavigationBarProps {
  userType?: 'individual' | 'enterprise_admin' | 'enterprise_member';
}

export default function NavigationBar({ userType = 'individual' }: NavigationBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, becomeAdmin } = useAuth();
  
  const filteredNavItems = navItems.filter(item => {
    if (item.requiresEnterprise) {
      return userType === 'enterprise_admin' || userType === 'enterprise_member';
    }
    return true;
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('已退出登录');
      navigate('/');
    } catch (error) {
      console.error('退出登录失败:', error);
      toast.error('退出登录失败');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">智</span>
          </div>
          <span className="hidden font-bold text-foreground md:inline-block">
            智汇南洋
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-1 md:flex">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to={item.path} className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </Button>
            );
          })}
          
          <div className="ml-4 flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
            <Mail className="h-3.5 w-3.5" />
            <span>加入我们请联系：605676449@qq.com</span>
          </div>
        </div>

        {/* User Menu */}
        <div className="hidden items-center space-x-2 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile?.username || '用户'}</p>
                    <p className="text-xs text-muted-foreground">
                      {profile?.role === 'admin' ? '管理员' : '普通用户'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    个人中心
                  </Link>
                </DropdownMenuItem>
                {profile?.role === 'admin' ? (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      管理后台
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={async () => {
                    const result = await becomeAdmin();
                    if (result.success) {
                      toast.success(result.message);
                    } else {
                      toast.error(result.message);
                    }
                  }}>
                    <ArrowUp className="mr-2 h-4 w-4" />
                    提升为管理员
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link to="/login" className="flex items-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>登录</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>导航菜单</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col space-y-2">
              {/* User Info */}
              {user ? (
                <div className="mb-4 rounded-lg border p-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {profile?.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{profile?.username || '用户'}</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.role === 'admin' ? '管理员' : '普通用户'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button variant="default" className="mb-4" asChild>
                  <Link to="/login" className="flex items-center justify-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>登录</span>
                  </Link>
                </Button>
              )}

              {/* Nav Items */}
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? 'default' : 'ghost'}
                    className="justify-start"
                    asChild
                  >
                    <Link to={item.path} className="flex items-center space-x-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                );
              })}

              <div className="my-4 rounded-lg bg-primary/5 p-4 text-center">
                <p className="text-xs font-semibold text-primary mb-1">加入我们</p>
                <p className="text-[10px] text-muted-foreground flex items-center justify-center">
                  <Mail className="h-3 w-3 mr-1" />
                  605676449@qq.com
                </p>
              </div>

              {/* User Actions */}
              {user && (
                <>
                  <div className="my-2 border-t" />
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/profile" className="flex items-center space-x-3">
                      <User className="h-5 w-5" />
                      <span>个人中心</span>
                    </Link>
                  </Button>
                  {profile?.role === 'admin' ? (
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link to="/admin" className="flex items-center space-x-3">
                        <Shield className="h-5 w-5" />
                        <span>管理后台</span>
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={async () => {
                        const result = await becomeAdmin();
                        if (result.success) {
                          toast.success(result.message);
                        } else {
                          toast.error(result.message);
                        }
                      }}
                    >
                      <ArrowUp className="mr-3 h-5 w-5" />
                      <span>提升为管理员</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="justify-start text-destructive hover:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>退出登录</span>
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
