import { useEffect, useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles } from 'lucide-react';
import { getAllPackages, getUserSubscription } from '@/db/api';
import type { SubscriptionPackage, UserSubscription } from '@/types';

export default function PremiumPackagePage() {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const mockUserId = 'demo-user-id';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allPackages = await getAllPackages();
      setPackages(allPackages);

      const subscription = await getUserSubscription(mockUserId);
      setCurrentSubscription(subscription);
    } catch (error) {
      console.error('加载套餐失败:', error);
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

  const getPackageFeatures = (features: Record<string, unknown>) => {
    const featureList: string[] = [];
    if (features.ai_evaluations === -1) {
      featureList.push('无限次AI评分');
    } else if (typeof features.ai_evaluations === 'number') {
      featureList.push(`${features.ai_evaluations}次AI评分`);
    }
    if (features.courses === 'all') {
      featureList.push('全部课程访问');
    } else if (features.courses === 'basic') {
      featureList.push('基础课程访问');
    }
    if (features.digital_humans) {
      featureList.push('数字人对话');
    }
    if (features.priority_support) {
      featureList.push('优先客服支持');
    }
    if (features.team_management) {
      featureList.push('团队管理功能');
    }
    if (features.custom_scenarios) {
      featureList.push('定制化场景');
    }
    return featureList;
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <main className="container space-y-6 px-4 py-6">
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Crown className="h-8 w-8 text-secondary" />
            <h1 className="text-3xl font-bold text-foreground">AI实训增强包</h1>
          </div>
          <p className="text-muted-foreground">
            解锁全部功能，加速你的学习进度
          </p>
        </div>

        {currentSubscription && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">当前订阅</p>
                  <p className="text-xl font-bold text-foreground">
                    {currentSubscription.package?.name}
                  </p>
                </div>
                <Badge variant="secondary">
                  <Sparkles className="mr-1 h-3 w-3" />
                  已激活
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((pkg, index) => {
            const features = getPackageFeatures(pkg.features || {});
            const isPopular = index === 1;
            const isEnterprise = index === 2;

            return (
              <Card 
                key={pkg.id}
                className={`relative ${isPopular ? 'border-primary shadow-lg' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default">最受欢迎</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  {isEnterprise ? (
                    <Crown className="mx-auto mb-2 h-12 w-12 text-secondary" />
                  ) : (
                    <Sparkles className="mx-auto mb-2 h-12 w-12 text-primary" />
                  )}
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      ¥{pkg.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{pkg.duration_days}天
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full" 
                    variant={isPopular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {pkg.price === 0 ? '免费使用' : '立即订阅'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
