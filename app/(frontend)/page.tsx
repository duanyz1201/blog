import Link from "next/link"
import { PostCard } from "@/components/frontend/post-card"
import { Pagination } from "@/components/ui/pagination"
import { FeaturedPost } from "@/components/frontend/featured-post"
import { PopularPosts } from "@/components/frontend/popular-posts"
import { CategoryList } from "@/components/frontend/category-list"
import { TagCloud } from "@/components/frontend/tag-cloud"
import { HeroSection } from "@/components/frontend/hero-section"

// 强制动态渲染，确保获取最新数据
export const dynamic = 'force-dynamic'

async function getHomepageData() {
  const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/homepage`, {
    cache: "no-store",
  })
  
  if (!res.ok) {
    return {
      featuredPost: null,
      popularPosts: [],
      latestPosts: [],
      categories: [],
      tags: [],
      stats: { totalPosts: 0, totalCategories: 0, totalTags: 0, totalViews: null },
    }
  }
  
  return res.json()
}

async function getPosts(page = 1) {
  const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/posts?page=${page}&limit=12`, {
    cache: "no-store",
  })
  
  if (!res.ok) {
    return { posts: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } }
  }
  
  return res.json()
}

async function getSiteName() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/settings`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      return data.siteName || "个人博客"
    }
  } catch (error) {
    console.error("获取站点名称失败:", error)
  }
  return "个人博客"
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || "1")
  const [homepageData, postsData, siteName] = await Promise.all([
    getHomepageData(),
    getPosts(page),
    getSiteName(),
  ])

  const { featuredPost, popularPosts, categories, tags, stats } = homepageData
  const { posts, pagination } = postsData

  return (
    <div className="min-h-screen">
      {/* Hero 全屏区域 */}
      <HeroSection stats={stats} siteName={siteName} />

      {/* 主要内容区域 - 简洁背景 */}
      <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        
        {/* 特色文章（如果有） */}
        {featuredPost && (
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold">精选推荐</h2>
                    <p className="text-muted-foreground mt-1">Featured Article</p>
                  </div>
                </div>
              </div>
              <FeaturedPost post={featuredPost} />
            </div>
          </div>
        )}

        {/* 最新文章列表区域 */}
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            {/* 标题 */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex flex-col">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">最新文章</h2>
                <div className="h-1 w-20 bg-blue-600 rounded-full mt-4" />
              </div>
              <Link
                href="/archives"
                className="group flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                查看全部
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
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
                      baseUrl="/"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* 底部信息区 */}
        <section className="relative border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-3 gap-16">
                {/* 热门文章 */}
                {popularPosts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                        🔥
                      </span>
                      热门文章
                    </h3>
                    <div className="space-y-6">
                      {popularPosts.slice(0, 5).map((post: any, index: number) => (
                        <Link 
                          key={post.id}
                          href={`/post/${post.slug}`}
                          className="flex items-start gap-4 group"
                        >
                          <span className={`flex-shrink-0 w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center mt-0.5 transition-colors ${
                            index === 0 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' :
                            index === 1 ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                            index === 2 ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                            'text-slate-400 dark:text-slate-600'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-relaxed">
                            {post.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 分类 */}
                {categories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        📂
                      </span>
                      文章分类
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {categories.map((category: any) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug}`}
                          className="group flex items-center gap-2 px-4 py-2 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                        >
                          <span className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {category.name}
                          </span>
                          <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-medium bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                            {category._count.posts}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 标签云 */}
                {tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        🏷️
                      </span>
                      热门标签
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(0, 15).map((tag: any) => (
                        <Link
                          key={tag.id}
                          href={`/tags/${tag.slug}`}
                          className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400/50 transition-colors"
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
