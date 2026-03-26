import { useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Users, Trophy, MessageCircle, Share2, ThumbsUp, Award, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    level: string;
  };
  content: string;
  achievement?: {
    title: string;
    icon: string;
    description: string;
  };
  likes: number;
  comments: number;
  timestamp: Date;
}

interface LeaderboardEntry {
  rank: number;
  user: {
    name: string;
    avatar: string;
    country: string;
  };
  score: number;
  achievements: number;
}

interface Question {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  title: string;
  content: string;
  tags: string[];
  answers: number;
  views: number;
  timestamp: Date;
}

export default function CommunityPage() {
  const [selectedTab, setSelectedTab] = useState('showcase');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);

  // 成长展示墙数据
  const posts: Post[] = [
    {
      id: '1',
      user: {
        name: '张明',
        avatar: '',
        level: '商务达人'
      },
      content: '今天完成了泰国商务礼仪课程，学到了很多实用的知识！特别是"wai"手势的使用场景，对即将到来的曼谷出差很有帮助。',
      achievement: {
        title: '泰国礼仪大师',
        icon: '🇹🇭',
        description: '完成泰国商务礼仪全部课程'
      },
      likes: 24,
      comments: 5,
      timestamp: new Date('2024-01-15T10:30:00')
    },
    {
      id: '2',
      user: {
        name: '李华',
        avatar: '',
        level: '文化探索者'
      },
      content: '刚刚通过了越南供应链磋商的AI对话训练，得分92分！感觉自己的谈判技巧有了很大提升。',
      achievement: {
        title: '越南商务新星',
        icon: '🇻🇳',
        description: '越南场景对话得分90+'
      },
      likes: 18,
      comments: 3,
      timestamp: new Date('2024-01-15T09:15:00')
    },
    {
      id: '3',
      user: {
        name: '王芳',
        avatar: '',
        level: '跨文化沟通专家'
      },
      content: '连续签到30天达成！坚持每天学习商务英语，现在已经可以流利地进行电话会议了。',
      achievement: {
        title: '学习坚持者',
        icon: '📅',
        description: '连续签到30天'
      },
      likes: 35,
      comments: 8,
      timestamp: new Date('2024-01-14T20:45:00')
    },
    {
      id: '4',
      user: {
        name: '陈强',
        avatar: '',
        level: '商务达人'
      },
      content: '完成了新加坡金融科技对接的标准化训练，测试满分通过！这个课程的内容非常实用，推荐给大家。',
      achievement: {
        title: '金融科技专家',
        icon: '💰',
        description: '完成金融科技课程并满分通过测试'
      },
      likes: 28,
      comments: 6,
      timestamp: new Date('2024-01-14T16:20:00')
    }
  ];

  // 排行榜数据
  const leaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      user: { name: '张明', avatar: '', country: '🇹🇭 泰国' },
      score: 8520,
      achievements: 15
    },
    {
      rank: 2,
      user: { name: '李华', avatar: '', country: '🇻🇳 越南' },
      score: 7890,
      achievements: 12
    },
    {
      rank: 3,
      user: { name: '王芳', avatar: '', country: '🇸🇬 新加坡' },
      score: 7350,
      achievements: 14
    },
    {
      rank: 4,
      user: { name: '陈强', avatar: '', country: '🇮🇩 印尼' },
      score: 6920,
      achievements: 11
    },
    {
      rank: 5,
      user: { name: '刘洋', avatar: '', country: '🇲🇾 马来西亚' },
      score: 6540,
      achievements: 10
    }
  ];

  // 专家问答数据
  const questions: Question[] = [
    {
      id: '1',
      user: { name: '小明', avatar: '' },
      title: '在泰国商务宴请时应该注意哪些礼仪？',
      content: '下周要去曼谷参加一个商务晚宴，想了解一下泰国的餐桌礼仪和需要注意的文化禁忌。',
      tags: ['泰国', '商务礼仪', '文化'],
      answers: 3,
      views: 156,
      timestamp: new Date('2024-01-15T11:00:00')
    },
    {
      id: '2',
      user: { name: '小红', avatar: '' },
      title: '越南供应商谈判时如何把握价格底线？',
      content: '正在和越南的纺织厂谈合作，对方报价比预期高，想请教一下谈判策略。',
      tags: ['越南', '谈判', '供应链'],
      answers: 5,
      views: 234,
      timestamp: new Date('2024-01-15T09:30:00')
    },
    {
      id: '3',
      user: { name: '小李', avatar: '' },
      title: '新加坡金融科技公司的合规要求有哪些？',
      content: '计划和新加坡的fintech公司合作，需要了解MAS的监管要求。',
      tags: ['新加坡', '金融科技', '合规'],
      answers: 2,
      views: 189,
      timestamp: new Date('2024-01-14T15:20:00')
    }
  ];

  // 点赞
  const handleLike = (postId: string) => {
    toast.success('点赞成功');
  };

  // 分享成就
  const handleShare = () => {
    toast.success('成就卡片已生成，可以分享到社交媒体');
    setShareDialogOpen(false);
  };

  // 提交问题
  const handleSubmitQuestion = () => {
    toast.success('问题已提交，专家会尽快回复');
    setQuestionDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <main className="container space-y-6 px-4 py-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">学习社区</h1>
          <p className="text-muted-foreground">
            分享学习成就，交流学习心得，共同进步
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="showcase">
              <Users className="mr-2 h-4 w-4" />
              成长展示墙
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Trophy className="mr-2 h-4 w-4" />
              排行榜
            </TabsTrigger>
            <TabsTrigger value="qa">
              <MessageCircle className="mr-2 h-4 w-4" />
              专家问答
            </TabsTrigger>
          </TabsList>

          {/* 成长展示墙 */}
          <TabsContent value="showcase" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Share2 className="mr-2 h-4 w-4" />
                    分享成就
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>分享你的学习成就</DialogTitle>
                    <DialogDescription>
                      选择一个成就生成精美的分享卡片
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      {[
                        { title: '泰国礼仪大师', icon: '🇹🇭' },
                        { title: '越南商务新星', icon: '🇻🇳' },
                        { title: '学习坚持者', icon: '📅' }
                      ].map((achievement, index) => (
                        <Card key={index} className="cursor-pointer transition-all hover:border-primary">
                          <CardContent className="flex items-center space-x-3 p-4">
                            <div className="text-3xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium">{achievement.title}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Button onClick={handleShare} className="w-full">
                      生成分享卡片
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {posts.map(post => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarImage src={post.user.avatar} />
                          <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{post.user.name}</span>
                            <Badge variant="secondary">{post.user.level}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {post.timestamp.toLocaleString('zh-CN')}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{post.content}</p>
                      
                      {post.achievement && (
                        <Card className="border-2 border-primary/20 bg-primary/5">
                          <CardContent className="flex items-center space-x-3 p-4">
                            <div className="text-4xl">{post.achievement.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <Award className="h-4 w-4 text-primary" />
                                <span className="font-medium">{post.achievement.title}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {post.achievement.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <div className="flex items-center space-x-4 border-t pt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                        >
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          分享
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* 排行榜 */}
          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>本周学习排行榜</CardTitle>
                <CardDescription>
                  根据学习时长、完成课程和获得成就综合排名
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map(entry => (
                    <div
                      key={entry.rank}
                      className="flex items-center space-x-4 rounded-lg border p-4 transition-all hover:border-primary"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                          entry.rank === 1
                            ? 'bg-yellow-500 text-white'
                            : entry.rank === 2
                            ? 'bg-gray-400 text-white'
                            : entry.rank === 3
                            ? 'bg-orange-600 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {entry.rank}
                      </div>
                      <Avatar>
                        <AvatarImage src={entry.user.avatar} />
                        <AvatarFallback>{entry.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{entry.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.user.country}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {entry.score.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.achievements} 个成就
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 专家问答 */}
          <TabsContent value="qa" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    提问
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>向专家提问</DialogTitle>
                    <DialogDescription>
                      描述你的问题，专家会尽快为你解答
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">问题标题</label>
                      <Input placeholder="简要描述你的问题" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">详细描述</label>
                      <Textarea
                        placeholder="详细描述你遇到的问题或想了解的内容"
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">标签</label>
                      <Input placeholder="添加相关标签，用逗号分隔" className="mt-1" />
                    </div>
                    <Button onClick={handleSubmitQuestion} className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      提交问题
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {questions.map(question => (
                  <Card key={question.id} className="cursor-pointer transition-all hover:border-primary">
                    <CardHeader>
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarImage src={question.user.avatar} />
                          <AvatarFallback>{question.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-base">{question.title}</CardTitle>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {question.content}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {question.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{question.answers} 个回答</span>
                        <span>·</span>
                        <span>{question.views} 次浏览</span>
                        <span>·</span>
                        <span>{question.timestamp.toLocaleString('zh-CN')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
