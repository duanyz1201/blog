# 个人博客系统

基于 Next.js 14 全栈框架开发的现代化个人博客系统，包含前台展示和后台管理功能。

## ✨ 功能特性

### 前台功能
- 📝 文章展示（列表、详情、归档）
- 🔍 全文搜索
- 📂 分类和标签管理
- 💬 评论系统（支持回复）
- 🌓 暗色模式
- 📱 响应式设计
- 📊 阅读统计

### 后台管理
- ✏️ 富文本编辑器（支持 Markdown）
- 📄 文章管理（创建、编辑、删除）
- 🏷️ 分类和标签管理
- 💬 评论审核
- ⚙️ 站点设置
- 📈 数据统计

## 🛠️ 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui + Radix UI
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js v5
- **编辑器**: Tiptap
- **Markdown**: react-markdown + remark-gfm
- **代码高亮**: Shiki
- **表单**: React Hook Form + Zod

## 📋 前置要求

- Node.js 18+ 
- npm/yarn/pnpm
- PostgreSQL 数据库

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd blog
```

### 2. 安装依赖

如果遇到 npm 缓存权限问题，请先修复：

```bash
sudo chown -R $(whoami) ~/.npm
```

然后安装依赖：

```bash
npm install
```

### 3. 环境变量配置

创建 `.env.local` 文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置以下环境变量：

```env
# 数据库连接
DATABASE_URL="postgresql://user:password@localhost:5432/blog?schema=public"

# NextAuth.js 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # 使用 openssl rand -base64 32 生成

# 可选：AUTH_URL（NextAuth v5）
AUTH_URL="http://localhost:3000"
```

**生成 NEXTAUTH_SECRET**：

```bash
# 方法1: 使用 openssl
openssl rand -base64 32

# 方法2: 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. 数据库设置

#### 创建数据库

```bash
# 使用 PostgreSQL 客户端创建数据库
createdb blog

# 或使用 psql
psql -U postgres
CREATE DATABASE blog;
```

#### 运行数据库迁移

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev

# 查看数据库（可选）
npx prisma studio
```

### 5. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
blog/
├── app/                      # Next.js App Router
│   ├── (frontend)/          # 前台页面组
│   │   ├── page.tsx         # 首页
│   │   ├── post/            # 文章详情
│   │   ├── categories/      # 分类页
│   │   ├── tags/            # 标签页
│   │   ├── search/          # 搜索页
│   │   └── layout.tsx       # 前台布局
│   ├── admin/               # 后台管理
│   │   ├── dashboard/       # 仪表盘
│   │   ├── posts/           # 文章管理
│   │   ├── categories/      # 分类管理
│   │   ├── tags/            # 标签管理
│   │   ├── comments/        # 评论管理
│   │   └── settings/        # 站点设置
│   ├── api/                 # API 路由
│   │   ├── auth/            # 认证相关
│   │   ├── posts/           # 文章 API
│   │   ├── admin/           # 管理 API
│   │   └── ...
│   └── layout.tsx           # 根布局
├── components/              # React 组件
│   ├── frontend/            # 前台组件
│   ├── admin/               # 后台组件
│   └── ui/                  # UI 基础组件
├── lib/                     # 工具函数
│   ├── db.ts                # 数据库连接
│   ├── auth.ts              # 认证配置
│   └── ...
├── prisma/                  # 数据库
│   ├── schema.prisma        # 数据模型
│   └── migrations/          # 数据库迁移
├── public/                  # 静态资源
├── types/                   # TypeScript 类型
└── scripts/                 # 工具脚本
```

## 📜 可用命令

```bash
# 开发
npm run dev          # 启动开发服务器

# 构建
npm run build        # 构建生产版本
npm start            # 启动生产服务器

# 数据库
npx prisma generate  # 生成 Prisma Client
npx prisma migrate dev    # 开发环境迁移
npx prisma migrate deploy # 生产环境迁移
npx prisma studio     # 打开数据库可视化工具

# 代码检查
npm run lint         # 运行 ESLint
```

## 🔧 环境变量说明

### 必需变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 数据库连接字符串 | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | 应用的基础 URL | `http://localhost:3000` 或 `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | NextAuth.js 加密密钥（至少32字符） | 使用 `openssl rand -base64 32` 生成 |

### 可选变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `AUTH_URL` | NextAuth v5 认证 URL | 同 `NEXTAUTH_URL` |

## 🚢 部署

### 部署前准备

1. **环境变量配置**
   - 配置生产环境的 `DATABASE_URL`
   - 配置生产环境的 `NEXTAUTH_URL`（使用 HTTPS）
   - 生成新的 `NEXTAUTH_SECRET`

2. **数据库迁移**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

3. **生产构建测试**
   ```bash
   npm run build
   npm start
   ```

### 部署平台

#### Vercel（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 设置构建命令：`npm run build`
4. 配置数据库连接
5. 部署完成

#### Railway

1. 创建新项目
2. 连接数据库服务
3. 配置环境变量
4. 自动部署

#### 自建服务器

1. 安装 Node.js 18+
2. 配置 Nginx 反向代理
3. 使用 PM2 管理进程
4. 配置 SSL 证书

详细部署说明请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)（如果存在）

## 🔐 安全注意事项

- ✅ 确保 `.env.local` 文件已添加到 `.gitignore`
- ✅ 生产环境使用强密码
- ✅ 配置 HTTPS
- ✅ 定期更新依赖包
- ✅ 配置数据库连接池
- ✅ 设置适当的 CORS 策略

## 📚 相关文档

- [开发规划](./PLAN.md) - 项目开发计划和进度
- [功能需求](./REQUIREMENTS.md) - 详细功能需求文档
- [技术栈](./TECH_STACK.md) - 技术栈详细说明

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👤 作者

duanyz

---

**注意**: 这是一个开发中的项目，部分功能可能仍在完善中。
