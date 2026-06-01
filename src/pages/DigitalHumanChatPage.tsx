import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/common/Header';
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
  Volume2,
  VolumeX,
  Bot,
  User,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { sendChatMessage, playAudioUrl, playAudioBase64 } from '@/services/digitalHumanApi';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// 对话模式配置
const CHAT_MODES = [
  { id: 'chat', name: '自由对话', icon: '💬', description: '自由英语对话练习' },
  { id: 'interpret', name: '实时口译', icon: '🎤', description: '中英文互译练习' },
  { id: 'ielts', name: '雅思考试', icon: '📚', description: '雅思口语模拟' },
  { id: 'kids', name: '儿童模式', icon: '👶', description: '适合儿童的简单对话' },
  { id: 'teaching', name: '教学模式', icon: '👨‍🏫', description: '系统化英语教学' },
  { id: 'scenario', name: '场景对话', icon: '💼', description: '商务场景模拟' },
];

// 语音识别接口
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

export default function DigitalHumanChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMode, setCurrentMode] = useState('chat');
  const [isSupported, setIsSupported] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // 初始化欢迎消息
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'system',
      content: 'AI English Coach is ready! Click the microphone or type to start chatting.',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 初始化语音识别
  useEffect(() => {
    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new (SpeechRecognition as new () => SpeechRecognitionInstance)();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      handleSendMessage(transcript);
      stopRecording();
    };

    recognition.onerror = (event: { error: string }) => {
      console.error('语音识别错误:', event.error);
      toast.error('语音识别失败，请重试');
      stopRecording();
    };

    recognition.onend = () => {
      stopRecording();
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  // 发送消息
  const handleSendMessage = useCallback(
    async (text?: string) => {
      const messageText = text || inputMessage.trim();
      if (!messageText || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: messageText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsLoading(true);

      try {
        const response = await sendChatMessage(messageText, currentMode, 'zh');

        if (response.success && response.data) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.data,
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, aiMessage]);

          // 播放音频
          if (response.audio && !isMuted) {
            setIsSpeaking(true);
            try {
              if (response.audio.startsWith('http://') || response.audio.startsWith('https://')) {
                await playAudioUrl(response.audio);
              } else {
                await playAudioBase64(response.audio);
              }
            } catch (audioError) {
              console.error('音频播放失败:', audioError);
              // 降级使用浏览器语音合成
              speakText(response.data);
            } finally {
              setIsSpeaking(false);
            }
          } else if (!isMuted) {
            // 使用浏览器语音合成
            speakText(response.data);
          }
        } else {
          throw new Error(response.error || '获取回复失败');
        }
      } catch (error) {
        console.error('发送消息失败:', error);
        toast.error('发送消息失败，请重试');

        // 使用模拟回复作为降级
        const mockResponses = [
          'Hello! I am your English speaking coach.',
          'That is a great question, let me help you.',
          'You can ask me more questions, keep practicing!',
          'I understand your needs and will do my best to help.',
          'Very good! Keep up the great work!',
        ];
        const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: mockResponse,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);

        if (!isMuted) {
          speakText(mockResponse);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [inputMessage, isLoading, currentMode, isMuted]
  );

  // 浏览器语音合成
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // 尝试使用英文女声
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = [
        'Google US English',
        'Google US English Female',
        'Microsoft Zira Desktop',
        'Microsoft Aria Online',
        'Samantha',
        'Karen',
      ];

      let selectedVoice = null;
      for (const voiceName of preferredVoices) {
        const voice = voices.find(v => v.name.includes(voiceName));
        if (voice) {
          selectedVoice = voice;
          break;
        }
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.includes('en'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // 开始录音
  const startRecording = () => {
    if (!recognitionRef.current) {
      toast.error('您的浏览器不支持语音识别');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      return;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
      toast.info('请开始说话...', { duration: 2000 });
    } catch (e) {
      console.error('启动录音失败:', e);
      toast.error('启动录音失败，请重试');
    }
  };

  // 停止录音
  const stopRecording = () => {
    setIsRecording(false);
  };

  // 切换录音状态
  const toggleRecording = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      stopRecording();
    } else {
      startRecording();
    }
  };

  // 按Enter发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 清空对话
  const handleClearChat = () => {
    setMessages([]);
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: '对话已清空。点击麦克风或输入文字开始新的对话。',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    toast.success('对话已清空');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavigationBar />

      <main className="flex-1 overflow-hidden">
        <div className="flex h-[calc(100vh-4rem)] flex-col">
          {/* 顶部信息栏 */}
          <div className="flex items-center justify-between border-b bg-background p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回
              </Button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">AI英语私教</h2>
                <p className="text-xs text-muted-foreground">
                  数字人语音对话
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isMuted ? 'destructive' : 'outline'}
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="h-9 w-9"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
              >
                清空对话
              </Button>
            </div>
          </div>

          {/* 模式选择 */}
          <div className="border-b bg-muted/30 p-3">
            <div className="flex gap-2 overflow-x-auto">
              {CHAT_MODES.map(mode => (
                <Button
                  key={mode.id}
                  variant={currentMode === mode.id ? 'default' : 'outline'}
                  size="sm"
                  className="flex-shrink-0 gap-1"
                  onClick={() => {
                    setCurrentMode(mode.id);
                    toast.success(`已切换到${mode.name}模式`);
                  }}
                >
                  <span>{mode.icon}</span>
                  <span>{mode.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* 消息列表 */}
          <ScrollArea className="flex-1 p-4">
            <div className="mx-auto max-w-3xl space-y-4">
              {messages.map(message => (
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
                        : message.role === 'assistant'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : message.role === 'assistant' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  {/* 消息内容 */}
                  <Card
                    className={cn(
                      'max-w-[80%]',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : message.role === 'system'
                          ? 'bg-muted'
                          : ''
                    )}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className="mt-1 text-[10px] opacity-60">
                        {message.timestamp.toLocaleTimeString('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit',
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
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">思考中...</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* 说话状态 */}
              {isSpeaking && (
                <div className="flex justify-center">
                  <Badge variant="secondary" className="gap-1">
                    <Volume2 className="h-3 w-3 animate-pulse" />
                    正在播放语音...
                  </Badge>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* 输入区域 */}
          <div className="border-t bg-background p-4">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-2">
                <Button
                  variant={isRecording ? 'destructive' : 'outline'}
                  size="icon"
                  onClick={toggleRecording}
                  className={cn(
                    'h-10 w-10 shrink-0',
                    isRecording && 'animate-pulse'
                  )}
                  disabled={!isSupported}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入消息与AI英语私教对话..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="h-10 w-10 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {isSupported
                  ? '按 Enter 发送消息 · 点击麦克风语音输入'
                  : '按 Enter 发送消息 · 您的浏览器不支持语音识别'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
