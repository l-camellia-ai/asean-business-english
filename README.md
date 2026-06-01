# 智汇南洋 — 面向东盟 AI 商务英语实训平台

> 中国-东盟跨文化商务沟通智能实训平台 — 无风险、高仿真、游戏化、数据驱动的实战训练专家

## 项目简介

**东盟商语** 面向中国-东盟经贸往来中的语言障碍与文化隔阂，以 **AI 数字人 + 游戏化学习** 为核心模式，提供覆盖东盟主要国家的沉浸式商务英语实训服务。

### 解决的三大痛点

| 痛点 | 表现 | 解决方案 |
|------|------|----------|
| **口音多元，听不懂** | 东盟各国英语口音差异显著（新加坡英语、泰式英语、越南式英语等），传统培训只教标准英语 | 多口音模拟引擎，覆盖越南、泰国、印尼等 6 国口音 |
| **文化壁垒，不敢说** | 高语境文化背景下面子机制导致表达抑制，67.4% 驻东盟员工因"担心表达不当"放弃发言 | AI 数字人提供无风险模拟环境，反复练习不尴尬 |
| **场景缺失，学了没用** | 通用商务英语与真实跨境场景脱节，培训效果转化率不足 25% | 500+ 真实商务对话场景，覆盖跨境电商、制造业、旅游业 |

### 市场背景

- 2025 年中国与东盟贸易总值突破 **1.05 万亿美元**
- 中国对东盟直接投资存量超 **2100 亿美元**
- **65%** 以上在东盟运营的企业将语言文化障碍列为首要挑战
- 面向东盟的垂直商务语言培训市场尚属 **蓝海**

---

## 核心功能

### 🎭 情景实战

- **AI 情景对话工坊** — 与 AI 数字人进行多国口音商务谈判模拟
- **AI 电话工坊** — 模拟真实电话沟通场景，训练听力与应答能力
- **标准化情景模块** — 覆盖询盘、报价、合同、售后等全流程商务场景

### 🤖 AI 英语私教

- 支持 5 国数字人形象切换（越南、新加坡、马来西亚、印尼、菲律宾）
- 口型同步动画，视觉与听觉一致
- 实时语音交互 + AI 智能评分
- 基于阿里云百炼智能体的对话引擎 + CosyVoice 复刻音色语音合成

### 📚 商务知识库

- **国别商务文化指南** — 东盟 10 国商务礼仪、文化禁忌、谈判风格
- **行业术语与实务库** — 跨境电商、制造业、旅游业等核心行业双语术语
- **动态政策与市场洞察** — 实时追踪东盟经贸政策变化

### 🗺️ 学习地图

- 东盟 10 国市场开拓地图可视化
- **六维能力雷达图** — 语言准确性、文化适配性、商务策略、谈判技巧、沟通效率、跨文化意识
- 个人学习进度追踪

### 🏆 每日挑战

- 每日任务卡片（如"完成 1 次越南口音电话谈判"）
- 签到任务、限时挑战、连胜奖励
- 双倍经验值激励

### 👥 学习社区

- 个人成长展示墙
- 多维激励排行榜
- 专家问答

### 🏢 企业服务

- 团队管理后台
- 能力诊断报告
- 定制化方案管理

### 💎 AI 实训增强包

- 解锁无限次 AI 情景工坊评分
- 深度评测报告
- 订阅套餐管理

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite (rolldown-vite) |
| UI 组件 | Tailwind CSS 3 + Radix UI + shadcn/ui |
| 后端服务 | Supabase (Auth + PostgreSQL + Edge Functions + RLS) |
| 桌面端 | Electron 42 |
| 路由 | react-router-dom v7 |
| 图表 | Recharts |
| 动画 | Motion (Framer Motion) |
| AI 对话 | 阿里云百炼智能体 API |
| 语音合成 | CosyVoice v3.5-plus 复刻音色 |
| 包管理 | pnpm |
| 代码规范 | Biome + TypeScript |

---

## 项目结构

