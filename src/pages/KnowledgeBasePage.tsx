import { useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import IndustryTerms from '@/components/IndustryTerms';
import CountryCultureGuide from '@/components/CountryCultureGuide';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Globe, Briefcase, TrendingUp, ExternalLink, Loader2, RefreshCw, FileText } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';

interface MarketInsight {
  id: string;
  title: string;
  url: string;
  summary: string;
  source: string;
  thumbnail?: string;
  isLoading?: boolean;
  content?: string;
}

export default function KnowledgeBasePage() {
  const [selectedInsight, setSelectedInsight] = useState<MarketInsight | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; name: string; flag: string } | null>(null);
  const [cultureDialogOpen, setCultureDialogOpen] = useState(false);

  const countries = [
    { 
      code: 'TH', 
      name: '泰国', 
      flag: '🇹🇭', 
      courses: 12,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
      description: '微笑之国，佛教文化深厚'
    },
    { 
      code: 'VN', 
      name: '越南', 
      flag: '🇻🇳', 
      courses: 10,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
      description: '快速发展的新兴市场'
    },
    { 
      code: 'ID', 
      name: '印尼', 
      flag: '🇮🇩', 
      courses: 8,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
      description: '东盟最大经济体'
    },
    { 
      code: 'SG', 
      name: '新加坡', 
      flag: '🇸🇬', 
      courses: 15,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
      description: '亚洲金融与科技中心'
    }
  ];

  // 处理国家点击
  const handleCountryClick = (country: { code: string; name: string; flag: string }) => {
    setSelectedCountry(country);
    setCultureDialogOpen(true);
  };

  // 市场洞察链接列表
  const marketInsights: MarketInsight[] = [
    {
      id: '1',
      title: '全球经济综述（2026年12月）',
      url: 'https://mp.weixin.qq.com/s/wftJdklvuVphu7TNl-8s1Q',
      summary: '开泰研究中心预测，2026年全球经济将进入复苏新周期，受软着陆预期影响，美联储将在年底维持稳定利率策略...',
      source: '格拉威亚东南亚环保新能源网',
      thumbnail: '🌍'
    },
    {
      id: '2',
      title: '2026年越南工业房地产的"黄金时代"',
      url: 'https://mp.weixin.qq.com/s/wftJdklvuVphu7TNl-8s1Q',
      summary: '越南工业房地产市场在2026年迎来爆发式增长，高科技产业园区吸引了前所未有的超大规模外资投资...',
      source: '格拉威亚东南亚环保新能源网',
      thumbnail: '🏭'
    },
    {
      id: '3',
      title: '泰国央行2026年政策指引：稳定中寻求增长',
      url: 'https://mp.weixin.qq.com/s/wftJdklvuVphu7TNl-8s1Q',
      summary: '泰国银行货币政策委员会在2026年第一季度议息会议中明确，将通过结构性金融工具支持数字经济转型...',
      source: '格拉威亚东南亚环保新能源网',
      thumbnail: '🏦'
    },
    {
      id: '4',
      title: '东盟数字经济动态（2026年Q3）',
      url: 'https://mp.weixin.qq.com/s/wftJdklvuVphu7TNl-8s1Q',
      summary: '2026年第三季度，东盟内部数字支付互联互通实现重大突破，马来西亚与泰国实现跨境扫码实时结算...',
      source: '格拉威亚东南亚环保新能源网',
      thumbnail: '📊'
    },
    {
      id: '5',
      title: '印尼经济展望：2026年数字基建新版图',
      url: 'https://mp.weixin.qq.com/s/wftJdklvuVphu7TNl-8s1Q',
      summary: '印尼政府在2026年投入巨资建设覆盖全境的5G网络，预计将带动其电商和金融科技行业年增速超过30%...',
      source: '格拉威亚东南亚环保新能源网',
      thumbnail: '🇮🇩'
    }
  ];

  // 加载市场洞察详情
  const loadInsightDetail = async (insight: MarketInsight) => {
    setSelectedInsight(insight);
    setIsLoadingDetail(true);

    try {
      const { data, error } = await supabase.functions.invoke('web-summary', {
        body: {
          url: insight.url,
          query: `请帮我提取这篇文章"${insight.title}"的关键洞察、商务机会和重要趋势，用清晰的结构化方式呈现`
        }
      });

      if (error) {
        const errorMsg = await error?.context?.text?.() || error.message;
        throw new Error(errorMsg);
      }

      if (!data.success) {
        throw new Error(data.error || '获取市场洞察失败');
      }

      setSelectedInsight({
        ...insight,
        content: data.content
      });
      toast.success('市场洞察已加载');
    } catch (error) {
      console.error('加载市场洞察失败:', error);
      toast.error(error instanceof Error ? error.message : '加载失败，请重试');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <main className="container space-y-6 px-4 py-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">商务知识库</h1>
          <p className="text-muted-foreground">
            系统学习东盟各国商务文化、行业术语和市场动态
          </p>
        </div>

        <Tabs defaultValue="culture">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="culture">
              <Globe className="mr-2 h-4 w-4" />
              国别文化指南
            </TabsTrigger>
            <TabsTrigger value="industry">
              <Briefcase className="mr-2 h-4 w-4" />
              行业术语库
            </TabsTrigger>
            <TabsTrigger value="market">
              <TrendingUp className="mr-2 h-4 w-4" />
              市场洞察
            </TabsTrigger>
          </TabsList>

          <TabsContent value="culture" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {countries.map(country => (
                <Card 
                  key={country.name} 
                  className="group cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-lg active:scale-95"
                  onClick={() => handleCountryClick(country)}
                >
                  {/* 国家图片 */}
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={country.image} 
                      alt={country.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    {/* 国旗和国家代码 */}
                    <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                      <div className="text-3xl">{country.flag}</div>
                      <div className="rounded bg-black/40 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                        {country.code}
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{country.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {country.description}
                    </CardDescription>
                    <div className="pt-2">
                      <Badge variant="secondary" className="bg-orange-500 text-white hover:bg-orange-600">
                        {country.courses} 门课程
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="industry">
            <Card>
              <CardHeader>
                <CardTitle>行业术语与实务库</CardTitle>
                <CardDescription>
                  按行业分类的专业术语和实务知识，支持搜索和收藏
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IndustryTerms />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* 左侧：洞察列表 */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base">东盟市场洞察</CardTitle>
                  <CardDescription className="text-xs">
                    实时更新的市场动态
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-1 px-3 pb-3">
                      {marketInsights.map(insight => (
                        <Card
                          key={insight.id}
                          className={`cursor-pointer transition-all hover:border-primary ${
                            selectedInsight?.id === insight.id ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => loadInsightDetail(insight)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start space-x-3">
                              <div className="text-3xl">{insight.thumbnail}</div>
                              <div className="flex-1 space-y-1">
                                <div className="font-medium text-sm leading-tight">
                                  {insight.title}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {insight.summary}
                                </p>
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <FileText className="h-3 w-3" />
                                  <span>{insight.source}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* 右侧：详细内容 */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-base">
                        {selectedInsight ? selectedInsight.title : '选择一个洞察查看详情'}
                      </CardTitle>
                      {selectedInsight && (
                        <CardDescription className="text-xs">
                          来源：{selectedInsight.source}
                        </CardDescription>
                      )}
                    </div>
                    {selectedInsight && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadInsightDetail(selectedInsight)}
                        disabled={isLoadingDetail}
                      >
                        {isLoadingDetail ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            加载中
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            刷新
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!selectedInsight ? (
                    <div className="flex h-[550px] items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-sm text-muted-foreground">
                          请从左侧列表选择一个市场洞察
                        </p>
                      </div>
                    </div>
                  ) : isLoadingDetail && !selectedInsight.content ? (
                    <div className="flex h-[550px] items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                        <p className="mt-4 text-sm text-muted-foreground">正在分析市场洞察...</p>
                      </div>
                    </div>
                  ) : selectedInsight.content ? (
                    <ScrollArea className="h-[550px]">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="whitespace-pre-wrap">{selectedInsight.content}</div>
                      </div>
                      
                      <div className="mt-6 border-t pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={selectedInsight.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            查看原文
                          </a>
                        </Button>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex h-[550px] items-center justify-center">
                      <div className="text-center">
                        <p className="text-muted-foreground">点击刷新按钮加载内容</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* 文化指南对话框 */}
      <Dialog open={cultureDialogOpen} onOpenChange={setCultureDialogOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-4 md:p-6 pb-0">
            <DialogTitle>东盟国别文化指南</DialogTitle>
            <DialogDescription>
              深入了解东盟国家的商务礼仪、沟通风格和禁忌
            </DialogDescription>
          </DialogHeader>
          {selectedCountry && (
            <div className="px-4 md:px-6 pb-4 md:pb-6 overflow-hidden">
              <CountryCultureGuide
                countryCode={selectedCountry.code}
                countryName={selectedCountry.name}
                countryFlag={selectedCountry.flag}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
