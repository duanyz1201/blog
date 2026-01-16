import Link from "next/link"
import { formatDateTime } from "@/lib/date-utils"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

type FeaturedPost = {
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
  categories: Array<{ name: string; slug: string }>
  _count: {
    comments: number
  }
}

export function FeaturedPost({ post }: { post: FeaturedPost }) {
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-white/10 shadow-xl bg-white/30 dark:bg-white/5 backdrop-blur-md">
      <Link href={`/post/${post.slug}`} className="block">
        {post.cover && (
          <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden rounded-lg">
            <img
              src={post.cover}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="eager"
            />
            {/* 多层渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
            
            {/* 内容区域 */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
              <div className="max-w-4xl">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {post.categories.map((category) => (
                    <Badge
                      key={category.slug}
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-colors"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 line-clamp-2 leading-tight drop-shadow-lg">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-lg text-white/90 line-clamp-3 mb-6 drop-shadow-md">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-white/90 flex-wrap">
                  <span className="font-medium">{post.author.name}</span>
                  <span className="text-white/60">•</span>
                  <span className="text-white/80">
                    {formatDateTime(new Date(post.createdAt))}
                  </span>
                  <span className="text-white/60">•</span>
                  <span className="flex items-center gap-1">
                    <span>👁</span>
                    <span>{post.views}</span>
                  </span>
                  <span className="text-white/60">•</span>
                  <span className="flex items-center gap-1">
                    <span>💬</span>
                    <span>{post._count.comments}</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* 悬停时的阅读更多提示 */}
            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
                阅读更多 →
              </div>
            </div>
          </div>
        )}
        {!post.cover && (
          <div className="p-8 md:p-12 bg-white/20 dark:bg-white/5 backdrop-blur-md rounded-lg border border-white/20 dark:border-white/10">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {post.categories.map((category) => (
                <Badge key={category.slug} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h2>
            {post.excerpt && (
              <p className="text-lg text-muted-foreground line-clamp-3 mb-6">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="font-medium">{post.author.name}</span>
              <span>•</span>
              <span>
                {formatDateTime(new Date(post.createdAt))}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>👁</span>
                <span>{post.views}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>💬</span>
                <span>{post._count.comments}</span>
              </span>
            </div>
          </div>
        )}
      </Link>
    </Card>
  )
}
