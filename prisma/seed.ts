import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/password'
import dotenv from 'dotenv'
import { resolve } from 'path'

// 加载环境变量（按优先级顺序）
dotenv.config({ path: resolve(process.cwd(), '.env.production') })
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

// 判断是否为生产环境
const isProduction = process.env.NODE_ENV === 'production' || 
                     process.env.PRISMA_SEED_MODE === 'production' ||
                     process.env.DATABASE_URL?.includes('production') ||
                     process.env.DATABASE_URL?.includes('prod')

async function seed() {
  try {
    if (isProduction) {
      console.log('🚀 生产环境：开始初始化管理员账户...\n')
    } else {
      console.log('🚀 开发环境：开始创建测试数据...\n')
    }
    
    // 检查数据库连接
    await prisma.$connect()
    console.log('✅ 数据库连接成功\n')
    
    // 1. 创建管理员用户（所有环境都需要）
    console.log('📝 创建管理员账户...')
    const adminPassword = await hashPassword('admin@123')
    const admin = await prisma.user.upsert({
      where: { email: 'admin@admin.com' },
      update: {
        password: adminPassword,
        name: 'admin',
        role: 'ADMIN',
      },
      create: {
        email: 'admin@admin.com',
        password: adminPassword,
        name: 'admin',
        role: 'ADMIN',
      },
    })
    console.log(`✅ 管理员账户已创建/更新: ${admin.email}`)
    
    // 2. 开发环境：创建测试数据
    if (!isProduction) {
      console.log('\n📦 创建测试数据（开发环境）...')
      
      // 创建分类
      console.log('   - 创建分类...')
      const category1 = await prisma.category.upsert({
        where: { slug: 'tech' },
        update: {},
        create: {
          name: '技术',
          slug: 'tech',
        },
      })
      
      const category2 = await prisma.category.upsert({
        where: { slug: 'life' },
        update: {},
        create: {
          name: '生活',
          slug: 'life',
        },
      })
      console.log(`   ✅ 分类已创建: ${category1.name}, ${category2.name}`)
      
      // 创建标签
      console.log('   - 创建标签...')
      const tag1 = await prisma.tag.upsert({
        where: { slug: 'nextjs' },
        update: {},
        create: {
          name: 'Next.js',
          slug: 'nextjs',
        },
      })
      
      const tag2 = await prisma.tag.upsert({
        where: { slug: 'react' },
        update: {},
        create: {
          name: 'React',
          slug: 'react',
        },
      })
      
      const tag3 = await prisma.tag.upsert({
        where: { slug: 'typescript' },
        update: {},
        create: {
          name: 'TypeScript',
          slug: 'typescript',
        },
      })
      console.log(`   ✅ 标签已创建: ${tag1.name}, ${tag2.name}, ${tag3.name}`)
      
      // 创建测试文章
      console.log('   - 创建测试文章...')
      const post1 = await prisma.post.upsert({
        where: { slug: 'welcome-to-my-blog' },
        update: {},
        create: {
          title: '欢迎来到我的博客',
          slug: 'welcome-to-my-blog',
          content: `# 欢迎来到我的博客

这是我的第一篇博客文章。这个博客系统基于 Next.js 14 开发，使用了以下技术栈：

- **Next.js 14** - React 全栈框架
- **TypeScript** - 类型安全
- **Prisma** - ORM 数据库工具
- **PostgreSQL** - 数据库
- **Tailwind CSS** - 样式框架
- **shadcn/ui** - UI 组件库

## 功能特点

- ✅ 文章管理（CRUD）
- ✅ 分类和标签系统
- ✅ 评论功能
- ✅ 搜索功能
- ✅ 暗色模式支持
- ✅ 响应式设计

希望你能喜欢这个博客系统！`,
          excerpt: '这是我的第一篇博客文章，介绍了博客系统的技术栈和功能特点。',
          status: 'PUBLISHED',
          authorId: admin.id,
          categories: {
            connect: [{ id: category1.id }],
          },
          tags: {
            connect: [{ id: tag1.id }, { id: tag2.id }],
          },
        },
      })
      
      const post2 = await prisma.post.upsert({
        where: { slug: 'getting-started-with-nextjs' },
        update: {},
        create: {
          title: 'Next.js 入门指南',
          slug: 'getting-started-with-nextjs',
          content: `# Next.js 入门指南

Next.js 是一个强大的 React 框架，提供了许多开箱即用的功能。

## 主要特性

1. **服务端渲染 (SSR)**
2. **静态站点生成 (SSG)**
3. **API Routes**
4. **自动代码分割**
5. **优化的图片加载**

## 快速开始

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## 总结

Next.js 让 React 开发变得更加简单和高效。`,
          excerpt: '介绍 Next.js 的主要特性和快速开始方法。',
          status: 'PUBLISHED',
          authorId: admin.id,
          categories: {
            connect: [{ id: category1.id }],
          },
          tags: {
            connect: [{ id: tag1.id }, { id: tag3.id }],
          },
        },
      })
      
      const post3 = await prisma.post.upsert({
        where: { slug: 'my-first-day' },
        update: {},
        create: {
          title: '我的第一天',
          slug: 'my-first-day',
          content: `# 我的第一天

今天是我开始写博客的第一天。我想记录下这个特殊的时刻。

## 为什么开始写博客？

- 分享知识和经验
- 记录学习和成长
- 与社区交流

希望这个博客能帮助到更多的人！`,
          excerpt: '记录开始写博客的第一天，分享开始写博客的原因。',
          status: 'PUBLISHED',
          authorId: admin.id,
          categories: {
            connect: [{ id: category2.id }],
          },
          tags: {},
        },
      })
      console.log(`   ✅ 文章已创建: ${post1.title}, ${post2.title}, ${post3.title}`)
    }
    
    // 输出完成信息
    console.log('\n✅ 数据初始化完成！')
    console.log('\n📋 登录信息:')
    console.log('   用户名/邮箱: admin 或 admin@admin.com')
    console.log('   密码: admin@123')
    
    if (isProduction) {
      console.log('\n⚠️  重要提示:')
      console.log('   1. 请立即登录并修改默认密码')
      console.log('   2. 建议在生产环境中使用强密码')
    } else {
      console.log('\n现在可以访问 http://localhost:3000 查看博客首页了！')
    }
    
  } catch (error: any) {
    console.error('\n❌ 初始化失败:', error.message)
    if (error.code === 'P1001') {
      console.error('   错误: 无法连接到数据库')
      console.error('   请检查 DATABASE_URL 环境变量是否正确配置')
    } else {
      console.error(error)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
