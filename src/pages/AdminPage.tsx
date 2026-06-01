import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import NavigationBar from '@/components/NavigationBar';
import Header from '@/components/common/Header';
import {
  Users, BookOpen, Zap, DollarSign, TrendingUp,
  Search, RefreshCw, Shield, ArrowLeft, UserCheck, Activity
} from 'lucide-react';
import {
  CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  totalLearningRecords: number;
  totalSubscriptions: number;
  avgCompletionRate: number;
  adminCount: number;
}

interface UserRecord {
  id: string;
  username: string;
  user_type: string;
  role: string;
  experience_points: number;
  level: number;
  created_at: string;
  is_guest: boolean;
}

interface ActivityRecord {
  id: string;
  user_id: string;
  username: string;
  country: string;
  scenario_type: string;
  completion_rate: number;
  score: number;
  last_practiced_at: string;
}

export default function AdminPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [dailyStats, setDailyStats] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [profile, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        { count: totalUsers },
        { count: activeToday },
        { count: totalLearningRecords },
        { data: learningData },
        { data: subscriptionData },
        { count: adminCount },
        { data: allUsers },
        { data: recentActivities },
        { data: completionStats }
      ] = await Promise.all([
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('learning_progress').select('*', { count: 'exact', head: true })
          .gte('last_practiced_at', new Date(Date.now() - 86400000).toISOString()),
        supabase.from('learning_progress').select('*', { count: 'exact', head: true }),
        supabase.from('learning_progress').select('completion_rate'),
        supabase.from('user_subscriptions').select('*', { count: 'exact', head: true })
          .eq('status', 'active'),
        supabase.from('user_profiles').select('*', { count: 'exact', head: true })
          .eq('role', 'admin'),
        supabase.from('user_profiles').select('id, username, user_type, role, experience_points, level, created_at, is_guest')
          .order('created_at', { ascending: false })
          .limit(200),
        supabase.from('learning_progress')
          .select('id, user_id, country, scenario_type, completion_rate, score, last_practiced_at')
          .order('last_practiced_at', { ascending: false })
          .limit(100),
        supabase.from('learning_progress')
          .select('last_practiced_at')
          .order('last_practiced_at', { ascending: false })
          .limit(500)
      ]);

      const avgRate = learningData
        ? (learningData as { completion_rate: number }[]).reduce((sum, r) => sum + r.completion_rate, 0) /
          Math.max((learningData as { completion_rate: number }[]).length, 1)
        : 0;

      setStats({
        totalUsers: totalUsers ?? 0,
        activeToday: activeToday ?? 0,
        totalLearningRecords: totalLearningRecords ?? 0,
        totalSubscriptions: subscriptionData?.length ?? 0,
        avgCompletionRate: Math.round(avgRate * 10) / 10,
        adminCount: adminCount ?? 0,
      });

      setUsers((allUsers as UserRecord[]) || []);

      const userMap = new Map<string, string>();
      if (allUsers) {
        (allUsers as UserRecord[]).forEach((u: UserRecord) => {
          userMap.set(u.id, u.username || '未知用户');
        });
      }

      setActivities(
        ((recentActivities as ActivityRecord[]) || []).map((a: ActivityRecord) => ({
          ...a,
          username: userMap.get(a.user_id) || '未知用户',
        }))
      );

      const dateMap = new Map<string, number>();
      if (completionStats) {
        (completionStats as { last_practiced_at: string }[]).forEach((r: { last_practiced_at: string }) => {
          const date = r.last_practiced_at?.split('T')[0];
          if (date) dateMap.set(date, (dateMap.get(date) || 0) + 1);
        });
      }
      const sorted = Array.from(dateMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-30)
        .map(([date, count]) => ({ date, count }));
      setDailyStats(sorted);

    } catch (err) {
      console.error('获取管理员数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchData();
    }
  }, [profile]);

  const filteredUsers = users.filter(u =>
    (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.user_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">无权访问</p>
          <p className="text-sm text-muted-foreground">仅管理员可访问此页面</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <NavigationBar userType={profile.user_type} />
      <Header
        title="管理后台"
        description="数据监测与用户管理"
        actions={
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            刷新数据
          </Button>
        }
      />

      <div className="container px-4 py-6 space-y-6">
        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}><CardContent className="p-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))
          ) : (
            <>
              <StatCard title="总用户数" value={stats!.totalUsers.toString()} icon={Users} color="text-blue-600" bg="bg-blue-50" />
              <StatCard title="今日活跃" value={stats!.activeToday.toString()} icon={Activity} color="text-green-600" bg="bg-green-50" />
              <StatCard title="管理员" value={stats!.adminCount.toString()} icon={Shield} color="text-purple-600" bg="bg-purple-50" />
              <StatCard title="学习记录" value={stats!.totalLearningRecords.toString()} icon={BookOpen} color="text-orange-600" bg="bg-orange-50" />
              <StatCard title="付费用户" value={stats!.totalSubscriptions.toString()} icon={DollarSign} color="text-rose-600" bg="bg-rose-50" />
              <StatCard title="平均完成率" value={`${stats!.avgCompletionRate}%`} icon={TrendingUp} color="text-cyan-600" bg="bg-cyan-50" />
            </>
          )}
        </div>

        {/* 图表 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                学习活动趋势（近30天）
              </CardTitle>
              <CardDescription>每日学习记录提交数量</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[300px] w-full" /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                用户注册趋势（近30天）
              </CardTitle>
              <CardDescription>每日新注册用户数量</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[300px] w-full" /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={
                    (() => {
                      const map = new Map<string, number>();
                      users.forEach(u => {
                        const d = u.created_at?.split('T')[0];
                        if (d) map.set(d, (map.get(d) || 0) + 1);
                      });
                      return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0])).slice(-30).map(([date, count]) => ({ date, count }));
                    })()
                  }>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs: 用户管理 + 学习数据 */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              用户管理
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              学习记录
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>用户列表</CardTitle>
                    <CardDescription>共 {stats?.totalUsers ?? 0} 位用户</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索用户名或类型..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>用户名</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead>类型</TableHead>
                        <TableHead>等级</TableHead>
                        <TableHead>经验值</TableHead>
                        <TableHead>游客</TableHead>
                        <TableHead>注册时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.slice(0, 50).map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.username || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                              {u.role === 'admin' ? '管理员' : '用户'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {u.user_type === 'enterprise_admin' ? '企业管理员' :
                               u.user_type === 'enterprise_member' ? '企业成员' : '个人用户'}
                            </Badge>
                          </TableCell>
                          <TableCell>Lv.{u.level}</TableCell>
                          <TableCell>{u.experience_points}</TableCell>
                          <TableCell>{u.is_guest ? '是' : '否'}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('zh-CN') : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>最近学习记录</CardTitle>
                    <CardDescription>共 {activities.length} 条记录</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>用户</TableHead>
                        <TableHead>国家/场景</TableHead>
                        <TableHead>完成率</TableHead>
                        <TableHead>得分</TableHead>
                        <TableHead>最后练习</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-muted-foreground" />
                              {a.username}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">{a.country}</Badge>
                              <span className="text-xs text-muted-foreground">{a.scenario_type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-20 rounded-full bg-muted">
                                <div
                                  className="h-2 rounded-full bg-primary transition-all"
                                  style={{ width: `${Math.min(a.completion_rate, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs">{a.completion_rate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={a.score >= 70 ? 'default' : a.score >= 40 ? 'secondary' : 'destructive'}>
                              {a.score ?? '-'}分
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(a.last_practiced_at).toLocaleString('zh-CN')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`rounded-lg p-3 ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
