import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import LearningMapVisual from '@/components/LearningMapVisual';
import RadarChart from '@/components/RadarChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUserLearningProgress, getUserAbilities } from '@/db/api';
import type { LearningProgress, AbilityDimensions } from '@/types';

export default function LearningMapPage() {
  const [searchParams] = useSearchParams();
  const [progressData, setProgressData] = useState<LearningProgress[]>([]);
  const [abilities, setAbilities] = useState<AbilityDimensions | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const userId = user?.id;
  const selectedCountry = searchParams.get('country');

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const progress = await getUserLearningProgress(userId);
      setProgressData(progress);

      const userAbilities = await getUserAbilities(userId);
      if (userAbilities) {
        setAbilities(userAbilities);
      } else {
        // 使用默认值
        setAbilities({
          id: 'demo-ability-id',
          user_id: userId,
          language_accuracy: 75,
          cultural_adaptation: 68,
          business_strategy: 82,
          negotiation_skills: 70,
          communication_efficiency: 78,
          cross_cultural_awareness: 65,
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('加载数据失败:', error);
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
          <h1 className="text-3xl font-bold text-foreground">我的学习地图</h1>
          <p className="text-muted-foreground">
            追踪你在东盟各国的学习进度和能力成长
          </p>
          {selectedCountry && (
            <Badge variant="secondary">当前选择: {selectedCountry}</Badge>
          )}
        </div>

        <LearningMapVisual progressData={progressData} />

        {abilities && (
          <div className="mt-6">
            <RadarChart abilities={abilities} />
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>学习统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">已完成课程</p>
                <p className="text-2xl font-bold text-primary">
                  {progressData.filter(p => p.completion_rate === 100).length}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">进行中课程</p>
                <p className="text-2xl font-bold text-secondary">
                  {progressData.filter(p => p.completion_rate > 0 && p.completion_rate < 100).length}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">平均分数</p>
                <p className="text-2xl font-bold text-foreground">
                  {progressData.length > 0
                    ? Math.round(progressData.reduce((sum, p) => sum + (p.score || 0), 0) / progressData.length)
                    : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
