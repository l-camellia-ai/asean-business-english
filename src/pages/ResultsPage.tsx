import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Award, Target, ArrowUp, ArrowDown } from 'lucide-react';

export default function ResultsPage() {
  const learningEfficiency = [
    {
      metric: '情景对话完成率',
      before: '61%',
      after: '89%',
      change: '+28%',
      improvement: '显著提升',
      icon: TrendingUp
    },
    {
      metric: '文化知识点记忆留存率',
      before: '传统教学',
      after: '+47%',
      change: '提升',
      improvement: '大幅改善',
      icon: Award
    },
    {
      metric: '数字人对话模块日均使用时长',
      before: '新功能',
      after: '38分钟',
      change: '高活跃度',
      improvement: '用户喜爱',
      icon: Users
    }
  ];

  const crossCulturalAbility = [
    {
      metric: '文化冲突处理正确率',
      before: '52%',
      after: '78%',
      change: '+26%',
      improvement: '显著提升',
      icon: Target
    },
    {
      metric: '高语境文化沟通特征识别',
      before: '试点前',
      after: '93%',
      change: '高准确率',
      improvement: '优秀表现',
      icon: Award
    },
    {
      metric: '掌握至少3种东盟国家商务礼仪',
      before: '学习前',
      after: '85%',
      change: '广泛掌握',
      improvement: '全面覆盖',
      icon: Users
    }
  ];

  const businessValue = [
    {
      metric: '东盟市场开发成功率',
      before: '试点前',
      after: '+31%',
      change: '显著提升',
      improvement: '商业价值',
      icon: TrendingUp
    },
    {
      metric: '获得实际商务合作机会',
      before: '用户反馈',
      after: '12%',
      change: '转化率',
      improvement: '实际收益',
      icon: Award
    }
  ];

  const optimizationDirections = [
    {
      title: '语料库扩展',
      description: '增加柬埔寨、老挝等新兴市场语料，覆盖RCEP全部15国',
      timeline: '2024-2025',
      priority: '高'
    },
    {
      title: '技术升级',
      description: '引入大语言模型提升对话自然度，开发AR实景对话功能',
      timeline: '2024-2026',
      priority: '高'
    },
    {
      title: '行业深化',
      description: '与东盟商会合作开发能源、医疗等垂直领域数字人',
      timeline: '2025-2026',
      priority: '中'
    },
    {
      title: '评估体系',
      description: '建立CEFR-C（跨文化商务英语框架）能力认证标准',
      timeline: '2025-2027',
      priority: '中'
    }
  ];

  const overallImpact = [
    {
      title: '东盟市场商务沟通效率',
      value: '提升65%',
      description: '学习者反馈',
      icon: TrendingUp
    },
    {
      title: '文化冲突发生率',
      value: '下降58%',
      description: '对比数据',
      icon: ArrowDown
    },
    {
      title: '一带一路人才培养',
      value: '创新方案',
      description: '可复制模式',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="gradient-bg text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">实施效果评估</h1>
            <p className="text-xl opacity-95">
              数据驱动的学习成果展示，持续优化方向
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">学习效率提升</h2>
            <p className="text-muted-foreground text-lg">从试点期到正式运行的效果对比</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {learningEfficiency.map((item, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{item.metric}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">试点期</span>
                      <span className="text-lg font-semibold">{item.before}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                      <span className="text-sm font-medium text-primary">正式运行</span>
                      <span className="text-2xl font-bold text-primary">{item.after}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-sm">{item.change}</Badge>
                      <span className="text-sm font-medium text-primary">{item.improvement}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">跨文化能力改善</h2>
            <p className="text-muted-foreground text-lg">在模拟东盟商务谈判中的表现提升</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {crossCulturalAbility.map((item, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{item.metric}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">{item.before}</span>
                      <span className="text-lg font-semibold">{item.before === '试点前' ? '52%' : item.before}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                      <span className="text-sm font-medium text-primary">学习后</span>
                      <span className="text-2xl font-bold text-primary">{item.after}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-sm">{item.change}</Badge>
                      <span className="text-sm font-medium text-primary">{item.improvement}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">商业价值转化</h2>
            <p className="text-muted-foreground text-lg">试点企业反馈与实际商业成果</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {businessValue.map((item, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{item.metric}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">{item.before}</span>
                      <span className="text-lg font-semibold">{item.before === '试点前' ? '基准水平' : item.before}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                      <span className="text-sm font-medium text-primary">实施后</span>
                      <span className="text-2xl font-bold text-primary">{item.after}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-sm">{item.change}</Badge>
                      <span className="text-sm font-medium text-primary">{item.improvement}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">持续优化方向</h2>
            <p className="text-muted-foreground text-lg">未来发展规划与技术创新</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {optimizationDirections.map((item, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <Badge variant={item.priority === '高' ? 'destructive' : 'secondary'}>
                      {item.priority}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">计划时间</span>
                    <Badge variant="outline">{item.timeline}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">总体影响</h2>
              <p className="text-muted-foreground text-lg">构建"情景-听力-游戏-数字人"四维学习生态</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {overallImpact.map((item, index) => (
                <Card key={index} className="border-2 text-center">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold gradient-text mb-2">
                      {item.value}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl md:text-4xl mb-4">方案价值</CardTitle>
                <CardDescription className="text-lg">
                  有效解决传统商务英语教学中的痛点问题
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-card rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">解决的问题</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 文化维度缺失</li>
                      <li>• 实践场景不足</li>
                      <li>• 学习动力不足</li>
                      <li>• 跨文化能力薄弱</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-card rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">提供的价值</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 四维学习生态</li>
                      <li>• 沉浸式体验</li>
                      <li>• 游戏化激励</li>
                      <li>• 真实场景模拟</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 p-6 bg-primary/10 rounded-lg text-center">
                  <p className="text-lg font-medium">
                    为"一带一路"人才培养提供了创新解决方案
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}