import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import LoginDialog from '@/components/LoginDialog';

import routes from './routes';

// 导入诊断工具（仅在开发环境）
if (import.meta.env.DEV) {
  import('@/utils/diagnose');
}

// 内部组件：处理登录弹窗逻辑
function AppContent() {
  const { user, loading } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // 检查localStorage中的游客模式标记
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuestMode(guestMode);
  }, []);

  useEffect(() => {
    // 等待认证加载完成
    if (!loading && !hasCheckedAuth) {
      setHasCheckedAuth(true);
      // 如果用户未登录且不是游客模式，显示登录弹窗
      if (!user && !isGuestMode) {
        setShowLoginDialog(true);
      }
    }
  }, [loading, user, isGuestMode, hasCheckedAuth]);

  // 处理游客模式
  const handleGuestMode = () => {
    setIsGuestMode(true);
    localStorage.setItem('guestMode', 'true');
    setShowLoginDialog(false);
  };

  // 登录成功后关闭弹窗
  const handleLoginSuccess = (open: boolean) => {
    setShowLoginDialog(open);
    if (!open && user) {
      // 清除游客模式标记
      localStorage.removeItem('guestMode');
      setIsGuestMode(false);
    }
  };

  // 如果正在加载认证状态，显示加载界面
  if (loading && !hasCheckedAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouteGuard>
        <IntersectObserver />
        <div className="flex min-h-screen flex-col">
          <main className="flex-grow">
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </RouteGuard>

      {/* 登录弹窗 */}
      <LoginDialog open={showLoginDialog} onOpenChange={handleLoginSuccess} onGuestMode={handleGuestMode} />
    </>
  );
}

const App: React.FC = () => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🔧 开发模式已启用');
      console.log('💡 输入 diagnosePhoneWorkshop() 来诊断AI电话工坊');
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
