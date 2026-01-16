-- 完整的权限授予脚本
-- 在数据库服务器上以 postgres 用户执行

-- 1. 确保 schema 所有者是 duanyz
ALTER SCHEMA public OWNER TO duanyz;

-- 2. 授予 schema 的使用和创建权限
GRANT USAGE ON SCHEMA public TO duanyz;
GRANT CREATE ON SCHEMA public TO duanyz;
GRANT ALL PRIVILEGES ON SCHEMA public TO duanyz;

-- 3. 授予数据库权限
GRANT ALL PRIVILEGES ON DATABASE blog TO duanyz;

-- 4. 设置默认权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO duanyz;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO duanyz;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TYPES TO duanyz;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO duanyz;

-- 5. 验证权限
SELECT 
    schema_name, 
    schema_owner 
FROM information_schema.schemata 
WHERE schema_name = 'public';
