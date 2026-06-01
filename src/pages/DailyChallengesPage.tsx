import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import DailyChallengeCard from '@/components/DailyChallengeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Flame } from 'lucide-react';
import { getTodayChallenges, getUserChallengeCompletions } from '@/db/api';
import type { DailyChallenge } from '@/types';

export default function DailyChallengesPage() {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState(7); // 连续签到天数
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const todayChallenges = await getTodayChallenges();
      setChallenges(todayChallenges);

      const completions = await getUserChallengeCompletions(userId);
      const ids = new Set(completions.map(c => c.challenge_id));
      setCompletedIds(ids);
    } catch (error) {
      console.error('加载挑战失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
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
      <NavigationBar />
      
      <main className="container space-y-6 px-4 py-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">每日挑战</h1>
          <p className="text-muted-foreground">
            完成每日挑战，获得双倍经验值奖励
          </p>
        </div>

        {/* 连续签到统计 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-secondary/20 bg-gradient-to-r from-secondary/10 to-primary/10">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">连续签到</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-secondary">{streak}</span>
                  <span className="text-muted-foreground">天</span>
                </div>
              </div>
              <Flame className="h-12 w-12 text-secondary" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">今日完成</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-primary">
                    {Array.from(completedIds).length}
                  </span>
                  <span className="text-muted-foreground">/ {challenges.length}</span>
                </div>
              </div>
              <Calendar className="h-12 w-12 text-primary" />
            </CardContent>
          </Card>
        </div>

        {/* 今日挑战列表 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>今日挑战</CardTitle>
              <Badge variant="secondary">双倍经验</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {challenges.length > 0 ? (
              challenges.map(challenge => (
                <DailyChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isCompleted={completedIds.has(challenge.id)}
                  onStart={() => console.log('开始挑战:', challenge.id)}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">今日暂无挑战</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
