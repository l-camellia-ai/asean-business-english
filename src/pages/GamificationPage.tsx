import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, TrendingUp, Gift, Medal, Star } from 'lucide-react';

export default function GamificationPage() {
  const pointsSystem = [
    {
      type: '文化探索者',
      icon: Award,
      color: 'from-chart-2 to-chart-3',
      points: [
        { action: '完成特定国家情景对话', value: '+100', description: '每个国家' },
        { action: '正确处理文化冲突', value: '+200', description: '每次成功处理' },
        { action: '学习文化禁忌知识', value: '+50', description: '每个知识点' },
        { action: '完成文化测试', value: '+150', description: '每次测试' }
      ]
    },
    {
      type: '商务达人',
      icon: TrendingUp,
      color: 'from-primary to-primary-glow',
      points: [
        { action: '完成商务谈判场景', value: '+120', description: '每个场景' },
        { action: '达成商务合作', value: '+300', description: '每次成功合作' },
        { action: '优化商务策略', value: '+80', description: '每次优化' },
        { action: '完成商务测试', value: '+180', description: '每次测试' }
      ]
    }
  ];

  const badges = [
    {
      category: '国家文化徽章',
      icon: Star,
      items: [
        { name: '泰国礼仪大师', country: '泰国', requirement: '完成所有泰国场景' },
        { name: '印尼禁忌专家', country: '印尼', requirement: '掌握印尼文化禁忌' },
        { name: '越南商务达人', country: '越南', requirement: '完成越南商务场景' },
        { name: '新加坡金融精英', country: '新加坡', requirement: '掌握金融场景' },
        { name: '马来西亚文化使者', country: '马来西亚', requirement: '完成马来场景' },
        { name: '菲律宾服务专家', country: '菲律宾', requirement: '掌握服务场景' }
      ]
    },
    {
      category: '行业徽章',
      icon: Medal,
      items: [
        { name: '旅游行业专家', industry: '旅游业', requirement: '完成旅游场景' },
        { name: '制造业精英', industry: '制造业', requirement: '完成制造场景' },
        { name: '农业贸易专家', industry: '农业', requirement: '完成农业场景' },
        { name: '金融科技先锋', industry: '金融科技', requirement: '完成金融场景' }
      ]
    },
    {
      category: '隐藏徽章',
      icon: Trophy,
      items: [
        { name: '海峡英才', requirement: '同时获得新加坡、马来西亚商务徽章' },
        { name: '东盟通', requirement: '获得5个以上国家徽章' },
        { name: '文化大师', requirement: '获得所有文化徽章' },
        { name: '商务精英', requirement: '获得所有行业徽章' }
      ]
    }
  ];

  const leaderboards = [
    {
      title: '最佳跨文化沟通者',
      period: '本周',
      users: [
        { rank: 1, name: '张小明', points: 2850, country: '中国' },
        { rank: 2, name: '李华', points: 2630, country: '中国' },
        { rank: 3, name: '王芳', points: 2410, country: '中国' },
        { rank: 4, name: '陈伟', points: 2280, country: '中国' },
        { rank: 5, name: '刘洋', points: 2150, country: '中国' }
      ]
    },
    {
      title: '东盟商务新星',
      period: '本月',
      users: [
        { rank: 1, name: '赵敏', points: 12500, country: '中国' },
        { rank: 2, name: '孙强', points: 11800, country: '中国' },
        { rank: 3, name: '周杰', points: 10950, country: '中国' },
        { rank: 4, name: '吴磊', points: 10200, country: '中国' },
        { rank: 5, name: '郑丽', points: 9850, country: '中国' }
      ]
    }
  ];

  const rewards = [
    { name: '越南斗笠', points: 500, description: '越南传统服饰' },
    { name: '印尼巴迪布徽章', points: 800, description: '印尼传统图案' },
    { name: '泰国大象挂件', points: 600, description: '泰国文化象征' },
    { name: '新加坡鱼尾狮', points: 700, description: '新加坡地标' },
    { name: '马来西亚双子塔', points: 900, description: '吉隆坡地标' },
    { name: '菲律宾吉普尼', points: 550, description: '菲律宾特色交通' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="gradient-bg text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">游戏化学习元素</h1>
            <p className="text-xl opacity-95">
              双轨积分体系，排行榜竞争，30个成就徽章
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">双轨积分系统</h2>
            <p className="text-muted-foreground text-lg">文化探索者与商务达人双轨并行</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {pointsSystem.map((system, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${system.color} flex items-center justify-center`}>
                      <system.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{system.type}</CardTitle>
                      <CardDescription>积分获取规则</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {system.points.map((point, idx) => (
                      <div key={idx} className="flex items-start justify-between p-4 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium mb-1">{point.action}</p>
                          <p className="text-sm text-muted-foreground">{point.description}</p>
                        </div>
                        <Badge className="text-lg font-bold px-3 py-1">{point.value}</Badge>
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
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">成就徽章体系</h2>
              <p className="text-muted-foreground text-lg">30个文化认知徽章，激励持续学习</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {badges.map((category, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">{category.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.items.map((badge, idx) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold">{badge.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {'country' in badge ? badge.country : 'industry' in badge ? badge.industry : '隐藏'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{badge.requirement}</p>
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

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">排行榜竞争机制</h2>
              <p className="text-muted-foreground text-lg">按国家/行业维度设置区域排行榜</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {leaderboards.map((board, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{board.title}</CardTitle>
                      <Badge variant="outline">{board.period}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {board.users.map((user, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            user.rank === 1 ? 'gradient-bg text-white' : 
                            user.rank === 2 ? 'bg-secondary text-secondary-foreground' : 
                            user.rank === 3 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            {user.rank}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.country}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">{user.points.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">积分</p>
                          </div>
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
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">积分兑换奖励</h2>
              <p className="text-muted-foreground text-lg">虚拟商务礼品，激励学习动力</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-lg gradient-bg flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-center">{reward.name}</CardTitle>
                    <CardDescription className="text-center">{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge className="text-lg font-bold px-4 py-2">
                      {reward.points} 积分
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl md:text-4xl mb-4">特别奖励</CardTitle>
                <CardDescription className="text-lg">
                  积分前10%用户获得与行业数字人深度对话机会
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="p-6 bg-muted rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">月度前10%</h4>
                    <p className="text-sm text-muted-foreground">与数字人深度对话</p>
                  </div>
                  <div className="p-6 bg-muted rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">季度前5%</h4>
                    <p className="text-sm text-muted-foreground">获得专属学习报告</p>
                  </div>
                  <div className="p-6 bg-muted rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">年度前1%</h4>
                    <p className="text-sm text-muted-foreground">获得认证证书</p>
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