import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"
import { postSchema } from "@/lib/validations"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        categories: true,
        tags: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: "文章不存在" },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("获取文章错误:", error)
    return NextResponse.json(
      { error: "获取文章失败" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    const body = await request.json()
    
    const validatedData = postSchema.parse(body)
    
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        cover: validatedData.cover || null,
        status: validatedData.status,
        categories: {
          set: [],
          connect: validatedData.categoryIds?.map((id) => ({ id })) || [],
        },
        tags: {
          set: [],
          connect: validatedData.tagIds?.map((id) => ({ id })) || [],
        },
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    })
    
    return NextResponse.json(post)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "输入验证失败", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("更新文章错误:", error)
    return NextResponse.json(
      { error: "更新文章失败" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    
    await prisma.post.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ message: "删除成功" })
  } catch (error) {
    console.error("删除文章错误:", error)
    return NextResponse.json(
      { error: "删除文章失败" },
      { status: 500 }
    )
  }
}
