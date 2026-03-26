import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, CheckCircle2, Lock, Play, FileText, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  locked: boolean;
}

interface LessonContent {
  image: string;
  content: string;
  keyPoints: string[];
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface StandardTrainingProps {
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  courseLevel: string;
  onComplete?: () => void;
}

export default function StandardTraining({
  courseId,
  courseTitle,
  courseDescription,
  courseLevel
}: StandardTrainingProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [currentLesson, setCurrentLesson] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // 模拟课程内容
  const lessons: Lesson[] = [
    {
      id: '1',
      title: '第一课：商务问候与介绍',
      description: '学习正式的商务场合问候语和自我介绍技巧',
      duration: '15分钟',
      completed: false,
      locked: false
    },
    {
      id: '2',
      title: '第二课：商务邮件基础',
      description: '掌握商务邮件的标准格式和常用表达',
      duration: '20分钟',
      completed: false,
      locked: false
    },
    {
      id: '3',
      title: '第三课：电话沟通技巧',
      description: '学习专业的电话沟通礼仪和表达方式',
      duration: '18分钟',
      completed: false,
      locked: false
    },
    {
      id: '4',
      title: '第四课：会议参与技巧',
      description: '掌握会议中的发言、提问和讨论技巧',
      duration: '25分钟',
      completed: false,
      locked: true
    },
    {
      id: '5',
      title: '第五课：商务谈判基础',
      description: '学习谈判的基本策略和常用表达',
      duration: '30分钟',
      completed: false,
      locked: true
    }
  ];

  // 课程内容
  const lessonContent: Record<string, LessonContent> = {
    '1': {
      image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_df9a9237-60ea-42ac-8a69-76c7a090843f.jpg',
      content: `
# 商务问候与介绍

## 正式问候语

在商务场合，第一印象非常重要。以下是常用的正式问候语：

**初次见面：**
- "Good morning/afternoon, I'm [Name] from [Company]."
- "It's a pleasure to meet you."
- "How do you do? I'm [Name]."

**再次见面：**
- "Good to see you again."
- "Nice to meet you again, [Name]."

## 自定义练习
请尝试大声朗读以上表达，注意语气的专业性。
      `,
      keyPoints: [
        '使用正式的问候语建立专业形象',
        '自我介绍要简洁明了，包含关键信息',
        '注意不同国家的文化差异和礼仪',
        '交换名片时要双手递交，表示尊重',
        '保持眼神交流和自信的肢体语言'
      ]
    },
    '2': {
      image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d3ad6506-b972-4e34-8bdc-315eda5e00c1.jpg',
      content: `
# 商务邮件基础

## 邮件结构

一封标准的商务邮件应包含：

1. **主题行（Subject Line）**
   - 简洁明了，概括邮件主要内容
   - 示例："Meeting Request: Q4 Marketing Strategy Discussion"

2. **称呼（Greeting）**
   - 正式：Dear Mr./Ms. [Last Name]
   - 半正式：Dear [First Name]
   - 不确定：Dear Sir/Madam

3. **正文（Body）**
   - 开场：说明写信目的
   - 主体：详细说明内容
   - 结尾：明确下一步行动

4. **结束语（Closing）**
   - 正式：Yours sincerely / Best regards
   - 半正式：Kind regards / Warm regards

5. **签名（Signature）**
   - 姓名、职位、公司、联系方式

## 核心表达
- "I'm writing to follow up on..."
- "Please find attached the report..."
- "Thank you for your prompt attention."
      `,
      keyPoints: [
        '主题行要清晰具体，便于收件人识别',
        '使用适当的称呼和结束语保持专业',
        '正文结构清晰，分段明确',
        '检查语法和拼写错误',
        '附件要在正文中提及',
        '24-48小时内回复邮件是基本礼仪'
      ]
    },
    '3': {
      image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b64b6b05-b06b-4c27-9161-105c88f14037.jpg',
      content: `
# 电话沟通技巧

## 接听电话

**标准开场：**
"Good morning/afternoon, [Company Name], [Your Name] speaking. How may I help you?"

**确认对方身份：**
- "May I ask who's calling, please?"
- "Could I have your name and company, please?"

## 拨打电话

**自我介绍：**
"Hello, this is [Name] from [Company]. May I speak to [Person's Name], please?"

**说明来电目的：**
"I'm calling regarding..."
"I'd like to discuss..."
      `,
      keyPoints: [
        '接听电话要及时，不超过三声铃响',
        '说话清晰，语速适中',
        '保持专业和礼貌的语气',
        '记录重要信息（姓名、电话、事项）',
        '适应不同口音，必要时请求重复',
        '结束通话前确认下一步行动'
      ]
    },
    '4': {
      image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_7fc86bf3-7458-4e0f-8eb1-504d1cf86955.jpg',
      content: `
# 会议参与技巧

## 准备阶段

参加商务会议前，应充分准备：
- 仔细阅读会议议程（Agenda）
- 准备好相关的报告或数据
- 明确自己在会议中的角色

## 会议发言表达

**提出建议：**
- "I suggest that we..."
- "I would like to propose..."
- "In my opinion, we should..."
      `,
      keyPoints: [
        '会议发言要言简意赅，逻辑清晰',
        '尊重他人的发言，不要轻易打断',
        '使用委婉的语气表达不同意见',
        '确保在会议结束前明确下一步行动',
        '注意东盟国家的会议等级和共识文化'
      ]
    },
    '5': {
      image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_39770506-aac4-4e50-adad-4daca116a883.jpg',
      content: `
# 商务谈判基础

## 谈判阶段

典型的商务谈判包含以下阶段：
1. **开场（Opening）：** 建立关系，设定议程
2. **摸底（Exploration）：** 了解对方需求和底线
3. **出价（Bargaining）：** 提出方案，讨价还价
4. **结案（Closing）：** 达成协议，确认条款
      `,
      keyPoints: [
        '谈判目标要清晰，底线要明确',
        '善于倾听对方的需求，寻找双赢方案',
        '注意保护各方的"面子"，建立和谐氛围',
        '记录谈判过程中的所有共识和细节',
        '保持耐心，理解东盟国家慢节奏的信任建立过程'
      ]
    }
  };

  // 测试题
  const quizzes: Quiz[] = [
    {
      id: 'q1',
      question: '在商务场合初次见面时，以下哪个问候语最正式？',
      options: [
        'Hi, I\'m John.',
        'Good morning, I\'m John Smith from ABC Company.',
        'Hey, nice to meet you!',
        'What\'s up?'
      ],
      correctAnswer: 1
    },
    {
      id: 'q2',
      question: '商务邮件的主题行应该：',
      options: [
        '尽可能详细，包含所有信息',
        '简短神秘，引起好奇心',
        '简洁明了，概括主要内容',
        '使用全大写字母以引起注意'
      ],
      correctAnswer: 2
    },
    {
      id: 'q3',
      question: '在泰国商务场合，表示尊重的正确方式是：',
      options: [
        '用力握手',
        '拍对方肩膀',
        '使用"wai"手势（双手合十）',
        '拥抱对方'
      ],
      correctAnswer: 2
    },
    {
      id: 'q4',
      question: '接听商务电话时，应该在铃响几声内接听？',
      options: [
        '1声',
        '3声以内',
        '5声以内',
        '随时都可以'
      ],
      correctAnswer: 1
    },
    {
      id: 'q5',
      question: '在印尼商务场合，应该避免：',
      options: [
        '用右手握手',
        '用左手递交物品',
        '交换名片',
        '微笑'
      ],
      correctAnswer: 1
    },
    {
      id: 'q6',
      question: '在菲律宾参加商务会议时，最重要的沟通原则是：',
      options: [
        '直接表达不同意见',
        '寻求共识（Consensus），避免公开对立',
        '必须由职位最高的人全程发言',
        '会议必须在15分钟内结束'
      ],
      correctAnswer: 1
    },
    {
      id: 'q7',
      question: '在商务谈判中，如果有条件的退让，以下哪个表达最合适？',
      options: [
        'I want a lower price.',
        'We would be willing to accept that, provided that you can reduce the delivery time.',
        'No, we can\'t accept your price.',
        'Give me a discount please.'
      ],
      correctAnswer: 1
    }
  ];

  // 计算进度
  const completedLessons = lessons.filter(l => l.completed).length;
  const progress = (completedLessons / lessons.length) * 100;

  // 处理测试提交
  const handleQuizSubmit = () => {
    let correctCount = 0;
    quizzes.forEach(quiz => {
      if (quizAnswers[quiz.id] === quiz.correctAnswer) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / quizzes.length) * 100);
    setScore(finalScore);
    setQuizSubmitted(true);
  };

  // 重置测试
  const handleQuizReset = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setScore(0);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 课程头部 */}
      <div className="flex-shrink-0 border-b border-border px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1 space-y-2">
            <h3 className="break-words text-lg font-semibold md:text-xl">{courseTitle}</h3>
            <p className="break-words text-sm text-muted-foreground">{courseDescription}</p>
            <Badge variant="outline">{courseLevel}</Badge>
          </div>
          <div className="text-left md:text-right">
            <div className="text-sm font-medium text-muted-foreground">学习进度</div>
            <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
          </div>
        </div>
        <Progress value={progress} className="mt-4" />
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex h-full flex-col">
          <TabsList className="w-full flex-shrink-0 justify-start overflow-x-auto rounded-none border-b px-6">
            <TabsTrigger value="overview" className="flex-shrink-0">
              <BookOpen className="mr-2 h-4 w-4" />
              课程概览
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex-shrink-0">
              <Play className="mr-2 h-4 w-4" />
              课程内容
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex-shrink-0">
              <FileText className="mr-2 h-4 w-4" />
              课程测试
            </TabsTrigger>
          </TabsList>

