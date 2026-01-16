"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PostCard } from "@/components/frontend/post-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PaginationClient } from "@/components/ui/pagination-client"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })

  const search = async (searchQuery: string, pageNum = 1) => {
    if (!searchQuery.trim()) {
      setPosts([])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&page=${pageNum}&limit=10`)
      const data = await res.json()
      setPosts(data.posts || [])
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
      setPage(pageNum)
    } catch (error) {
      console.error("搜索错误:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const q = searchParams.get("q")
    if (q) {
      setQuery(q)
      search(q)
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    search(query, 1)
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">搜索</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="输入关键词搜索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "搜索中..." : "搜索"}
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>搜索中...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>{query ? "未找到相关文章" : "请输入关键词搜索"}</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            找到 {pagination.total} 条结果
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="mt-12">
              <PaginationClient
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={(newPage) => search(query, newPage)}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
