import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Lightbulb, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  score?: number;
  feedback?: string;
}

interface AIDialogueProps {
  scenarioTitle: string;
  scenarioCountry: string;
  scenarioDifficulty: string;
  onClose?: () => void;
}

// 模拟AI回复的场景对话数据
const scenarioResponses: Record<string, string[]> = {
  '泰国酒店合作谈判': [
    'Sawasdee krap! Welcome to Thailand. I\'m Somchai from Grand Palace Hotels. Thank you for your interest in partnering with us for Chinese tour packages.',
    'That sounds like a great proposal. However, we need to ensure the package aligns with Thai cultural values. Have you considered including traditional Thai experiences?',
    'Excellent! We particularly appreciate your understanding of the "wai" greeting custom. This shows respect for our culture.',
    'Regarding pricing, we need to discuss the commission structure. What percentage are you proposing?',
    'I think we\'re making good progress. Let me consult with my team and get back to you within 3 business days. Khob khun krap!'
  ],
  '越南供应链磋商': [
    'Xin chào! I\'m Nguyen from Vietnam Textile Manufacturing. Thank you for reaching out about supply chain optimization.',
    'We\'re interested in long-term partnerships. Can you tell me more about your quality control standards?',
    'That\'s impressive. In Vietnam, we value punctuality and clear communication. How do you handle production delays?',
    'The pricing seems reasonable, but we need to discuss payment terms. What are your standard payment conditions?',
    'Great discussion! I\'ll prepare a detailed proposal and send it to you by next week. Cảm ơn!'
  ],
  '新加坡金融科技对接': [
    'Good morning! I\'m Tan Wei Ming from Singapore FinTech Solutions. Pleased to discuss cross-border digital payment integration.',
    'Singapore has strict regulatory requirements for fintech. Is your solution compliant with MAS (Monetary Authority of Singapore) regulations?',
    'Excellent. We need to ensure data security and privacy protection. What encryption standards do you use?',
    'The technology stack looks solid. Let\'s discuss the implementation timeline and technical support.',
    'I\'m impressed with your proposal. Let\'s schedule a technical deep-dive session next week. Thank you!'
  ],
  '印尼商务宴请礼仪': [
    'Selamat siang! Welcome to our business dinner. I\'m Budi from Jakarta Trading Company.',
    'Please, have a seat. In Indonesia, we usually start with light conversation before discussing business. How was your flight?',
    'I notice you\'re using your right hand for eating. That\'s very respectful of our customs. Thank you!',
    'Now, let\'s talk about the palm oil trade. What volume are you looking to purchase?',
    'This has been a productive dinner. Let\'s continue our discussion at the office tomorrow. Terima kasih!'
  ]
};

// 文化提示
const culturalTips: Record<string, string[]> = {
  '泰国酒店合作谈判': [
    '💡 文化提示：泰国人非常重视礼貌和尊重，使用"wai"手势（双手合十）是表示尊重的方式',
    '💡 文化提示：避免触摸他人头部，这在泰国文化中是不礼貌的',
    '💡 文化提示：泰国商务文化强调建立个人关系，不要急于谈判'
  ],
  '越南供应链磋商': [
    '💡 文化提示：越南商务文化重视准时和承诺，确保按时交付很重要',
    '💡 文化提示：越南人欣赏直接但礼貌的沟通方式',
    '💡 文化提示：建立长期关系比短期利益更重要'
  ],
  '新加坡金融科技对接': [
    '💡 文化提示：新加坡商务文化高效专业，准备充分的技术文档很重要',
    '💡 文化提示：新加坡是多元文化社会，尊重不同文化背景',
    '💡 文化提示：遵守严格的法规和合规要求是必须的'
  ],
  '印尼商务宴请礼仪': [
    '💡 文化提示：印尼是穆斯林国家，用餐时使用右手，左手被认为不洁',
    '💡 文化提示：商务宴请前会有社交时间，不要立即谈生意',
    '💡 文化提示：尊重宗教习俗，避免提供猪肉或酒精饮料'
  ]
};

