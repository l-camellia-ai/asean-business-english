import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import LearningMapVisual from '@/components/LearningMapVisual';
import DailyChallengeCard from '@/components/DailyChallengeCard';
import { DigitalHumanCard } from '@/components/AIDigitalHuman';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  TrendingUp, 
  Award,
  ArrowRight,
  Zap,
  BookOpen,
  Users,
  Crown,
  Bot
} from 'lucide-react';
import { 
  getUserLearningProgress,
  getTodayChallenges,
  getUserChallengeCompletions,
  getUserProfile
} from '@/db/api';
import type { LearningProgress, DailyChallenge, UserProfile } from '@/types';

export default function HomePage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [progressData, setProgressData] = useState<LearningProgress[]>([]);
  const [todayChallenges, setTodayChallenges] = useState<DailyChallenge[]>([]);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // 模拟用户ID（实际应从认证系统获取）
  const mockUserId = 'demo-user-id';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 加载用户资料（如果不存在则使用默认值）
      const profile = await getUserProfile(mockUserId);
      if (profile) {
        setUserProfile(profile);
      } else {
        // 使用默认值
        setUserProfile({
          id: mockUserId,
          user_type: 'individual',
          experience_points: 1250,
          level: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      // 加载学习进度
      const progress = await getUserLearningProgress(mockUserId);
      setProgressData(progress);

      // 加载今日挑战
      const challenges = await getTodayChallenges();
      setTodayChallenges(challenges);

      // 加载已完成的挑战
      const completions = await getUserChallengeCompletions(mockUserId);
      const completedIds = new Set(completions.map(c => c.challenge_id));
      setCompletedChallengeIds(completedIds);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryClick = (country: string) => {
    navigate(`/learning-map?country=${country}`);
  };

  const handleChallengeStart = (challengeId: string) => {
    navigate(`/daily-challenges/${challengeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar userType={userProfile?.user_type} />
        <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar userType={userProfile?.user_type} />
      
      <main className="container space-y-6 px-4 py-6">
        {/* 欢迎横幅 */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  欢迎回来！ 👋
                </h1>
                <p className="text-muted-foreground">
                  继续你的东盟商务英语学习之旅
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userProfile?.level || 1}</div>
                  <div className="text-xs text-muted-foreground">等级</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{userProfile?.experience_points || 0}</div>
                  <div className="text-xs text-muted-foreground">经验值</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI数字人入口 - 突出展示 */}
        <DigitalHumanCard 
          onClick={() => navigate('/ai-digital-human')}
          className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5"
        />

        {/* 快速入口 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md" onClick={() => navigate('/scenario-training')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Zap className="h-8 w-8 text-primary" />
                <Badge variant="secondary">核心功能</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">情景实战</CardTitle>
              <CardDescription>
                AI情景对话、电话工坊、标准化训练
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md" onClick={() => navigate('/knowledge-base')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <BookOpen className="h-8 w-8 text-secondary" />
                <Badge variant="outline">知识库</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">商务知识库</CardTitle>
              <CardDescription>
                国别文化指南、行业术语、市场洞察
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md" onClick={() => navigate('/community')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-primary" />
                <Badge variant="outline">社区</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">学习社区</CardTitle>
              <CardDescription>
                成长展示、排行榜、专家问答
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* 我的学习地图 */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">我的学习地图</h2>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/learning-map">
                查看详情 <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <LearningMapVisual 
            progressData={progressData}
            onCountryClick={handleCountryClick}
          />
        </section>

        {/* 每日挑战 */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-bold text-foreground">每日挑战</h2>
              <Badge variant="secondary">双倍经验</Badge>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/daily-challenges">
                全部挑战 <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todayChallenges.length > 0 ? (
              todayChallenges.map(challenge => (
                <DailyChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isCompleted={completedChallengeIds.has(challenge.id)}
                  onStart={() => handleChallengeStart(challenge.id)}
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Award className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">今日暂无挑战</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* 底部CTA */}
        <Card className="border-secondary/20 bg-gradient-to-r from-secondary/10 to-primary/10">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-between space-y-4 text-center md:flex-row md:space-y-0 md:text-left">
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-2 md:justify-start">
                  <Crown className="h-6 w-6 text-secondary" />
                  <h3 className="text-xl font-bold text-foreground">AI实训增强包</h3>
                </div>
                <p className="text-muted-foreground">
                  解锁无限次AI评分、深度评测报告，加速你的学习进度
                </p>
              </div>
              <Button size="lg" variant="default" asChild>
                <Link to="/premium-package">
                  立即订阅
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
