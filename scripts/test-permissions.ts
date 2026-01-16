import { config } from 'dotenv'
import { resolve } from 'path'
import pg from 'pg'

config({ path: resolve(__dirname, '../.env') })

const { Client } = pg

async function testPermissions() {
  const client = new Client({
    host: 'ct2.duanyz.net',
    port: 54321,
    database: 'blog',
    user: 'duanyz',
    password: 'euP789rbRa0PtEwYrWx2',
  })

  try {
    await client.connect()
    console.log('✅ 数据库连接成功\n')
    
    // 检查 schema 所有者
    const schemaInfo = await client.query(`
      SELECT 
        schema_name,
        schema_owner
      FROM information_schema.schemata
      WHERE schema_name = 'public'
    `)
    console.log('Schema 信息:', schemaInfo.rows[0])
    
    // 检查用户权限
    const userInfo = await client.query(`
      SELECT 
        usename,
        usecreatedb,
        usesuper
      FROM pg_user 
      WHERE usename = 'duanyz'
    `)
    console.log('用户信息:', userInfo.rows[0])
    
    // 测试创建枚举类型
    console.log('\n测试创建枚举类型...')
    try {
      await client.query(`
        CREATE TYPE test_role AS ENUM ('TEST1', 'TEST2')
      `)
      console.log('✅ 可以创建枚举类型')
      await client.query('DROP TYPE test_role')
    } catch (error: any) {
      console.log('❌ 无法创建枚举类型:', error.message)
    }
    
    // 测试创建表
    console.log('\n测试创建表...')
    try {
      await client.query(`
        CREATE TABLE test_table (
          id TEXT PRIMARY KEY,
          name TEXT
        )
      `)
      console.log('✅ 可以创建表')
      await client.query('DROP TABLE test_table')
    } catch (error: any) {
      console.log('❌ 无法创建表:', error.message)
    }
    
    console.log('\n✅ 权限测试完成')
    
  } catch (error: any) {
    console.error('❌ 测试失败:', error.message)
  } finally {
    await client.end()
  }
}

testPermissions()
