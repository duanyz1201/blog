import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"
import { postSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status")
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }
    
    if (status) {
      where.status = status
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

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin()
    const body = await request.json()
    
    const validatedData = postSchema.parse(body)
    
    // 创建文章
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        cover: validatedData.cover || null,
        status: validatedData.status,
        authorId: user.id,
        categories: validatedData.categoryIds
          ? {
              connect: validatedData.categoryIds.map((id) => ({ id })),
            }
          : undefined,
        tags: validatedData.tagIds
          ? {
              connect: validatedData.tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    })
    
    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "输入验证失败", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("创建文章错误:", error)
    return NextResponse.json(
      { error: "创建文章失败" },
      { status: 500 }
    )
  }
}
