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
      <article className="h-full flex flex-col relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 backdrop-blur-xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
        {/* 装饰性背景光晕 - 仅在 Hover 时显现 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -ml-10 -mb-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* 卡片内容容器 */}
        <div className="p-6 flex flex-col h-full relative z-10">
          {/* 顶部：分类和日期 */}
          <div className="flex items-center justify-between mb-4">
            {post.categories && post.categories.length > 0 ? (
              <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-md">
                {post.categories[0].name}
              </span>
            ) : (
              <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-md">
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
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* 底部：数据和阅读更多 */}
          <div className="pt-4 border-t border-gray-50 dark:border-slate-800/50 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1.5 transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-300">
                <Eye className="h-4 w-4" />
                {post.views}
              </span>
              {post._count && (
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-300">
                  <MessageCircle className="h-4 w-4" />
                  {post._count.comments}
                </span>
              )}
            </div>

            <span className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              阅读全文 <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
