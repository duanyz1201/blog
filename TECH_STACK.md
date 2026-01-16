# 技术栈清单

## 核心技术栈

### 前端框架
- **Next.js 14+** - React 全栈框架，使用 App Router
- **React 18+** - UI 库
- **TypeScript** - 类型安全

### 样式方案
- **Tailwind CSS** - 原子化 CSS 框架
- **shadcn/ui** - 高质量组件库
- **next-themes** - 暗色模式支持

### 状态管理
- **Zustand** - 轻量级状态管理（或 React Context）
- **React Query / SWR** - 服务端状态管理

### 表单处理
- **React Hook Form** - 表单管理
- **Zod** - Schema 验证

### 富文本编辑器
- **Tiptap** - 现代富文本编辑器（支持 Markdown）

### Markdown 渲染
- **react-markdown** - Markdown 渲染
- **remark-gfm** - GitHub Flavored Markdown 支持
- **rehype-highlight** - 代码高亮（可选）

### 代码高亮
- **shiki** - 代码高亮（推荐，性能好）
- **prism-react-renderer** - 备选方案

### 后端服务
- **Next.js API Routes** - API 接口
- **NextAuth.js** - 认证系统
- **Prisma** - ORM 数据库工具

### 数据库
- **PostgreSQL** - 主数据库（推荐）
- **MySQL** - 备选方案
- **SQLite** - 开发环境可选

### 文件上传
- **Multer** - 文件上传处理
- **云存储** - OSS/S3（可选，生产环境推荐）

### 工具库
- **date-fns** - 日期处理
- **lodash** - 工具函数
- **axios** - HTTP 请求
- **react-hot-toast** - 消息提示
- **lucide-react** - 图标库

### 图表统计
- **Recharts** - 图表库（推荐）
- **Chart.js** - 备选方案

### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Husky** - Git hooks
- **lint-staged** - 提交前检查

### 部署平台
- **Vercel** - 前端部署（推荐）
- **Railway** - 数据库部署（推荐）
- **Render** - 备选方案
- **Netlify** - 备选方案

## 依赖包清单

### 核心依赖
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0"
}
```

### UI 相关
```json
{
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0",
  "@radix-ui/react-*": "latest",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "next-themes": "^0.2.0",
  "lucide-react": "^0.300.0"
}
```

### 表单与验证
```json
{
  "react-hook-form": "^7.48.0",
  "zod": "^3.22.0",
  "@hookform/resolvers": "^3.3.0"
}
```

### 编辑器与 Markdown
```json
{
  "@tiptap/react": "^2.1.0",
  "@tiptap/starter-kit": "^2.1.0",
  "@tiptap/extension-code-block-lowlight": "^2.1.0",
  "react-markdown": "^9.0.0",
  "remark-gfm": "^4.0.0",
  "rehype-highlight": "^7.0.0",
  "shiki": "^0.14.0"
}
```

### 认证与数据库
```json
{
  "next-auth": "^4.24.0",
  "@prisma/client": "^5.7.0",
  "prisma": "^5.7.0",
  "bcryptjs": "^2.4.3"
}
```

### 工具库
```json
{
  "date-fns": "^3.0.0",
  "axios": "^1.6.0",
  "react-hot-toast": "^2.4.0",
  "zod": "^3.22.0"
}
```

### 图表
```json
{
  "recharts": "^2.10.0"
}
```

### 开发依赖
```json
{
  "@types/node": "^20.10.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "@types/bcryptjs": "^2.4.6",
  "eslint": "^8.55.0",
  "eslint-config-next": "^14.0.0",
  "prettier": "^3.1.0",
  "prettier-plugin-tailwindcss": "^0.5.0"
}
```

## 项目结构

```
blog/
├── app/                      # Next.js App Router
│   ├── (frontend)/          # 前台页面组
│   │   ├── page.tsx         # 首页
│   │   ├── posts/           # 文章列表
│   │   │   └── page.tsx
│   │   ├── post/            # 文章详情
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── categories/      # 分类页
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── tags/            # 标签页
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── search/          # 搜索页
│   │   │   └── page.tsx
│   │   └── layout.tsx       # 前台布局
│   ├── (admin)/             # 后台管理组
│   │   ├── dashboard/       # 仪表盘
│   │   │   └── page.tsx
│   │   ├── posts/           # 文章管理
│   │   │   ├── page.tsx     # 列表
│   │   │   ├── new/         # 新建
│   │   │   │   └── page.tsx
│   │   │   └── [id]/        # 编辑
│   │   │       └── page.tsx
│   │   ├── categories/      # 分类管理
│   │   ├── tags/            # 标签管理
│   │   ├── comments/        # 评论管理
│   │   ├── users/           # 用户管理
│   │   ├── settings/        # 系统设置
│   │   └── layout.tsx       # 后台布局
│   ├── api/                 # API 路由
│   │   ├── auth/            # 认证相关
│   │   ├── posts/           # 文章相关
│   │   ├── categories/      # 分类相关
│   │   ├── tags/            # 标签相关
│   │   ├── comments/        # 评论相关
│   │   └── users/           # 用户相关
│   ├── layout.tsx           # 根布局
│   └── globals.css          # 全局样式
├── components/              # 组件
│   ├── ui/                  # UI 组件（shadcn/ui）
│   ├── frontend/            # 前台组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PostCard.tsx
│   │   ├── PostList.tsx
│   │   ├── CommentList.tsx
│   │   └── ThemeToggle.tsx
│   └── admin/               # 后台组件
│       ├── Sidebar.tsx
│       ├── PostEditor.tsx
│       └── Dashboard.tsx
├── lib/                     # 工具函数
│   ├── utils.ts
│   ├── db.ts                # Prisma 客户端
│   ├── auth.ts              # 认证配置
│   └── validations.ts       # Zod schemas
├── prisma/                  # 数据库
│   ├── schema.prisma        # 数据模型
│   └── seed.ts              # 种子数据（可选）
├── public/                  # 静态资源
│   ├── images/
│   └── favicon.ico
├── types/                   # TypeScript 类型
│   └── index.ts
├── .env.local               # 环境变量
├── .env.example             # 环境变量示例
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 环境变量配置

```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/blog?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# 可选：文件上传
UPLOAD_DIR="./public/uploads"
# 或云存储
OSS_ACCESS_KEY_ID=""
OSS_ACCESS_KEY_SECRET=""
OSS_BUCKET=""
OSS_REGION=""
```

## 开发命令

```bash
# 安装依赖
npm install

# 开发环境
npm run dev

# 构建
npm run build

# 生产环境
npm start

# 数据库迁移
npx prisma migrate dev

# 生成 Prisma Client
npx prisma generate

# Prisma Studio（数据库可视化）
npx prisma studio
```