```
├── src/
│   ├── App.tsx                    # 入口：AuthProvider + ErrorBoundary + 登录弹窗
│   ├── routes.tsx                 # 路由配置（React.lazy 懒加载）
│   ├── main.tsx                   # Vite 入口
│   │
│   ├── pages/                     # 页面组件
│   │   ├── HomePage.tsx           # 首页：欢迎横幅 + 快速入口 + 学习地图 + 每日挑战
│   │   ├── ScenarioTrainingPage   # 情景实战：对话工坊 + 电话工坊 + 标准化训练
│   │   ├── AIDigitalHumanPage     # AI 数字人交互页
│   │   ├── DigitalHumanChatPage   # AI 英语私教（数字人对话）
│   │   ├── KnowledgeBasePage      # 商务知识库
│   │   ├── CommunityPage          # 学习社区
│   │   ├── EnterpriseServicePage  # 企业服务
│   │   ├── LearningMapPage        # 学习地图
│   │   ├── DailyChallengesPage    # 每日挑战
│   │   ├── PremiumPackagePage     # AI 实训增强包
│   │   ├── ProfilePage            # 个人中心
│   │   ├── LoginPage              # 登录/注册
│   │   ├── OnboardingPage         # 新用户引导
│   │   ├── AdminPage              # 管理后台
│   │   └── NotFound.tsx           # 404 页面
│   │
│   ├── components/
│   │   ├── AIDialogueChat.tsx     # AI 对话聊天组件
│   │   ├── AIPhoneCall.tsx        # AI 电话工坊组件
│   │   ├── AIDigitalHuman.tsx     # 数字人展示卡片
│   │   ├── StandardTraining.tsx   # 标准化训练模块
│   │   ├── NavigationBar.tsx      # 顶部导航栏
│   │   ├── LoginDialog.tsx        # 登录弹窗
│   │   ├── LearningMapVisual.tsx  # 学习地图可视化
│   │   ├── DailyChallengeCard.tsx # 每日挑战卡片
│   │   ├── RadarChart.tsx         # 六维能力雷达图
│   │   ├── CountryCultureGuide    # 国别文化指南
│   │   ├── IndustryTerms.tsx      # 行业术语库
│   │   ├── PhoneInput.tsx         # 国际手机号输入
│   │   ├── common/
│   │   │   ├── ErrorBoundary.tsx  # 全局错误边界
│   │   │   └── RouteGuard.tsx     # 路由守卫
│   │   └── ui/                    # shadcn/ui 基础组件
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx        # 认证上下文（Supabase Auth）
│   │
│   ├── db/
│   │   ├── supabase.ts            # Supabase 客户端初始化
│   │   └── api.ts                 # 数据库 API 封装
│   │
│   ├── services/
│   │   └── digitalHumanApi.ts     # 数字人对话 API
│   │
│   ├── hooks/                     # 自定义 Hooks
│   ├── types/                     # TypeScript 类型定义
│   └── lib/                       # 工具函数
│
├── supabase/
│   ├── migrations/                # 数据库迁移
│   │   ├── 00001_create_initial_schema.sql    # 核心表结构
│   │   ├── 00002_add_user_auth_system.sql     # 用户认证
│   │   ├── 00003_add_user_profile_fields.sql  # 扩展用户字段
│   │   └── 00004_fix_user_trigger_and_promote.sql
│   ├── functions/
│   │   ├── phone-call-dialogue/   # 电话对话 Edge Function
│   │   └── web-summary/           # 网页摘要 Edge Function
│   └── config.toml                # Supabase 配置
│
├── deploy/
│   ├── server/
│   │   ├── index.js               # Express 后端（百炼 API + CosyVoice TTS）
│   │   └── .env                   # 后端环境变量（需自行配置）
│   └── www/                       # 静态页面
│
├── electron/
│   └── main.js                    # Electron 主进程
│
├── public/                        # 静态资源
├── 启动.vbs                       # Windows 一键启动脚本
├── 停止.vbs                       # Windows 一键停止脚本
└── package.json
```

---

## 数据库设计

### 核心表

| 表名 | 说明 |
|------|------|
| `user_profiles` | 用户档案（等级、经验值、角色） |
| `learning_progress` | 学习进度（国家、场景、完成率、分数） |
| `ability_dimensions` | 六维能力数据 |
| `achievements` | 成就徽章定义 |
| `user_achievements` | 用户已获得的成就 |
| `daily_challenges` | 每日挑战任务 |
| `user_challenge_completions` | 挑战完成记录 |
| `leaderboard` | 排行榜 |
| `courses` | 课程内容 |
| `user_course_progress` | 课程学习进度 |
| `digital_humans` | 数字人角色（国家、行业、形象） |
| `digital_human_conversations` | 对话记录（含 AI 评分） |
| `subscription_packages` | 订阅套餐 |
| `user_subscriptions` | 用户订阅状态 |
| `enterprises` | 企业信息 |

