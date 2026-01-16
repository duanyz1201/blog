import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const status = searchParams.get("status") || "PUBLISHED"
    const skip = (page - 1) * limit

    const where: any = {
      status: status as any,
    }

    if (category) {
      where.categories = {
        some: {
          slug: category,
        },
      }
    }

    if (tag) {
      where.tags = {
        some: {
          slug: tag,
        },
      }
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
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
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("获取文章列表错误:", error)
    return NextResponse.json(
      { error: "获取文章列表失败" },
      { status: 500 }
    )
  }
}
