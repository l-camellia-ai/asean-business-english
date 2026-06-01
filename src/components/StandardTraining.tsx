import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, CheckCircle2, Lock, Play, FileText, Award, Clock } from 'lucide-react';
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
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      content: `
# 商务问候与介绍

## 正式场合的问候

在商务场合，第一印象至关重要。正确的问候方式能够展现你的专业素养。

**基本问候语：**
- "Good morning/afternoon, I'm [Name] from [Company]."
- "It's a pleasure to meet you."
- "How do you do?"

## 自我介绍技巧

简洁明了地介绍自己的身份和职责：
- 姓名 + 公司 + 职位
- 简要说明工作职责
- 表达合作意愿
      `,
      keyPoints: [
        '保持眼神交流，展现自信',
        '握手要坚定有力，但不要过度用力',
        '记住对方的名字并在对话中使用',
        '准备好简洁的自我介绍（30秒电梯演讲）',
        '注意东盟国家的文化差异，如泰国的"wai"礼'
      ]
    },
    '2': {
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      content: `
# 商务邮件基础

## 邮件结构

标准的商务邮件包含以下部分：
1. **主题行（Subject）：** 简洁明了，概括邮件主要内容
2. **称呼（Greeting）：** Dear Mr./Ms. [Last Name]
3. **正文（Body）：** 清晰表达目的和内容
4. **结尾（Closing）：** Best regards, Sincerely
5. **签名（Signature）：** 姓名、职位、联系方式

## 常用表达

**开头：**
- "I am writing to inquire about..."
- "Thank you for your email regarding..."
      `,
      keyPoints: [
        '主题行要具体，避免使用"Hello"或"Question"',
        '使用正式的称呼，除非对方明确表示可以使用名字',
        '段落要简短，每段只表达一个主要观点',
        '检查拼写和语法错误',
        '24小时内回复重要邮件'
      ]
    },
    '3': {
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      content: `
# 电话沟通技巧

## 接听电话

专业的电话礼仪从接听开始：
- 铃响3声内接听
- 清晰报出公司名称和自己的姓名
- 使用友好但专业的语气

**标准开场白：**
"Good morning, [Company Name], [Your Name] speaking. How may I help you?"

## 拨打电话

确认对方是否方便通话：
"Is this a good time to talk?"
      `,
      keyPoints: [
        '准备好笔和纸记录重要信息',
        '说话清晰，语速适中',
        '适应不同口音，必要时请求重复',
        '结束通话前确认下一步行动',
        '在安静的环境中进行重要通话'
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
    <div className="flex h-full flex-col bg-background">
      {/* 课程头部信息卡片 - 可滚动 */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-6">
          {/* 课程信息卡片 */}
          <Card className="border-2">
            <CardContent className="p-4">
              {/* 标题和描述 */}
              <div className="mb-3 space-y-1">
                <h2 className="text-xl font-bold">{courseTitle}</h2>
                <p className="text-xs text-muted-foreground">{courseDescription}</p>
                <Badge variant="secondary" className="text-xs">
                  {courseLevel}
                </Badge>
              </div>

              {/* 学习进度 */}
              <div className="mb-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">学习进度</span>
                  <span className="font-bold text-primary">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              {/* 课程统计 */}
              <div className="grid grid-cols-3 gap-3 border-t pt-3">
                <div className="text-center">
                  <div className="mb-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="h-3 w-3" />
                    <span>课时</span>
                  </div>
                  <div className="text-base font-bold text-primary">{lessons.length}课</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>时长</span>
                  </div>
                  <div className="text-base font-bold text-primary">2小时</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span>测试</span>
                  </div>
                  <div className="text-base font-bold text-primary">{quizzes.length}题</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab导航和内容 */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            {/* Tab列表 */}
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview" className="text-xs">
                <BookOpen className="mr-1.5 h-3 w-3" />
                课程概览
              </TabsTrigger>
              <TabsTrigger value="lessons" className="text-xs">
                <Play className="mr-1.5 h-3 w-3" />
                课程内容
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-xs">
                <FileText className="mr-1.5 h-3 w-3" />
                课程测试
              </TabsTrigger>
            </TabsList>

            {/* 课程概览 */}
            <TabsContent value="overview" className="m-0 space-y-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">课程介绍</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs leading-relaxed text-muted-foreground">{courseDescription}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">课程列表</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    {lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={cn(
                          'flex items-start gap-2 rounded-lg border p-3 transition-colors',
                          !lesson.locked && 'hover:border-primary hover:bg-accent/50',
                          lesson.locked && 'opacity-60'
                        )}
                      >
                        <div className="flex-shrink-0 pt-0.5">
                          {lesson.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : lesson.locked ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary text-[10px] font-bold text-primary">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="text-sm font-medium">{lesson.title}</div>
                          <div className="text-xs text-muted-foreground">{lesson.description}</div>
                        </div>
                        <div className="flex-shrink-0 text-xs text-muted-foreground">{lesson.duration}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 课程内容 */}
            <TabsContent value="lessons" className="m-0 space-y-4">
              {/* 课程选择器 */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {lessons.map((lesson, index) => (
                  <Button
                    key={lesson.id}
                    variant={currentLesson === index ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentLesson(index)}
                    disabled={lesson.locked}
                    className="shrink-0 text-xs"
                  >
                    {lesson.locked && <Lock className="mr-1.5 h-3 w-3" />}
                    第{index + 1}课
                  </Button>
                ))}
              </div>

              {/* 课程内容区域 */}
              <div className="space-y-4">
                {/* 课程标题 */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold">{lessons[currentLesson].title}</h3>
                  <p className="text-xs text-muted-foreground">{lessons[currentLesson].description}</p>
                </div>

                {lessonContent[lessons[currentLesson].id] ? (
                  <>
                    {/* 课程配图 */}
                    <Card className="overflow-hidden">
                      <img
                        src={lessonContent[lessons[currentLesson].id].image}
                        alt={lessons[currentLesson].title}
                        className="h-48 w-full object-cover"
                      />
                    </Card>

                    {/* 课程正文 */}
                    <Card>
                      <CardContent className="prose prose-sm max-w-none p-4 text-xs dark:prose-invert">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: lessonContent[lessons[currentLesson].id].content
                              .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold mt-4 mb-2">$1</h1>')
                              .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold mt-3 mb-2">$1</h2>')
                              .replace(/^\*\*(.+?)\*\*$/gm, '<p class="font-bold mt-1">$1</p>')
                              .replace(/^- (.+)$/gm, '<li class="ml-3 text-xs">$1</li>'),
                          }}
                        />
                      </CardContent>
                    </Card>

                    {/* 本课要点 */}
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <span>📌</span>
                          <span>本课要点</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <ul className="space-y-2">
                          {lessonContent[lessons[currentLesson].id].keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                              <span className="text-xs leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-xs text-muted-foreground">课程内容开发中...</p>
                    </CardContent>
                  </Card>
                )}

                {/* 课程导航 */}
                <div className="flex items-center justify-between border-t pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                    disabled={currentLesson === 0}
                    className="text-xs"
                  >
                    上一课
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (currentLesson < lessons.length - 1) {
                        setCurrentLesson(currentLesson + 1);
                      } else {
                        setSelectedTab('quiz');
                      }
                    }}
                    disabled={lessons[currentLesson].locked}
                    className="text-xs"
                  >
                    {currentLesson < lessons.length - 1 ? '下一课' : '开始测试'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* 课程测试 */}
            <TabsContent value="quiz" className="m-0 space-y-4">
              {!quizSubmitted ? (
                <>
                  {/* 测试说明 */}
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">课程测试</CardTitle>
                      <CardDescription className="text-xs">
                        完成以下 {quizzes.length} 道题目，测试你的学习成果。需要答对{' '}
                        {Math.ceil(quizzes.length * 0.6)} 题以上才能通过。
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  {/* 测试题目 */}
                  {quizzes.map((quiz, index) => (
                    <Card key={quiz.id}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold">
                          {index + 1}. {quiz.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2">
                          {quiz.options.map((option, optionIndex) => (
                            <button
                              key={optionIndex}
                              onClick={() => setQuizAnswers({ ...quizAnswers, [quiz.id]: optionIndex })}
                              className={cn(
                                'w-full rounded-lg border p-3 text-left text-xs transition-all hover:border-primary hover:bg-accent/50',
                                quizAnswers[quiz.id] === optionIndex && 'border-primary bg-primary/10'
                              )}
                            >
                              <div className="flex items-start gap-2">
                                <div
                                  className={cn(
                                    'mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2',
                                    quizAnswers[quiz.id] === optionIndex
                                      ? 'border-primary bg-primary'
                                      : 'border-muted-foreground'
                                  )}
                                >
                                  {quizAnswers[quiz.id] === optionIndex && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                                  )}
                                </div>
                                <span className="flex-1 leading-relaxed">{option}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* 提交按钮 */}
                  <Button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < quizzes.length}
                    className="w-full text-xs"
                    size="sm"
                  >
                    提交答案
                  </Button>
                </>
              ) : (
                <>
                  {/* 测试结果 */}
                  <Card
                    className={cn(
                      'border-2',
                      score >= 60
                        ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : 'border-red-500 bg-red-50 dark:bg-red-950'
                    )}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <CardTitle className="text-lg">
                            {score >= 60 ? '🎉 恭喜通过！' : '😔 未通过测试'}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {score >= 60 ? '你已经掌握了本课程的核心内容' : '建议重新学习课程内容后再次测试'}
                          </CardDescription>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">{score}</div>
                          <div className="text-xs text-muted-foreground">分</div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* 答案解析 */}
                  {quizzes.map((quiz, index) => (
                    <Card key={quiz.id}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold">
                          {index + 1}. {quiz.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2">
                          {quiz.options.map((option, optionIndex) => {
                            const isCorrect = optionIndex === quiz.correctAnswer;
                            const isSelected = quizAnswers[quiz.id] === optionIndex;
                            const showResult = isCorrect || isSelected;

                            return (
                              <div
                                key={optionIndex}
                                className={cn(
                                  'rounded-lg border p-3 text-xs',
                                  isCorrect && 'border-green-500 bg-green-50 dark:bg-green-950',
                                  isSelected && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-950',
                                  !showResult && 'opacity-50'
                                )}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="flex-1 leading-relaxed">{option}</span>
                                  <div className="flex-shrink-0">
                                    {isCorrect && (
                                      <Badge variant="default" className="text-[10px]">
                                        正确答案
                                      </Badge>
                                    )}
                                    {isSelected && !isCorrect && (
                                      <Badge variant="destructive" className="text-[10px]">
                                        你的答案
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* 操作按钮 */}
                  <div className="flex gap-3">
                    <Button onClick={handleQuizReset} variant="outline" className="flex-1 text-xs" size="sm">
                      重新测试
                    </Button>
                    {score >= 60 && (
                      <Button className="flex-1 text-xs" size="sm">
                        <Award className="mr-1.5 h-3 w-3" />
                        获取证书
                      </Button>
                    )}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
