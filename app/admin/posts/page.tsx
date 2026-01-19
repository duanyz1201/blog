import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, MessageCircle } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { prisma } from "@/lib/db"

async function getPosts() {
  try {
    const page = 1
    const limit = 20
    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
          categories: true,
          tags: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.post.count(),
    ])

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("获取文章列表错误:", error)
    return {
      posts: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    }
  }
}

export default async function PostsPage() {
  const { posts, pagination } = await getPosts()

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      PUBLISHED: "default",
      DRAFT: "secondary",
      PRIVATE: "destructive",
    }
    const labels: Record<string, string> = {
      PUBLISHED: "已发布",
      DRAFT: "草稿",
      PRIVATE: "私密",
    }
    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">文章管理</h1>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4 mr-2" />
            新建文章
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无文章</p>
          <Button asChild className="mt-4">
            <Link href="/admin/posts/new">创建第一篇文章</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="font-medium hover:underline transition-colors cursor-pointer"
                  >
                    {post.title}
                  </Link>
                  {getStatusBadge(post.status)}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                  <span>{post.author.name}</span>
                  <span>•</span>
                  <span>
                    {format(new Date(post.createdAt), "yyyy年MM月dd日", { locale: zhCN })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {post.views}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {post._count.comments}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild className="cursor-pointer">
                  <Link href={`/admin/posts/${post.id}`}>编辑</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
