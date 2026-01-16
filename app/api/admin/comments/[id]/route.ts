import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    const body = await request.json()
    
    const comment = await prisma.comment.update({
      where: { id: params.id },
      data: {
        status: body.status,
      },
    })
    
    return NextResponse.json(comment)
  } catch (error) {
    console.error("更新评论错误:", error)
    return NextResponse.json(
      { error: "更新评论失败" },
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
    
    await prisma.comment.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ message: "删除成功" })
  } catch (error) {
    console.error("删除评论错误:", error)
    return NextResponse.json(
      { error: "删除评论失败" },
      { status: 500 }
    )
  }
}
