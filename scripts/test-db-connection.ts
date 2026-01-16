import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { resolve } from 'path'

// 加载 .env.local 文件
config({ path: resolve(__dirname, '../.env.local') })

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('正在测试数据库连接...')
    console.log('连接地址: ct2.duanyz.net:5432')
    console.log('数据库: blog')
    console.log('用户: duanyz')
    
    // 测试连接
    await prisma.$connect()
    console.log('\n✅ 数据库连接成功！')
    
    // 测试查询
    const result: any = await prisma.$queryRaw`SELECT version()`
    console.log('✅ 数据库查询成功！')
    console.log('PostgreSQL 版本:', result[0]?.version || result)
    
    // 检查表是否存在
    const tables: any = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    console.log('\n当前数据库中的表:')
    if (Array.isArray(tables) && tables.length > 0) {
      tables.forEach((table: any) => {
        console.log(`  - ${table.table_name}`)
      })
    } else {
      console.log('  (数据库为空，没有表)')
    }
    
    console.log('\n✅ 数据库连接测试完成！')
    
  } catch (error: any) {
    console.error('\n❌ 数据库连接失败:')
    if (error.code === 'P1001') {
      console.error('无法连接到数据库服务器')
      console.error('请检查:')
      console.error('  1. 数据库服务器是否运行')
      console.error('  2. 网络连接是否正常')
      console.error('  3. 防火墙设置')
    } else if (error.code === 'P1000') {
      console.error('数据库认证失败')
      console.error('请检查用户名和密码是否正确')
    } else {
      console.error('错误代码:', error.code)
      console.error('错误信息:', error.message)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
