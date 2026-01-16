import { PrismaClient } from '@prisma/client'
import { hashPassword } from '@/lib/password'
import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

const linuxPosts = [
  {
    title: 'Linux基础命令完全指南',
    slug: 'linux-basic-commands-guide',
    excerpt: '详细介绍Linux系统中最常用的基础命令，包括文件操作、目录管理、权限控制等核心命令的使用方法和实际应用场景。',
    content: `# Linux基础命令完全指南

Linux作为最流行的开源操作系统，掌握其基础命令是每个开发者和系统管理员的必备技能。本文将详细介绍Linux系统中最常用的基础命令。

## 文件操作命令

### ls - 列出目录内容
\`\`\`bash
ls -la  # 显示所有文件（包括隐藏文件）的详细信息
ls -lh  # 以人类可读的格式显示文件大小
\`\`\`

### cd - 切换目录
\`\`\`bash
cd /home/user  # 切换到指定目录
cd ..          # 返回上一级目录
cd ~           # 返回用户主目录
\`\`\`

### cp - 复制文件
\`\`\`bash
cp file1.txt file2.txt        # 复制文件
cp -r dir1 dir2                # 递归复制目录
\`\`\`

### mv - 移动/重命名文件
\`\`\`bash
mv old.txt new.txt            # 重命名文件
mv file.txt /home/user/        # 移动文件
\`\`\`

### rm - 删除文件
\`\`\`bash
rm file.txt                   # 删除文件
rm -rf directory              # 递归删除目录（谨慎使用）
\`\`\`

## 文本处理命令

### cat - 查看文件内容
\`\`\`bash
cat file.txt                  # 显示文件内容
cat file1.txt file2.txt       # 合并显示多个文件
\`\`\`

### grep - 搜索文本
\`\`\`bash
grep "pattern" file.txt        # 在文件中搜索模式
grep -r "pattern" /path       # 递归搜索目录
\`\`\`

### sed - 流编辑器
\`\`\`bash
sed 's/old/new/g' file.txt    # 替换文本
\`\`\`

## 系统信息命令

### ps - 查看进程
\`\`\`bash
ps aux                        # 显示所有进程
ps -ef | grep process         # 查找特定进程
\`\`\`

### top/htop - 系统监控
\`\`\`bash
top                           # 实时显示系统进程
htop                          # 更友好的进程查看器
\`\`\`

### df - 磁盘使用情况
\`\`\`bash
df -h                         # 以人类可读格式显示磁盘使用
\`\`\`

## 权限管理

### chmod - 修改文件权限
\`\`\`bash
chmod 755 file.txt            # 设置文件权限
chmod +x script.sh            # 添加执行权限
\`\`\`

### chown - 修改文件所有者
\`\`\`bash
chown user:group file.txt     # 修改所有者和组
\`\`\`

## 总结

掌握这些基础命令是使用Linux系统的第一步。建议在实际操作中多加练习，逐步熟悉每个命令的用法和参数。`,
    tags: ['Linux', '命令', '基础'],
    views: 1250
  },
  {
    title: 'Shell脚本编程入门与实践',
    slug: 'shell-scripting-basics',
    excerpt: '从零开始学习Shell脚本编程，包括变量、条件判断、循环、函数等核心概念，以及实际项目中的应用案例。',
    content: `# Shell脚本编程入门与实践

Shell脚本是Linux系统管理和自动化任务的重要工具。本文将带你从零开始学习Shell脚本编程。

## 第一个Shell脚本

创建一个简单的脚本：

\`\`\`bash
#!/bin/bash
echo "Hello, World!"
\`\`\`

保存为 \`hello.sh\`，然后添加执行权限：

\`\`\`bash
chmod +x hello.sh
./hello.sh
\`\`\`

## 变量

### 定义和使用变量
\`\`\`bash
#!/bin/bash
NAME="Linux"
echo "Hello, $NAME"
echo "Hello, \${NAME}!"
\`\`\`

### 环境变量
\`\`\`bash
echo $HOME
echo $PATH
echo $USER
\`\`\`

## 条件判断

### if语句
\`\`\`bash
#!/bin/bash
if [ -f "file.txt" ]; then
    echo "文件存在"
else
    echo "文件不存在"
fi
\`\`\`

### 条件测试
\`\`\`bash
[ -f file ]    # 文件存在且为普通文件
[ -d dir ]     # 目录存在
[ -r file ]    # 文件可读
[ -w file ]    # 文件可写
[ -x file ]    # 文件可执行
\`\`\`

## 循环

### for循环
\`\`\`bash
#!/bin/bash
for i in {1..5}; do
    echo "数字: $i"
done
\`\`\`

### while循环
\`\`\`bash
#!/bin/bash
count=1
while [ $count -le 5 ]; do
    echo "计数: $count"
    count=$((count + 1))
done
\`\`\`

## 函数

\`\`\`bash
#!/bin/bash
greet() {
    echo "Hello, $1"
}

greet "World"
\`\`\`

## 实际应用示例

### 备份脚本
\`\`\`bash
#!/bin/bash
BACKUP_DIR="/backup"
SOURCE_DIR="/home/user"
DATE=$(date +%Y%m%d)

tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$SOURCE_DIR"
echo "备份完成: backup_$DATE.tar.gz"
\`\`\`

## 总结

Shell脚本是Linux系统管理的重要工具，掌握它可以大大提高工作效率。`,
    tags: ['Shell', '脚本', '编程'],
    views: 980
  },
  {
    title: 'Linux文件权限详解',
    slug: 'linux-file-permissions',
    excerpt: '深入理解Linux文件权限系统，包括权限表示法、chmod命令、ACL访问控制列表等高级权限管理技巧。',
    content: `# Linux文件权限详解

Linux的文件权限系统是系统安全的基础。本文将深入讲解Linux文件权限的各个方面。

## 权限基础

### 权限类型
- **r (read)**: 读权限，值为4
- **w (write)**: 写权限，值为2
- **x (execute)**: 执行权限，值为1

### 权限对象
- **所有者 (owner)**: 文件创建者
- **组 (group)**: 文件所属组
- **其他用户 (others)**: 系统其他用户

## 权限表示法

### 符号表示法
\`\`\`bash
-rwxr-xr-x  # 所有者可读写执行，组和其他用户可读执行
drwxr-xr-x  # 目录权限
\`\`\`

### 数字表示法
\`\`\`bash
755 = rwxr-xr-x
644 = rw-r--r--
777 = rwxrwxrwx
\`\`\`

## chmod命令

### 使用符号
\`\`\`bash
chmod u+x file.txt        # 给所有者添加执行权限
chmod g-w file.txt        # 移除组的写权限
chmod o+r file.txt        # 给其他用户添加读权限
chmod a+x file.txt        # 给所有人添加执行权限
\`\`\`

### 使用数字
\`\`\`bash
chmod 755 script.sh       # 设置权限为755
chmod 644 file.txt        # 设置权限为644
\`\`\`

## 特殊权限

### SUID (Set User ID)
\`\`\`bash
chmod u+s file            # 设置SUID位
\`\`\`

### SGID (Set Group ID)
\`\`\`bash
chmod g+s directory       # 设置SGID位
\`\`\`

### Sticky Bit
\`\`\`bash
chmod +t directory        # 设置粘滞位
\`\`\`

## ACL访问控制列表

### 查看ACL
\`\`\`bash
getfacl file.txt
\`\`\`

### 设置ACL
\`\`\`bash
setfacl -m u:user:rw file.txt    # 给用户添加读写权限
setfacl -m g:group:r file.txt    # 给组添加读权限
\`\`\`

## 默认权限

### umask值
\`\`\`bash
umask                        # 查看当前umask
umask 022                    # 设置umask值
\`\`\`

## 安全建议

1. 遵循最小权限原则
2. 定期检查文件权限
3. 使用ACL进行细粒度控制
4. 避免使用777权限

## 总结

正确理解和管理文件权限是Linux系统安全的关键。`,
    tags: ['Linux', '权限', '安全'],
    views: 1100
  },
  {
    title: 'Linux进程管理完全指南',
    slug: 'linux-process-management',
    excerpt: '全面介绍Linux进程管理，包括进程查看、进程控制、后台任务、进程优先级调整等实用技巧。',
    content: `# Linux进程管理完全指南

进程管理是Linux系统管理的核心技能之一。本文将全面介绍Linux进程管理的各个方面。

## 查看进程

### ps命令
\`\`\`bash
ps aux                    # 显示所有进程
ps -ef                    # 使用标准格式
ps -u username            # 显示特定用户的进程
\`\`\`

### top命令
\`\`\`bash
top                       # 实时显示进程信息
htop                      # 更友好的进程查看器
\`\`\`

### pgrep和pkill
\`\`\`bash
pgrep process_name        # 查找进程ID
pkill process_name        # 终止进程
\`\`\`

## 进程控制

### 前台和后台
\`\`\`bash
command &                 # 在后台运行命令
fg                        # 将后台任务调到前台
bg                        # 将任务放到后台运行
\`\`\`

### nohup命令
\`\`\`bash
nohup command &           # 不受终端关闭影响的命令
\`\`\`

## 终止进程

### kill命令
\`\`\`bash
kill PID                  # 发送TERM信号
kill -9 PID               # 强制终止进程
killall process_name      # 终止所有同名进程
\`\`\`

### 信号类型
- **SIGTERM (15)**: 正常终止
- **SIGKILL (9)**: 强制终止
- **SIGHUP (1)**: 挂起信号

## 进程优先级

### nice和renice
\`\`\`bash
nice -n 10 command        # 以较低优先级运行
renice 10 PID            # 调整运行中进程的优先级
\`\`\`

## 系统服务

### systemd管理
\`\`\`bash
systemctl start service   # 启动服务
systemctl stop service    # 停止服务
systemctl status service  # 查看服务状态
systemctl enable service  # 设置开机自启
\`\`\`

## 进程监控

### 资源使用
\`\`\`bash
ps aux --sort=-%mem       # 按内存使用排序
ps aux --sort=-%cpu       # 按CPU使用排序
\`\`\`

## 总结

掌握进程管理对于系统维护和性能优化至关重要。`,
    tags: ['Linux', '进程', '系统管理'],
    views: 890
  },
  {
    title: 'Linux网络配置与管理',
    slug: 'linux-network-config',
    excerpt: '详细介绍Linux网络配置方法，包括IP地址设置、路由配置、网络工具使用等网络管理技能。',
    content: `# Linux网络配置与管理

网络配置是Linux系统管理的重要部分。本文将介绍Linux网络配置的各种方法。

## 网络接口

### 查看网络接口
\`\`\`bash
ip addr show              # 显示所有网络接口
ifconfig                  # 传统方式查看接口
\`\`\`

### 配置IP地址
\`\`\`bash
ip addr add 192.168.1.100/24 dev eth0
ifconfig eth0 192.168.1.100 netmask 255.255.255.0
\`\`\`

## 路由管理

### 查看路由表
\`\`\`bash
ip route show             # 显示路由表
route -n                  # 传统方式查看路由
\`\`\`

### 添加路由
\`\`\`bash
ip route add 192.168.2.0/24 via 192.168.1.1
route add -net 192.168.2.0 netmask 255.255.255.0 gw 192.168.1.1
\`\`\`

## 网络工具

### ping
\`\`\`bash
ping -c 4 8.8.8.8         # 发送4个ping包
\`\`\`

### netstat
\`\`\`bash
netstat -tuln             # 显示监听端口
netstat -anp              # 显示所有连接
\`\`\`

### ss命令
\`\`\`bash
ss -tuln                  # 显示监听端口
ss -anp                   # 显示所有连接
\`\`\`

## 防火墙

### iptables基础
\`\`\`bash
iptables -L              # 列出规则
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
\`\`\`

### firewalld
\`\`\`bash
firewall-cmd --list-all
firewall-cmd --add-port=80/tcp --permanent
\`\`\`

## 网络配置文件

### CentOS/RHEL
\`\`\`bash
/etc/sysconfig/network-scripts/ifcfg-eth0
\`\`\`

### Ubuntu/Debian
\`\`\`bash
/etc/netplan/*.yaml
\`\`\`

## 总结

网络配置需要根据具体发行版和需求进行调整。`,
    tags: ['Linux', '网络', '配置'],
    views: 750
  }
]