          {/* 课程概览 */}
          <TabsContent value="overview" className="m-0 flex-1 overflow-hidden px-6 py-4">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>课程介绍</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="break-words text-sm text-muted-foreground">{courseDescription}</p>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">课程级别</div>
                        <div className="text-2xl font-bold text-primary">{courseLevel}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">课程数量</div>
                        <div className="text-2xl font-bold text-primary">{lessons.length}课</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">预计时长</div>
                        <div className="text-2xl font-bold text-primary">2小时</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>课程列表</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className={cn(
                            'flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between',
                            lesson.locked && 'opacity-50'
                          )}
                        >
                          <div className="flex items-start space-x-3">
                            {lesson.completed ? (
                              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                            ) : lesson.locked ? (
                              <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                            ) : (
                              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary text-xs font-bold text-primary">
                                {index + 1}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="break-words font-medium">{lesson.title}</div>
                              <div className="break-words text-sm text-muted-foreground">{lesson.description}</div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-sm text-muted-foreground">{lesson.duration}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* 课程内容 */}
          <TabsContent value="lessons" className="m-0 flex flex-1 flex-col overflow-hidden px-6 py-4">
            <div className="flex h-full flex-col space-y-4">
              {/* 课程选择器 */}
              <div className="flex flex-shrink-0 items-center space-x-2 overflow-x-auto pb-2">
                {lessons.map((lesson, index) => (
                  <Button
                    key={lesson.id}
                    variant={currentLesson === index ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentLesson(index)}
                    disabled={lesson.locked}
                    className="shrink-0"
                  >
                    {lesson.locked ? <Lock className="mr-2 h-4 w-4" /> : null}
                    第{index + 1}课
                  </Button>
                ))}
              </div>

              {/* 课程内容 */}
              <ScrollArea className="flex-1 pr-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="mb-4">
                    <h2 className="break-words text-xl font-bold">{lessons[currentLesson].title}</h2>
                    <p className="break-words text-muted-foreground">{lessons[currentLesson].description}</p>
                  </div>

                  {lessonContent[lessons[currentLesson].id] ? (
                    <>
                      {/* 课程配图 */}
                      <div className="mb-6 overflow-hidden rounded-lg border bg-muted shadow-sm">
                        <img
                          src={lessonContent[lessons[currentLesson].id].image}
                          alt={lessons[currentLesson].title}
                          className="h-48 w-full object-cover md:h-64"
                        />
                      </div>

                      <div
                        className="break-words whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: lessonContent[lessons[currentLesson].id].content
                            .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
                            .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-3">$1</h2>')
                            .replace(/^\*\*(.+?)\*\*$/gm, '<p class="font-bold mt-2">$1</p>')
                            .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>'),
                        }}
                      />

                      <Card className="mt-6">
                        <CardHeader>
                          <CardTitle className="text-lg">📌 本课要点</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {lessonContent[lessons[currentLesson].id].keyPoints.map((point, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span className="break-words text-sm">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <p className="text-muted-foreground">课程内容开发中...</p>
                  )}
                </div>
              </ScrollArea>

              {/* 课程导航 */}
              <div className="flex flex-shrink-0 items-center justify-between border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                  disabled={currentLesson === 0}
                >
                  上一课
                </Button>
                <Button
                  onClick={() => {
                    if (currentLesson < lessons.length - 1) {
                      setCurrentLesson(currentLesson + 1);
                    } else {
                      setSelectedTab('quiz');
                    }
                  }}
                  disabled={lessons[currentLesson].locked}
                >
                  {currentLesson < lessons.length - 1 ? '下一课' : '开始测试'}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* 课程测试 */}
          <TabsContent value="quiz" className="m-0 flex-1 overflow-hidden px-6 py-4">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6 pb-4">
                {!quizSubmitted ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>课程测试</CardTitle>
                        <CardDescription className="break-words">
                          完成以下{quizzes.length}道题目，测试你的学习成果。需要答对{Math.ceil(quizzes.length * 0.6)}
                          题以上才能通过。
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    {quizzes.map((quiz, index) => (
                      <Card key={quiz.id}>
                        <CardHeader>
                          <CardTitle className="break-words text-base">
                            {index + 1}. {quiz.question}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {quiz.options.map((option, optionIndex) => (
                              <button
                                key={optionIndex}
                                onClick={() => setQuizAnswers({ ...quizAnswers, [quiz.id]: optionIndex })}
                                className={cn(
                                  'w-full rounded-lg border p-3 text-left transition-all hover:border-primary',
                                  quizAnswers[quiz.id] === optionIndex && 'border-primary bg-primary/10'
                                )}
                              >
                                <div className="flex items-start space-x-2">
                                  <div
                                    className={cn(
                                      'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2',
                                      quizAnswers[quiz.id] === optionIndex
                                        ? 'border-primary bg-primary'
                                        : 'border-muted-foreground'
                                    )}
                                  >
                                    {quizAnswers[quiz.id] === optionIndex && (
                                      <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                                    )}
                                  </div>
                                  <span className="break-words text-sm">{option}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < quizzes.length}
                      className="w-full"
                      size="lg"
                    >
                      提交答案
                    </Button>
                  </>
                ) : (
                  <>
                    <Card
                      className={cn(
                        'border-2',
                        score >= 60
                          ? 'border-green-500 bg-green-50 dark:bg-green-950'
                          : 'border-red-500 bg-red-50 dark:bg-red-950'
                      )}
                    >
                      <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl sm:text-2xl">
                              {score >= 60 ? '🎉 恭喜通过！' : '😔 未通过测试'}
                            </CardTitle>
                            <CardDescription className="break-words">
                              {score >= 60 ? '你已经掌握了本课程的核心内容' : '建议重新学习课程内容后再次测试'}
                            </CardDescription>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold text-primary">{score}</div>
                            <div className="text-sm text-muted-foreground">分</div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    {quizzes.map((quiz, index) => (
                      <Card key={quiz.id}>
                        <CardHeader>
                          <CardTitle className="break-words text-base">
                            {index + 1}. {quiz.question}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {quiz.options.map((option, optionIndex) => {
                              const isCorrect = optionIndex === quiz.correctAnswer;
                              const isSelected = quizAnswers[quiz.id] === optionIndex;
                              const showResult = isCorrect || isSelected;

                              return (
                                <div
                                  key={optionIndex}
                                  className={cn(
                                    'rounded-lg border p-3',
                                    isCorrect && 'border-green-500 bg-green-50 dark:bg-green-950',
                                    isSelected && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-950',
                                    !showResult && 'opacity-50'
                                  )}
                                >
                                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <span className="break-words text-sm">{option}</span>
                                    <div className="flex-shrink-0">
                                      {isCorrect && <Badge variant="default">正确答案</Badge>}
                                      {isSelected && !isCorrect && <Badge variant="destructive">你的答案</Badge>}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <div className="flex flex-col gap-2 sm:flex-row sm:space-x-4">
                      <Button onClick={handleQuizReset} variant="outline" className="flex-1">
                        重新测试
                      </Button>
                      {score >= 60 && (
                        <Button className="flex-1">
                          <Award className="mr-2 h-4 w-4" />
                          获取证书
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
