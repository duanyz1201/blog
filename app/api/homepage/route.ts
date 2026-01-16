import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// 强制动态渲染，禁用缓存
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // 获取特色文章（最新的一篇，带封面图）
    const featuredPost = await prisma.post.findFirst({
      where: {
        status: "PUBLISHED",
        cover: {
          not: null,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
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
    })

    // 获取热门文章（按阅读量，最多5篇）
    const popularPosts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        views: "desc",
      },
      take: 5,
      include: {
        author: {
          select: {
            name: true,
          },
        },
        categories: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })

    // 获取最新文章（除了特色文章外的5篇）
    const latestPosts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        ...(featuredPost ? { id: { not: featuredPost.id } } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
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
    })

    // 获取所有分类（带文章数量）
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: "PUBLISHED",
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    // 获取热门标签（按使用次数，最多10个）
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: "PUBLISHED",
              },
            },
          },
        },
      },
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
      take: 10,
    })

    // 获取统计数据
    const viewsAggregate = await prisma.post.aggregate({
      where: { status: "PUBLISHED" },
      _sum: { views: true },
    })
    
    const stats = {
      totalPosts: await prisma.post.count({
        where: { status: "PUBLISHED" },
      }),
      totalCategories: await prisma.category.count(),
      totalTags: await prisma.tag.count(),
      totalViews: viewsAggregate._sum.views || 0,
    }

    return NextResponse.json({
      featuredPost,
      popularPosts,
      latestPosts,
      categories,
      tags,
      stats,
    })
  } catch (error) {
    console.error("获取首页数据错误:", error)
    return NextResponse.json(
      { error: "获取首页数据失败" },
      { status: 500 }
    )
  }
}
