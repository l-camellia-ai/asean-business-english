import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Star, BookOpen, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Term {
  id: string;
  term: string;
  translation: string;
  definition: string;
  example: string;
  industry: string;
  favorite: boolean;
}

export default function IndustryTerms() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // 行业分类
  const industries = [
    { id: 'all', name: '全部', icon: '📚' },
    { id: 'manufacturing', name: '制造业', icon: '🏭' },
    { id: 'fintech', name: '金融科技', icon: '💰' },
    { id: 'tourism', name: '旅游业', icon: '✈️' },
    { id: 'agriculture', name: '农业', icon: '🌾' },
    { id: 'ecommerce', name: '跨境电商', icon: '🛒' },
    { id: 'logistics', name: '物流', icon: '🚚' }
  ];

  // 术语数据
  const terms: Term[] = [
    // 制造业
    {
      id: '1',
      term: 'Supply Chain',
      translation: '供应链',
      definition: '从原材料采购到产品交付给最终客户的整个流程',
      example: 'We need to optimize our supply chain to reduce costs and improve efficiency.',
      industry: 'manufacturing',
      favorite: false
    },
    {
      id: '2',
      term: 'Quality Control',
      translation: '质量控制',
      definition: '确保产品或服务符合规定标准的过程',
      example: 'Our quality control team inspects every batch before shipment.',
      industry: 'manufacturing',
      favorite: false
    },
    {
      id: '3',
      term: 'Lead Time',
      translation: '交货期',
      definition: '从订单确认到产品交付所需的时间',
      example: 'The lead time for this order is approximately 4-6 weeks.',
      industry: 'manufacturing',
      favorite: false
    },
    {
      id: '4',
      term: 'MOQ (Minimum Order Quantity)',
      translation: '最小订购量',
      definition: '供应商要求的最小订购数量',
      example: 'Our MOQ for this product is 1000 units.',
      industry: 'manufacturing',
      favorite: false
    },
    // 金融科技
    {
      id: '5',
      term: 'Digital Wallet',
      translation: '数字钱包',
      definition: '用于存储和管理数字货币或支付信息的电子应用',
      example: 'Our digital wallet supports multiple currencies and payment methods.',
      industry: 'fintech',
      favorite: false
    },
    {
      id: '6',
      term: 'Cross-border Payment',
      translation: '跨境支付',
      definition: '不同国家或地区之间的资金转移',
      example: 'We provide secure cross-border payment solutions for ASEAN businesses.',
      industry: 'fintech',
      favorite: false
    },
    {
      id: '7',
      term: 'KYC (Know Your Customer)',
      translation: '客户身份识别',
      definition: '金融机构验证客户身份的程序',
      example: 'Please complete the KYC process to activate your account.',
      industry: 'fintech',
      favorite: false
    },
    {
      id: '8',
      term: 'Blockchain',
      translation: '区块链',
      definition: '分布式数据库技术，用于记录交易信息',
      example: 'We use blockchain technology to ensure transaction transparency.',
      industry: 'fintech',
      favorite: false
    },
    // 旅游业
    {
      id: '9',
      term: 'Package Tour',
      translation: '套餐旅游',
      definition: '包含交通、住宿、餐饮等服务的旅游产品',
      example: 'We offer customized package tours to Thailand and Vietnam.',
      industry: 'tourism',
      favorite: false
    },
    {
      id: '10',
      term: 'Itinerary',
      translation: '行程安排',
      definition: '旅行的详细计划和时间表',
      example: 'Please review the itinerary and let us know if you need any changes.',
      industry: 'tourism',
      favorite: false
    },
    {
      id: '11',
      term: 'Accommodation',
      translation: '住宿',
      definition: '旅行期间的居住安排',
      example: 'The package includes 5-star accommodation in Singapore.',
      industry: 'tourism',
      favorite: false
    },
    {
      id: '12',
      term: 'Visa on Arrival',
      translation: '落地签证',
      definition: '抵达目的地后办理的签证',
      example: 'Chinese tourists can get a visa on arrival in Thailand.',
      industry: 'tourism',
      favorite: false
    },
    // 农业
    {
      id: '13',
      term: 'Organic Farming',
      translation: '有机农业',
      definition: '不使用化学农药和肥料的农业生产方式',
      example: 'We source our products from certified organic farming operations.',
      industry: 'agriculture',
      favorite: false
    },
    {
      id: '14',
      term: 'Sustainable Agriculture',
      translation: '可持续农业',
      definition: '保护环境和资源的长期农业实践',
      example: 'Our company is committed to sustainable agriculture practices.',
      industry: 'agriculture',
      favorite: false
    },
    {
      id: '15',
      term: 'Export Certificate',
      translation: '出口证书',
      definition: '证明产品符合出口要求的官方文件',
      example: 'Please provide the export certificate for customs clearance.',
      industry: 'agriculture',
      favorite: false
    },
    // 跨境电商
    {
      id: '16',
      term: 'Dropshipping',
      translation: '代发货',
      definition: '零售商不持有库存，由供应商直接发货给客户',
      example: 'We offer dropshipping services for ASEAN markets.',
      industry: 'ecommerce',
      favorite: false
    },
    {
      id: '17',
      term: 'Conversion Rate',
      translation: '转化率',
      definition: '访客转化为客户的比例',
      example: 'Our conversion rate increased by 25% after optimizing the checkout process.',
      industry: 'ecommerce',
      favorite: false
    },
    {
      id: '18',
      term: 'Fulfillment',
      translation: '订单履行',
      definition: '从接收订单到交付产品的整个过程',
      example: 'We provide end-to-end fulfillment services for online retailers.',
      industry: 'ecommerce',
      favorite: false
    },
    // 物流
    {
      id: '19',
      term: 'Last Mile Delivery',
      translation: '最后一公里配送',
      definition: '从配送中心到最终客户的配送过程',
      example: 'We specialize in last mile delivery solutions in urban areas.',
      industry: 'logistics',
      favorite: false
    },
    {
      id: '20',
      term: 'Customs Clearance',
      translation: '清关',
      definition: '货物进出口时的海关手续办理',
      example: 'The customs clearance process usually takes 2-3 business days.',
      industry: 'logistics',
      favorite: false
    },
    // 制造业补充
    {
      id: '21',
      term: 'OEM (Original Equipment Manufacturer)',
      translation: '原始设备制造商',
      definition: '为其他品牌生产产品的制造商',
      example: 'We are an OEM partner for several international brands.',
      industry: 'manufacturing',
      favorite: false
    },
    {
      id: '22',
      term: 'Just-in-Time (JIT)',
      translation: '准时制生产',
      definition: '按需生产，减少库存的生产方式',
      example: 'Our factory operates on a JIT manufacturing system.',
      industry: 'manufacturing',
      favorite: false
    },
    {
      id: '23',
      term: 'Capacity Planning',
      translation: '产能规划',
      definition: '确定生产设施所需资源的过程',
      example: 'We need to review our capacity planning for next quarter.',
      industry: 'manufacturing',
      favorite: false
    },
    // 金融科技补充
    {
      id: '24',
      term: 'API Integration',
      translation: 'API集成',
      definition: '将不同系统通过应用程序接口连接',
      example: 'Our platform supports seamless API integration with major banks.',
      industry: 'fintech',
      favorite: false
    },
    {
      id: '25',
      term: 'Compliance',
      translation: '合规',
      definition: '遵守相关法律法规和行业标准',
      example: 'We ensure full compliance with ASEAN financial regulations.',
      industry: 'fintech',
      favorite: false
    },
    {
      id: '26',
      term: 'Remittance',
      translation: '汇款',
      definition: '跨境资金转移服务',
      example: 'Our remittance service offers competitive exchange rates.',
      industry: 'fintech',
      favorite: false
    },
    // 旅游业补充
    {
      id: '27',
      term: 'Travel Insurance',
      translation: '旅游保险',
      definition: '为旅行期间可能发生的风险提供保障',
      example: 'We recommend purchasing travel insurance before your trip.',
      industry: 'tourism',
      favorite: false
    },
    {
      id: '28',
      term: 'Guided Tour',
      translation: '导游服务',
      definition: '由专业导游带领的旅游活动',
      example: 'The package includes guided tours of major attractions.',
      industry: 'tourism',
      favorite: false
    },
    {
      id: '29',
      term: 'Peak Season',
      translation: '旅游旺季',
      definition: '旅游需求最高的时期',
      example: 'Prices are higher during peak season in December.',
      industry: 'tourism',
      favorite: false
    },
    // 农业补充
    {
      id: '30',
      term: 'Traceability',
      translation: '可追溯性',
      definition: '追踪产品从生产到销售全过程的能力',
      example: 'Our products have full traceability from farm to table.',
      industry: 'agriculture',
      favorite: false
    },
    {
      id: '31',
      term: 'Cold Chain',
      translation: '冷链',
      definition: '保持产品低温的供应链系统',
      example: 'We maintain a complete cold chain for fresh produce.',
      industry: 'agriculture',
      favorite: false
    },
    {
      id: '32',
      term: 'Phytosanitary Certificate',
      translation: '植物检疫证书',
      definition: '证明植物产品符合进口国检疫要求的文件',
      example: 'A phytosanitary certificate is required for exporting fruits.',
      industry: 'agriculture',
      favorite: false
    },
    // 跨境电商补充
    {
      id: '33',
      term: 'SKU (Stock Keeping Unit)',
      translation: '库存单位',
      definition: '用于识别和追踪库存的唯一编码',
      example: 'Each product variant has a unique SKU number.',
      industry: 'ecommerce',
      favorite: false
    },
    {
      id: '34',
      term: 'Abandoned Cart',
      translation: '购物车放弃',
      definition: '用户将商品加入购物车但未完成购买',
      example: 'We send reminder emails to reduce abandoned cart rates.',
      industry: 'ecommerce',
      favorite: false
    },
    {
      id: '35',
      term: 'Marketplace',
      translation: '电商平台',
      definition: '连接买家和卖家的在线交易平台',
      example: 'We sell our products on major ASEAN marketplaces.',
      industry: 'ecommerce',
      favorite: false
    },
    // 物流补充
    {
      id: '36',
      term: 'Freight Forwarder',
      translation: '货运代理',
      definition: '安排货物运输的中介服务商',
      example: 'Our freight forwarder handles all international shipments.',
      industry: 'logistics',
      favorite: false
    },
    {
      id: '37',
      term: 'Bill of Lading',
      translation: '提单',
      definition: '货物运输的法律文件和收据',
      example: 'Please sign the bill of lading upon receiving the goods.',
      industry: 'logistics',
      favorite: false
    },
    {
      id: '38',
      term: 'Warehouse Management System (WMS)',
      translation: '仓库管理系统',
      definition: '管理仓库操作的软件系统',
      example: 'Our WMS tracks inventory in real-time across all warehouses.',
      industry: 'logistics',
      favorite: false
    },
    {
      id: '39',
      term: 'Incoterms',
      translation: '国际贸易术语',
      definition: '定义买卖双方责任的国际标准术语',
      example: 'We typically use FOB or CIF incoterms for international orders.',
      industry: 'logistics',
      favorite: false
    },
    {
      id: '40',
      term: 'Consolidation',
      translation: '拼箱',
      definition: '将多个小批量货物合并运输',
      example: 'Consolidation helps reduce shipping costs for small orders.',
      industry: 'logistics',
      favorite: false
    }
  ];

  // 切换收藏
  const toggleFavorite = (termId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(termId)) {
        newFavorites.delete(termId);
      } else {
        newFavorites.add(termId);
      }
      return newFavorites;
    });
  };

  // 过滤术语
  const filteredTerms = terms.filter(term => {
    const matchesIndustry = selectedIndustry === 'all' || term.industry === selectedIndustry;
    const matchesSearch = searchQuery === '' || 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.translation.includes(searchQuery) ||
      term.definition.includes(searchQuery);
    return matchesIndustry && matchesSearch;
  });

  // 收藏的术语
  const favoriteTerms = terms.filter(term => favorites.has(term.id));

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索术语、翻译或定义..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="browse">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">
            <BookOpen className="mr-2 h-4 w-4" />
            浏览术语
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Star className="mr-2 h-4 w-4" />
            我的收藏 ({favorites.size})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* 行业分类 */}
          <div className="flex flex-wrap gap-2">
            {industries.map(industry => (
              <Button
                key={industry.id}
                variant={selectedIndustry === industry.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedIndustry(industry.id)}
              >
                <span className="mr-1">{industry.icon}</span>
                {industry.name}
              </Button>
            ))}
          </div>

          {/* 术语列表 */}
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {filteredTerms.length > 0 ? (
                filteredTerms.map(term => (
                  <Card key={term.id} className="transition-all hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-lg">{term.term}</CardTitle>
                            <Badge variant="secondary">{term.translation}</Badge>
                          </div>
                          <CardDescription>
                            {industries.find(i => i.id === term.industry)?.icon}{' '}
                            {industries.find(i => i.id === term.industry)?.name}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(term.id)}
                        >
                          <Star
                            className={cn(
                              'h-5 w-5',
                              favorites.has(term.id) && 'fill-yellow-400 text-yellow-400'
                            )}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">定义</div>
                        <p className="text-sm">{term.definition}</p>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">例句</div>
                        <p className="text-sm italic">{term.example}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Volume2 className="mr-2 h-4 w-4" />
                        发音
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">未找到匹配的术语</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="favorites">
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {favoriteTerms.length > 0 ? (
                favoriteTerms.map(term => (
                  <Card key={term.id} className="transition-all hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-lg">{term.term}</CardTitle>
                            <Badge variant="secondary">{term.translation}</Badge>
                          </div>
                          <CardDescription>
                            {industries.find(i => i.id === term.industry)?.icon}{' '}
                            {industries.find(i => i.id === term.industry)?.name}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(term.id)}
                        >
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">定义</div>
                        <p className="text-sm">{term.definition}</p>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">例句</div>
                        <p className="text-sm italic">{term.example}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Volume2 className="mr-2 h-4 w-4" />
                        发音
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-12 text-center">
                  <Star className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">还没有收藏的术语</p>
                  <p className="text-sm text-muted-foreground">点击术语卡片上的星标图标添加收藏</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
