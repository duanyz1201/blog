import { PrismaClient } from '@prisma/client'
import { hashPassword } from '@/lib/password'
import dotenv from 'dotenv'
import { resolve } from 'path'

// 加载环境变量（支持 .env.production, .env.local, .env）
dotenv.config({ path: resolve(process.cwd(), '.env.production') })
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

async function seedProduction() {
  try {
    console.log('🚀 开始初始化生产环境数据...\n')
    
    // 检查数据库连接
    await prisma.$connect()
    console.log('✅ 数据库连接成功\n')
    
    // 创建管理员用户
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
    
    console.log(`✅ 管理员账户已创建/更新`)
    console.log(`   邮箱: ${admin.email}`)
    console.log(`   用户名: ${admin.name}`)
    console.log(`   角色: ${admin.role}`)
    
    console.log('\n✅ 生产环境初始化完成！')
    console.log('\n⚠️  重要提示:')
    console.log('   1. 请立即登录并修改默认密码')
    console.log('   2. 用户名/邮箱: admin 或 admin@admin.com')
    console.log('   3. 密码: admin@123')
    console.log('   4. 建议在生产环境中使用强密码')
    
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

seedProduction()
