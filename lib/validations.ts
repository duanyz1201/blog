import { z } from "zod"

// 注册表单验证
export const registerSchema = z.object({
  name: z.string().min(2, "姓名至少2个字符").max(50, "姓名最多50个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6个字符").max(100, "密码最多100个字符"),
})

// 登录表单验证（支持用户名或邮箱）
export const loginSchema = z.object({
  username: z.string().min(1, "请输入用户名或邮箱"),
  password: z.string().min(1, "请输入密码"),
})

// 文章创建/更新验证
export const postSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200, "标题最多200个字符"),
  slug: z.string().min(1, "URL别名不能为空").max(200, "URL别名最多200个字符"),
  content: z.string().min(1, "内容不能为空"),
  excerpt: z.string().max(500, "摘要最多500个字符").nullable().optional(),
  cover: z
    .union([z.string().url("封面图片URL格式不正确"), z.literal(""), z.null()])
    .optional(),
  status: z.enum(["PUBLISHED", "DRAFT", "PRIVATE"]),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
})

// 分类验证
export const categorySchema = z.object({
  name: z.string().min(1, "分类名称不能为空").max(50, "分类名称最多50个字符"),
  slug: z.string().min(1, "URL别名不能为空").max(50, "URL别名最多50个字符"),
})

// 标签验证
export const tagSchema = z.object({
  name: z.string().min(1, "标签名称不能为空").max(50, "标签名称最多50个字符"),
  slug: z.string().min(1, "URL别名不能为空").max(50, "URL别名最多50个字符"),
})

// 评论验证
export const commentSchema = z.object({
  content: z.string().min(1, "评论内容不能为空").max(2000, "评论内容最多2000个字符"),
  author: z.string().min(1, "昵称不能为空").max(50, "昵称最多50个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  postId: z.string().min(1, "文章ID不能为空"),
  parentId: z.string().optional(),
})
