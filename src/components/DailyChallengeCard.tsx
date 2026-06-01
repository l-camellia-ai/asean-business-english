import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Trophy } from 'lucide-react';
import type { DailyChallenge } from '@/types';

interface DailyChallengeCardProps {
  challenge: DailyChallenge;
  isCompleted?: boolean;
  onStart?: () => void;
}

export default function DailyChallengeCard({ 
  challenge, 
  isCompleted = false,
  onStart 
}: DailyChallengeCardProps) {
  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'phone_call':
        return '📞';
      case 'quiz':
        return '❓';
      case 'scenario':
        return '🎭';
      case 'listening':
        return '👂';
      default:
        return '✨';
    }
  };

  const getChallengeTypeText = (type: string) => {
    switch (type) {
      case 'phone_call':
        return '电话谈判';
      case 'quiz':
        return '快速问答';
      case 'scenario':
        return '情景对话';
      case 'listening':
        return '听力训练';
      default:
        return '挑战';
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-md ${
      isCompleted ? 'border-primary bg-accent' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* 挑战类型图标 */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getChallengeIcon(challenge.challenge_type)}</span>
              <Badge variant="outline">{getChallengeTypeText(challenge.challenge_type)}</Badge>
              {challenge.country && (
                <Badge variant="secondary">{challenge.country}</Badge>
              )}
            </div>

            {/* 标题 */}
            <h3 className="font-semibold text-foreground">{challenge.title}</h3>

            {/* 描述 */}
            {challenge.description && (
              <p className="text-sm text-muted-foreground">{challenge.description}</p>
            )}

            {/* 奖励信息 */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-secondary">
                <Trophy className="h-4 w-4" />
                <span className="font-medium">+{challenge.points} 经验值</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>今日挑战</span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="ml-4">
            {isCompleted ? (
              <div className="flex flex-col items-center space-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <span className="text-2xl">✓</span>
                </div>
                <span className="text-xs font-medium text-primary">已完成</span>
              </div>
            ) : (
              <Button onClick={onStart} size="sm" className="whitespace-nowrap">
                开始挑战
              </Button>
            )}
          </div>
        </div>

        {/* 完成状态遮罩 */}
        {isCompleted && (
          <div className="absolute right-0 top-0 h-full w-1 bg-primary" />
        )}
      </CardContent>
    </Card>
  );
}
