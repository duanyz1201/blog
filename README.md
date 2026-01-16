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

创建 `.env` 文件：

```bash
# 如果有 .env.example 模板文件，可以复制它
cp .env.example .env

# 如果没有 .env.example，直接创建
touch .env
```

编辑 `.env` 文件，配置以下环境变量：

```env
# 数据库连接
DATABASE_URL="postgresql://user:password@localhost:5432/blog?schema=public"

# NextAuth.js 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # 使用 openssl rand -base64 32 生成

# 可选：AUTH_URL（NextAuth v5）
AUTH_URL="http://localhost:3000"
```

> 💡 **提示**：使用 `.env` 文件而不是 `.env.local`，因为 Prisma CLI 默认只读取 `.env` 文件，而 Next.js 也会自动读取 `.env` 文件。这样可以确保 Next.js 和 Prisma 命令都能正常工作。

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

# 运行数据库迁移（自动运行种子脚本）
npx prisma migrate dev

# 查看数据库（可选）
npx prisma studio
```

> 💡 **提示**：`prisma migrate dev` 会自动运行种子脚本，详见下方"数据库初始化说明"章节。

**生产环境**：

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移（创建表结构）
npx prisma migrate deploy

# 手动运行种子脚本（创建管理员账户）
npm run seed
# 或
npx prisma db seed

# 查看数据库（可选）
npx prisma studio
```

> ⚠️ **重要**：`prisma migrate deploy` **不会自动运行种子脚本**，需要手动运行 `npm run seed` 来创建管理员账户。详见下方"数据库初始化说明"章节。

### 5. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 💾 数据库初始化说明

### 自动种子功能

**开发环境**：运行 `prisma migrate dev` 时，Prisma 会**自动执行** `prisma/seed.ts` 种子脚本。

**生产环境**：`prisma migrate deploy` **不会自动运行**种子脚本，需要手动执行 `npm run seed` 来创建管理员账户。

### 环境判断规则

种子脚本会根据以下条件自动判断环境：

- `NODE_ENV=production`
- `PRISMA_SEED_MODE=production`
- `DATABASE_URL` 包含 `production` 或 `prod`

满足任一条件即判定为生产环境。

### 数据初始化行为

**开发环境**：
- ✅ 创建管理员账户
- ✅ 创建测试数据（分类、标签、文章）

**生产环境**：
- ✅ 创建管理员账户
- ❌ 不创建测试数据

### 默认管理员账户

迁移后需要手动运行种子脚本来创建以下管理员账户：

- **用户名/邮箱**：`admin` 或 `admin@admin.com`
- **密码**：`admin@123`
- ⚠️ **重要**：部署后请立即登录并修改密码！

### 手动运行种子脚本

**生产环境**：在运行 `prisma migrate deploy` 后，必须手动运行种子脚本：

```bash
npm run seed
# 或
npx prisma db seed
```

**开发环境**：`prisma migrate dev` 会自动运行种子脚本，通常不需要手动运行。

如果需要重新初始化数据：

```bash
npm run seed          # 根据环境自动判断
# 或直接使用 Prisma 命令：
npx prisma db seed
```

> ⚠️ **注意**：手动运行种子脚本前，确保已设置正确的环境变量，以便脚本能正确判断环境。

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
│   ├── seed.ts              # 自动种子脚本（迁移后自动运行）
│   ├── grant-permissions-complete.sql  # 数据库权限配置脚本
│   └── migrations/          # 数据库迁移
├── public/                  # 静态资源
└── types/                   # TypeScript 类型
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

### 📋 部署前检查清单

在开始部署前，请确保完成以下检查：

- [ ] Node.js 18+ 已安装
- [ ] PostgreSQL 数据库已准备就绪
- [ ] 生产环境数据库已创建
- [ ] 所有环境变量已配置（见下方）
- [ ] 域名已解析到服务器 IP（如使用域名）
- [ ] 服务器防火墙已开放必要端口（3000、80、443）
- [ ] SSL 证书已准备（或使用 Let's Encrypt 自动申请）

### 部署前准备

1. **环境变量配置（生产环境）**

   创建 `.env` 文件（或 `.env.production` 文件，部署时复制为 `.env`）：

   ```env
   # 数据库连接（生产环境）
   DATABASE_URL="postgresql://user:password@host:5432/blog_prod?schema=public"
   
   # NextAuth.js 配置
   NEXTAUTH_URL="https://yourdomain.com"  # 使用 HTTPS
   NEXTAUTH_SECRET="your-production-secret-key"  # 使用 openssl rand -base64 32 生成
   AUTH_URL="https://yourdomain.com"
   
   # 环境标识（用于自动判断环境）
   NODE_ENV="production"
   # 或者确保 DATABASE_URL 包含 production/prod
   ```

   **重要提示**：
   - 生产环境的 `NEXTAUTH_SECRET` 必须与开发环境不同
   - `NEXTAUTH_URL` 必须使用 HTTPS
   - 确保数据库连接字符串正确且可访问
   - 使用 `.env` 文件确保 Next.js 和 Prisma CLI 都能读取环境变量

