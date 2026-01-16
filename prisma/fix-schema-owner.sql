-- 修复 schema 所有者问题
-- 必须在数据库服务器上以管理员身份（如 postgres 用户）执行

-- 最关键的命令：将 public schema 的所有者改为 duanyz
ALTER SCHEMA public OWNER TO duanyz;

-- 验证更改
SELECT schema_name, schema_owner 
FROM information_schema.schemata 
WHERE schema_name = 'public';
