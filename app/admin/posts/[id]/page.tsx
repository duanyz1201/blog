import { notFound, redirect } from "next/navigation"
import { PostEditor } from "@/components/admin/post-editor"

async function getPost(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/admin/posts/${id}`, {
    cache: "no-store",
  })
  
  if (!res.ok) {
    return null
  }
  
  return res.json()
}

async function getCategoriesAndTags() {
  const [categoriesRes, tagsRes] = await Promise.all([
    fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/admin/categories`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/admin/tags`, {
      cache: "no-store",
    }),
  ])

  const categories = categoriesRes.ok ? await categoriesRes.json() : []
  const tags = tagsRes.ok ? await tagsRes.json() : []

  return { categories, tags }
}

export default async function EditPostPage({
  params,
}: {
  params: { id: string }
}) {
  const post = await getPost(params.id)
  const { categories, tags } = await getCategoriesAndTags()

  if (!post) {
    notFound()
  }

  async function updatePost(data: any) {
    "use server"
    
    const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/admin/posts/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("更新文章失败")
    }

    redirect("/admin/posts")
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
