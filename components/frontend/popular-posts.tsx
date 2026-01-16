import Link from "next/link"
import { formatDateTime } from "@/lib/date-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
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

export function PopularPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null

  const getRankColor = (index: number) => {
    if (index === 0) return "bg-gradient-to-br from-yellow-500 to-orange-500 text-white"
    if (index === 1) return "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
    if (index === 2) return "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
    return "bg-primary/10 text-primary"
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 shadow-sm">
          <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">热门文章</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Popular Articles</p>
        </div>
      </div>
      <div className="space-y-3">
        {posts.map((post, index) => (
          <Link key={post.id} href={`/post/${post.slug}`}>
            <Card className="group relative overflow-hidden hover:shadow-lg hover:-translate-x-1 transition-all duration-300 border border-white/20 dark:border-white/10 shadow-sm bg-white/40 dark:bg-white/5 backdrop-blur-md">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${getRankColor(index)} flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {post.categories.slice(0, 1).map((category) => (
                        <Badge key={category.slug} variant="secondary" className="text-xs">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span>{post.author.name}</span>
                      <span>•</span>
                      <span>{formatDateTime(new Date(post.createdAt))}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span>👁</span>
                        <span>{post.views}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