async function seedLinuxPosts() {
  try {
    console.log('开始创建Linux技术文章...\n')
    
    // 获取或创建管理员用户
    const adminPassword = await hashPassword('admin123')
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: adminPassword,
        name: '管理员',
        role: 'ADMIN',
      },
    })
    
    // 获取或创建"技术"分类
    const techCategory = await prisma.category.upsert({
      where: { slug: 'tech' },
      update: {},
      create: {
        name: '技术',
        slug: 'tech',
      },
    })
    
    // 创建Linux相关标签
    const tagsMap: Record<string, any> = {}
    const tagNames = ['Linux', '命令', '基础', 'Shell', '脚本', '编程', '权限', '安全', '进程', '系统管理', '网络', '配置']
    
    for (const tagName of tagNames) {
      const slug = tagName.toLowerCase().replace(/\s+/g, '-')
      const tag = await prisma.tag.upsert({
        where: { slug },
        update: {},
        create: {
          name: tagName,
          slug,
        },
      })
      tagsMap[tagName] = tag
    }
    
    // 创建文章
    let createdCount = 0
    for (const postData of linuxPosts) {
      const tagConnections = postData.tags.map(tagName => ({ id: tagsMap[tagName].id }))
      
      const post = await prisma.post.upsert({
        where: { slug: postData.slug },
        update: {
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          views: postData.views,
        },
        create: {
          title: postData.title,
          slug: postData.slug,
          content: postData.content,
          excerpt: postData.excerpt,
          status: 'PUBLISHED',
          views: postData.views,
          authorId: admin.id,
          categories: {
            connect: [{ id: techCategory.id }],
          },
          tags: {
            connect: tagConnections,
          },
        },
      })
      
      createdCount++
      console.log(`✅ 创建文章: ${post.title}`)
    }
    
    // 生成更多文章以凑够20篇
    const additionalTitles = [
      'Linux磁盘管理实战',
      'Linux用户和组管理',
      'Linux日志系统详解',
      'Linux定时任务cron使用指南',
      'Linux软件包管理',
      'Linux系统性能优化',
      'Linux容器技术Docker入门',
      'Linux系统监控工具',
      'Linux备份与恢复策略',
      'Linux安全加固实践',
      'Linux Shell高级技巧',
      'Linux文本处理三剑客',
      'Linux系统启动流程',
      'Linux内核模块管理',
      'Linux虚拟化技术'
    ]
    
    for (let i = 0; i < additionalTitles.length && createdCount < 20; i++) {
      const title = additionalTitles[i]
      const slug = `linux-${title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${i + 1}`
      const excerpt = `关于${title}的详细技术文章，包含实用技巧和最佳实践。`
      const content = `# ${title}

## 简介

本文详细介绍${title}的相关知识和技术要点。

## 主要内容

### 基础概念

了解${title}的基础概念和核心原理。

### 实践应用

通过实际案例学习如何应用这些知识。

### 最佳实践

分享在实际项目中的最佳实践和经验总结。

## 总结

掌握${title}对于Linux系统管理非常重要。`
      
      const post = await prisma.post.upsert({
        where: { slug },
        update: {},
        create: {
          title,
          slug,
          content,
          excerpt,
          status: 'PUBLISHED',
          views: Math.floor(Math.random() * 500) + 100,
          authorId: admin.id,
          categories: {
            connect: [{ id: techCategory.id }],
          },
          tags: {
            connect: [
              { id: tagsMap['Linux'].id },
              { id: tagsMap['系统管理'].id }
            ],
          },
        },
      })
      
      createdCount++
      console.log(`✅ 创建文章: ${post.title}`)
    }
    
    console.log(`\n✅ 共创建 ${createdCount} 篇Linux技术文章！`)
    
  } catch (error: any) {
    console.error('❌ 创建文章失败:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

seedLinuxPosts()
