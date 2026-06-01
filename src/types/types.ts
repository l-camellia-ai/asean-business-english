// 用户类型定义
export type UserType = 'individual' | 'enterprise_admin' | 'enterprise_member';
export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  username?: string;
  avatar_url?: string;
  user_type: UserType;
  role?: UserRole;
  enterprise_id?: string;
  experience_points: number;
  level: number;
  created_at: string;
  updated_at: string;
  // 用户画像字段
  identity?: 'employee' | 'student' | 'entrepreneur' | 'other';
  english_level?: 'beginner' | 'intermediate' | 'advanced';
  learning_goals?: string[];
  onboarding_completed?: boolean;
  phone_number?: string;
  phone_country_code?: string;
  // 游客模式字段
  is_guest?: boolean;
  guest_trial_count?: number;
  guest_trial_limit?: number;
}

// 企业
export interface Enterprise {
  id: string;
  name: string;
  admin_id: string;
  created_at: string;
}

// 学习进度
export interface LearningProgress {
  id: string;
  user_id: string;
  country: string;
  scenario_type: string;
  completion_rate: number;
  score?: number;
  last_practiced_at: string;
  created_at: string;
}

// 能力维度
export interface AbilityDimensions {
  id: string;
  user_id: string;
  language_accuracy: number;
  cultural_adaptation: number;
  business_strategy: number;
  negotiation_skills: number;
  communication_efficiency: number;
  cross_cultural_awareness: number;
  updated_at: string;
}

// 成就徽章
export interface Achievement {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  category: 'country' | 'skill' | 'milestone';
  country?: string;
  points: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

// 每日挑战
export interface DailyChallenge {
  id: string;
  title: string;
  description?: string;
  challenge_type: string;
  country?: string;
  points: number;
  active_date: string;
  created_at: string;
}

export interface UserChallengeCompletion {
  id: string;
  user_id: string;
  challenge_id: string;
  completed_at: string;
  challenge?: DailyChallenge;
}

// 排行榜
export interface LeaderboardEntry {
  id: string;
  user_id: string;
  category: string;
  subcategory?: string;
  score: number;
  rank?: number;
  updated_at: string;
  user_profile?: UserProfile;
}

// 课程
export interface Course {
  id: string;
  title: string;
  description?: string;
  category: 'scenario' | 'knowledge' | 'listening';
  country?: string;
  industry?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  thumbnail_url?: string;
  content_url?: string;
  created_at: string;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  completed: boolean;
  last_accessed_at: string;
  course?: Course;
}

// 数字人
export interface DigitalHuman {
  id: string;
  name: string;
  country: string;
  industry: string;
  role: string;
  avatar_url?: string;
  description?: string;
  typical_needs?: string;
  created_at: string;
}

export interface DigitalHumanConversation {
  id: string;
  user_id: string;
  digital_human_id: string;
  conversation_data?: Record<string, unknown>;
  cultural_score?: number;
  language_score?: number;
  strategy_score?: number;
  created_at: string;
  digital_human?: DigitalHuman;
}

// 订阅套餐
export interface SubscriptionPackage {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: Record<string, unknown>;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  package_id: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'expired' | 'cancelled';
  remaining_credits: number;
  created_at: string;
  package?: SubscriptionPackage;
}

// 东盟国家列表
export const ASEAN_COUNTRIES = [
  { code: 'thailand', name: '泰国', flag: '🇹🇭' },
  { code: 'vietnam', name: '越南', flag: '🇻🇳' },
  { code: 'indonesia', name: '印尼', flag: '🇮🇩' },
  { code: 'singapore', name: '新加坡', flag: '🇸🇬' },
  { code: 'malaysia', name: '马来西亚', flag: '🇲🇾' },
  { code: 'philippines', name: '菲律宾', flag: '🇵🇭' },
  { code: 'brunei', name: '文莱', flag: '🇧🇳' },
  { code: 'cambodia', name: '柬埔寨', flag: '🇰🇭' },
  { code: 'laos', name: '老挝', flag: '🇱🇦' },
  { code: 'myanmar', name: '缅甸', flag: '🇲🇲' }
] as const;
