import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, GitBranch, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function AIChatPage() {
  const scenarios = [
    { name: '贸易谈判', countries: ['泰国', '越南', '印尼'], difficulty: '高级' },
    { name: '会议主持', countries: ['新加坡', '马来西亚'], difficulty: '中级' },
    { name: '跨文化团队管理', countries: ['菲律宾', '印尼'], difficulty: '高级' },
    { name: '商务宴请', countries: ['泰国', '马来西亚'], difficulty: '初级' },
    { name: '价格磋商', countries: ['越南', '印尼'], difficulty: '中级' },
    { name: '供应链优化', countries: ['新加坡', '泰国'], difficulty: '高级' },
    { name: '市场推广', countries: ['马来西亚', '菲律宾'], difficulty: '中级' },
    { name: '合同签订', countries: ['新加坡', '印尼'], difficulty: '高级' },
    { name: '客户拜访', countries: ['泰国', '越南'], difficulty: '初级' },
    { name: '产品演示', countries: ['新加坡', '马来西亚'], difficulty: '中级' },
    { name: '投诉处理', countries: ['菲律宾', '印尼'], difficulty: '高级' },
    { name: '商务礼仪', countries: ['泰国', '马来西亚'], difficulty: '初级' }
  ];

  const features = [
    {
      icon: GitBranch,
      title: '动态分支设计',
      description: '采用决策树算法构建对话分支，根据用户选择触发不同文化反应',
      examples: [
        '提及泰国客户时，系统会提示避免触摸头部',
        '与越南企业沟通时，自动调整时间观念相关表述',
        '马来西亚商务宴请场景中，提示右手进食原则'
      ]
    },
    {
      icon: TrendingUp,
      title: '实时反馈机制',
      description: '通过NLP技术分析用户回答，从三个维度进行评分',
      dimensions: [
        { name: '语言准确性', weight: '40%', description: '语法、词汇、发音' },
        { name: '文化适配性', weight: '35%', description: '文化禁忌、礼仪规范' },
        { name: '商务策略', weight: '25%', description: '谈判技巧、沟通策略' }
      ]
    },
    {
      icon: CheckCircle2,
      title: '文化禁忌提示',
      description: '实时识别并提示跨文化沟通中的潜在风险',
      tips: [
        '泰国：避免触摸头部，尊重皇室',
        '马来西亚：使用右手进食，避免公开示爱',
        '印尼：避免用左手传递物品',
        '越南：重视时间观念，准时赴约',
        '菲律宾：尊重家庭观念，避免批评家人'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="gradient-bg text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">AI情景对话工作流</h1>
            <p className="text-xl opacity-95">
              基于中国-东盟商务场景，设计12类高频情景，实现沉浸式对话学习
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">12类高频商务场景</h2>
            <p className="text-muted-foreground text-lg">覆盖东盟市场主要商务场景</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {scenarios.map((scenario, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{scenario.name}</CardTitle>
                    <Badge variant={scenario.difficulty === '高级' ? 'destructive' : scenario.difficulty === '中级' ? 'default' : 'secondary'}>
                      {scenario.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {scenario.countries.map((country, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          {country}
                        </span>
                      ))}
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">核心功能特性</h2>
              <p className="text-muted-foreground text-lg">智能对话系统，提升学习效果</p>
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
                    {feature.examples && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm mb-3">示例场景：</h4>
                        <ul className="space-y-2">
                          {feature.examples.map((example, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {feature.dimensions && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm mb-3">评分维度：</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {feature.dimensions.map((dimension, idx) => (
                            <div key={idx} className="p-4 bg-muted rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold">{dimension.name}</h5>
                                <Badge variant="outline">{dimension.weight}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{dimension.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {feature.tips && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm mb-3">文化禁忌提示：</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {feature.tips.map((tip, idx) => (
                            <div key={idx} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                              <p className="text-sm">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl md:text-4xl mb-4">技术实现</CardTitle>
                <CardDescription className="text-lg">
                  先进的技术架构支撑智能对话系统
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">前端</h4>
                    <p className="text-sm text-muted-foreground">React Native</p>
                    <p className="text-xs text-muted-foreground mt-2">跨平台Chatbot界面</p>
                  </div>
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">后端</h4>
                    <p className="text-sm text-muted-foreground">Python + Django</p>
                    <p className="text-xs text-muted-foreground mt-2">对话管理系统</p>
                  </div>
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">NLP模块</h4>
                    <p className="text-sm text-muted-foreground">Rasa框架</p>
                    <p className="text-xs text-muted-foreground mt-2">意图识别与实体抽取</p>
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