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

**开发环境**：

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移（开发环境，自动运行种子脚本）
npx prisma migrate dev

# 查看数据库（可选）
npx prisma studio
```

> 💡 **开发环境自动种子功能**：`prisma migrate dev` 会自动运行 `prisma/seed.ts`，创建管理员账户和测试数据（分类、标签、文章）。

**生产环境**：

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移（生产环境，自动运行种子脚本）
npx prisma migrate deploy

# 查看数据库（可选）
npx prisma studio
```

> 💡 **生产环境自动种子功能**：`prisma migrate deploy` 会自动运行 `prisma/seed.ts`，根据环境变量自动判断为生产环境，仅创建管理员账户（不创建测试数据）。
> 
> **环境判断规则**：
> - `NODE_ENV=production`
> - `PRISMA_SEED_MODE=production`
> - `DATABASE_URL` 包含 `production` 或 `prod`

**默认管理员账户**（自动创建）：
- 用户名/邮箱：`admin` 或 `admin@admin.com`
- 密码：`admin@123`
- ⚠️ **生产环境重要提示**：部署后请立即登录并修改密码！

**手动运行种子脚本**（如果需要重新初始化）：
```bash
npm run seed          # 根据环境自动判断（开发环境：管理员+测试数据，生产环境：仅管理员）
# 或直接使用 Prisma 命令：
npx prisma db seed
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
│   ├── seed.ts              # 自动种子脚本（迁移后自动运行，根据环境自动判断）
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
npx prisma migrate dev    # 开发环境迁移（自动运行种子脚本）
npx prisma migrate deploy # 生产环境迁移（自动运行种子脚本）
npx prisma studio     # 打开数据库可视化工具

# 数据初始化（手动运行，通常不需要，迁移时会自动运行）
npm run seed          # 手动运行种子脚本（根据环境自动判断）

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

## 🚢 生产环境部署

### 部署前准备

1. **环境变量配置（生产环境）**
   - 配置生产环境的 `DATABASE_URL`
   - 配置生产环境的 `NEXTAUTH_URL`（使用 HTTPS）
   - 生成新的 `NEXTAUTH_SECRET`
   - 设置 `NODE_ENV=production` 或确保 `DATABASE_URL` 包含 `production`/`prod`（用于自动判断环境）

2. **数据库迁移（生产环境，自动创建管理员账户）**
   ```bash
   # 生产环境迁移命令
   npx prisma migrate deploy
   npx prisma generate
   ```
   
   > 💡 **自动种子功能**：运行 `prisma migrate deploy` 后，Prisma 会自动运行种子脚本（`prisma/seed.ts`）。
   > 
   > **生产环境**会自动检测并仅创建管理员账户（不创建测试数据）。
   > 
   > **环境判断规则**：
   > - `NODE_ENV=production`
   > - `PRISMA_SEED_MODE=production`
   > - `DATABASE_URL` 包含 `production` 或 `prod`
   
   **默认管理员账户**（自动创建）：
   - 用户名/邮箱：`admin` 或 `admin@admin.com`
   - 密码：`admin@123`
   - ⚠️ **重要**：部署后请立即登录并修改密码！

3. **手动运行种子脚本（可选，通常不需要）**
   ```bash
   # 如果需要手动重新初始化数据，可以使用：
   npm run seed          # 根据环境自动判断（生产环境：仅管理员，开发环境：管理员+测试数据）
   # 或直接使用 Prisma 命令：
   npx prisma db seed
   ```
   > ⚠️ **注意**：在运行种子脚本前，确保已设置正确的环境变量，以便脚本能正确判断为生产环境。

4. **生产环境构建和启动**
   ```bash
   npm run build
   npm start
   ```
   
   > ✅ **无需额外步骤**：管理员账户已在步骤 2 中自动创建，可以直接登录使用！

### 生产环境部署平台

#### Vercel（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 配置生产环境变量（`DATABASE_URL`、`NEXTAUTH_URL`、`NEXTAUTH_SECRET`、`NODE_ENV=production`）
3. 设置构建命令：`npm run build`
4. 配置数据库连接
5. 在部署后运行数据库迁移：`npx prisma migrate deploy`（会自动创建管理员账户）
6. 部署完成

#### Railway

1. 创建新项目
2. 连接数据库服务
3. 配置生产环境变量（包括 `NODE_ENV=production`）
4. 在部署后运行数据库迁移：`npx prisma migrate deploy`
5. 自动部署

#### 自建服务器

1. 安装 Node.js 18+ 和 PostgreSQL
2. 配置生产环境变量（`.env.production` 或系统环境变量）
3. 运行数据库迁移：`npx prisma migrate deploy`
4. 构建应用：`npm run build`
5. 配置 Nginx 反向代理
6. 使用 PM2 管理进程：`pm2 start npm --name "blog" -- start`
7. 配置 SSL 证书（Let's Encrypt）

详细部署说明请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)（如果存在）

## 🔐 安全注意事项

- ✅ 确保 `.env.local` 文件已添加到 `.gitignore`
- ✅ 生产环境使用强密码
- ✅ **部署后立即修改默认管理员密码**
- ✅ 配置 HTTPS
- ✅ 定期更新依赖包
- ✅ 配置数据库连接池
- ✅ 设置适当的 CORS 策略
- ✅ 生产环境使用 `npm run seed:production` 而非 `npm run seed`（避免导入测试数据）

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
