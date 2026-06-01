import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, Briefcase, Utensils, Gift, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CountryCultureGuideProps {
  countryCode: string;
  countryName: string;
  countryFlag: string;
}

interface CultureSection {
  title: string;
  icon: React.ReactNode;
  image: string;
  content: string[];
  dos: string[];
  donts: string[];
}

export default function CountryCultureGuide({
  countryCode,
  countryName,
  countryFlag
}: CountryCultureGuideProps) {
  const [selectedTab, setSelectedTab] = useState('overview');

  // 国家文化数据
  const cultureData: Record<string, {
    overview: string;
    sections: CultureSection[];
  }> = {
    'TH': {
      overview: '泰国是一个佛教国家，文化深受佛教影响。泰国人重视礼貌、尊重和"面子"（Kreng Jai），商务交往中强调建立个人关系和信任。泰国商务文化融合了传统价值观和现代商业实践，理解这些文化特点对成功开展商务活动至关重要。',
      sections: [
        {
          title: '商务礼仪',
          icon: <Briefcase className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_606921ff-9c58-4583-b025-0d384268ca5c.jpg',
          content: [
            '**问候方式：** 使用"wai"手势（双手合十，微微鞠躬）表示尊重，地位越高的人，双手合十的位置越高',
            '**名片交换：** 双手递交和接收名片，仔细阅读后再收起',
            '**着装要求：** 正式商务场合穿着保守，男士穿西装打领带，女士穿套装或正式连衣裙',
            '**准时观念：** 虽然泰国人对时间较为灵活，但外国商务人士应准时到达',
            '**会议礼仪：** 会议通常以社交寒暄开始，不要急于进入正题'
          ],
          dos: [
            '保持微笑和友好的态度',
            '尊重长辈和地位较高的人',
            '使用敬语和礼貌用语',
            '耐心倾听，不要打断对方',
            '建立个人关系和信任'
          ],
          donts: [
            '不要触摸他人的头部（被视为神圣）',
            '不要用脚指向人或物品',
            '不要在公共场合大声说话或发脾气',
            '不要批评王室或佛教',
            '不要过于直接或咄咄逼人'
          ]
        },
        {
          title: '沟通风格',
          icon: <Users className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_7534249f-95cc-4046-ae86-52f314dc1513.jpg',
          content: [
            '**间接沟通：** 泰国人倾向于间接表达，避免直接说"不"',
            '**非语言信号：** 注意肢体语言和面部表情，它们传达重要信息',
            '**保全面子：** 避免让对方在公开场合感到尴尬或丢脸',
            '**等级意识：** 尊重组织内的等级制度，决策通常由高层做出',
            '**建立关系：** 商务关系建立在个人信任基础上，需要时间培养'
          ],
          dos: [
            '使用委婉的语言表达不同意见',
            '通过第三方传达敏感信息',
            '给对方留出思考和回应的时间',
            '在非正式场合建立个人关系',
            '表现出对泰国文化的兴趣和尊重'
          ],
          donts: [
            '不要在公开场合批评或指责',
            '不要强迫对方立即做出决定',
            '不要忽视非语言信号',
            '不要越级沟通',
            '不要表现出不耐烦'
          ]
        },
        {
          title: '商务宴请',
          icon: <Utensils className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8e6277bd-4a9f-4fb9-b000-4719df6fdff7.jpg',
          content: [
            '**用餐礼仪：** 使用勺子和叉子，勺子在右手，叉子在左手',
            '**座位安排：** 等待主人安排座位，最尊贵的客人坐在主人右侧',
            '**敬酒文化：** 敬酒时说"Chok Dee"（祝好运），碰杯时杯子略低于长辈',
            '**食物分享：** 泰国菜通常是共享式的，从公共盘中取食物到自己的盘子',
            '**餐桌话题：** 避免谈论政治、宗教等敏感话题，多聊家庭、旅游等轻松话题'
          ],
          dos: [
            '等主人开始用餐后再动筷',
            '品尝所有提供的菜肴',
            '称赞食物的美味',
            '适量饮酒，不要喝醉',
            '用餐结束后感谢主人的款待'
          ],
          donts: [
            '不要用叉子直接送食物入口',
            '不要将筷子插在米饭中（类似祭祀）',
            '不要浪费食物',
            '不要在用餐时擤鼻涕',
            '不要过早离席'
          ]
        },
        {
          title: '送礼文化',
          icon: <Gift className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_43b0ecee-cbd0-45f4-bead-85db4ecd4bd7.jpg',
          content: [
            '**送礼时机：** 初次见面、节日庆典、商务合作达成时',
            '**礼物选择：** 选择有品质但不过于昂贵的礼物，避免过于个人化的物品',
            '**包装要求：** 礼物应精美包装，避免使用黑色或白色包装纸',
            '**赠送方式：** 双手递交礼物，接受礼物时也应双手接收',
            '**打开礼物：** 通常不会当面打开礼物，以示谦逊'
          ],
          dos: [
            '选择具有文化意义的礼物',
            '赠送公司纪念品或特产',
            '考虑对方的兴趣爱好',
            '附上手写的祝福卡片',
            '尊重对方的宗教信仰'
          ],
          donts: [
            '不要送刀具或剪刀（象征断绝关系）',
            '不要送钟表（谐音"送终"）',
            '不要送手帕（象征分离）',
            '不要送酒类给虔诚的佛教徒',
            '不要期待立即收到回礼'
          ]
        }
      ]
    },
    'VN': {
      overview: '越南是一个快速发展的新兴市场，商务文化融合了儒家传统和法国殖民影响。越南人重视家庭、尊重长辈和集体主义。在商务交往中，建立个人关系和信任至关重要，决策过程通常需要时间和多方协商。',
      sections: [
        {
          title: '商务礼仪',
          icon: <Briefcase className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_46582566-a339-4e50-b400-006c7adee9c3.jpg',
          content: [
            '**问候方式：** 握手是标准的商务问候方式，同时可以轻微点头示意',
            '**名片交换：** 双手递交和接收名片，仔细阅读后再收起，表示尊重',
            '**着装要求：** 商务场合穿着正式保守，男士穿西装，女士穿套装',
            '**准时观念：** 准时到达会议，但要理解越南人可能会迟到',
            '**等级制度：** 尊重组织内的等级，决策通常由高层做出'
          ],
          dos: [
            '使用正式的称呼和头衔',
            '表现出对越南文化的尊重',
            '耐心等待决策过程',
            '建立长期的商务关系',
            '参加社交活动增进了解'
          ],
          donts: [
            '不要在公开场合批评或指责',
            '不要过于直接或咄咄逼人',
            '不要忽视等级制度',
            '不要期待快速决策',
            '不要在商务场合谈论战争'
          ]
        },
        {
          title: '沟通风格',
          icon: <Users className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_9d46284f-f092-46cf-88eb-7bd6c4260cda.jpg',
          content: [
            '**间接沟通：** 越南人倾向于间接表达，避免直接冲突',
            '**保全面子：** 非常重视"面子"，避免让对方感到尴尬',
            '**集体主义：** 决策通常需要团队共识，而非个人决定',
            '**关系导向：** 商务关系建立在个人信任基础上',
            '**非语言沟通：** 注意肢体语言和面部表情的含义'
          ],
          dos: [
            '使用委婉的语言表达意见',
            '通过第三方传达敏感信息',
            '给予充足的思考时间',
            '在非正式场合建立关系',
            '表现出耐心和理解'
          ],
          donts: [
            '不要公开批评或反驳',
            '不要强迫立即做决定',
            '不要忽视团队意见',
            '不要表现出傲慢',
            '不要过于激进'
          ]
        },
        {
          title: '商务宴请',
          icon: <Utensils className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_35185832-1372-4f2b-81cc-ed176063672f.jpg',
          content: [
            '**用餐礼仪：** 使用筷子和勺子，等长辈开始用餐后再动筷',
            '**座位安排：** 最尊贵的客人坐在主人对面或右侧',
            '**敬酒文化：** 敬酒时说"Một, hai, ba, vô!"（一、二、三，干杯！）',
            '**食物分享：** 越南菜通常是共享式的，从公共盘中取食物',
            '**餐桌话题：** 谈论家庭、美食、旅游等轻松话题'
          ],
          dos: [
            '品尝所有提供的菜肴',
            '称赞食物的美味',
            '适量饮酒，不要拒绝敬酒',
            '用餐结束后感谢主人',
            '主动参与敬酒活动'
          ],
          donts: [
            '不要将筷子插在米饭中',
            '不要浪费食物',
            '不要用筷子指向他人',
            '不要在用餐时擤鼻涕',
            '不要过早离席'
          ]
        },
        {
          title: '送礼文化',
          icon: <Gift className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_a38bd070-d33f-418a-9977-21fd8d081d07.jpg',
          content: [
            '**送礼时机：** 春节（Tết）、中秋节、商务合作达成时',
            '**礼物选择：** 选择有品质的礼物，如茶叶、酒类、特产',
            '**包装要求：** 礼物应精美包装，使用红色或金色包装纸',
            '**赠送方式：** 双手递交礼物，表示尊重',
            '**打开礼物：** 通常不会当面打开礼物'
          ],
          dos: [
            '选择具有文化意义的礼物',
            '赠送公司纪念品',
            '考虑对方的喜好',
            '附上祝福卡片',
            '尊重当地习俗'
          ],
          donts: [
            '不要送黑色或白色的礼物',
            '不要送钟表',
            '不要送刀具',
            '不要送手帕',
            '不要期待立即回礼'
          ]
        }
      ]
    },
    'ID': {
      overview: '印度尼西亚是世界上最大的穆斯林国家，伊斯兰教深刻影响着商务文化。印尼人重视和谐、尊重和集体主义。商务交往中强调建立个人关系，决策过程通常需要时间和共识。理解宗教习俗和文化禁忌对成功开展商务活动至关重要。',
      sections: [
        {
          title: '商务礼仪',
          icon: <Briefcase className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_73ca76e1-aa38-42cb-a5a7-c6fc57230abf.jpg',
          content: [
            '**问候方式：** 握手是标准方式，但要注意性别差异，等待女性先伸手',
            '**名片交换：** 用右手或双手递交和接收名片，左手被视为不洁',
            '**着装要求：** 穿着保守，尊重伊斯兰教习俗，女士应避免暴露',
            '**准时观念：** 虽然印尼人对时间较为灵活，但外国商务人士应准时',
            '**宗教尊重：** 尊重祈祷时间，避免在斋月期间安排午餐会议'
          ],
          dos: [
            '使用右手进行所有交互',
            '尊重伊斯兰教习俗和禁忌',
            '表现出耐心和理解',
            '建立个人关系和信任',
            '参加社交活动增进了解'
          ],
          donts: [
            '不要用左手递交物品',
            '不要触摸他人的头部',
            '不要在公开场合批评',
            '不要在斋月期间当众饮食',
            '不要表现出不耐烦'
          ]
        },
        {
          title: '沟通风格',
          icon: <Users className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_13c54ce3-03bc-4c6a-b21e-971bf83daf9c.jpg',
          content: [
            '**间接沟通：** 印尼人倾向于间接表达，避免直接冲突',
            '**和谐至上：** 维护和谐关系比直接表达意见更重要',
            '**集体决策：** 决策通常需要团队共识和多方协商',
            '**关系导向：** 商务关系建立在个人信任基础上',
            '**非正式沟通：** 重要决策常在非正式场合讨论'
          ],
          dos: [
            '使用委婉的语言',
            '通过第三方传达敏感信息',
            '给予充足的决策时间',
            '在非正式场合建立关系',
            '表现出对印尼文化的尊重'
          ],
          donts: [
            '不要公开批评或反驳',
            '不要强迫立即做决定',
            '不要忽视团队意见',
            '不要表现出傲慢',
            '不要过于直接'
          ]
        },
        {
          title: '商务宴请',
          icon: <Utensils className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_59e579cf-b88c-474b-93e7-19b457f1d286.jpg',
          content: [
            '**用餐礼仪：** 使用右手进食，左手不应触碰食物',
            '**清真食品：** 确保提供清真（Halal）食品，避免猪肉和酒精',
            '**座位安排：** 最尊贵的客人坐在主人右侧',
            '**用餐方式：** 传统上用手抓饭，但现代商务场合通常使用餐具',
            '**餐桌话题：** 谈论家庭、旅游、美食等轻松话题'
          ],
          dos: [
            '用右手进食',
            '品尝所有提供的菜肴',
            '称赞食物的美味',
            '尊重宗教饮食禁忌',
            '用餐结束后感谢主人'
          ],
          donts: [
            '不要用左手触碰食物',
            '不要提供猪肉或酒精',
            '不要浪费食物',
            '不要在用餐时擤鼻涕',
            '不要过早离席'
          ]
        },
        {
          title: '送礼文化',
          icon: <Gift className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_05879dfa-26ca-428d-b45d-0d085a4f03be.jpg',
          content: [
            '**送礼时机：** 开斋节（Eid al-Fitr）、商务合作达成时',
            '**礼物选择：** 选择符合伊斯兰教规的礼物，避免酒精和猪肉制品',
            '**包装要求：** 礼物应精美包装，使用绿色或金色包装纸',
            '**赠送方式：** 用右手或双手递交礼物',
            '**打开礼物：** 通常不会当面打开礼物'
          ],
          dos: [
            '选择符合宗教规范的礼物',
            '赠送公司纪念品或特产',
            '考虑对方的宗教信仰',
            '附上祝福卡片',
            '尊重当地习俗'
          ],
          donts: [
            '不要送酒类或猪肉制品',
            '不要送狗的图案或雕像',
            '不要送刀具',
            '不要送黑色或白色的礼物',
            '不要期待立即回礼'
          ]
        }
      ]
    },
    'SG': {
      overview: '新加坡是一个多元文化的国际商业中心，融合了华人、马来人、印度人和西方文化。新加坡商务文化高效、务实、注重规则和纪律。准时、专业和直接沟通是新加坡商务文化的核心特点。',
      sections: [
        {
          title: '商务礼仪',
          icon: <Briefcase className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ac54cdb1-5098-4c4b-a596-300c32ce7576.jpg',
          content: [
            '**问候方式：** 握手是标准方式，眼神交流表示诚意和尊重',
            '**名片交换：** 双手递交和接收名片，仔细阅读后再收起',
            '**着装要求：** 商务场合穿着正式专业，但可以适应热带气候',
            '**准时观念：** 准时非常重要，迟到被视为不尊重',
            '**效率至上：** 会议高效简洁，直奔主题'
          ],
          dos: [
            '准时到达会议',
            '准备充分的资料和数据',
            '直接清晰地表达观点',
            '遵守规则和法律',
            '表现出专业和效率'
          ],
          donts: [
            '不要迟到',
            '不要浪费时间',
            '不要过于随意',
            '不要违反规则',
            '不要表现出不专业'
          ]
        },
        {
          title: '沟通风格',
          icon: <Users className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_fae466ba-a452-4a23-95af-56f8da82315f.jpg',
          content: [
            '**直接沟通：** 新加坡人倾向于直接表达，但仍保持礼貌',
            '**效率导向：** 沟通简洁明了，注重结果',
            '**多元文化：** 理解和尊重不同文化背景',
            '**英语为主：** 商务沟通主要使用英语',
            '**数据驱动：** 决策基于数据和事实'
          ],
          dos: [
            '直接表达观点和需求',
            '提供详细的数据支持',
            '保持专业和礼貌',
            '尊重多元文化',
            '快速响应和跟进'
          ],
          donts: [
            '不要拐弯抹角',
            '不要浪费时间',
            '不要缺乏准备',
            '不要忽视细节',
            '不要延迟回复'
          ]
        },
        {
          title: '商务宴请',
          icon: <Utensils className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8f6d5535-fef4-4ed7-a04f-6d04233ff211.jpg',
          content: [
            '**用餐礼仪：** 根据餐厅类型使用相应餐具',
            '**多元美食：** 新加坡有丰富的多元文化美食',
            '**座位安排：** 通常按照地位和重要性安排座位',
            '**敬酒文化：** 敬酒时说"Cheers"或"Yam Seng"',
            '**餐桌话题：** 可以谈论商务话题，但也要注意社交礼仪'
          ],
          dos: [
            '尊重不同文化的饮食习惯',
            '品尝当地特色美食',
            '适量饮酒',
            '参与敬酒活动',
            '用餐结束后感谢主人'
          ],
          donts: [
            '不要浪费食物',
            '不要在用餐时大声喧哗',
            '不要忽视他人的饮食禁忌',
            '不要过度饮酒',
            '不要过早离席'
          ]
        },
        {
          title: '送礼文化',
          icon: <Gift className="h-5 w-5" />,
          image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d2bed1f9-51c7-4cf8-8e0b-f36a5a1b01fc.jpg',
          content: [
            '**送礼时机：** 春节、开斋节、屠妖节、圣诞节等多元文化节日',
            '**礼物选择：** 选择有品质但不过于昂贵的礼物',
            '**包装要求：** 礼物应精美包装，注意不同文化的颜色禁忌',
            '**赠送方式：** 双手递交礼物，表示尊重',
            '**打开礼物：** 通常不会当面打开礼物'
          ],
          dos: [
            '选择适合多元文化的礼物',
            '赠送公司纪念品',
            '考虑对方的文化背景',
            '附上祝福卡片',
            '尊重不同文化的习俗'
          ],
          donts: [
            '不要送过于昂贵的礼物（可能被视为贿赂）',
            '不要送违反文化禁忌的礼物',
            '不要送刀具',
            '不要送钟表',
            '不要期待立即回礼'
          ]
        }
      ]
    }
  };

  const currentCulture = cultureData[countryCode] || cultureData['TH'];

  return (
    <div className="flex h-[600px] max-h-[70vh] flex-col overflow-hidden">
      {/* 头部 */}
      <CardHeader className="border-b border-border flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-full overflow-hidden">
            <div className="flex items-center space-x-2">
              <span className="text-3xl flex-shrink-0">{countryFlag}</span>
              <CardTitle className="text-base md:text-lg truncate">{countryName}文化指南</CardTitle>
            </div>
            <CardDescription className="max-w-full text-xs md:text-sm line-clamp-3">
              {currentCulture.overview}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* 内容区域 */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full flex flex-col">
          <div className="flex-shrink-0 overflow-x-auto">
            <TabsList className="w-full min-w-max justify-start rounded-none border-b px-2 md:px-4">
              <TabsTrigger value="overview" className="text-xs md:text-sm">
                <BookOpen className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                概览
              </TabsTrigger>
              {currentCulture.sections.map((section, index) => (
                <TabsTrigger key={index} value={`section-${index}`} className="text-xs md:text-sm">
                  <span className="mr-1 md:mr-2 [&>svg]:h-3 [&>svg]:w-3 md:[&>svg]:h-4 md:[&>svg]:w-4">
                    {section.icon}
                  </span>
                  <span className="whitespace-nowrap">{section.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* 概览标签 */}
          <TabsContent value="overview" className="flex-1 overflow-hidden p-2 md:p-4 m-0">
            <ScrollArea className="h-full">
              <div className="space-y-4 pr-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg">文化概述</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {currentCulture.overview}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  {currentCulture.sections.map((section, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer transition-all hover:border-primary"
                      onClick={() => setSelectedTab(`section-${index}`)}
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <span className="[&>svg]:h-4 [&>svg]:w-4">{section.icon}</span>
                          <CardTitle className="text-sm md:text-base">{section.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                          {section.content[0]}
                        </p>
                        <Button variant="ghost" size="sm" className="mt-2 w-full text-xs md:text-sm">
                          查看详情 →
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* 各个文化部分标签 */}
          {currentCulture.sections.map((section, index) => (
            <TabsContent key={index} value={`section-${index}`} className="flex-1 overflow-hidden p-2 md:p-4 m-0">
              <ScrollArea className="h-full">
                <div className="space-y-4 md:space-y-6 pr-4">
                  {/* 图片展示 */}
                  <div className="overflow-hidden rounded-lg border bg-muted">
                    <img 
                      src={section.image} 
                      alt={section.title}
                      className="h-32 md:h-48 w-full object-cover"
                    />
                  </div>

                  {/* 内容说明 */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <span className="[&>svg]:h-4 [&>svg]:w-4 md:[&>svg]:h-5 md:[&>svg]:w-5">{section.icon}</span>
                        <CardTitle className="text-base md:text-lg">{section.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 md:space-y-3">
                      {section.content.map((item, idx) => (
                        <div key={idx} className="text-xs md:text-sm leading-relaxed break-words">
                          {item.split('**').map((part, i) =>
                            i % 2 === 0 ? (
                              <span key={i}>{part}</span>
                            ) : (
                              <strong key={i} className="font-semibold text-foreground">
                                {part}
                              </strong>
                            )
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* 应该做的 */}
                  <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <CardTitle className="text-sm md:text-base text-green-900 dark:text-green-100">应该做的（Do's）</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 md:space-y-2">
                        {section.dos.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs md:text-sm text-green-800 dark:text-green-200">
                            <CheckCircle2 className="mt-0.5 h-3 w-3 md:h-4 md:w-4 shrink-0" />
                            <span className="break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* 不应该做的 */}
                  <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <CardTitle className="text-sm md:text-base text-red-900 dark:text-red-100">不应该做的（Don'ts）</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 md:space-y-2">
                        {section.donts.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs md:text-sm text-red-800 dark:text-red-200">
                            <AlertCircle className="mt-0.5 h-3 w-3 md:h-4 md:w-4 shrink-0" />
                            <span className="break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </div>
  );
}
