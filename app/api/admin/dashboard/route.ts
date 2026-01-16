import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"

export async function GET() {
  try {
    await requireAdmin()

    const [
      totalPosts,
      totalComments,
      totalViews,
      recentPosts,
      recentComments,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.comment.count(),
      prisma.post.aggregate({
        _sum: {
          views: true,
        },
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.comment.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          post: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      }),
    ])

    return NextResponse.json({
      stats: {
        totalPosts,
        totalComments,
        totalViews: totalViews._sum.views || 0,
      },
      recentPosts,
      recentComments,
    })
  } catch (error) {
    console.error("获取仪表盘数据错误:", error)
    return NextResponse.json(
      { error: "获取数据失败" },
      { status: 500 }
    )
  }
}
