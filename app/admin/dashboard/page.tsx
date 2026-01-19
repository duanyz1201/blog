import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Eye, Clock, TrendingUp, Folder, Tag, AlertCircle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { prisma } from "@/lib/db"

async function getDashboardData() {
  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - 7)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalPosts,
      totalComments,
      totalViews,
      publishedPosts,
      draftPosts,
      pendingComments,
      hiddenComments,
      todayPosts,
      todayComments,
      todayViews,
      weekPosts,
      weekComments,
      weekViews,
      monthPosts,
      monthComments,
      monthViews,
      totalCategories,
      totalTags,
      recentPosts,
      recentComments,
      popularPosts,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.comment.count(),
      prisma.post.aggregate({
        _sum: { views: true },
      }),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.comment.count({ where: { status: "PENDING" } }),
      prisma.comment.count({ where: { status: "HIDDEN" } }),
      // 今日新增
      prisma.post.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.comment.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.post.aggregate({
        where: { createdAt: { gte: todayStart } },
        _sum: { views: true },
      }),
      // 本周新增
      prisma.post.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.comment.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.post.aggregate({
        where: { createdAt: { gte: weekStart } },
        _sum: { views: true },
      }),
      // 本月新增
      prisma.post.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.comment.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.post.aggregate({
        where: { createdAt: { gte: monthStart } },
        _sum: { views: true },
      }),
      prisma.category.count(),
      prisma.tag.count(),
      // 最近文章
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true } },
        },
      }),
      // 最近评论
      prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          post: { select: { title: true, slug: true } },
        },
      }),
      // 热门文章
      prisma.post.findMany({
        take: 5,
        where: { status: "PUBLISHED" },
        orderBy: { views: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          views: true,
        },
      }),
    ])

    return {
      stats: {
        totalPosts,
        totalComments,
        totalViews: totalViews._sum.views || 0,
        publishedPosts,
        draftPosts,
        pendingComments,
        hiddenComments,
        todayPosts,
        todayComments,
        todayViews: todayViews._sum.views || 0,
        weekPosts,
        weekComments,
        weekViews: weekViews._sum.views || 0,
        monthPosts,
        monthComments,
        monthViews: monthViews._sum.views || 0,
        totalCategories,
        totalTags,
      },
      recentPosts,
      recentComments,
      popularPosts,
    }
  } catch (error) {
    console.error("获取仪表盘数据错误:", error)
    return {
      stats: {
        totalPosts: 0,
        totalComments: 0,
        totalViews: 0,
        publishedPosts: 0,
        draftPosts: 0,
        pendingComments: 0,
        hiddenComments: 0,
        todayPosts: 0,
        todayComments: 0,
        todayViews: 0,
        weekPosts: 0,
        weekComments: 0,
        weekViews: 0,
        monthPosts: 0,
        monthComments: 0,
        monthViews: 0,
        totalCategories: 0,
        totalTags: 0,
      },
      recentPosts: [],
      recentComments: [],
      popularPosts: [],
    }
  }
}

export default async function DashboardPage() {
  const { stats, recentPosts, recentComments, popularPosts } = await getDashboardData()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">仪表盘</h1>

      {/* 核心指标 */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">文章总数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              已发布: {stats.publishedPosts} | 草稿: {stats.draftPosts}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">评论总数</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            {stats.pendingComments > 0 && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                待审核: {stats.pendingComments}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总阅读量</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              本月: {stats.monthViews.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日新增</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayPosts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              文章 | {stats.todayComments} 评论
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">分类/标签</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground mt-1">
              分类 | {stats.totalTags} 标签
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">隐藏评论</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hiddenComments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              条评论已隐藏
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 本周统计 */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本周新增文章</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weekPosts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              评论: {stats.weekComments} | 阅读: {stats.weekViews.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本月新增文章</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthPosts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              评论: {stats.monthComments}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日阅读量</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              新增文章: {stats.todayPosts}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
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
                        className="text-sm font-medium hover:underline cursor-pointer transition-colors"
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
                      className="text-xs text-primary hover:underline cursor-pointer transition-colors"
                    >
                      {comment.post.title}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              热门文章
            </CardTitle>
          </CardHeader>
          <CardContent>
            {popularPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无数据</p>
            ) : (
              <div className="space-y-4">
                {popularPosts.map((post: any, index: number) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary">
                          #{index + 1}
                        </span>
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="text-sm font-medium hover:underline line-clamp-1 cursor-pointer transition-colors"
                        >
                          {post.title}
                        </Link>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views.toLocaleString()} 阅读
                      </p>
                    </div>
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
