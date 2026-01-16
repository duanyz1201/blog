import { PostEditor } from "@/components/admin/post-editor"
import { redirect } from "next/navigation"

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

export default async function NewPostPage() {
  const { categories, tags } = await getCategoriesAndTags()

  async function createPost(data: any) {
    "use server"
    
    const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/admin/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("创建文章失败")
    }

    redirect("/admin/posts")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">新建文章</h1>
      <PostEditor
        categories={categories}
        tags={tags}
        onSubmit={createPost}
      />
    </div>
  )
}
