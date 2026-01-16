import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { registerSchema } from "@/lib/validations"
import { hashPassword } from "@/lib/password"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证输入
    const validatedData = registerSchema.parse(body)
    
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 400 }
      )
    }
    
    // 加密密码
    const hashedPassword = await hashPassword(validatedData.password)
    
    // 创建用户
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "USER", // 默认角色
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    })
    
    return NextResponse.json(
      { 
        message: "注册成功",
        user 
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
    
    console.error("注册错误:", error)
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    )
  }
}
