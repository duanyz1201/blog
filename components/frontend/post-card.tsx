"use client"

import Link from "next/link"
import { formatDateTime } from "@/lib/date-utils"
import { Eye, MessageCircle, ArrowRight, Calendar } from "lucide-react"

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover: string | null
  createdAt: Date
  views: number
  author: {
    name: string
  }
  categories?: Array<{ name: string; slug: string }>
  tags?: Array<{ name: string; slug: string }>
  _count?: {
    comments: number
  }
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/post/${post.slug}`} className="group block h-full cursor-pointer">
      <article className="h-full flex flex-col relative overflow-hidden rounded-2xl bg-card border border-border shadow-md hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 hover:border-primary/50">
        {/* 顶部装饰条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 装饰性背景光晕 - 始终可见但较弱，Hover 时增强 */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 group-hover:bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20 transition-all duration-500" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 group-hover:bg-primary/20 rounded-full blur-2xl -ml-16 -mb-16 transition-all duration-500" />

        {/* 卡片内容容器 */}
        <div className="p-6 flex flex-col h-full relative z-10">
          {/* 顶部：分类和日期 */}
          <div className="flex items-center justify-between mb-4 mt-1">
            {post.categories && post.categories.length > 0 ? (
              <span className="px-3 py-1.5 text-xs font-semibold bg-accent text-accent-foreground rounded-lg border border-border shadow-sm">
                {post.categories[0].name}
              </span>
            ) : (
              <span className="px-3 py-1.5 text-xs font-semibold bg-muted text-muted-foreground rounded-lg border border-border">
                未分类
              </span>
            )}
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {formatDateTime(new Date(post.createdAt))}
            </div>
          </div>

          {/* 中部：标题和摘要 */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* 底部：数据和阅读更多 */}
          <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 transition-colors group-hover:text-primary font-medium">
                <Eye className="h-4 w-4" />
                {post.views}
              </span>
              {post._count && (
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-primary font-medium">
                  <MessageCircle className="h-4 w-4" />
                  {post._count.comments}
                </span>
              )}
            </div>

            <span className="flex items-center text-sm font-semibold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              阅读全文 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
