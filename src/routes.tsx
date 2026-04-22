import HomePage from './pages/HomePage';
import ScenarioTrainingPage from './pages/ScenarioTrainingPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import CommunityPage from './pages/CommunityPage';
import EnterpriseServicePage from './pages/EnterpriseServicePage';
import LearningMapPage from './pages/LearningMapPage';
import DailyChallengesPage from './pages/DailyChallengesPage';
import PremiumPackagePage from './pages/PremiumPackagePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import AIDigitalHumanPage from './pages/AIDigitalHumanPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '首页',
    path: '/',
    element: <HomePage />,
    visible: true
  },
  {
    name: '情景实战',
    path: '/scenario-training',
    element: <ScenarioTrainingPage />,
    visible: true
  },
  {
    name: 'AI数字人',
    path: '/ai-digital-human',
    element: <AIDigitalHumanPage />,
    visible: false
  },
  {
    name: '商务知识库',
    path: '/knowledge-base',
    element: <KnowledgeBasePage />,
    visible: true
  },
  {
    name: '学习社区',
    path: '/community',
    element: <CommunityPage />,
    visible: true
  },
  {
    name: '企业服务',
    path: '/enterprise-service',
    element: <EnterpriseServicePage />,
    visible: true
  },
  {
    name: '学习地图',
    path: '/learning-map',
    element: <LearningMapPage />,
    visible: false
  },
  {
    name: '每日挑战',
    path: '/daily-challenges',
    element: <DailyChallengesPage />,
    visible: false
  },
  {
    name: 'AI实训增强包',
    path: '/premium-package',
    element: <PremiumPackagePage />,
    visible: false
  },
  {
    name: '个人中心',
    path: '/profile',
    element: <ProfilePage />,
    visible: false
  },
  {
    name: '登录',
    path: '/login',
    element: <LoginPage />,
    visible: false
  },
  {
    name: '新用户引导',
    path: '/onboarding',
    element: <OnboardingPage />,
    visible: false
  }
];

export default routes;
