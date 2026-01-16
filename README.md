# 个人博客系统

基于 Next.js 14 全栈框架开发的个人博客系统，包含前台展示和后台管理功能。

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **数据库**: PostgreSQL + Prisma
- **认证**: NextAuth.js

## 开始开发

### 前置要求

- Node.js 18+ 
- npm/yarn/pnpm

### 安装依赖

如果遇到 npm 缓存权限问题，请先修复：

```bash
sudo chown -R $(whoami) ~/.npm
```

然后安装依赖：

```bash
npm install
```

### 环境变量配置

复制 `.env.example` 为 `.env.local` 并配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入你的数据库连接信息。

### 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
blog/
├── app/              # Next.js App Router
├── components/       # React 组件
├── lib/              # 工具函数
├── prisma/           # 数据库模型
├── public/           # 静态资源
└── types/            # TypeScript 类型
```

## 开发阶段

详见 [PLAN.md](./PLAN.md)

## 功能需求

详见 [REQUIREMENTS.md](./REQUIREMENTS.md)
