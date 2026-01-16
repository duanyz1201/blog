import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { resolve } from 'path'

// 加载环境变量
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

async function checkPosts() {
  try {
    console.log('正在检查数据库中的文章...\n')
    
    // 检查所有文章（包括草稿）
    const allPosts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
        categories: true,
        tags: true,
      },
    })
    
    console.log(`总文章数: ${allPosts.length}`)
    
    if (allPosts.length === 0) {
      console.log('\n❌ 数据库中没有文章数据')
      console.log('建议：')
      console.log('1. 访问 /admin/posts/new 创建第一篇文章')
      console.log('2. 确保文章状态为 PUBLISHED（已发布）')
    } else {
      console.log('\n文章列表:')
      allPosts.forEach((post, index) => {
        console.log(`\n${index + 1}. ${post.title}`)
        console.log(`   状态: ${post.status}`)
        console.log(`   作者: ${post.author.name}`)
        console.log(`   创建时间: ${post.createdAt}`)
        console.log(`   分类: ${post.categories.map(c => c.name).join(', ') || '无'}`)
        console.log(`   标签: ${post.tags.map(t => t.name).join(', ') || '无'}`)
      })
      
      // 检查已发布的文章
      const publishedPosts = allPosts.filter(p => p.status === 'PUBLISHED')
      console.log(`\n已发布文章数: ${publishedPosts.length}`)
      
      if (publishedPosts.length === 0) {
        console.log('\n⚠️  没有已发布的文章，首页只会显示"暂无文章"')
        console.log('建议：将文章状态改为 PUBLISHED')
      }
    }
    
    // 检查用户
    const users = await prisma.user.findMany()
    console.log(`\n用户数: ${users.length}`)
    if (users.length === 0) {
      console.log('⚠️  没有用户，需要先注册一个用户才能创建文章')
    }
    
  } catch (error: any) {
    console.error('❌ 检查失败:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkPosts()
