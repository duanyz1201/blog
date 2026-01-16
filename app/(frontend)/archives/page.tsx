import { PostCard } from "@/components/frontend/post-card"
import { Pagination } from "@/components/ui/pagination"

async function getPosts(page = 1) {
  const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/posts?page=${page}&limit=12`, {
    cache: "no-store",
  })
  
  if (!res.ok) {
    return { posts: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } }
  }
  
  return res.json()
}

export default async function ArchivesPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || "1")
  const { posts, pagination } = await getPosts(page)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">归档</h1>
            <div className="h-1 w-20 bg-blue-600 rounded-full mt-4" />
          </div>
          {pagination.total > 0 && (
            <div className="text-sm text-slate-600 dark:text-slate-400">
              共 {pagination.total} 篇文章
            </div>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg text-slate-500">暂无文章</p>
          </div>
        ) : (
          <>
            {/* 文章网格 - 3列 */}
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
                  baseUrl="/archives"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
