import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ASEAN_COUNTRIES } from '@/types';
import type { LearningProgress } from '@/types';

interface LearningMapVisualProps {
  progressData: LearningProgress[];
  onCountryClick?: (country: string) => void;
}

export default function LearningMapVisual({ progressData, onCountryClick }: LearningMapVisualProps) {
  // 计算每个国家的完成率
  const countryProgress = ASEAN_COUNTRIES.map(country => {
    const countryData = progressData.filter(p => p.country === country.code);
    const avgCompletion = countryData.length > 0
      ? Math.round(countryData.reduce((sum, p) => sum + p.completion_rate, 0) / countryData.length)
      : 0;
    
    return {
      ...country,
      completion: avgCompletion,
      isUnlocked: avgCompletion > 0
    };
  });

  const getStatusColor = (completion: number) => {
    if (completion === 0) return 'bg-muted';
    if (completion < 30) return 'bg-destructive';
    if (completion < 70) return 'bg-secondary';
    return 'bg-primary';
  };

  const getStatusText = (completion: number) => {
    if (completion === 0) return '未开始';
    if (completion < 30) return '初级';
    if (completion < 70) return '中级';
    if (completion === 100) return '已完成';
    return '高级';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>东盟市场开拓地图</span>
          <Badge variant="outline">
            {countryProgress.filter(c => c.isUnlocked).length}/{ASEAN_COUNTRIES.length} 已解锁
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {countryProgress.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => onCountryClick?.(country.code)}
              className="group relative flex flex-col items-center space-y-2 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md"
            >
              {/* 国旗 */}
              <div className="text-4xl">{country.flag}</div>
              
              {/* 国家名称 */}
              <div className="text-center text-sm font-medium text-foreground">
                {country.name}
              </div>
              
              {/* 进度条 */}
              <div className="w-full">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full transition-all ${getStatusColor(country.completion)}`}
                    style={{ width: `${country.completion}%` }}
                  />
                </div>
                <div className="mt-1 text-center text-xs text-muted-foreground">
                  {country.completion}% · {getStatusText(country.completion)}
                </div>
              </div>

              {/* 锁定状态 */}
              {!country.isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                  <span className="text-2xl">🔒</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* 图例 */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-muted" />
            <span className="text-muted-foreground">未开始</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground">初级 (&lt;30%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-secondary" />
            <span className="text-muted-foreground">中级 (30-70%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">高级 (&gt;70%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
