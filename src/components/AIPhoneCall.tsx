import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Phone, PhoneOff, Volume2, Loader2, Award, Send, Mic, MicOff, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AIPhoneCallProps {
  scenarioTitle: string;
  scenarioCountry: string;
  scenarioDifficulty: string;
}

export default function AIPhoneCall({
  scenarioTitle,
  scenarioCountry,
  scenarioDifficulty
}: AIPhoneCallProps) {
  // 状态管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState('');

  // Refs
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const actualRecordingTimeRef = useRef<number>(0); // 实际录音时长（用于准确检查）

  // 初始化欢迎消息
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'system',
      content: `欢迎来到"${scenarioTitle}"AI电话工坊！\n\n在这个场景中，你将与${scenarioCountry}的商务伙伴进行电话对话。\n\n💡 使用提示：\n1. 点击"开始通话"开始训练\n2. 语音模式：点击"录音"按钮说英语（2-60秒）\n3. 文字模式：点击键盘图标切换，直接输入英语\n4. AI会用英语回复并播放语音\n5. 如遇语音识别问题，建议使用文字模式\n6. 推荐浏览器：Chrome或Edge`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    // 清理函数
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
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

  // 开始通话
  const startCall = async () => {
    setCallActive(true);
    const greetingMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Hello! This is your business partner. How can I help you today?',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, greetingMessage]);
    toast.success('通话已开始，您可以点击录音或切换到文字模式');
  };

  // 结束通话
  const endCall = () => {
    setCallActive(false);
    if (isRecording) {
      stopRecording();
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    const endMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: `通话已结束。本次对话总分：${totalScore}分\n\n感谢使用AI电话工坊！`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, endMessage]);
  };

  // 开始录音
  const startRecording = async () => {
    if (isRecording || isProcessing) return;

    try {
      // 请求麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // 创建MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // 停止所有音轨
        stream.getTracks().forEach(track => track.stop());
        
        // 清除计时器
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        // 使用ref中的实际录音时长进行检查
        const actualTime = actualRecordingTimeRef.current;
        console.log('录音结束，实际时长:', actualTime, '秒');
        
        // 检查录音时长
        if (actualTime < 2) {
          toast.error(`录音时间太短（${actualTime}秒），请至少说2秒以上`);
          setRecordingTime(0);
          actualRecordingTimeRef.current = 0;
          return;
        }

        // 处理录音
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log('开始处理音频，大小:', audioBlob.size, 'bytes');
        await processAudio(audioBlob);
        setRecordingTime(0);
        actualRecordingTimeRef.current = 0;
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);
      actualRecordingTimeRef.current = 0; // 重置实际录音时长

      // 开始计时
      recordingTimerRef.current = setInterval(() => {
        actualRecordingTimeRef.current += 1; // 更新实际时长
        setRecordingTime(prev => {
          const newTime = prev + 1;
          console.log('录音中，当前时长:', newTime, '秒');
          // 60秒自动停止
          if (newTime >= 60) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);

      toast.success('开始录音，请说英语');
    } catch (error: any) {
      console.error('启动录音失败:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('麦克风权限被拒绝，请在浏览器设置中允许麦克风访问');
      } else if (error.name === 'NotFoundError') {
        toast.error('未找到麦克风设备，请检查设备连接');
      } else {
        toast.error('启动录音失败：' + error.message);
      }
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 处理音频
  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        console.log('开始处理音频:', { size: audioBlob.size, type: audioBlob.type });

        // 转换为WAV格式
        const wavBlob = await convertWebmToWav(audioBlob);
        console.log('音频转换完成:', { size: wavBlob.size, type: wavBlob.type });

        // 转换为Base64
        const arrayBuffer = await wavBlob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Audio = btoa(binary);
        console.log('Base64编码完成，长度:', base64Audio.length);

        // 发送到Edge Function
        await processRecognizedText(base64Audio, wavBlob.size);
        
        // 成功后退出循环
        break;
      } catch (error: any) {
        console.error(`音频处理失败 (尝试 ${retryCount + 1}/${maxRetries + 1}):`, error);
        
        retryCount++;
        
        if (retryCount > maxRetries) {
          // 所有重试都失败
          if (error.message?.includes('音频格式')) {
            toast.error('音频格式不支持，请使用Chrome或Edge浏览器');
          } else if (error.message?.includes('读取')) {
            toast.error('读取音频失败，请重新录制');
          } else {
            toast.error('音频处理失败：' + (error.message || '未知错误'));
          }
          
          setIsProcessing(false);
          return;
        }
        
        // 等待后重试
        toast.info(`正在重试... (${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

    setIsProcessing(false);
  };

  // 将WebM转换为WAV格式（16000Hz, 16bit, 单声道）
  const convertWebmToWav = async (webmBlob: Blob): Promise<Blob> => {
    try {
      console.log('=== 开始音频转换 ===');
      console.log('输入大小:', webmBlob.size, 'bytes');
      console.log('输入类型:', webmBlob.type);
      
      // 创建AudioContext（使用默认采样率）
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('AudioContext创建成功，采样率:', audioContextRef.current.sampleRate);
      }
      const audioContext = audioContextRef.current;
      
      // 读取音频数据
      const arrayBuffer = await webmBlob.arrayBuffer();
      console.log('ArrayBuffer读取成功，大小:', arrayBuffer.byteLength, 'bytes');
      
      if (arrayBuffer.byteLength === 0) {
        throw new Error('音频数据为空');
      }
      
      // 解码音频（使用Promise包装以便更好的错误处理）
      let audioBuffer: AudioBuffer;
      try {
        audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
          audioContext.decodeAudioData(
            arrayBuffer.slice(0), // 创建副本避免detached buffer
            (buffer) => {
              console.log('音频解码成功');
              console.log('- 时长:', buffer.duration.toFixed(2), '秒');
              console.log('- 采样率:', buffer.sampleRate, 'Hz');
              console.log('- 声道数:', buffer.numberOfChannels);
              resolve(buffer);
            },
            (error) => {
              console.error('解码失败:', error);
              reject(new Error('音频解码失败，请使用Chrome或Edge浏览器'));
            }
          );
        });
      } catch (decodeError) {
        console.error('解码错误:', decodeError);
        throw decodeError;
      }

      // 重采样到16000Hz并转换为单声道
      const targetSampleRate = 16000;
      const targetLength = Math.ceil(audioBuffer.duration * targetSampleRate);
      console.log('开始重采样，目标:', targetSampleRate, 'Hz,', targetLength, '样本');
      
      const offlineContext = new OfflineAudioContext(
        1, // 单声道
        targetLength,
        targetSampleRate
      );
      
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start(0);
      
      const resampledBuffer = await offlineContext.startRendering();
      console.log('重采样完成，样本数:', resampledBuffer.length);
      
      // 转换为WAV格式
      const length = resampledBuffer.length * 2; // 16bit = 2 bytes
      const buffer = new ArrayBuffer(44 + length);
      const view = new DataView(buffer);

      // WAV文件头
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + length, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true); // fmt chunk size
      view.setUint16(20, 1, true); // PCM format
      view.setUint16(22, 1, true); // 单声道
      view.setUint32(24, targetSampleRate, true); // 采样率
      view.setUint32(28, targetSampleRate * 2, true); // byte rate
      view.setUint16(32, 2, true); // block align
      view.setUint16(34, 16, true); // 16bit
      writeString(36, 'data');
      view.setUint32(40, length, true);

      // 写入PCM数据
      const channelData = resampledBuffer.getChannelData(0);
      let offset = 44;
      for (let i = 0; i < channelData.length; i++) {
        const sample = Math.max(-1, Math.min(1, channelData[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }

      const wavBlob = new Blob([buffer], { type: 'audio/wav' });
      console.log('WAV文件生成完成，大小:', wavBlob.size, 'bytes');
      console.log('=== 音频转换完成 ===');
      
      return wavBlob;
    } catch (error) {
      console.error('=== 音频转换失败 ===');
      console.error('错误:', error);
      throw new Error('音频处理失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 处理识别的文本
  const processRecognizedText = async (audioBase64: string, audioLength: number) => {
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        const conversationHistory = messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .slice(-10)
          .map(m => ({
            role: m.role,
            content: m.content,
            name: m.role === 'user' ? '用户' : 'AI助手'
          }));

        const body = {
          audioBase64,
          audioLength,
          conversationHistory,
          scenarioTitle,
          voiceId: 'male-qn-qingse',
        };

        console.log('发送请求到Edge Function:', {
          audioLength,
          historyLength: conversationHistory.length
        });

        // 设置超时
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('请求超时')), 30000);
        });

        const requestPromise = supabase.functions.invoke('phone-call-dialogue', {
          body
        });

        const result = await Promise.race([requestPromise, timeoutPromise]) as any;
        
        console.log('Edge Function响应:', result);

        // 检查网络错误
        if (result.error) {
          console.error('Edge Function调用错误:', result.error);
          
          let errorMessage = result.error.message || '网络请求失败';
          
          if (result.error.context) {
            try {
              const errorText = await result.error.context.text();
              console.error('Edge Function详细错误:', errorText);
              
              try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorText;
              } catch {
                errorMessage = errorText;
              }
            } catch (e) {
              console.error('无法读取错误详情:', e);
            }
          }
          
          throw new Error(errorMessage);
        }

        const data = result.data;
        
        if (!data) {
          throw new Error('服务器未返回数据');
        }

        if (!data.success) {
          throw new Error(data.error || '服务器处理失败');
        }

        // 添加用户消息
        if (data.userText) {
          const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: data.userText,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, userMsg]);
        }

        // 添加AI消息
        if (data.aiReply) {
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.aiReply,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMsg]);
          setTotalScore(prev => prev + (Math.floor(Math.random() * 20) + 70));
        }

        // 播放音频
        if (data.audioHex) {
          await playAudioFromHex(data.audioHex);
        }

        toast.success('对话成功');
        break;
      } catch (error: any) {
        console.error(`对话处理失败 (尝试 ${retryCount + 1}/${maxRetries + 1}):`, error);
        
        // 检查是否是配额耗尽错误（429）
        const is429Error = error.message?.includes('429') || error.message?.includes('额度已耗尽');
        
        if (is429Error) {
          // 配额耗尽，不重试，直接提示用户切换到文字模式
          console.error('语音识别配额已耗尽');
          toast.error('语音识别今日额度已用完', {
            description: '已自动切换到文字输入模式，您可以直接输入英语文字继续对话',
            duration: 6000
          });
          
          // 自动切换到文字模式
          setInputMode('text');
          setIsProcessing(false);
          return;
        }
        
        retryCount++;
        
        if (retryCount > maxRetries) {
          if (error.message?.includes('超时')) {
            toast.error('请求超时，请检查网络连接');
          } else if (error.message?.includes('识别')) {
            toast.error('语音识别失败', {
              description: '建议切换到文字输入模式',
              duration: 5000
            });
          } else if (error.message?.includes('API密钥')) {
            toast.error('系统配置错误，请联系管理员');
          } else {
            toast.error('对话处理失败', {
              description: error.message || '未知错误',
              duration: 5000
            });
          }
          setIsProcessing(false);
          return;
        }
        
        toast.info(`正在重试... (${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  };

  // 处理文字输入
  const handleTextSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim() || isProcessing) return;

    const userText = textInput.trim();
    setTextInput('');
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    await processTextInput(userText);
  };

  // 处理文字输入
  const processTextInput = async (userText: string) => {
    setIsProcessing(true);

    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        const conversationHistory = messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .slice(-10)
          .map(m => ({
            role: m.role,
            content: m.content,
            name: m.role === 'user' ? '用户' : 'AI助手'
          }));

        const body = {
          userText,
          conversationHistory,
          scenarioTitle,
          voiceId: 'male-qn-qingse',
        };

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('请求超时')), 30000);
        });

        const requestPromise = supabase.functions.invoke('phone-call-dialogue', {
          body
        });

        const result = await Promise.race([requestPromise, timeoutPromise]) as any;

        if (result.error) {
          let errorMessage = result.error.message || '网络请求失败';
          
          if (result.error.context) {
            try {
              const errorText = await result.error.context.text();
              try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorText;
              } catch {
                errorMessage = errorText;
              }
            } catch (e) {
              console.error('无法读取错误详情:', e);
            }
          }
          
          throw new Error(errorMessage);
        }

        const data = result.data;
        
        if (!data) {
          throw new Error('服务器未返回数据');
        }

        if (!data.success) {
          throw new Error(data.error || '服务器处理失败');
        }

        if (data.aiReply) {
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.aiReply,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMsg]);
          setTotalScore(prev => prev + (Math.floor(Math.random() * 20) + 70));
        }

        if (data.audioHex) {
          await playAudioFromHex(data.audioHex);
        }

        toast.success('对话成功');
        break;
      } catch (error: any) {
        retryCount++;
        
        if (retryCount > maxRetries) {
          toast.error('对话处理失败：' + (error.message || '未知错误'));
          setIsProcessing(false);
          return;
        }
        
        toast.info(`正在重试... (${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

    setIsProcessing(false);
  };

  // 播放音频
  const playAudioFromHex = async (hexString: string): Promise<void> => {
    try {
      if (!hexString || hexString.length < 100) {
        console.warn('音频数据无效，跳过播放');
        return;
      }

      const bytes = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      const blob = new Blob([bytes], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      currentAudioRef.current = audio;
      
      setIsPlaying(true);
      
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          audio.pause();
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          reject(new Error('音频播放超时'));
        }, 30000);

        audio.onended = () => {
          clearTimeout(timeout);
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          resolve();
        };
        
        audio.onerror = (e) => {
          clearTimeout(timeout);
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          console.error('音频播放错误:', e);
          reject(new Error('音频播放失败'));
        };
        
        audio.play().catch((e) => {
          clearTimeout(timeout);
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          console.error('音频播放失败:', e);
          reject(e);
        });
      });
    } catch (error) {
      console.error('播放音频失败:', error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex h-[600px] flex-col">
      {/* 通话头部 */}
      <CardHeader className="border-b border-border">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{scenarioTitle}</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{scenarioCountry}</span>
              <Badge variant="outline">{scenarioDifficulty}</Badge>
              {callActive && (
                <Badge variant="default" className="animate-pulse">
                  <Phone className="mr-1 h-3 w-3" />
                  通话中
                </Badge>
              )}
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
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    message.role === 'user' && 'bg-primary',
                    message.role === 'assistant' && 'bg-secondary',
                    message.role === 'system' && 'bg-accent'
                  )}
                >
                  {message.role === 'user' && <Send className="h-4 w-4 text-primary-foreground" />}
                  {message.role === 'assistant' && <Volume2 className="h-4 w-4 text-secondary-foreground" />}
                  {message.role === 'system' && <Phone className="h-4 w-4 text-accent-foreground" />}
                </div>

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

                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium">正在处理中，请稍候...</span>
              </div>
            )}

            {isPlaying && (
              <div className="flex items-center justify-center space-x-2 text-secondary">
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span className="text-sm">AI正在说话...</span>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* 控制区域 */}
      <div className="border-t border-border p-4">
        <div className="flex flex-col space-y-3">
          {!callActive ? (
            <Button onClick={startCall} size="lg" className="w-full">
              <Phone className="mr-2 h-5 w-5" />
              开始通话
            </Button>
          ) : (
            <>
              {/* 模式切换 */}
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant={inputMode === 'voice' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInputMode('voice')}
                  disabled={isRecording || isProcessing}
                >
                  <Mic className="mr-1 h-4 w-4" />
                  语音模式
                </Button>
                <Button
                  variant={inputMode === 'text' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInputMode('text')}
                  disabled={isRecording || isProcessing}
                >
                  <Keyboard className="mr-1 h-4 w-4" />
                  文字模式
                </Button>
              </div>

              {/* 输入区域 */}
              <div className="flex items-center space-x-2">
                {inputMode === 'voice' ? (
                  <>
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      size="lg"
                      variant={isRecording ? 'destructive' : 'default'}
                      disabled={isProcessing || isPlaying}
                      className="flex-1"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="mr-2 h-5 w-5" />
                          停止录音 ({recordingTime}秒)
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-5 w-5" />
                          点击录音
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <form onSubmit={handleTextSubmit} className="flex flex-1 space-x-2">
                    <Input
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="输入英语对话..."
                      disabled={isProcessing || isPlaying}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!textInput.trim() || isProcessing || isPlaying}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </form>
                )}

                <Button
                  onClick={endCall}
                  size="lg"
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
