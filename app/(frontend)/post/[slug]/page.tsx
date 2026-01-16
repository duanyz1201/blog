import { notFound } from "next/navigation"
import Link from "next/link"
import { formatDateTime } from "@/lib/date-utils"
import { MarkdownContent } from "@/components/markdown-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CommentSection } from "@/components/frontend/comment-section"
import { ReadingProgress } from "@/components/frontend/reading-progress"
import { PostCard } from "@/components/frontend/post-card"
import { ShareButtons } from "@/components/frontend/share-buttons"

async function getPost(slug: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/posts/${slug}`, {
    cache: "no-store",
  })
  
  if (!res.ok) {
    return null
  }
  
  return res.json()
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <ReadingProgress />
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        {/* 文章头部 */}
        <header className="mb-12">
          {/* 分类标签 */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category: any) => (
                <Badge 
                  key={category.slug} 
                  variant="secondary"
                  className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
          
          {/* 标题和分享 */}
          <div className="flex items-start justify-between gap-6 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight flex-1">
              {post.title}
            </h1>
            <ShareButtons 
              title={post.title}
              url={`/post/${post.slug}`}
              description={post.excerpt || undefined}
            />
          </div>
          
          {/* 元数据 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <span className="font-medium text-gray-900 dark:text-white">{post.author.name}</span>
            <span>•</span>
            <span>
              {formatDateTime(new Date(post.createdAt))}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>👁</span>
              {post.views}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>💬</span>
              {post.comments?.length || 0}
            </span>
          </div>
          
          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-slate-800">
              {post.tags.map((tag: any) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 rounded-full hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* 封面图 */}
        {post.cover && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* 文章内容 */}
        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none mb-12">
          <MarkdownContent content={post.content} />
        </div>

        {/* 上一页/下一页导航 */}
        <div className="border-t border-gray-200 dark:border-slate-800 pt-8 mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            {post.prevPost && (
              <Button variant="outline" asChild className="flex-1 sm:flex-initial">
                <Link href={`/post/${post.prevPost.slug}`} className="flex items-center gap-2">
                  <span>←</span>
                  <span className="truncate">{post.prevPost.title}</span>
                </Link>
              </Button>
            )}
            {post.nextPost && (
              <Button variant="outline" asChild className="flex-1 sm:flex-initial">
                <Link href={`/post/${post.nextPost.slug}`} className="flex items-center gap-2">
                  <span className="truncate">{post.nextPost.title}</span>
                  <span>→</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* 评论区域 - 使用客户端组件包装 */}
        <CommentSection postId={post.id} initialComments={post.comments || []} />

        {/* 相关文章 */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-gray-200 dark:border-slate-800">
            <h2 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">相关文章</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {post.relatedPosts.map((relatedPost: any) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  )
}