### 安全策略

- **行级安全 (RLS)** — 用户只能访问自己的数据
- **公开读取** — 成就、挑战、课程、数字人等公共数据对所有人可见
- **SECURITY DEFINER** — 用户注册时自动创建 profile 的触发器函数

---

## 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 9

### 安装与启动

```bash
# 克隆仓库
git clone https://github.com/l-camellia-ai/asean-business-english.git
cd asean-business-english

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 http://localhost:5173

### 环境变量

创建 `.env` 文件：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 后端服务（AI 数字人语音对话）

```bash
cd deploy/server
# 创建 .env 文件
echo "BAILIAN_APP_ID=your_app_id" > .env
echo "BAILIAN_API_KEY=your_api_key" >> .env
# 安装依赖并启动
npm install
node index.js
```

### 一键启动（Windows）

双击 `启动.vbs`，自动启动后端 + 前端 + 打开浏览器。

### 构建 Electron 桌面版

```bash
pnpm electron:build
```

输出目录：`release/ASEAN-Business-English/`

---

## 商业模式

### 定价策略：基础订阅 + 核心功能增值

**企业客户**

| 版本 | 价格 | 说明 |
|------|------|------|
| 基础团队版 | ¥600/账号/年 | 标准数字人场景，每日 10 次 AI 评分 |
| 专业定制版 | ¥800-1,200/账号/年 | 轻量场景定制，无限次 AI 评分 |
| 旗舰解决方案版 | ¥50,000-200,000/项目 | 全方位定制 + 专属客户成功经理 |

**个人用户**

| 套餐 | 价格 | 说明 |
|------|------|------|
| 月度会员 | ¥50/月 | 完整课程 + 每日 5 次 AI 评分 |
| 年度会员 | ¥480/年 | 月度会员全部权益 |
| AI 实训增强包 | ¥30/月 | 无限次评分 + 深度报告 |
| 个人精进套餐 | ¥588/年 | 年度会员 + 增强包打包 |

---

## 覆盖范围

### 东盟 10 国

🇻🇳 越南 · 🇹🇭 泰国 · 🇮🇩 印尼 · 🇸🇬 新加坡 · 🇲🇾 马来西亚 · 🇵🇭 菲律宾 · 🇧🇳 文莱 · 🇰🇭 柬埔寨 · 🇱🇦 老挝 · 🇲🇲 缅甸

### 核心行业

- 跨境电商
- 制造业
- 旅游业
- 基础设施
- 金融服务

---

## 项目团队

**广西财经学院** 跨学科团队，融合人工智能、商务英语、财务分析与数据科学。

### 指导老师

- **胡维娜** — 讲师，跨境金融与商业模式创新，双创竞赛指导专家
- **李颖** — 副教授，电子商务客户行为分析与深度学习
- **胡小春** — 教授，AI 教育应用与智能体开发，"广财小智"项目负责人
- **Choo Peng Yin** — 马来西亚拉曼大学副院长，AI 数字人技术
- **黄丹桦** — 马来西亚 RMAICT 技术顾问，IT 系统架构
- **李圣德** — 广西中小企业服务促进会常务副会长，网络安全与数据安全

### 合作伙伴

- **RMAICT Sdn Bhd** — 马来西亚 IT 解决方案公司
- **马来西亚拉曼大学** — 学术合作与内容本土化
- **广西-东盟经贸合作中心** — 市场资源对接

---

## 未来规划

| 阶段 | 目标 |
|------|------|
| **2026** | 平台 1.0 上线，南宁样板市场，签约 20 家企业客户 |
| **2027** | 拓展越南、泰国、马来西亚，注册用户突破 2.5 万 |
| **2028** | 转型综合性商务人才服务平台，连接学习-实训-就业闭环 |

---

## 赛事参与

- 全国大学生电子商务"创新、创意及创业"挑战赛（三创赛）
- "挑战杯"大学生课外学术科技作品竞赛
- 中国"互联网+"大学生创新创业大赛

---

## 许可证

本项目为参赛作品，仅供学习交流使用。

---

**让每一次跨文化沟通，都因充分准备而更自信、更有效。**
