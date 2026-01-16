import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { commentSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证输入
    const validatedData = commentSchema.parse(body)
    
    // 检查文章是否存在
    const post = await prisma.post.findUnique({
      where: { id: validatedData.postId },
    })
    
    if (!post) {
      return NextResponse.json(
        { error: "文章不存在" },
        { status: 404 }
      )
    }
    
    // 创建评论
    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        author: validatedData.author,
        email: validatedData.email,
        postId: validatedData.postId,
        parentId: validatedData.parentId,
        status: "APPROVED", // 默认已通过
      },
    })
    
    return NextResponse.json(
      { 
        message: "评论已发布",
        comment 
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "输入验证失败", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("创建评论错误:", error)
    return NextResponse.json(
      { error: "评论提交失败，请稍后重试" },
      { status: 500 }
    )
  }
}
