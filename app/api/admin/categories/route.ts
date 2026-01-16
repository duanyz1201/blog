import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"
import { categorySchema } from "@/lib/validations"

export async function GET() {
  try {
    await requireAdmin()

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("获取分类列表错误:", error)
    return NextResponse.json(
      { error: "获取分类列表失败" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    
    const validatedData = categorySchema.parse(body)
    
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
      },
    })
    
    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "输入验证失败", details: error.errors },
        { status: 400 }
      )
    }
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "分类名称或别名已存在" },
        { status: 400 }
      )
    }
    
    console.error("创建分类错误:", error)
    return NextResponse.json(
      { error: "创建分类失败" },
      { status: 500 }
    )
  }
}
