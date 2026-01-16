-- 完整的权限授予脚本
-- 需要在数据库服务器上以管理员身份（如 postgres 用户）执行

-- 1. 授予创建数据库的权限（如果还没有）
ALTER USER duanyz CREATEDB;

-- 2. 授予数据库的所有权限
GRANT ALL PRIVILEGES ON DATABASE blog TO duanyz;

-- 3. 授予 schema 的使用权限（必须先有 USAGE 才能创建对象）
GRANT USAGE ON SCHEMA public TO duanyz;
GRANT CREATE ON SCHEMA public TO duanyz;

-- 4. 授予 schema 的所有权限
GRANT ALL PRIVILEGES ON SCHEMA public TO duanyz;

-- 5. 将 schema 的所有者改为 duanyz（推荐）
ALTER SCHEMA public OWNER TO duanyz;

-- 6. 设置默认权限，确保未来创建的对象也有权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO duanyz;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO duanyz;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TYPES TO duanyz;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO duanyz;

-- 7. 如果已有表，授予所有表的权限
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO duanyz;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO duanyz;
GRANT ALL PRIVILEGES ON ALL TYPES IN SCHEMA public TO duanyz;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO duanyz;
