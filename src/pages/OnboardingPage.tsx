import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Briefcase, GraduationCap, Rocket, User, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface OnboardingData {
  identity: 'employee' | 'student' | 'entrepreneur' | 'other';
  english_level: 'beginner' | 'intermediate' | 'advanced';
  learning_goals: string[];
}

const IDENTITIES = [
  { value: 'employee', label: '企业员工', icon: Briefcase, desc: '在企业工作，需要商务英语' },
  { value: 'student', label: '学生', icon: GraduationCap, desc: '在校学习，提升英语能力' },
  { value: 'entrepreneur', label: '创业者', icon: Rocket, desc: '创业或自由职业' },
  { value: 'other', label: '其他', icon: User, desc: '其他身份' },
] as const;

const ENGLISH_LEVELS = [
  { value: 'beginner', label: '初级', desc: '基础词汇，简单对话' },
  { value: 'intermediate', label: '中级', desc: '日常交流，基本商务' },
  { value: 'advanced', label: '高级', desc: '流利表达，专业商务' },
] as const;

const LEARNING_GOALS = [
  { value: 'negotiation', label: '商务谈判', desc: '提升谈判技巧' },
  { value: 'email', label: '邮件沟通', desc: '规范商务邮件' },
  { value: 'culture', label: '文化了解', desc: '跨文化交流' },
  { value: 'presentation', label: '演讲展示', desc: '商务演讲能力' },
  { value: 'other', label: '其他', desc: '其他学习目标' },
] as const;

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    identity: 'employee',
    english_level: 'intermediate',
    learning_goals: [],
  });
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const progress = (step / 3) * 100;

  const handleNext = () => {
    if (step === 1 && !data.identity) {
      toast.error('请选择您的身份');
      return;
    }
    if (step === 2 && !data.english_level) {
      toast.error('请选择您的英语水平');
      return;
    }
    if (step === 3 && data.learning_goals.length === 0) {
      toast.error('请至少选择一个学习目标');
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!user) {
      toast.error('用户信息获取失败');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        // @ts-expect-error - 数据库类型定义未更新
        .update({
          identity: data.identity,
          english_level: data.english_level,
          learning_goals: data.learning_goals,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast.success('设置完成！开始您的学习之旅吧');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('保存用户信息失败:', error);
      toast.error('保存失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGoal = (goal: string) => {
    setData((prev) => ({
      ...prev,
      learning_goals: prev.learning_goals.includes(goal)
        ? prev.learning_goals.filter((g) => g !== goal)
        : [...prev.learning_goals, goal],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* 进度条 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>完成度</span>
            <span>{step}/3</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* 步骤1：选择身份 */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>欢迎加入智汇南洋！</CardTitle>
              <CardDescription>首先，让我们了解一下您的身份</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={data.identity}
                onValueChange={(value) =>
                  setData((prev) => ({ ...prev, identity: value as OnboardingData['identity'] }))
                }
              >
                <div className="grid gap-3 md:grid-cols-2">
                  {IDENTITIES.map((identity) => {
                    const Icon = identity.icon;
                    return (
                      <Label
                        key={identity.value}
                        htmlFor={identity.value}
                        className={`flex cursor-pointer items-start space-x-3 rounded-lg border-2 p-4 transition-all hover:border-primary ${
                          data.identity === identity.value ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <RadioGroupItem value={identity.value} id={identity.value} className="mt-1" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-primary" />
                            <span className="font-medium">{identity.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{identity.desc}</p>
                        </div>
                      </Label>
                    );
                  })}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* 步骤2：选择英语水平 */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>您的英语水平如何？</CardTitle>
              <CardDescription>帮助我们为您推荐合适的课程</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={data.english_level}
                onValueChange={(value) =>
                  setData((prev) => ({ ...prev, english_level: value as OnboardingData['english_level'] }))
                }
              >
                <div className="space-y-3">
                  {ENGLISH_LEVELS.map((level) => (
                    <Label
                      key={level.value}
                      htmlFor={level.value}
                      className={`flex cursor-pointer items-start space-x-3 rounded-lg border-2 p-4 transition-all hover:border-primary ${
                        data.english_level === level.value ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value={level.value} id={level.value} className="mt-1" />
                      <div className="flex-1 space-y-1">
                        <span className="font-medium">{level.label}</span>
                        <p className="text-xs text-muted-foreground">{level.desc}</p>
                      </div>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* 步骤3：选择学习目标 */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>您的学习目标是什么？</CardTitle>
              <CardDescription>可以选择多个目标</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {LEARNING_GOALS.map((goal) => (
                  <Label
                    key={goal.value}
                    htmlFor={goal.value}
                    className={`flex cursor-pointer items-start space-x-3 rounded-lg border-2 p-4 transition-all hover:border-primary ${
                      data.learning_goals.includes(goal.value) ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <Checkbox
                      id={goal.value}
                      checked={data.learning_goals.includes(goal.value)}
                      onCheckedChange={() => toggleGoal(goal.value)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <span className="font-medium">{goal.label}</span>
                      <p className="text-xs text-muted-foreground">{goal.desc}</p>
                    </div>
                  </Label>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1 || isLoading}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            上一步
          </Button>
          <Button onClick={handleNext} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : step === 3 ? (
              '完成'
            ) : (
              <>
                下一步
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
