import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"
import { tagSchema } from "@/lib/validations"

export async function GET() {
  try {
    await requireAdmin()

    const tags = await prisma.tag.findMany({
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

    return NextResponse.json(tags)
  } catch (error) {
    console.error("获取标签列表错误:", error)
    return NextResponse.json(
      { error: "获取标签列表失败" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    
    const validatedData = tagSchema.parse(body)
    
    const tag = await prisma.tag.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
      },
    })
    
    return NextResponse.json(tag, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "输入验证失败", details: error.errors },
        { status: 400 }
      )
    }
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "标签名称或别名已存在" },
        { status: 400 }
      )
    }
    
    console.error("创建标签错误:", error)
    return NextResponse.json(
      { error: "创建标签失败" },
      { status: 500 }
    )
  }
}
