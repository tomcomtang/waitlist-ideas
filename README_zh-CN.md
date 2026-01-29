# Waitlist Ideas

本仓库是一个模板项目，用于收集名额登记（如活动报名、预售申请、预约名单等）。技术栈为 Next.js 15、Notion 作为数据存储、Resend 发送确认邮件。邮件发送为可选功能，由环境变量 `RESEND_ENABLED` 控制。

## 功能特性

- ✅ **Notion 集成**：将所有登记保存到 Notion 数据库
- ✅ **登记凭据 Token**：每条登记会生成唯一 token 并存入 Notion，并在确认邮件中附带该 token，作为登记凭据（如核销、领取名额等）
- ✅ **邮件通知**：通过 Resend 发送确认邮件（可选，由 `RESEND_ENABLED` 控制）
- ✅ **防重复**：同一邮箱不可重复登记
- ✅ **邮件发送状态**：在 Notion 中记录每条登记是否已发送确认邮件
- ✅ **现代界面**：毛玻璃效果与动效背景
- ✅ **响应式布局**：适配各类设备
- ✅ **类型安全**：使用 TypeScript 开发
- ✅ **即时反馈**：操作结果通过 Toast 提示

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
NOTION_SECRET=your_notion_secret_here
NOTION_DB=your_notion_database_id_here
RESEND_ENABLED=false
RESEND_API_KEY=your_resend_api_key_here
```

将 `RESEND_ENABLED=true` 可开启发送确认邮件。

### 3. 配置 Notion 数据库

1. 在 Notion 工作区中新建一个数据库
2. 添加以下属性：
   - **Name**：标题类型
   - **Email**：邮箱类型
   - **Time**：日期类型
   - **ID**：文本类型
   - **Email Sent**：复选框类型
   - **Token**：文本类型（每条登记的唯一 token；插入时自动生成，并在确认邮件中作为登记凭据）
3. 在 [Notion 集成](https://www.notion.so/my-integrations) 中创建集成
4. 复制集成密钥，作为 `NOTION_SECRET`
5. 将数据库授权给该集成
6. 从数据库 URL `https://www.notion.so/{DATABASE_ID}?v=...` 中获取数据库 ID

### 4. 配置 Resend（可选）

1. 在 [Resend](https://resend.com) 注册
2. 测试时可使用默认发件邮箱 `onboarding@resend.dev`
3. 正式环境需验证域名，并在 `.env.local` 中设置 `RESEND_FROM_EMAIL`

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 6. 生产环境构建

```bash
npm run build
npm start
```

## 部署

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?from=github&template=waitlist-ideas)

## 项目结构

```
├── app/
│   ├── api/
│   │   ├── mail/
│   │   │   └── route.ts          # 发送邮件 API
│   │   └── notion/
│   │       └── route.ts          # Notion 集成 API
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 首页
├── components/
│   ├── ui/                       # 通用 UI 组件
│   ├── canvas-background.tsx     # 动效背景
│   ├── footer.tsx                # 页脚
│   ├── hero-section.tsx          # 主视觉区
│   └── subscription-section.tsx  # 登记表单
├── emails/
│   └── index.tsx                 # 确认邮件模板
├── lib/
│   └── utils.ts                  # 工具函数
└── package.json
```

## 工作流程

1. **登记**：访客在页面填写姓名和邮箱，申请名额
2. **校验**：前端校验邮箱格式与必填项
3. **写入 Notion**：登记写入 Notion 数据库，并生成唯一 **Token** 存入该条记录
4. **防重复**：系统拒绝重复邮箱，保证每个名额只被登记一次
5. **发邮件**：若 `RESEND_ENABLED=true`，通过 Resend 发送确认邮件，邮件中包含 token 作为登记凭据
6. **状态记录**：在 Notion 中记录该条是否已发送确认邮件
7. **用户反馈**：通过 Toast 提示成功或错误信息

## 技术栈

- **框架**：Next.js 15（App Router）
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **动效**：Framer Motion
- **背景**：@paper-design/shaders-react
- **数据**：Notion API
- **邮件**：Resend
- **UI 组件**：Radix UI、Sonner（Toast）

## 开发说明

### 自定义样式

修改 `app/globals.css` 可调整界面外观。当前设计包含：

- 毛玻璃效果（backdrop-filter、半透明）
- 紫色渐变主题
- 深色背景与 shader 动效

### 自定义邮件模板

编辑 `emails/index.tsx` 可自定义发送给新登记用户的确认邮件。模板接收 `userFirstname` 和 `token`；token 会在邮件中展示，作为登记人的凭据（如核销、领取名额等）。

### API 接口

- `POST /api/notion` - 将一条登记写入 Notion
  - 请求体：`{ name: string, email: string }`
  - 返回：`{ success: boolean, id?: string, error?: string }`

- `POST /api/mail` - 发送确认邮件
  - 请求体：`{ email: string, firstname: string }`
  - 返回：`{ message: string, error?: string }`
  - 会自动判断该邮箱是否已发过邮件

## 许可证

MIT

## 致谢

本项目使用 Notion 作为数据存储、Resend 作为邮件服务，提供简洁可用的名额登记与申请名单方案。
