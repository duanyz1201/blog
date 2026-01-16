import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        categories: true,
        tags: true,
        comments: {
          where: {
            parentId: null,
            status: "APPROVED",
          },
          include: {
            replies: {
              where: {
                status: "APPROVED",
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: "文章不存在" },
        { status: 404 }
      )
    }

    // 增加阅读量
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })

    // 获取上一篇和下一篇文章
    const [prevPost, nextPost] = await Promise.all([
      prisma.post.findFirst({
        where: {
          status: "PUBLISHED",
          createdAt: {
            lt: post.createdAt,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      }),
      prisma.post.findFirst({
        where: {
          status: "PUBLISHED",
          createdAt: {
            gt: post.createdAt,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      }),
    ])

    // 获取相关文章（基于分类和标签）
    const categoryIds = post.categories.map(c => c.id)
    const tagIds = post.tags.map(t => t.id)
    
    const relatedPosts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        id: {
          not: post.id,
        },
        OR: [
          {
            categories: {
              some: {
                id: {
                  in: categoryIds,
                },
              },
            },
          },
          {
            tags: {
              some: {
                id: {
                  in: tagIds,
                },
              },
            },
          },
        ],
      },
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        categories: {
          select: {
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })

    return NextResponse.json({
      ...post,
      prevPost,
      nextPost,
      relatedPosts,
    })
  } catch (error) {
    console.error("获取文章详情错误:", error)
    return NextResponse.json(
      { error: "获取文章详情失败" },
      { status: 500 }
    )
  }
}
