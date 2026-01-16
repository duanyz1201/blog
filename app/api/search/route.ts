import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get("q") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    if (!q.trim()) {
      return NextResponse.json({
        posts: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      })
    }

    const where = {
      status: "PUBLISHED" as const,
      OR: [
        {
          title: {
            contains: q,
            mode: "insensitive" as const,
          },
        },
        {
          content: {
            contains: q,
            mode: "insensitive" as const,
          },
        },
      ],
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
    console.error("搜索错误:", error)
    return NextResponse.json(
      { error: "搜索失败" },
      { status: 500 }
    )
  }
}