export default function AIDialogueChat({
  scenarioTitle,
  scenarioCountry,
  scenarioDifficulty
}: AIDialogueProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 初始化对话
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'system',
      content: `欢迎来到"${scenarioTitle}"情景对话训练！\n\n在这个场景中，你将与${scenarioCountry}的商务伙伴进行对话。请注意文化差异和商务礼仪。\n\n准备好了吗？让我们开始吧！`,
      timestamp: new Date()
    };

    const firstAIMessage: Message = {
      id: '2',
      role: 'assistant',
      content: scenarioResponses[scenarioTitle]?.[0] || 'Hello! Let\'s start our business conversation.',
      timestamp: new Date()
    };

    setMessages([welcomeMessage, firstAIMessage]);
  }, [scenarioTitle, scenarioCountry]);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // 评分函数
  const scoreMessage = (userMessage: string): { score: number; feedback: string } => {
    let score = 70; // 基础分
    let feedback = '';

    // 简单的评分逻辑
    if (userMessage.length < 10) {
      score -= 20;
      feedback = '回答过于简短，建议提供更详细的信息。';
    } else if (userMessage.length > 100) {
      score += 10;
      feedback = '回答详细，表达清晰！';
    }

    // 检查礼貌用语
    const politeWords = ['please', 'thank you', 'appreciate', 'grateful', 'kindly', '请', '谢谢', '感谢'];
    if (politeWords.some(word => userMessage.toLowerCase().includes(word))) {
      score += 10;
      feedback += ' 使用了礼貌用语，很好！';
    }

    // 检查专业术语
    const businessTerms = ['partnership', 'proposal', 'agreement', 'terms', 'contract', '合作', '提案', '协议', '条款'];
    if (businessTerms.some(term => userMessage.toLowerCase().includes(term))) {
      score += 10;
      feedback += ' 使用了专业商务术语。';
    }

    return { score: Math.min(score, 100), feedback: feedback || '继续保持！' };
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    // 评分
    const { score, feedback } = scoreMessage(inputValue);
    userMessage.score = score;
    userMessage.feedback = feedback;

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setTotalScore(prev => prev + score);

    // 模拟AI思考时间
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 添加AI回复
    const nextStep = conversationStep + 1;
    const responses = scenarioResponses[scenarioTitle] || [];
    const aiResponse = responses[nextStep] || 'Thank you for your input. Let\'s continue our discussion.';

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setConversationStep(nextStep);
    setIsTyping(false);

    // 随机添加文化提示
    if (Math.random() > 0.6) {
      const tips = culturalTips[scenarioTitle] || [];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      if (randomTip) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const tipMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'system',
          content: randomTip,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, tipMessage]);
      }
    }
  };

  // 处理回车发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[600px] flex-col">
      {/* 对话头部 */}
      <CardHeader className="border-b border-border">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{scenarioTitle}</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{scenarioCountry}</span>
              <Badge variant="outline">{scenarioDifficulty}</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-secondary" />
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">总分</div>
              <div className="text-lg font-bold text-secondary">{totalScore}</div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* 对话区域 */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea ref={scrollAreaRef} className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start space-x-2',
                  message.role === 'user' && 'flex-row-reverse space-x-reverse'
                )}
              >
                {/* 头像 */}
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    message.role === 'user' && 'bg-primary',
                    message.role === 'assistant' && 'bg-secondary',
                    message.role === 'system' && 'bg-accent'
                  )}
                >
                  {message.role === 'user' && <User className="h-4 w-4 text-primary-foreground" />}
                  {message.role === 'assistant' && <Bot className="h-4 w-4 text-secondary-foreground" />}
                  {message.role === 'system' && <Lightbulb className="h-4 w-4 text-accent-foreground" />}
                </div>

                {/* 消息内容 */}
                <div
                  className={cn(
                    'flex max-w-[80%] flex-col space-y-1',
                    message.role === 'user' && 'items-end'
                  )}
                >
                  <div
                    className={cn(
                      'rounded-lg px-4 py-2',
                      message.role === 'user' && 'bg-primary text-primary-foreground',
                      message.role === 'assistant' && 'bg-muted text-foreground',
                      message.role === 'system' && 'bg-accent/50 text-accent-foreground'
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>

                  {/* 评分和反馈 */}
                  {message.score !== undefined && (
                    <div className="flex items-center space-x-2 text-xs">
                      <Badge
                        variant={message.score >= 80 ? 'default' : message.score >= 60 ? 'secondary' : 'destructive'}
                      >
                        +{message.score}分
                      </Badge>
                      <span className="text-muted-foreground">{message.feedback}</span>
                    </div>
                  )}

                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* 打字中提示 */}
            {isTyping && (
              <div className="flex items-start space-x-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Bot className="h-4 w-4 text-secondary-foreground" />
                </div>
                <div className="rounded-lg bg-muted px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* 输入区域 */}
      <div className="border-t border-border p-4">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="输入你的回复... (按Enter发送)"
            className="flex-1"
            disabled={isTyping}
          />
          <Button onClick={handleSendMessage} disabled={isTyping || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          💡 提示：注意商务礼仪和文化差异，使用专业术语和礼貌用语可以获得更高分数
        </p>
      </div>
    </div>
  );
}
