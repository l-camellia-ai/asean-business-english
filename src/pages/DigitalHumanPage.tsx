import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, RefreshCw, FileText, MessageSquare, Target, AlertCircle } from 'lucide-react';

export default function DigitalHumanPage() {
  const digitalHumans = [
    {
      country: '泰国',
      industry: '旅游业',
      role: '酒店集团市场总监',
      demand: '寻求中国定制游合作方案',
      avatar: '🇹🇭',
      color: 'from-chart-4 to-chart-5',
      keyPoints: [
        '了解中国游客偏好',
        '定制化服务方案',
        '文化体验设计',
        '价格策略协商'
      ]
    },
    {
      country: '越南',
      industry: '制造业',
      role: '纺织厂生产经理',
      demand: '探讨供应链优化策略',
      avatar: '🇻🇳',
      color: 'from-primary to-primary-glow',
      keyPoints: [
        '供应链效率提升',
        '质量控制标准',
        '交货时间优化',
        '成本控制方案'
      ]
    },
    {
      country: '印尼',
      industry: '农业',
      role: '棕榈油出口商',
      demand: '协商可持续采购条款',
      avatar: '🇮🇩',
      color: 'from-chart-2 to-chart-3',
      keyPoints: [
        '可持续认证要求',
        '采购价格谈判',
        '质量标准确认',
        '长期合作条款'
      ]
    },
    {
      country: '新加坡',
      industry: '金融科技',
      role: '支付平台CEO',
      demand: '对接跨境数字货币解决方案',
      avatar: '🇸🇬',
      color: 'from-primary-glow to-chart-2',
      keyPoints: [
        '技术方案对接',
        '合规要求确认',
        '市场推广策略',
        '收益分配方案'
      ]
    }
  ];

  const features = [
    {
      icon: RefreshCw,
      title: '动态需求生成',
      description: '基于真实商务案例库，每月更新数字人需求参数',
      details: [
        '引入AI生成技术，使同一角色在不同对话轮次提出差异化要求',
        '设置文化陷阱选项（如马来西亚数字人突然改用马来语问候）',
        '基于用户学习进度动态调整对话难度'
      ]
    },
    {
      icon: MessageSquare,
      title: '多轮对话评估',
      description: '记录用户与数字人对话轮次、策略调整次数',
      details: [
        '分析文化适配度（如是否尊重菲律宾的"Bayanihan"社区精神）',
        '生成《跨文化商务能力诊断报告》，指出改进方向',
        '提供个性化学习建议'
      ]
    },
    {
      icon: Target,
      title: '文化陷阱设置',
      description: '模拟真实商务场景中的文化冲突',
      examples: [
        '马来西亚数字人突然改用马来语问候',
        '泰国数字人询问对皇室的看法',
        '印尼数字人用左手递名片',
        '越南数字人迟到15分钟'
      ]
    }
  ];

  const evaluationMetrics = [
    {
      category: '对话质量',
      metrics: [
        { name: '对话轮次', weight: '20%', description: '平均对话轮次' },
        { name: '策略调整', weight: '15%', description: '策略调整次数' },
        { name: '问题解决', weight: '25%', description: '问题解决效率' }
      ]
    },
    {
      category: '文化适配',
      metrics: [
        { name: '文化禁忌', weight: '20%', description: '文化禁忌识别' },
        { name: '礼仪规范', weight: '15%', description: '礼仪规范遵守' },
        { name: '文化尊重', weight: '25%', description: '文化尊重程度' }
      ]
    },
    {
      category: '商务能力',
      metrics: [
        { name: '谈判技巧', weight: '20%', description: '谈判策略运用' },
        { name: '沟通效率', weight: '15%', description: '沟通效率评估' },
        { name: '合作达成', weight: '25%', description: '合作达成能力' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="gradient-bg text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">行业数字人对话模块</h1>
            <p className="text-xl opacity-95">
              东盟四国行业代表，动态需求生成，多轮对话评估
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">数字人矩阵</h2>
            <p className="text-muted-foreground text-lg">代表东盟国家不同行业的虚拟商务伙伴</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {digitalHumans.map((human, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${human.color} flex items-center justify-center text-4xl`}>
                      {human.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-2xl">{human.country}</CardTitle>
                        <Badge variant="secondary">{human.industry}</Badge>
                      </div>
                      <CardDescription className="text-base font-medium">{human.role}</CardDescription>
                    </div>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm font-medium text-primary">典型需求：{human.demand}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-3">对话要点：</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {human.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">核心功能</h2>
              <p className="text-muted-foreground text-lg">智能化对话体验，真实商务场景模拟</p>
            </div>
            <div className="space-y-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{feature.title}</CardTitle>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {feature.details && (
                      <ul className="space-y-2">
                        {feature.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {feature.examples && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        {feature.examples.map((example, idx) => (
                          <div key={idx} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                              <p className="text-sm">{example}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">多轮对话评估体系</h2>
              <p className="text-muted-foreground text-lg">从三个维度全面评估商务沟通能力</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {evaluationMetrics.map((category, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">{category.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.metrics.map((metric, idx) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm">{metric.name}</h4>
                            <Badge variant="outline" className="text-xs">{metric.weight}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{metric.description}</p>
                        </div>
                      ))}
                    </div>
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
                <CardTitle className="text-3xl md:text-4xl mb-4">技术实现方案</CardTitle>
                <CardDescription className="text-lg">
                  先进的技术架构支撑真实的数字人交互体验
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">3D虚拟形象</h4>
                    <p className="text-sm text-muted-foreground mb-2">Unity3D构建</p>
                    <p className="text-xs text-muted-foreground">逼真的虚拟形象</p>
                  </div>
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">语音交互</h4>
                    <p className="text-sm text-muted-foreground mb-2">Azure Cognitive Services</p>
                    <p className="text-xs text-muted-foreground">自然语音交互</p>
                  </div>
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">口型同步</h4>
                    <p className="text-sm text-muted-foreground mb-2">LipSync技术</p>
                    <p className="text-xs text-muted-foreground">延迟&lt;0.3秒</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}