import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// 国家配置
const COUNTRIES = [
  {
    code: 'VN',
    name: '越南',
    nameEn: 'Vietnam',
    flag: '🇻🇳',
    accent: '越南口音',
    avatar: 'https://miaoda-conversation-file.cdn.bcebos.com/user-9s74qvdlnx1c/conv-9s74rqz8t1c0/20260422/file-b4nvrfp6h2bk.jpg'
  },
  {
    code: 'SG',
    name: '新加坡',
    nameEn: 'Singapore',
    flag: '🇸🇬',
    accent: '新加坡口音',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&crop=face'
  },
  {
    code: 'MY',
    name: '马来西亚',
    nameEn: 'Malaysia',
    flag: '🇲🇾',
    accent: '马来西亚口音',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&crop=face'
  },
  {
    code: 'ID',
    name: '印度尼西亚',
    nameEn: 'Indonesia',
    flag: '🇮🇩',
    accent: '印尼口音',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&crop=face'
  },
  {
    code: 'PH',
    name: '菲律宾',
    nameEn: 'Philippines',
    flag: '🇵🇭',
    accent: '菲律宾口音',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&crop=face'
  }
] as const;

export type CountryCode = (typeof COUNTRIES)[number]['code'];

interface AIDigitalHumanProps {
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCountrySelector?: boolean;
  className?: string;
}

export function AIDigitalHuman({
  selectedCountry,
  onCountryChange,
  isSpeaking = false,
  size = 'md',
  showCountrySelector = true,
  className
}: AIDigitalHumanProps) {
  const [currentCountry, setCurrentCountry] = useState(
    COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0]
  );

  useEffect(() => {
    const country = COUNTRIES.find(c => c.code === selectedCountry);
    if (country) {
      setCurrentCountry(country);
    }
  }, [selectedCountry]);

  const handleCountryChange = (code: CountryCode) => {
    onCountryChange(code);
  };

  // 尺寸配置
  const sizeConfig = {
    sm: {
      container: 'w-24 h-32',
      image: 'w-20 h-28',
      mouth: 'w-3 h-1.5',
      flag: 'w-5 h-5 text-xs',
      selector: 'gap-1'
    },
    md: {
      container: 'w-40 h-52',
      image: 'w-36 h-48',
      mouth: 'w-5 h-2.5',
      flag: 'w-8 h-8 text-base',
      selector: 'gap-2'
    },
    lg: {
      container: 'w-56 h-72',
      image: 'w-52 h-68',
      mouth: 'w-7 h-3.5',
      flag: 'w-10 h-10 text-lg',
      selector: 'gap-3'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* 数字人形象区域 */}
      <div className="relative">
        {/* 国家标识 */}
        <div
          className={cn(
            'absolute -left-2 -top-2 z-20 flex items-center justify-center rounded-full bg-white shadow-lg',
            config.flag
          )}
        >
          {currentCountry.flag}
        </div>

        {/* 口音标签 */}
        <Badge
          variant="secondary"
          className="absolute -right-2 -top-2 z-20 text-xs shadow-sm"
        >
          {currentCountry.accent}
        </Badge>

        {/* 数字人形象容器 */}
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl bg-gradient-to-b from-primary/10 to-secondary/10 shadow-xl',
            config.container
          )}
        >
          {/* 数字人图片 */}
          <img
            src={currentCountry.avatar}
            alt={`${currentCountry.name}数字人`}
            className={cn(
              'absolute inset-0 mx-auto object-cover object-top',
              config.image
            )}
          />

          {/* 嘴巴区域 - 口型动画 */}
          {isSpeaking && (
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2">
              <div
                className={cn(
                  'rounded-full bg-red-500/80 animate-lip-sync',
                  config.mouth
                )}
              />
            </div>
          )}

          {/* 静态嘴巴（不说话时显示微笑） */}
          {!isSpeaking && (
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2">
              <div
                className={cn(
                  'rounded-full border-2 border-red-400/60 bg-transparent',
                  config.mouth
                )}
                style={{
                  borderRadius: '0 0 50% 50%',
                  borderTop: 'none'
                }}
              />
            </div>
          )}

          {/* 呼吸动画效果 */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/5 via-transparent to-transparent animate-pulse" />
        </div>

        {/* 国家名称 */}
        <div className="mt-3 text-center">
          <p className="font-semibold text-foreground">{currentCountry.name}</p>
          <p className="text-xs text-muted-foreground">{currentCountry.nameEn}</p>
        </div>
      </div>

      {/* 国家切换器 */}
      {showCountrySelector && (
        <Card className="p-3">
          <div className={cn('flex flex-wrap justify-center', config.selector)}>
            {COUNTRIES.map(country => (
              <Button
                key={country.code}
                variant={currentCountry.code === country.code ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCountryChange(country.code)}
                className="gap-1 px-2 text-xs"
              >
                <span>{country.flag}</span>
                <span className="hidden sm:inline">{country.name}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// 简化的数字人卡片组件（用于首页入口）
interface DigitalHumanCardProps {
  onClick?: () => void;
  className?: string;
}

export function DigitalHumanCard({ onClick, className }: DigitalHumanCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // 自动轮播展示不同国家
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % COUNTRIES.length);
      // 切换时模拟说话动画
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentCountry = COUNTRIES[currentIndex];

  return (
    <Card
      className={cn(
        'cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 p-4">
        {/* 数字人缩略图 */}
        <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-b from-primary/10 to-secondary/10">
          <img
            src={currentCountry.avatar}
            alt={currentCountry.name}
            className="h-full w-full object-cover object-top"
          />
          {/* 嘴巴动画 */}
          {isSpeaking && (
            <div className="absolute bottom-[15%] left-1/2 h-1.5 w-2 -translate-x-1/2 animate-lip-sync rounded-full bg-red-500/80" />
          )}
          {!isSpeaking && (
            <div
              className="absolute bottom-[15%] left-1/2 h-1.5 w-2 -translate-x-1/2 rounded-full border border-red-400/60 bg-transparent"
              style={{ borderRadius: '0 0 50% 50%', borderTop: 'none' }}
            />
          )}
          {/* 国旗 */}
          <div className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs shadow">
            {currentCountry.flag}
          </div>
        </div>

        {/* 文字内容 */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">AI数字人陪练</h3>
            <Badge variant="secondary" className="text-xs">
              {COUNTRIES.length}国可选
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            与{currentCountry.name}数字人进行商务英语对话
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {COUNTRIES.map((c, i) => (
              <span
                key={c.code}
                className={cn(
                  'text-xs transition-opacity',
                  i === currentIndex ? 'opacity-100' : 'opacity-40'
                )}
              >
                {c.flag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export { COUNTRIES };
export default AIDigitalHuman;
