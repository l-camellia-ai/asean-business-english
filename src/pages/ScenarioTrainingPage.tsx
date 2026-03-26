import { useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import AIDialogueChat from '@/components/AIDialogueChat';
import AIPhoneCall from '@/components/AIPhoneCall';
import StandardTraining from '@/components/StandardTraining';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Phone, MessageSquare, BookText, Play } from 'lucide-react';

interface Scenario {
  id: number;
  title: string;
  country: string;
  difficulty: string;
  duration: string;
  description: string;
}

export default function ScenarioTrainingPage() {
  const [selectedTab, setSelectedTab] = useState('dialogue');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [standardDialogOpen, setStandardDialogOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const scenarios: Scenario[] = [
    {
      id: 1,
      title: '泰国酒店合作谈判',
      country: '🇹🇭 泰国',
      difficulty: '中级',
      duration: '30分钟',
      description: '与泰国酒店集团市场总监洽谈中国定制游合作方案，学习泰国商务礼仪和谈判技巧'
    },
    {
      id: 2,
      title: '越南供应链磋商',
      country: '🇻🇳 越南',
      difficulty: '高级',
      duration: '45分钟',
      description: '与越南纺织厂生产经理探讨供应链优化策略，掌握越南商务沟通要点'
    },
    {
      id: 3,
      title: '新加坡金融科技对接',
      country: '🇸🇬 新加坡',
      difficulty: '高级',
      duration: '40分钟',
      description: '与新加坡支付平台CEO对接跨境数字货币解决方案，了解新加坡金融科技行业规范'
    },
    {
      id: 4,
      title: '印尼商务宴请礼仪',
      country: '🇮🇩 印尼',
      difficulty: '初级',
      duration: '20分钟',
      description: '参加印尼商务宴请，学习印尼文化禁忌和餐桌礼仪，建立良好商务关系'
    }
  ];

  const phoneScenarios: Scenario[] = [
    {
      id: 1,
      title: '马来西亚客户电话咨询',
      country: '🇲🇾 马来西亚',
      difficulty: '初级',
      duration: '15分钟',
      description: '接听马来西亚客户的产品咨询电话，练习电话礼仪和产品介绍技巧'
    },
    {
      id: 2,
      title: '菲律宾供应商电话谈判',
      country: '🇵🇭 菲律宾',
      difficulty: '中级',
      duration: '25分钟',
      description: '与菲律宾供应商进行电话价格谈判，掌握电话谈判策略和技巧'
    },
    {
      id: 3,
      title: '泰国合作伙伴紧急沟通',
      country: '🇹🇭 泰国',
      difficulty: '高级',
      duration: '20分钟',
      description: '处理泰国合作伙伴的紧急问题，练习危机处理和跨文化沟通能力'
    },
    {
      id: 4,
      title: '新加坡客户售后服务',
      country: '🇸🇬 新加坡',
      difficulty: '中级',
      duration: '20分钟',
      description: '为新加坡客户提供电话售后服务，学习客户服务技巧和问题解决方法'
    }
  ];

  const handleStartTraining = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setDialogOpen(true);
  };

  const handleStartPhoneCall = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setPhoneDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <main className="container space-y-6 px-4 py-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">情景实战</h1>
          <p className="text-muted-foreground">
            通过AI模拟真实商务场景，提升跨文化沟通能力
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dialogue">
              <MessageSquare className="mr-2 h-4 w-4" />
              AI情景对话
            </TabsTrigger>
            <TabsTrigger value="phone">
              <Phone className="mr-2 h-4 w-4" />
              AI电话工坊
            </TabsTrigger>
            <TabsTrigger value="standard">
              <BookText className="mr-2 h-4 w-4" />
              标准化训练
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dialogue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI情景对话工坊</CardTitle>
                <CardDescription>
                  12类高频商务场景，动态分支设计，实时反馈评分
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {scenarios.map(scenario => (
                <Card key={scenario.id} className="transition-all hover:border-primary hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{scenario.title}</CardTitle>
                        <CardDescription>{scenario.country}</CardDescription>
                      </div>
                      <Badge variant="outline">{scenario.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">⏱️ {scenario.duration}</span>
                      <Button size="sm" onClick={() => handleStartTraining(scenario)}>
                        <Play className="mr-2 h-4 w-4" />
                        开始训练
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI情景电话工坊</CardTitle>
                <CardDescription>
                  模拟真实电话沟通场景，支持语音识别和AI语音回复
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {phoneScenarios.map(scenario => (
                <Card key={scenario.id} className="transition-all hover:border-primary hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{scenario.title}</CardTitle>
                        <CardDescription>{scenario.country}</CardDescription>
                      </div>
                      <Badge variant="outline">{scenario.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">⏱️ {scenario.duration}</span>
                      <Button size="sm" onClick={() => handleStartPhoneCall(scenario)}>
                        <Phone className="mr-2 h-4 w-4" />
                        开始通话
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="standard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>标准化情景模块训练</CardTitle>
                <CardDescription>
                  系统化学习商务英语标准表达和流程，循序渐进掌握核心技能
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  id: 1,
                  title: '商务礼仪基础',
                  description: '学习国际商务礼仪规范，掌握正式场合的行为准则',
                  level: '初级',
                  lessons: 5,
                  duration: '2小时'
                },
                {
                  id: 2,
                  title: '商务邮件写作',
                  description: '掌握商务邮件的标准格式、常用表达和写作技巧',
                  level: '初级',
                  lessons: 6,
                  duration: '2.5小时'
                },
                {
                  id: 3,
                  title: '会议沟通技巧',
                  description: '学习会议主持、发言、讨论和总结的专业技能',
                  level: '中级',
                  lessons: 7,
                  duration: '3小时'
                },
                {
                  id: 4,
                  title: '商务谈判策略',
                  description: '掌握谈判的基本策略、技巧和常用表达方式',
                  level: '高级',
                  lessons: 8,
                  duration: '3.5小时'
                },
                {
                  id: 5,
                  title: '跨文化沟通',
                  description: '了解东盟各国文化差异，提升跨文化沟通能力',
                  level: '中级',
                  lessons: 6,
                  duration: '2.5小时'
                },
                {
                  id: 6,
                  title: '商务演讲技巧',
                  description: '学习商务演讲的结构设计、表达技巧和互动方法',
                  level: '高级',
                  lessons: 7,
                  duration: '3小时'
                }
              ].map(course => (
                <Card key={course.id} className="transition-all hover:border-primary hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>📚 {course.lessons}课时</span>
                      <span>⏱️ {course.duration}</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedScenario({
                          id: course.id,
                          title: course.title,
                          country: '🌏 东盟通用',
                          difficulty: course.level,
                          duration: course.duration,
                          description: course.description
                        });
                        setStandardDialogOpen(true);
                      }}
                    >
                      <BookText className="mr-2 h-4 w-4" />
                      开始学习
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* AI对话对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI情景对话训练</DialogTitle>
            <DialogDescription>
              与AI进行真实商务场景对话，系统会实时评分并提供文化提示
            </DialogDescription>
          </DialogHeader>
          {selectedScenario && (
            <AIDialogueChat
              scenarioTitle={selectedScenario.title}
              scenarioCountry={selectedScenario.country}
              scenarioDifficulty={selectedScenario.difficulty}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* AI电话对话框 */}
      <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI电话工坊训练</DialogTitle>
            <DialogDescription>
              通过语音与AI进行真实电话对话，支持语音识别和AI语音回复
            </DialogDescription>
          </DialogHeader>
          {selectedScenario && (
            <AIPhoneCall
              scenarioTitle={selectedScenario.title}
              scenarioCountry={selectedScenario.country}
              scenarioDifficulty={selectedScenario.difficulty}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 标准化训练对话框 */}
      <Dialog open={standardDialogOpen} onOpenChange={setStandardDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>标准化课程学习</DialogTitle>
            <DialogDescription>
              系统化学习商务英语标准表达，完成课程测试获取证书
            </DialogDescription>
          </DialogHeader>
          {selectedScenario && (
            <StandardTraining
              courseId={selectedScenario.id.toString()}
              courseTitle={selectedScenario.title}
              courseDescription={selectedScenario.description}
              courseLevel={selectedScenario.difficulty}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
