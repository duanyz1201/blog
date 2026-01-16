import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Eye, TrendingUp } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

async function getDashboardData() {
  const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/admin/dashboard`, {
    cache: "no-store",
    headers: {
      Cookie: typeof window !== "undefined" ? document.cookie : "",
    },
  })
  
  if (!res.ok) {
    return { stats: { totalPosts: 0, totalComments: 0, totalViews: 0 }, recentPosts: [], recentComments: [] }
  }
  
  return res.json()
}

export default async function DashboardPage() {
  const { stats, recentPosts, recentComments } = await getDashboardData()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">仪表盘</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">文章总数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">评论总数</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总阅读量</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>最近文章</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无文章</p>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post: any) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {post.author.name} · {format(new Date(post.createdAt), "yyyy年MM月dd日", { locale: zhCN })}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {post.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近评论</CardTitle>
          </CardHeader>
          <CardContent>
            {recentComments.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无评论</p>
            ) : (
              <div className="space-y-4">
                {recentComments.map((comment: any) => (
                  <div key={comment.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), "yyyy年MM月dd日", { locale: zhCN })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {comment.content}
                    </p>
                    <Link
                      href={`/post/${comment.post.slug}`}
                      className="text-xs text-primary hover:underline"
                    >
                      {comment.post.title}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
