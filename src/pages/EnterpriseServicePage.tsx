import NavigationBar from '@/components/NavigationBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users as UsersIcon, FileText } from 'lucide-react';

export default function EnterpriseServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar userType="enterprise_admin" />
      
      <main className="container space-y-6 px-4 py-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">企业服务</h1>
          <p className="text-muted-foreground">
            团队管理、能力诊断、定制化培训方案
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <UsersIcon className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>团队管理后台</CardTitle>
              <CardDescription>管理团队成员和学习进度</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">查看团队整体学习情况</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="mb-2 h-8 w-8 text-secondary" />
              <CardTitle>能力诊断报告</CardTitle>
              <CardDescription>团队能力地图和ROI分析</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">生成详细的培训效果报告</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>定制化方案</CardTitle>
              <CardDescription>根据企业需求定制培训内容</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">创建专属学习路径</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>功能开发中</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">企业服务功能正在开发中，敬请期待...</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