2. **数据库迁移和初始化**

   参考上方"数据库设置"章节执行数据库迁移。生产环境迁移命令：

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npm run seed  # 手动运行种子脚本创建管理员账户
   ```

   > ⚠️ **重要**：`prisma migrate deploy` **不会自动运行**种子脚本，需要手动运行 `npm run seed` 来创建管理员账户。详见上方"数据库初始化说明"章节。

3. **运行种子脚本（创建管理员账户）**

   ```bash
   npm run seed
   # 或
   npx prisma db seed
   ```

   > ⚠️ **重要**：必须在运行 `prisma migrate deploy` 后手动运行种子脚本来创建管理员账户。

4. **构建和启动应用**

   ```bash
   npm run build
   npm start
   ```

   > ✅ 管理员账户已通过种子脚本创建，可以直接登录使用！

### 生产环境部署平台

#### Vercel（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 配置生产环境变量（`DATABASE_URL`、`NEXTAUTH_URL`、`NEXTAUTH_SECRET`、`NODE_ENV=production`）
3. 设置构建命令：`npm run build`
4. 配置数据库连接
5. 在部署后运行数据库迁移：`npx prisma migrate deploy`
6. 手动运行种子脚本：`npm run seed`（创建管理员账户）
7. 部署完成

#### Railway

1. 创建新项目
2. 连接数据库服务
3. 配置生产环境变量（包括 `NODE_ENV=production`）
4. 在部署后运行数据库迁移：`npx prisma migrate deploy`
5. 手动运行种子脚本：`npm run seed`（创建管理员账户）
6. 自动部署

#### 自建服务器（详细步骤）

**1. 服务器环境准备**

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version  # 应显示 v18.x.x 或更高
npm --version

# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 创建数据库和用户
sudo -u postgres psql
CREATE DATABASE blog_prod;
CREATE USER blog_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE blog_prod TO blog_user;
\q
```

**2. 部署应用代码**

```bash
# 克隆项目
cd /var/www
sudo git clone <repository-url> blog
cd blog

# 安装依赖
npm ci --production=false  # 需要 devDependencies 用于构建

# 配置环境变量
sudo nano .env
# 填入生产环境变量（见上方环境变量配置）
# 注意：.env 文件会被 Next.js 和 Prisma CLI 同时读取
```

**3. 数据库迁移和初始化**

参考上方"数据库设置"章节执行：

```bash
npx prisma generate
npx prisma migrate deploy  # 创建表结构
npm run seed               # 手动运行种子脚本创建管理员账户
npx prisma studio          # 可选，用于验证数据
```

> ⚠️ **重要**：`prisma migrate deploy` **不会自动运行**种子脚本，必须手动运行 `npm run seed` 来创建管理员账户。详见上方"数据库初始化说明"章节。

**4. 构建应用**

```bash
# 构建生产版本
npm run build

# 验证构建是否成功
ls -la .next  # 应看到构建产物
```

**5. 配置 PM2 进程管理**

```bash
# 安装 PM2
sudo npm install -g pm2

# 创建 PM2 配置文件 ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'blog',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/blog',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
EOF

# 创建日志目录
mkdir -p logs

# 启动应用
pm2 start ecosystem.config.js

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status
pm2 logs blog
```

**6. 配置 Nginx 反向代理**

```bash
# 安装 Nginx
sudo apt install nginx -y

# 创建 Nginx 配置文件
sudo nano /etc/nginx/sites-available/blog
```

Nginx 配置内容：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # 重定向到 HTTPS（配置 SSL 后启用）
    # return 301 https://$server_name$request_uri;

    # 临时配置（配置 SSL 前使用）
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件缓存（Next.js 会自动处理，无需特殊配置）
    # Next.js 的静态文件应该通过主 location / 代理，由 Next.js 服务器处理
    # location /_next/static {
    #     proxy_pass http://localhost:3000;
    #     proxy_cache_valid 200 60m;
    #     add_header Cache-Control "public, immutable";
    # }
}

# HTTPS 配置（配置 SSL 后使用）
# server {
#     listen 443 ssl http2;
#     server_name yourdomain.com www.yourdomain.com;
#
#     ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
#
#     location / {
#         proxy_pass http://localhost:3000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto $scheme;
#         proxy_cache_bypass $http_upgrade;
#     }
# }
```

启用配置：

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

**7. 配置 SSL 证书（Let's Encrypt）**

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 申请证书（确保域名已解析到服务器）
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期测试
sudo certbot renew --dry-run

# 证书会自动续期（通过 cron 任务）
```

