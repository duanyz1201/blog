import { notFound, redirect } from "next/navigation"
import { PostEditor } from "@/components/admin/post-editor"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// 强制动态渲染
export const dynamic = 'force-dynamic'

async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        categories: true,
        tags: true,
      },
    })
    return post
  } catch (error) {
    console.error("获取文章错误:", error)
    return null
  }
}

async function getCategoriesAndTags() {
  try {
    const [categories, tags] = await Promise.all([
      prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      }),
      prisma.tag.findMany({
        orderBy: {
          name: "asc",
        },
      }),
    ])
    return { categories, tags }
  } catch (error) {
    console.error("获取分类和标签错误:", error)
    return { categories: [], tags: [] }
  }
}

export default async function EditPostPage({
  params,
}: {
  params: { id: string }
}) {
  const postId = params.id
  const post = await getPost(postId)
  const { categories, tags } = await getCategoriesAndTags()

  if (!post) {
    notFound()
  }

  async function updatePost(data: any) {
    "use server"
    
    const { requireAdmin } = await import("@/lib/auth-helpers")
    const { postSchema } = await import("@/lib/validations")
    const { prisma } = await import("@/lib/db")
    
    try {
      await requireAdmin()
      
      // 准备数据，处理空字符串的 cover 字段
      const dataToValidate = {
        ...data,
        cover: data.cover && data.cover.trim() !== "" ? data.cover : undefined,
        excerpt: data.excerpt && data.excerpt.trim() !== "" ? data.excerpt : undefined,
      }
      
      const validatedData = postSchema.parse(dataToValidate)
      
      await prisma.post.update({
        where: { id: postId },
        data: {
          title: validatedData.title,
          slug: validatedData.slug,
          content: validatedData.content,
          excerpt: validatedData.excerpt || null,
          cover: validatedData.cover || null,
          status: validatedData.status,
          categories: {
            set: [],
            connect: validatedData.categoryIds?.map((id) => ({ id })) || [],
          },
          tags: {
            set: [],
            connect: validatedData.tagIds?.map((id) => ({ id })) || [],
          },
        },
      })
      
      // 重新验证路径
      revalidatePath("/admin/posts")
      revalidatePath(`/admin/posts/${postId}`)
      
      // 返回成功状态而不是直接 redirect
      return { success: true, message: "文章已成功保存！" }
    } catch (error: any) {
      console.error("更新文章错误:", error)
      
      // 如果是验证错误，显示详细的验证信息
      if (error?.issues && Array.isArray(error.issues)) {
        const validationErrors = error.issues
          .map((issue: any) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ')
        return { success: false, message: `验证失败: ${validationErrors}` }
      }
      
      // 如果是 Prisma 错误，显示数据库错误信息
      if (error?.code) {
        return { success: false, message: `数据库错误: ${error.message || error.code}` }
      }
      
      // 其他错误，显示原始错误信息
      return { success: false, message: `更新文章失败: ${error.message || String(error)}` }
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">编辑文章</h1>
      <PostEditor
        initialData={{
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          cover: post.cover,
          status: post.status,
          categoryIds: post.categories.map((c: any) => c.id),
          tagIds: post.tags.map((t: any) => t.id),
        }}
        categories={categories}
        tags={tags}
        onSubmit={updatePost}
      />
    </div>
  )
}
