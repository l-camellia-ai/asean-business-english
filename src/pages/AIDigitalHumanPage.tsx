import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/common/Header';
import { AIDigitalHuman, COUNTRIES, type CountryCode } from '@/components/AIDigitalHuman';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Mic, 
  MicOff, 
  ArrowLeft, 
  Sparkles,
  MessageCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// 模拟AI回复
const MOCK_RESPONSES: Record<CountryCode, string[]> = {
  VN: [
    'Xin chào! Welcome to Vietnam business training. I\'m here to help you practice business English with Vietnamese accent.',
    'In Vietnam, business relationships are built on trust. It\'s common to have informal meetings before official negotiations.',
    'When greeting Vietnamese business partners, a slight bow with a handshake shows respect.',
    'Vietnamese business culture values patience. Rushing negotiations may be seen as disrespectful.',
    'Would you like to practice a scenario about importing textiles from Vietnam?'
  ],
  SG: [
    'Hello! Welcome to Singapore business training. Singapore is known for its efficient and direct business culture.',
    'In Singapore, punctuality is crucial. Being late to meetings is considered unprofessional.',
    'Singaporean business communication is typically direct but polite. We value clarity and precision.',
    'When exchanging business cards in Singapore, use both hands and take a moment to read the card carefully.',
    'Shall we practice negotiating a tech partnership agreement?'
  ],
  MY: [
    'Selamat datang! Welcome to Malaysia business training. Malaysia has a diverse and multicultural business environment.',
    'In Malaysian business culture, building personal relationships is important before discussing business matters.',
    'When meeting Malaysian partners, a gentle handshake is appropriate. Some Muslim colleagues may prefer not to shake hands with the opposite gender.',
    'Business in Malaysia often involves longer decision-making processes due to consensus-building practices.',
    'Would you like to practice a palm oil trade negotiation scenario?'
  ],
  ID: [
    'Selamat datang! Welcome to Indonesia business training. Indonesia values relationship-building in business.',
    'In Indonesian culture, it\'s important to show respect to senior members in business meetings.',
    'Business negotiations in Indonesia may take time as decisions are often made collectively.',
    'When addressing Indonesian business partners, use proper titles like "Bapak" (Mr.) or "Ibu" (Mrs./Ms.).',
    'Let\'s practice a scenario about importing Indonesian coffee beans!'
  ],
  PH: [
    'Mabuhay! Welcome to Philippines business training. Filipino business culture is relationship-oriented and friendly.',
    'In the Philippines, personal connections and trust are essential for successful business relationships.',
    'Filipino business communication tends to be indirect to maintain harmony. Reading between the lines is important.',
    'Meetings in the Philippines often start with casual conversation before getting down to business.',
    'Would you like to practice a customer service scenario with a Filipino accent?'
  ]
};

export default function AIDigitalHumanPage() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('VN');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentCountry = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0];

  // 初始欢迎消息
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `你好！我是来自${currentCountry.name}的商务英语AI助手。我可以帮助你练习${currentCountry.accent}的商务英语对话。我们可以一起练习商务谈判、邮件写作、电话沟通等各种场景。请问你想练习什么内容？`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [selectedCountry]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 模拟AI回复
  const simulateAIResponse = async () => {
    setIsLoading(true);
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = MOCK_RESPONSES[selectedCountry];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: randomResponse,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
    
    // 模拟数字人说话动画
    if (!isMuted) {
      setIsSpeaking(true);
      // 根据消息长度估算说话时间
      const speakDuration = Math.max(2000, randomResponse.length * 50);
      setTimeout(() => setIsSpeaking(false), speakDuration);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // 触发AI回复
    await simulateAIResponse();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCountryChange = (code: CountryCode) => {
    setSelectedCountry(code);
    // 清空消息，显示新国家的欢迎语
    const newCountry = COUNTRIES.find(c => c.code === code);
    if (newCountry) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `你好！我是来自${newCountry.name}的商务英语AI助手。我可以帮助你练习${newCountry.accent}的商务英语对话。请问你想练习什么内容？`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
    toast.success(`已切换到${newCountry?.name}数字人`);
  };

  const handleClearChat = () => {
    setMessages([]);
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `对话已清空。我是来自${currentCountry.name}的商务英语AI助手。请问你想练习什么内容？`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.info('语音输入已停止');
    } else {
      setIsRecording(true);
      toast.info('请开始说话...', { duration: 3000 });
      // 模拟语音识别
      setTimeout(() => {
        if (isRecording) {
          setInputMessage('你好，我想练习商务谈判场景');
          setIsRecording(false);
          toast.success('语音识别完成');
        }
      }, 3000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavigationBar />

      <main className="flex-1 overflow-hidden">
        <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row">
          {/* 左侧：数字人展示区域 */}
          <div className="flex flex-col border-b bg-muted/30 p-4 md:w-80 md:border-b-0 md:border-r lg:w-96">
            {/* 返回按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 justify-start"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>

            {/* 数字人形象 */}
            <div className="flex flex-1 flex-col items-center justify-center">
              <AIDigitalHuman
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
                isSpeaking={isSpeaking}
                size="lg"
                showCountrySelector={true}
              />
            </div>

            {/* 控制按钮 */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                variant={isMuted ? 'destructive' : 'outline'}
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="h-10 w-10"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleClearChat}
                className="h-10 w-10"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Badge variant="secondary" className="h-10 px-3">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                AI对话中
              </Badge>
            </div>
          </div>

          {/* 右侧：对话区域 */}
          <div className="flex flex-1 flex-col">
            {/* 顶部信息栏 */}
            <div className="flex items-center justify-between border-b bg-background p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">AI数字人陪练</h2>
                  <p className="text-xs text-muted-foreground">
                    {currentCountry.flag} {currentCountry.name} · {currentCountry.accent}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <MessageCircle className="mr-1.5 h-3 w-3" />
                  {messages.length} 条消息
                </Badge>
              </div>
            </div>

            {/* 消息列表 */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    {/* 头像 */}
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      )}
                    >
                      {message.role === 'user' ? '你' : <Bot className="h-4 w-4" />}
                    </div>

                    {/* 消息内容 */}
                    <Card
                      className={cn(
                        'max-w-[80%]',
                        message.role === 'user' ? 'bg-primary text-primary-foreground' : ''
                      )}
                    >
                      <CardContent className="p-3">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className="mt-1 text-[10px] opacity-60">
                          {message.timestamp.toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}

                {/* 加载状态 */}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <Card className="max-w-[80%]">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* 输入区域 */}
            <div className="border-t bg-background p-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={isRecording ? 'destructive' : 'outline'}
                  size="icon"
                  onClick={toggleRecording}
                  className="h-10 w-10 shrink-0"
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入消息与AI数字人对话..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="h-10 w-10 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                按 Enter 发送消息 · 支持语音输入
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
