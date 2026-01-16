"use client"

import Link from "next/link"
import { formatRelativeTime } from "@/lib/date-utils"
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
    <Link href={`/post/${post.slug}`} className="group block h-full">
      <article className="h-full flex flex-col relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 dark:hover:border-blue-600">
        {/* 顶部装饰条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 装饰性背景光晕 - 始终可见但较弱，Hover 时增强 */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 group-hover:bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 transition-all duration-500" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 group-hover:bg-purple-500/20 rounded-full blur-2xl -ml-16 -mb-16 transition-all duration-500" />

        {/* 卡片内容容器 */}
        <div className="p-6 flex flex-col h-full relative z-10">
          {/* 顶部：分类和日期 */}
          <div className="flex items-center justify-between mb-4 mt-1">
            {post.categories && post.categories.length > 0 ? (
              <span className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm">
                {post.categories[0].name}
              </span>
            ) : (
              <span className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-lg border border-gray-200 dark:border-slate-700">
                未分类
              </span>
            )}
            <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {formatRelativeTime(new Date(post.createdAt))}
            </div>
          </div>

          {/* 中部：标题和摘要 */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* 底部：数据和阅读更多 */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium">
                <Eye className="h-4 w-4" />
                {post.views}
              </span>
              {post._count && (
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium">
                  <MessageCircle className="h-4 w-4" />
                  {post._count.comments}
                </span>
              )}
            </div>

            <span className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              阅读全文 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
