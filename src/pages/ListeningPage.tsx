import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Headphones, Play,Download, Filter } from 'lucide-react';

export default function ListeningPage() {
  const categories = [
    {
      country: '新加坡',
      industry: '金融科技',
      videos: 35,
      accent: '新加坡式英语',
      description: '支付平台、数字货币、跨境金融'
    },
    {
      country: '泰国',
      industry: '旅游业',
      videos: 28,
      accent: '泰式英语',
      description: '酒店管理、定制旅游、文化体验'
    },
    {
      country: '越南',
      industry: '制造业',
      videos: 42,
      accent: '越南式英语',
      description: '纺织、电子、供应链管理'
    },
    {
      country: '印尼',
      industry: '农业',
      videos: 25,
      accent: '印尼式英语',
      description: '棕榈油、咖啡、可持续采购'
    },
    {
      country: '马来西亚',
      industry: '跨境电商',
      videos: 32,
      accent: '马来西亚式英语',
      description: '平台运营、物流配送、市场推广'
    },
    {
      country: '菲律宾',
      industry: '服务业',
      videos: 38,
      accent: '菲律宾式英语',
      description: '客服外包、技术支持、商务流程'
    }
  ];

  const trainingMethod = [
    {
      step: '第一遍',
      title: '无字幕盲听',
      description: '理解大意，捕捉关键词',
      duration: '30秒',
      focus: '整体理解'
    },
    {
      step: '第二遍',
      title: '带字幕精听',
      description: '逐句理解，学习表达',
      duration: '60秒',
      focus: '细节学习'
    },
    {
      step: '第三遍',
      title: '填空式听写',
      description: '巩固记忆，检验效果',
      duration: '90秒',
      focus: '能力检验'
    }
  ];

  const features = [
    {
      icon: Filter,
      title: '智能分类',
      description: '按国家、行业、难度多维度分类',
      details: [
        '10个东盟国家全覆盖',
        '6大主要行业分类',
        '3个难度等级（初级/中级/高级）'
      ]
    },
    {
      icon: Download,
      title: '可下载字幕',
      description: '支持中英双语字幕下载',
      details: [
        'SRT格式标准字幕',
        '中英双语对照',
        '支持离线学习'
      ]
    },
    {
      icon: Play,
      title: '微课程设计',
      description: '30秒精华片段，高效学习',
      details: [
        '精选关键对话片段',
        '平均时长30秒',
        '配套学习笔记'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="gradient-bg text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Headphones className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">油管语料库听力学习</h1>
            <p className="text-xl opacity-95">
              200+精选视频，三遍听力法，东盟口音专项训练
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">多模态语料库</h2>
            <p className="text-muted-foreground text-lg">覆盖东盟市场主要国家和行业</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-xl mb-1">{category.country}</CardTitle>
                      <Badge variant="secondary">{category.industry}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{category.videos}</div>
                      <div className="text-xs text-muted-foreground">个视频</div>
                    </div>
                  </div>
                  <CardDescription className="text-sm">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">口音：</span>
                    <Badge variant="outline">{category.accent}</Badge>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">三遍听力法</h2>
              <p className="text-muted-foreground text-lg">科学训练方法，循序渐进提升听力能力</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trainingMethod.map((method, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 gradient-bg opacity-10 rounded-bl-full" />
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                        <span className="text-white font-bold">{method.step}</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{method.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">{method.duration}</Badge>
                      </div>
                    </div>
                    <CardDescription className="text-base">{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm font-medium text-primary">重点：{method.focus}</p>
                    </div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">核心功能</h2>
              <p className="text-muted-foreground text-lg">智能化学习体验</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
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
                <CardTitle className="text-3xl md:text-4xl mb-4">东盟口音专项训练</CardTitle>
                <CardDescription className="text-lg">
                  针对东盟地区特有的英语口音进行专项训练
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-card rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">新加坡式英语</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 语速较快，语调平缓</li>
                      <li>• 受中文和马来语影响</li>
                      <li>• 常用"lah"等语气词</li>
                      <li>• 商务场合较为正式</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-card rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">菲律宾式英语</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 美式英语影响明显</li>
                      <li>• 发音清晰，语速适中</li>
                      <li>• 常用西班牙语词汇</li>
                      <li>• 服务业常用口音</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-card rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">马来西亚式英语</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 英式英语为基础</li>
                      <li>• 受马来语影响</li>
                      <li>• 语调较为柔和</li>
                      <li>• 商务场合注重礼仪</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-card rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">泰国式英语</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 语速较慢，发音清晰</li>
                      <li>• 受泰语声调影响</li>
                      <li>• 注重礼貌用语</li>
                      <li>• 旅游业常用口音</li>
                    </ul>
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