import NavigationBar from '@/components/NavigationBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, CreditCard, Building2 } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <main className="container space-y-6 px-4 py-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">个人中心</h1>
          <p className="text-muted-foreground">
            管理你的账户信息和学习设置
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          {/* 侧边栏 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt="用户头像" />
                  <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                    用
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-semibold text-foreground">演示用户</p>
                  <p className="text-sm text-muted-foreground">demo@example.com</p>
                </div>
                <div className="flex w-full items-center justify-around border-t border-border pt-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">5</p>
                    <p className="text-xs text-muted-foreground">等级</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-xl font-bold text-secondary">1250</p>
                    <p className="text-xs text-muted-foreground">经验值</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 主内容区 */}
          <Card>
            <Tabs defaultValue="profile">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">
                    <User className="mr-2 h-4 w-4" />
                    个人信息
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="mr-2 h-4 w-4" />
                    学习设置
                  </TabsTrigger>
                  <TabsTrigger value="subscription">
                    <CreditCard className="mr-2 h-4 w-4" />
                    订阅管理
                  </TabsTrigger>
                  <TabsTrigger value="enterprise">
                    <Building2 className="mr-2 h-4 w-4" />
                    企业绑定
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
                <TabsContent value="profile" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">用户名</Label>
                    <Input id="username" placeholder="输入用户名" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input id="email" type="email" placeholder="输入邮箱" />
                  </div>
                  <Button>保存更改</Button>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>学习偏好设置</CardTitle>
                      <CardDescription>自定义你的学习体验</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">功能开发中...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="subscription">
                  <Card>
                    <CardHeader>
                      <CardTitle>订阅管理</CardTitle>
                      <CardDescription>查看和管理你的订阅</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">当前使用免费版</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="enterprise">
                  <Card>
                    <CardHeader>
                      <CardTitle>企业绑定</CardTitle>
                      <CardDescription>绑定到企业账户</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">暂未绑定企业</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
}
