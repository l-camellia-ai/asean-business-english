import { supabase } from './supabase';
import type {
  UserProfile,
  LearningProgress,
  AbilityDimensions,
  Achievement,
  UserAchievement,
  DailyChallenge,
  UserChallengeCompletion,
  LeaderboardEntry,
  Course,
  UserCourseProgress,
  DigitalHuman,
  DigitalHumanConversation,
  SubscriptionPackage,
  UserSubscription
} from '@/types';

// ==================== 用户相关 ====================

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data as UserProfile | null;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as UserProfile | null;
}

// ==================== 学习进度 ====================

export async function getUserLearningProgress(userId: string) {
  const { data, error } = await supabase
    .from('learning_progress')
    .select('*')
    .eq('user_id', userId)
    .order('last_practiced_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data as LearningProgress[] : [];
}

export async function getProgressByCountry(userId: string, country: string) {
  const { data, error } = await supabase
    .from('learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('country', country);
  
  if (error) throw error;
  return Array.isArray(data) ? data as LearningProgress[] : [];
}

export async function upsertLearningProgress(progress: Partial<LearningProgress>) {
  const { data, error } = await supabase
    .from('learning_progress')
    .upsert(progress)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as LearningProgress | null;
}

// ==================== 能力维度 ====================

export async function getUserAbilities(userId: string) {
  const { data, error } = await supabase
    .from('ability_dimensions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data as AbilityDimensions | null;
}

export async function updateUserAbilities(userId: string, abilities: Partial<AbilityDimensions>) {
  const { data, error } = await supabase
    .from('ability_dimensions')
    .upsert({ user_id: userId, ...abilities })
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as AbilityDimensions | null;
}

// ==================== 成就徽章 ====================

export async function getAllAchievements() {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('points', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data as Achievement[] : [];
}

export async function getUserAchievements(userId: string) {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, achievement:achievements(*)')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data as UserAchievement[] : [];
}

export async function earnAchievement(userId: string, achievementId: string) {
  const { data, error } = await supabase
    .from('user_achievements')
    .insert({ user_id: userId, achievement_id: achievementId })
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as UserAchievement | null;
}

// ==================== 每日挑战 ====================

export async function getTodayChallenges() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('active_date', today);
  
  if (error) throw error;
  return Array.isArray(data) ? data as DailyChallenge[] : [];
}

export async function getUserChallengeCompletions(userId: string) {
  const { data, error } = await supabase
    .from('user_challenge_completions')
    .select('*, challenge:daily_challenges(*)')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(20);
  
  if (error) throw error;
  return Array.isArray(data) ? data as UserChallengeCompletion[] : [];
}

export async function completeChallenge(userId: string, challengeId: string) {
  const { data, error } = await supabase
    .from('user_challenge_completions')
    .insert({ user_id: userId, challenge_id: challengeId })
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as UserChallengeCompletion | null;
}

// ==================== 排行榜 ====================

export async function getLeaderboard(category: string, subcategory?: string, limit = 50) {
  let query = supabase
    .from('leaderboard')
    .select('*, user_profile:user_profiles(*)')
    .eq('category', category)
    .order('score', { ascending: false })
    .limit(limit);
  
  if (subcategory) {
    query = query.eq('subcategory', subcategory);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return Array.isArray(data) ? data as LeaderboardEntry[] : [];
}

export async function getUserRank(userId: string, category: string, subcategory?: string) {
  let query = supabase
    .from('leaderboard')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category);
  
  if (subcategory) {
    query = query.eq('subcategory', subcategory);
  }
  
  const { data, error } = await query.maybeSingle();
  
  if (error) throw error;
  return data as LeaderboardEntry | null;
}

// ==================== 课程 ====================

export async function getAllCourses(category?: string, country?: string) {
  let query = supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  if (country) {
    query = query.eq('country', country);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return Array.isArray(data) ? data as Course[] : [];
}

export async function getCourseById(courseId: string) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .maybeSingle();
  
  if (error) throw error;
  return data as Course | null;
}

export async function getUserCourseProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_course_progress')
    .select('*, course:courses(*)')
    .eq('user_id', userId)
    .order('last_accessed_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data as UserCourseProgress[] : [];
}

export async function updateCourseProgress(userId: string, courseId: string, progress: number) {
  const completed = progress >= 100;
  const { data, error } = await supabase
    .from('user_course_progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      progress,
      completed,
      last_accessed_at: new Date().toISOString()
    })
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as UserCourseProgress | null;
}

// ==================== 数字人 ====================

export async function getAllDigitalHumans() {
  const { data, error } = await supabase
    .from('digital_humans')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data as DigitalHuman[] : [];
}

export async function getDigitalHumansByCountry(country: string) {
  const { data, error } = await supabase
    .from('digital_humans')
    .select('*')
    .eq('country', country);
  
  if (error) throw error;
  return Array.isArray(data) ? data as DigitalHuman[] : [];
}

export async function getUserConversations(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('digital_human_conversations')
    .select('*, digital_human:digital_humans(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return Array.isArray(data) ? data as DigitalHumanConversation[] : [];
}

export async function saveConversation(conversation: Partial<DigitalHumanConversation>) {
  const { data, error } = await supabase
    .from('digital_human_conversations')
    .insert(conversation)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as DigitalHumanConversation | null;
}

// ==================== 订阅套餐 ====================

export async function getAllPackages() {
  const { data, error } = await supabase
    .from('subscription_packages')
    .select('*')
    .order('price', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data as SubscriptionPackage[] : [];
}

export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*, package:subscription_packages(*)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  
  if (error) throw error;
  return data as UserSubscription | null;
}

export async function createSubscription(subscription: Partial<UserSubscription>) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert(subscription)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as UserSubscription | null;
}