**8. 防火墙配置**

```bash
# 允许 HTTP 和 HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
```

**9. 验证部署**

```bash
# 检查应用状态
pm2 status
pm2 logs blog

# 检查 Nginx 状态
sudo systemctl status nginx

# 测试访问
curl http://localhost:3000
curl http://yourdomain.com
```

### 🔧 常见问题排查

**问题 1：应用无法启动**

```bash
# 检查日志
pm2 logs blog
tail -f logs/err.log

# 检查端口占用
sudo lsof -i :3000

# 检查环境变量
pm2 env 0
```

**问题 2：数据库连接失败**

```bash
# 测试数据库连接
psql -h localhost -U blog_user -d blog_prod

# 检查 DATABASE_URL 环境变量
echo $DATABASE_URL

# 检查 PostgreSQL 服务
sudo systemctl status postgresql
```

**问题 3：Nginx 502 错误**

```bash
# 检查应用是否运行
pm2 status

# 检查 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 检查防火墙
sudo ufw status
```

**问题 4：Prisma 迁移失败**

```bash
# 检查数据库权限
psql -U blog_user -d blog_prod -c "\dt"

# 重新生成 Prisma Client
npx prisma generate

# 查看迁移状态
npx prisma migrate status
```

### 💾 数据库备份和恢复

**备份数据库**：

```bash
# 创建备份
pg_dump -U blog_user -d blog_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# 压缩备份
gzip backup_*.sql
```

**恢复数据库**：

```bash
# 解压备份
gunzip backup_*.sql.gz

# 恢复数据
psql -U blog_user -d blog_prod < backup_*.sql
```

**自动备份脚本**（添加到 crontab）：

```bash
# 编辑 crontab
crontab -e

# 添加每日备份（每天凌晨 2 点）
0 2 * * * pg_dump -U blog_user -d blog_prod | gzip > /backups/blog_$(date +\%Y\%m\%d).sql.gz
```

### 🔄 应用更新流程

```bash
# 1. 拉取最新代码
cd /var/www/blog
git pull origin main

# 2. 安装依赖（如有更新）
npm ci --production=false

# 3. 运行数据库迁移
npx prisma migrate deploy
npx prisma generate

# 4. 重新构建
npm run build

# 5. 重启应用
pm2 restart blog

# 6. 检查状态
pm2 status
pm2 logs blog
```

### 📊 监控和维护

**查看应用日志**：

```bash
# PM2 日志
pm2 logs blog --lines 100

# 系统日志
journalctl -u nginx -f
```

**性能监控**：

```bash
# PM2 监控
pm2 monit

# 系统资源
htop
```

**定期维护**：

```bash
# 更新依赖（谨慎操作）
npm audit
npm update

# 清理构建缓存
rm -rf .next
npm run build
```

详细部署说明请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)（如果存在）

## 🔐 安全注意事项

### 部署安全清单

- ✅ 确保 `.env`、`.env.local`、`.env.production` 文件已添加到 `.gitignore`
- ✅ 生产环境使用强密码（数据库、管理员账户）
- ✅ **部署后立即登录并修改默认管理员密码**（admin@123）
- ✅ 配置 HTTPS（强制使用 SSL/TLS）
- ✅ 定期更新依赖包（`npm audit` 检查安全漏洞）
- ✅ 配置数据库连接池（Prisma 已自动处理）
- ✅ 设置适当的 CORS 策略
- ✅ 使用环境变量存储敏感信息，不要硬编码
- ✅ 配置防火墙，只开放必要端口
- ✅ 定期备份数据库
- ✅ 监控应用日志，及时发现异常
- ✅ 使用 PM2 进程管理，确保应用自动重启
- ✅ 配置 Nginx 安全头（见下方）

### Nginx 安全头配置

在 Nginx 配置中添加安全头：

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 数据库安全

- 使用强密码
- 限制数据库访问 IP（如果可能）
- 定期备份
- 不要在生产环境使用默认端口（如果可能）

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

## 🆘 获取帮助

如果遇到部署问题：

1. 查看本文档的"常见问题排查"部分
2. 检查应用日志：`pm2 logs blog`
3. 检查 Nginx 日志：`sudo tail -f /var/log/nginx/error.log`
4. 查看 Prisma 迁移状态：`npx prisma migrate status`
5. 提交 Issue 到项目仓库

---

**注意**: 这是一个开发完成的项目，已准备好部署上线。如有问题，请参考上述部署文档。
