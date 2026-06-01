import { lazy, Suspense, type ReactNode } from 'react';

// 路由懒加载 - 按需加载页面组件
const HomePage = lazy(() => import('./pages/HomePage'));
const ScenarioTrainingPage = lazy(() => import('./pages/ScenarioTrainingPage'));
const AIDigitalHumanPage = lazy(() => import('./pages/AIDigitalHumanPage'));
const DigitalHumanChatPage = lazy(() => import('./pages/DigitalHumanChatPage'));
const KnowledgeBasePage = lazy(() => import('./pages/KnowledgeBasePage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const EnterpriseServicePage = lazy(() => import('./pages/EnterpriseServicePage'));
const LearningMapPage = lazy(() => import('./pages/LearningMapPage'));
const DailyChallengesPage = lazy(() => import('./pages/DailyChallengesPage'));
const PremiumPackagePage = lazy(() => import('./pages/PremiumPackagePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// 加载占位组件
function PageLoader() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-3 text-sm text-muted-foreground">加载中...</p>
      </div>
    </div>
  );
}

// 包装组件：Suspense + 加载态
function lazyPage(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

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
    element: lazyPage(HomePage),
    visible: true
  },
  {
    name: '情景实战',
    path: '/scenario-training',
    element: lazyPage(ScenarioTrainingPage),
    visible: true
  },
  {
    name: 'AI数字人',
    path: '/ai-digital-human',
    element: lazyPage(AIDigitalHumanPage),
    visible: false
  },
  {
    name: 'AI英语私教',
    path: '/digital-human-chat',
    element: lazyPage(DigitalHumanChatPage),
    visible: true
  },
  {
    name: '商务知识库',
    path: '/knowledge-base',
    element: lazyPage(KnowledgeBasePage),
    visible: true
  },
  {
    name: '学习社区',
    path: '/community',
    element: lazyPage(CommunityPage),
    visible: true
  },
  {
    name: '企业服务',
    path: '/enterprise-service',
    element: lazyPage(EnterpriseServicePage),
    visible: true
  },
  {
    name: '学习地图',
    path: '/learning-map',
    element: lazyPage(LearningMapPage),
    visible: false
  },
  {
    name: '每日挑战',
    path: '/daily-challenges',
    element: lazyPage(DailyChallengesPage),
    visible: false
  },
  {
    name: 'AI实训增强包',
    path: '/premium-package',
    element: lazyPage(PremiumPackagePage),
    visible: false
  },
  {
    name: '个人中心',
    path: '/profile',
    element: lazyPage(ProfilePage),
    visible: false
  },
  {
    name: '登录',
    path: '/login',
    element: lazyPage(LoginPage),
    visible: false
  },
  {
    name: '新用户引导',
    path: '/onboarding',
    element: lazyPage(OnboardingPage),
    visible: false
  },
  {
    name: '管理后台',
    path: '/admin',
    element: lazyPage(AdminPage),
    visible: false
  }
];

export default routes;
