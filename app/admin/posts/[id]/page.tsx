import { notFound, redirect } from "next/navigation"
import { PostEditor } from "@/components/admin/post-editor"
import { prisma } from "@/lib/db"

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
      const validatedData = postSchema.parse(data)
      
      await prisma.post.update({
        where: { id: postId },
        data: {
          title: validatedData.title,
          slug: validatedData.slug,
          content: validatedData.content,
          excerpt: validatedData.excerpt,
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
      
      redirect("/admin/posts")
    } catch (error: any) {
      console.error("更新文章错误:", error)
      throw new Error("更新文章失败")
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
