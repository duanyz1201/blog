import { notFound } from "next/navigation"
import Link from "next/link"
import { formatDateTime } from "@/lib/date-utils"
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time"
import { MarkdownContent } from "@/components/markdown-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CommentSection } from "@/components/frontend/comment-section"
import { ReadingProgress } from "@/components/frontend/reading-progress"
import { PostCard } from "@/components/frontend/post-card"
import { ShareButtons } from "@/components/frontend/share-buttons"
import { TableOfContents } from "@/components/frontend/table-of-contents"
import { AuthorCard } from "@/components/frontend/author-card"
import { BackToTop } from "@/components/frontend/back-to-top"
import { Eye, MessageCircle, Clock, Calendar } from "lucide-react"

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

  // 计算阅读时间
  const readingTime = calculateReadingTime(post.content)

  return (
    <>
      <ReadingProgress />
      <BackToTop />
      
      {/* 目录导航 - 桌面端右侧浮动 */}
      <TableOfContents content={post.content} />
      
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl xl:mr-80">
        {/* 文章头部 - 带渐变背景 */}
        <header className="mb-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 article-header-gradient rounded-b-3xl">
          {/* 分类标签 */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category: { slug: string; name: string }) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="cursor-pointer"
                >
                  <Badge 
                    variant="secondary"
                    className="px-4 py-1.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {category.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
          
          {/* 标题 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            {post.title}
          </h1>
          
          {/* 元数据 - 更丰富的信息展示 */}
          <div className="article-meta mb-6">
            {/* 作者 */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium text-foreground">{post.author.name}</span>
            </div>
            
            <span className="separator">•</span>
            
            {/* 发布日期 */}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDateTime(new Date(post.createdAt))}
            </span>
            
            <span className="separator">•</span>
            
            {/* 阅读时间 */}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {formatReadingTime(readingTime)}
            </span>
            
            <span className="separator">•</span>
            
            {/* 阅读量 */}
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views} 次阅读
            </span>
            
            <span className="separator">•</span>
            
            {/* 评论数 */}
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              {post.comments?.length || 0} 条评论
            </span>
          </div>
          
          {/* 标签和分享按钮 */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/50">
            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: { slug: string; name: string }) => (
                  <Link
                    key={tag.slug}
                    href={`/tags/${tag.slug}`}
                    className="px-3 py-1 text-sm text-muted-foreground bg-secondary/80 rounded-full hover:text-primary hover:bg-accent transition-colors cursor-pointer"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
            
            {/* 分享按钮 */}
            <ShareButtons 
              title={post.title}
              url={`/post/${post.slug}`}
              description={post.excerpt || undefined}
            />
          </div>
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

        {/* 文章内容 - 使用增强的排版样式 */}
        <div className="prose prose-slate dark:prose-invert prose-base max-w-none mb-8 prose-article">
          <MarkdownContent content={post.content} />
        </div>
        
        {/* 作者信息卡片 */}
        <AuthorCard author={post.author} />

        {/* 上一页/下一页导航 */}
        <div className="border-t border-border pt-8 mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            {post.prevPost && (
              <Button variant="outline" asChild className="flex-1 sm:flex-initial cursor-pointer">
                <Link href={`/post/${post.prevPost.slug}`} className="flex items-center gap-2">
                  <span>←</span>
                  <span className="truncate">{post.prevPost.title}</span>
                </Link>
              </Button>
            )}
            {post.nextPost && (
              <Button variant="outline" asChild className="flex-1 sm:flex-initial cursor-pointer">
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
          <div className="mt-20 pt-16 border-t border-border">
            <h2 className="text-3xl font-bold mb-10 text-foreground">相关文章</h2>
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
