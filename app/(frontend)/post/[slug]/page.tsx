import { notFound } from "next/navigation"
import Link from "next/link"
import { formatDate, formatDateTime } from "@/lib/date-utils"
import { MarkdownContent } from "@/components/markdown-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CommentList } from "@/components/frontend/comment-list"
import { CommentForm } from "@/components/frontend/comment-form"
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
      <article className="container py-8 max-w-4xl">
      <header className="mb-8">
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((category: any) => (
              <Badge key={category.slug} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold flex-1">{post.title}</h1>
          <ShareButtons 
            title={post.title}
            url={`/post/${post.slug}`}
            description={post.excerpt || undefined}
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{post.author.name}</span>
          <span>•</span>
          <span title={formatDateTime(new Date(post.createdAt))}>
            {formatDate(new Date(post.createdAt))}
          </span>
          <span>•</span>
          <span>👁 {post.views}</span>
          <span>•</span>
          <span>💬 {post.comments?.length || 0}</span>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag: any) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {post.cover && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      )}

      <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
        <MarkdownContent content={post.content} />
      </div>

      <div className="border-t pt-8 mt-8">
        <div className="flex justify-between items-center mb-8">
          {post.prevPost && (
            <Button variant="outline" asChild>
              <Link href={`/post/${post.prevPost.slug}`}>
                ← {post.prevPost.title}
              </Link>
            </Button>
          )}
          {post.nextPost && (
            <Button variant="outline" asChild>
              <Link href={`/post/${post.nextPost.slug}`}>
                {post.nextPost.title} →
              </Link>
            </Button>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">评论 ({post.comments?.length || 0})</h2>
          <CommentForm postId={post.id} />
          <div className="mt-8">
            <CommentList comments={post.comments || []} postId={post.id} />
          </div>
        </div>
      </div>

      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold mb-8">相关文章</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
