import { config } from 'dotenv'
import { resolve } from 'path'
import pg from 'pg'

config({ path: resolve(__dirname, '../.env') })

const { Client } = pg

async function testConnection() {
  const client = new Client({
    host: 'ct2.duanyz.net',
    port: 54321,
    database: 'blog',
    user: 'duanyz',
    password: 'euP789rbRa0PtEwYrWx2',
  })

  try {
    console.log('正在测试数据库连接...')
    console.log('连接地址: ct2.duanyz.net:54321')
    console.log('数据库: blog')
    console.log('用户: duanyz\n')
    
    await client.connect()
    console.log('✅ 数据库连接成功！')
    
    const result = await client.query('SELECT version()')
    console.log('PostgreSQL 版本:', result.rows[0]?.version)
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    console.log('\n当前数据库中的表:')
    if (tables.rows.length > 0) {
      tables.rows.forEach((row) => {
        console.log(`  ✅ ${row.table_name}`)
      })
    } else {
      console.log('  (数据库为空，没有表)')
      console.log('\n提示: 请执行 prisma/init.sql 文件中的 SQL 语句来创建表结构')
    }
    
    console.log('\n✅ 数据库连接测试完成！')
    
  } catch (error: any) {
    console.error('\n❌ 数据库连接失败:')
    console.error('错误:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

testConnection()
