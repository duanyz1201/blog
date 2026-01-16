import { notFound } from "next/navigation"
import { PostCard } from "@/components/frontend/post-card"
import { Pagination } from "@/components/ui/pagination"

async function getTagPosts(slug: string, page = 1) {
  const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/posts?tag=${slug}&page=${page}&limit=10`, {
    cache: "no-store",
  })
  
  if (!res.ok) {
    return { posts: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }
  }
  
  return res.json()
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || "1")
  const { posts, pagination } = await getTagPosts(params.slug, page)

  if (posts.length === 0 && page === 1) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">标签: #{params.slug}</h1>
        
        {posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>该标签下暂无文章</p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            
            {pagination.totalPages > 1 && (
              <div className="mt-20 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  baseUrl={`/tags/${params.slug}`}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
